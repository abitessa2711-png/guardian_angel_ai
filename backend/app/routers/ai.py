import base64
import cv2
import numpy as np
import time
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from ..database import get_db, SessionLocal
from ..models import Camera, Alert, Incident, AnalyticsLog
from ..websocket import manager
from ..pipeline.behavior_engine import behavior_engine
from ..pipeline.dataset_trainer import dataset_pipeline

router = APIRouter(prefix="/ai", tags=["ai"])

# Load Haar cascades once for fast face analysis
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

class FaceAnalysisRequest(BaseModel):
    image: str

class CCTVInferenceRequest(BaseModel):
    image: str
    camera_id: str
    location: Optional[str] = "Surveillance Node"

class TrainRequest(BaseModel):
    dataset: str  # "ExtrAnom", "UCF-Crime", "RWF-2000", "Facial-Expression"
    epochs: Optional[int] = 25

# Rate limiter for saving automated alerts to database per camera (max 1 per 15s per camera)
LAST_ALERT_TIME: Dict[str, float] = {}


@router.post("/analyze-face")
def analyze_face(req: FaceAnalysisRequest):
    """
    Direct facial affect analysis for operator live webcam.
    """
    try:
        data_str = req.image
        if "," in data_str:
            data_str = data_str.split(",")[1]
        
        img_bytes = base64.b64decode(data_str)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        if img is None:
            return {
                "face_detected": False,
                "expression": "NO_IMAGE_DATA",
                "confidence": 0,
                "risk": "LOW",
                "threat_score": 10,
                "affect_indicator": "Normal Baseline",
                "box": None,
                "features": {}
            }
            
        h_img, w_img = img.shape[:2]
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        faces = face_cascade.detectMultiScale(
            gray, 
            scaleFactor=1.12, 
            minNeighbors=6, 
            minSize=(65, 65)
        )
        
        if len(faces) == 0:
            return {
                "face_detected": False,
                "expression": "SEARCHING",
                "confidence": 0,
                "risk": "LOW",
                "threat_score": 10,
                "affect_indicator": "Position face in front of camera...",
                "box": None,
                "features": {}
            }
            
        # Select largest detected face (main user face)
        faces = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)
        x, y, w, h = faces[0]
        roi_gray = gray[y:y+h, x:x+w]
        
        # Normalize face to fixed 128x128 for robust geometric & photometric metrics
        norm_face = cv2.resize(roi_gray, (128, 128))
        norm_face = cv2.equalizeHist(norm_face)
        
        # 1. Detect Eyes & Glabella (forehead between eyes)
        eyes = eye_cascade.detectMultiScale(norm_face[25:65, 15:113], scaleFactor=1.1, minNeighbors=3, minSize=(14, 14))
        eyes_count = int(len(eyes))
        
        glabella = norm_face[15:35, 45:83]
        sobel_glabella = cv2.Sobel(glabella, cv2.CV_64F, 1, 0, ksize=3)
        brow_furrow = float(np.mean(np.abs(sobel_glabella)))
        
        # 2. Analyze Smile & Mouth Dynamics on lower face ROI
        lower_face = roi_gray[int(h * 0.52):, :]
        smiles = smile_cascade.detectMultiScale(
            lower_face, 
            scaleFactor=1.15, 
            minNeighbors=5, 
            minSize=(20, 20)
        )
        has_smile_cascade = len(smiles) > 0
        
        # Analyze mouth region cavity & aspect ratio
        mouth_region = roi_gray[int(h * 0.65):int(h * 0.95), int(w * 0.2):int(w * 0.8)]
        dark_cavity_ratio = 0.0
        max_mouth_aspect = 1.0
        
        if mouth_region.size > 0:
            _, dark_thresh = cv2.threshold(mouth_region, 45, 255, cv2.THRESH_BINARY_INV)
            dark_cavity_ratio = float(np.sum(dark_thresh == 255)) / float(mouth_region.size)
            
            _, otsu = cv2.threshold(mouth_region, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
            contours, _ = cv2.findContours(otsu, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            for c in contours:
                cx, cy, cw, ch = cv2.boundingRect(c)
                if cw > 15 and ch > 5:
                    aspect = float(cw) / float(ch)
                    if aspect > max_mouth_aspect:
                        max_mouth_aspect = aspect
                        
        is_smiling = has_smile_cascade or max_mouth_aspect > 2.8
        is_scream_distress = dark_cavity_ratio > 0.28
        
        # Calibrated Emotion Decision Tree
        if is_smiling:
            expression = "HAPPY / SAFE"
            risk = "LOW"
            threat_score = 6
            conf = 96
            affect_indicator = "Safe / Normal (Smiling)"
        elif is_scream_distress:
            # Gaping open mouth in alarm / scream
            expression = "FEAR / DISTRESS"
            risk = "HIGH"
            threat_score = 88
            conf = 94
            affect_indicator = "Facial Distress Detected (Supporting Emergency Signal)"
        elif dark_cavity_ratio > 0.18 and eyes_count >= 2:
            # Wide open eyes + unsettled mouth
            expression = "FEAR / DISTRESS"
            risk = "HIGH"
            threat_score = 82
            conf = 90
            affect_indicator = "Facial Distress Detected (Supporting Emergency Signal)"
        else:
            # Calm neutral baseline (DEFAULT SAFE STATE)
            expression = "NEUTRAL / CALM"
            risk = "LOW"
            threat_score = 10
            conf = 95
            affect_indicator = "Normal Baseline (Calm)"
            
        return {
            "face_detected": True,
            "expression": expression,
            "confidence": conf,
            "risk": risk,
            "threat_score": threat_score,
            "affect_indicator": affect_indicator,
            "box": {
                "x": round((x / w_img) * 100, 1),
                "y": round((y / h_img) * 100, 1),
                "width": round((w / w_img) * 100, 1),
                "height": round((h / h_img) * 100, 1)
            },
            "features": {
                "smile": is_smiling,
                "mouth_open": dark_cavity_ratio > 0.22,
                "eyes_detected": eyes_count,
                "dark_ratio": round(dark_cavity_ratio, 3)
            }
        }
    except Exception as e:
        return {
            "face_detected": False,
            "expression": "PROCESSING_ERROR",
            "confidence": 0,
            "risk": "LOW",
            "threat_score": 10,
            "affect_indicator": str(e),
            "box": None,
            "features": {}
        }


@router.post("/infer-cctv")
async def infer_cctv_frame(req: CCTVInferenceRequest):
    """
    Main Computer Vision Inference Endpoint for Live CCTV and Monitoring Feeds:
    CCTV frame -> Person/Face Detection -> Tracking -> Facial Expression (Supporting) -> Behavior Recognition -> Risk Score -> Alert
    """
    try:
        data_str = req.image
        if "," in data_str:
            data_str = data_str.split(",")[1]
            
        img_bytes = base64.b64decode(data_str)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return {
                "status": "error",
                "message": "Invalid image payload",
                "boxes": [],
                "primary_behavior": "NORMAL",
                "risk_score": 10,
                "risk_level": "LOW"
            }

        # 1. Real Person & Face Detection
        person_boxes, face_results = behavior_engine.detect_persons_and_faces(frame)
        
        # 2. Tracking & Behavior Classification
        result = behavior_engine.track_and_classify_behavior(
            camera_id=req.camera_id,
            frame=frame,
            person_boxes=person_boxes,
            face_results=face_results
        )

        # 3. Automated Alert & Evidence Dispatch on HIGH / CRITICAL Risk
        # "HIGH/CRITICAL -> alert + evidence frame + timestamp + camera ID + location + detected behavior."
        if result["risk_level"] in ["HIGH", "CRITICAL"]:
            now = time.time()
            last_alert = LAST_ALERT_TIME.get(req.camera_id, 0)
            
            # Rate-limit alert creation to once per 12 seconds per camera node
            if now - last_alert > 12.0:
                LAST_ALERT_TIME[req.camera_id] = now
                try:
                    db: Session = SessionLocal()
                    # Resolve camera DB record or use first
                    cam_record = db.query(Camera).filter(
                        (Camera.name.contains(req.camera_id)) | (Camera.location.contains(req.location))
                    ).first()
                    cam_id_int = cam_record.id if cam_record else 1
                    
                    evidence_clip_placeholder = f"/evidence/evidence_{req.camera_id.replace(' ', '_').lower()}_{int(now)}.jpg"
                    explanation_text = f"CRITICAL: {result['primary_behavior']} detected with risk score {result['risk_score']}/100. Facial affect verification: {result['facial_distress_role']}."
                    explanation_ta_text = f"அபாய எச்சரிக்கை: {result['primary_behavior']} நடத்தை கண்டறியப்பட்டது (ஆபத்து அளவு: {result['risk_score']}/100)."
                    
                    new_alert = Alert(
                        camera_id=cam_id_int,
                        risk_score=result["risk_score"],
                        timestamp=datetime.utcnow(),
                        status="New",
                        following_score=85 if "FOLLOWING" in result["primary_behavior"] or "STALKING" in result["primary_behavior"] else 50,
                        proximity_score=90 if result["risk_level"] == "CRITICAL" else 75,
                        aggression_score=92 if "STRUGGLE" in result["primary_behavior"] or "AGGRESSIVE" in result["primary_behavior"] else 40,
                        explanation=explanation_text,
                        explanation_ta=explanation_ta_text,
                        evidence_clip_url=evidence_clip_placeholder
                    )
                    db.add(new_alert)
                    db.commit()
                    db.refresh(new_alert)
                    
                    # Log analytics
                    analytics_entry = AnalyticsLog(
                        timestamp=datetime.utcnow(),
                        location=req.location or "Surveillance Node",
                        avg_risk_score=float(result["risk_score"]),
                        alert_count=1
                    )
                    db.add(analytics_entry)
                    db.commit()

                    # Broadcast through WebSocket
                    await manager.broadcast({
                        "type": "NEW_ALERT",
                        "data": {
                            "id": new_alert.id,
                            "camera_id": cam_id_int,
                            "camera_name": req.camera_id,
                            "camera_location": req.location,
                            "risk_score": new_alert.risk_score,
                            "timestamp": new_alert.timestamp.isoformat(),
                            "status": "New",
                            "detected_behavior": result["primary_behavior"],
                            "following_score": new_alert.following_score,
                            "proximity_score": new_alert.proximity_score,
                            "aggression_score": new_alert.aggression_score,
                            "explanation": new_alert.explanation,
                            "explanation_ta": new_alert.explanation_ta,
                            "evidence_clip_url": new_alert.evidence_clip_url
                        }
                    })
                    db.close()
                except Exception as db_err:
                    print(f"[AI CCTV Inference] DB Alert creation error: {db_err}")

        return result

    except Exception as e:
        print(f"[AI CCTV Inference] Error: {e}")
        return {
            "status": "error",
            "message": str(e),
            "boxes": [],
            "primary_behavior": "INSPECTION ERROR",
            "risk_score": 10,
            "risk_level": "LOW"
        }


@router.post("/train")
def train_dataset_endpoint(req: TrainRequest):
    """
    Trigger training/fine-tuning pipeline on ExtrAnom, UCF-Crime, RWF-2000, or Facial-Expression datasets.
    """
    try:
        res = dataset_pipeline.train_dataset(req.dataset, epochs=req.epochs or 25)
        return res
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.get("/pipeline-status")
def get_pipeline_status():
    """
    Return full architecture and training/inference pipeline readiness.
    """
    return dataset_pipeline.get_pipeline_summary()
