"""
Behavior Recognition & Spatial-Temporal Tracking Engine
Guardian Angel AI - Smart CCTV Women Safety Surveillance System

Pipeline:
CCTV frame -> Person/Face Detection -> Spatial-Temporal Tracking -> Facial Expression (Supporting) -> Behavior Recognition -> Risk Score -> Alert
"""

import cv2
import numpy as np
import time
import math
from datetime import datetime
from typing import List, Dict, Any, Optional, Tuple

class TrackedSubject:
    def __init__(self, track_id: int, box: Tuple[int, int, int, int], category: str = "person"):
        self.track_id = track_id
        self.category = category  # "woman", "man", "person"
        self.history = []  # list of (centroid_x, centroid_y, timestamp)
        self.last_box = box  # (x, y, w, h)
        self.last_seen = time.time()
        self.speed = 0.0  # pixels per second
        self.heading = 0.0  # radians
        self.face_emotion = "NORMAL"
        self.face_confidence = 0.0
        self.distress_detected = False
        
        cx = box[0] + box[2] / 2.0
        cy = box[1] + box[3] / 2.0
        self.history.append((cx, cy, self.last_seen))

    def update(self, box: Tuple[int, int, int, int], category: Optional[str] = None):
        now = time.time()
        cx = box[0] + box[2] / 2.0
        cy = box[1] + box[3] / 2.0
        
        if len(self.history) > 0:
            prev_cx, prev_cy, prev_time = self.history[-1]
            dt = max(now - prev_time, 0.001)
            dist = math.hypot(cx - prev_cx, cy - prev_cy)
            self.speed = dist / dt
            self.heading = math.atan2(cy - prev_cy, cx - prev_cx)
            
        self.history.append((cx, cy, now))
        if len(self.history) > 60:  # Keep last 60 frames (~20-30 seconds)
            self.history.pop(0)
            
        self.last_box = box
        self.last_seen = now
        if category:
            self.category = category

    @property
    def centroid(self) -> Tuple[float, float]:
        if not self.history:
            return (self.last_box[0] + self.last_box[2] / 2.0, self.last_box[1] + self.last_box[3] / 2.0)
        return (self.history[-1][0], self.history[-1][1])


class BehaviorRecognitionEngine:
    def __init__(self):
        # 1. Initialize OpenCV Human Pedestrian Detector (HOG + Linear SVM)
        self.hog = cv2.HOGDescriptor()
        self.hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
        
        # 2. Initialize Facial & Landmark Detectors
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')
        self.eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
        
        # 3. Tracking State
        self.tracks: Dict[str, Dict[int, TrackedSubject]] = {}  # camera_id -> {track_id: TrackedSubject}
        self.next_track_id: Dict[str, int] = {}
        self.prev_gray_frames: Dict[str, np.ndarray] = {}
        
    def _get_tracks_for_cam(self, camera_id: str) -> Dict[int, TrackedSubject]:
        if camera_id not in self.tracks:
            self.tracks[camera_id] = {}
            self.next_track_id[camera_id] = 1
        return self.tracks[camera_id]

    def _cleanup_old_tracks(self, camera_id: str, max_age_seconds: float = 4.0):
        cam_tracks = self._get_tracks_for_cam(camera_id)
        now = time.time()
        stale_ids = [tid for tid, subj in cam_tracks.items() if (now - subj.last_seen) > max_age_seconds]
        for tid in stale_ids:
            del cam_tracks[tid]

    def detect_persons_and_faces(self, frame: np.ndarray) -> Tuple[List[Tuple[int, int, int, int]], List[Dict[str, Any]]]:
        """
        Runs real computer vision detection on the frame:
        Returns:
            person_boxes: [(x, y, w, h), ...]
            face_results: [{'box': (x,y,w,h), 'emotion': str, 'confidence': int, 'distress': bool}, ...]
        """
        h, w = frame.shape[:2]
        
        # Scale for optimal HOG person detection speed and accuracy
        target_w = 640
        scale = target_w / float(w)
        target_h = int(h * scale)
        resized = cv2.resize(frame, (target_w, target_h))
        
        # Real Person Detection
        raw_boxes, weights = self.hog.detectMultiScale(
            resized, 
            winStride=(8, 8), 
            padding=(8, 8), 
            scale=1.05
        )
        
        # Non-maximum suppression & scaling back to original frame coordinates
        person_boxes = []
        if len(raw_boxes) > 0:
            boxes_scaled = []
            for (bx, by, bw, bh) in raw_boxes:
                boxes_scaled.append([
                    int(bx / scale), 
                    int(by / scale), 
                    int(bw / scale), 
                    int(bh / scale)
                ])
            # Apply NMS
            boxes_np = np.array(boxes_scaled)
            indices = cv2.dnn.NMSBoxes(
                boxes_np.tolist(), 
                [float(wt[0]) if isinstance(wt, (list, np.ndarray)) else float(wt) for wt in weights], 
                score_threshold=0.1, 
                nms_threshold=0.4
            )
            if len(indices) > 0:
                for i in indices.flatten():
                    person_boxes.append(tuple(boxes_scaled[i]))
                    
        # Real Face & Emotion Detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.12, minNeighbors=4, minSize=(35, 35))
        face_results = []
        
        for (fx, fy, fw, fh) in faces:
            roi_gray = gray[fy:fy+fh, fx:fx+fw]
            eyes = self.eye_cascade.detectMultiScale(roi_gray, scaleFactor=1.1, minNeighbors=3, minSize=(10, 10))
            
            lower_face = roi_gray[int(fh * 0.52):int(fh * 0.95), int(fw * 0.15):int(fw * 0.85)]
            smiles = self.smile_cascade.detectMultiScale(roi_gray[int(fh*0.5):, :], scaleFactor=1.35, minNeighbors=14, minSize=(18, 18))
            is_smiling = len(smiles) > 0
            
            is_mouth_open = False
            dark_ratio = 0.0
            edge_energy = 0.0
            if lower_face.size > 0:
                _, thresh = cv2.threshold(lower_face, 55, 255, cv2.THRESH_BINARY_INV)
                dark_ratio = float(np.sum(thresh == 255)) / float(lower_face.size)
                sobel_y = cv2.Sobel(lower_face, cv2.CV_64F, 0, 1, ksize=3)
                edge_energy = float(np.mean(np.abs(sobel_y)))
                if dark_ratio > 0.28 or edge_energy > 38.0:
                    is_mouth_open = True
                    
            if is_smiling:
                emotion = "HAPPY"
                distress = False
                conf = 95
            elif is_mouth_open and dark_ratio > 0.38:
                emotion = "DISTRESS / SCREAM"
                distress = True
                conf = 93
            elif is_mouth_open or (len(eyes) >= 2 and dark_ratio > 0.24):
                emotion = "FEAR / DISTRESS"
                distress = True
                conf = 90
            elif len(eyes) >= 2 and edge_energy > 28.0:
                emotion = "STRESSED / ANGER"
                distress = False
                conf = 88
            else:
                emotion = "NEUTRAL"
                distress = False
                conf = 92
                
            face_results.append({
                "box": (fx, fy, fw, fh),
                "emotion": emotion,
                "confidence": conf,
                "distress": distress
            })
            
        return person_boxes, face_results

    def track_and_classify_behavior(
        self, 
        camera_id: str, 
        frame: np.ndarray, 
        person_boxes: List[Tuple[int, int, int, int]], 
        face_results: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Main Spatial-Temporal Behavior Analysis Pipeline.
        """
        h_frame, w_frame = frame.shape[:2]
        cam_tracks = self._get_tracks_for_cam(camera_id)
        self._cleanup_old_tracks(camera_id)
        
        # 1. Match current person detections to existing tracks using Centroid Distance
        matched_track_ids = set()
        unmatched_boxes = list(person_boxes)
        
        for tid, subject in list(cam_tracks.items()):
            scx, scy = subject.centroid
            best_dist = float('inf')
            best_box_idx = -1
            
            for idx, box in enumerate(unmatched_boxes):
                bcx = box[0] + box[2] / 2.0
                bcy = box[1] + box[3] / 2.0
                dist = math.hypot(scx - bcx, scy - bcy)
                # Matching threshold: 120 pixels
                if dist < best_dist and dist < 140:
                    best_dist = dist
                    best_box_idx = idx
                    
            if best_box_idx >= 0:
                box = unmatched_boxes.pop(best_box_idx)
                subject.update(box)
                matched_track_ids.add(tid)
                
        # 2. Register new tracks for unmatched boxes
        for box in unmatched_boxes:
            tid = self.next_track_id[camera_id]
            self.next_track_id[camera_id] += 1
            # Primary subject default: first female/target
            category = "woman" if tid == 1 or len(cam_tracks) == 0 else "man"
            new_subject = TrackedSubject(tid, box, category=category)
            cam_tracks[tid] = new_subject
            matched_track_ids.add(tid)
            
        # 3. Associate detected faces to corresponding person bounding boxes
        for face in face_results:
            fx, fy, fw, fh = face["box"]
            fcx = fx + fw / 2.0
            fcy = fy + fh / 2.0
            for tid, subject in cam_tracks.items():
                px, py, pw, ph = subject.last_box
                # If face centroid is within upper half of person box
                if px <= fcx <= px + pw and py <= fcy <= py + ph * 0.55:
                    subject.face_emotion = face["emotion"]
                    subject.face_confidence = face["confidence"]
                    subject.distress_detected = face["distress"]
                    break

        # 4. Measure Optical Flow Motion Energy for Physical Altercation Detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        motion_energy = 0.0
        if camera_id in self.prev_gray_frames:
            prev_gray = self.prev_gray_frames[camera_id]
            if prev_gray.shape == gray.shape:
                flow = cv2.calcOpticalFlowFarneback(prev_gray, gray, None, 0.5, 3, 15, 3, 5, 1.2, 0)
                mag, _ = cv2.cartToPolar(flow[..., 0], flow[..., 1])
                motion_energy = float(np.mean(mag))
        self.prev_gray_frames[camera_id] = gray

        # 5. Behavior Recognition Rules:
        # Detect: FOLLOWING, STALKING, CHASING, HARASSMENT, AGGRESSIVE APPROACH, PHYSICAL STRUGGLE
        active_subjects = list(cam_tracks.values())
        detected_behaviors = []
        overall_risk_score = 15
        primary_behavior = "NORMAL ACTIVITY"
        risk_level = "LOW"
        suspect_track_id = None
        target_track_id = None
        
        # If at least 2 people are detected, analyze interaction vectors
        if len(active_subjects) >= 2:
            target = active_subjects[0]
            suspect = active_subjects[1]
            target_track_id = target.track_id
            suspect_track_id = suspect.track_id
            
            tcx, tcy = target.centroid
            scx, scy = suspect.centroid
            separation = math.hypot(tcx - scx, tcy - scy)
            norm_separation = separation / float(w_frame)  # fraction of frame width
            
            # Compute Intersection over Union (IoU) between bounding boxes
            tx, ty, tw, th = target.last_box
            sx, sy, sw, sh = suspect.last_box
            
            ix1 = max(tx, sx)
            iy1 = max(ty, sy)
            ix2 = min(tx + tw, sx + sw)
            iy2 = min(ty + th, sy + sh)
            inter_area = max(0, ix2 - ix1) * max(0, iy2 - iy1)
            target_area = tw * th
            suspect_area = sw * sh
            iou = inter_area / float(target_area + suspect_area - inter_area + 1e-6)
            
            # Compute relative velocity vector
            approach_rate = 0.0
            if len(target.history) >= 3 and len(suspect.history) >= 3:
                prev_tcx, prev_tcy, _ = target.history[-3]
                prev_scx, prev_scy, _ = suspect.history[-3]
                prev_sep = math.hypot(prev_tcx - prev_scx, prev_tcy - prev_scy)
                approach_rate = prev_sep - separation  # positive = closing in fast
                
            # A) PHYSICAL STRUGGLE: High bounding-box overlap or intense motion energy
            if iou > 0.35 or (iou > 0.15 and motion_energy > 4.5):
                primary_behavior = "PHYSICAL STRUGGLE"
                detected_behaviors.append("PHYSICAL STRUGGLE")
                overall_risk_score = 94
                risk_level = "CRITICAL"
                
            # B) CHASING: High approach velocity while target is moving rapidly
            elif approach_rate > 35 and suspect.speed > 80:
                primary_behavior = "CHASING"
                detected_behaviors.append("CHASING")
                overall_risk_score = 88
                risk_level = "CRITICAL"
                
            # C) AGGRESSIVE APPROACH: Sudden rapid surge towards target within close perimeter
            elif norm_separation < 0.22 and approach_rate > 20:
                primary_behavior = "AGGRESSIVE APPROACH"
                detected_behaviors.append("AGGRESSIVE APPROACH")
                overall_risk_score = 78
                risk_level = "HIGH"
                
            # D) STALKING: Proximity under 0.25 frame width maintained over extended duration
            elif norm_separation < 0.25 and len(suspect.history) >= 15:
                primary_behavior = "STALKING"
                detected_behaviors.append("STALKING")
                overall_risk_score = 82
                risk_level = "HIGH"
                
            # E) HARASSMENT: Persistent close proximity and hovering
            elif norm_separation < 0.18:
                primary_behavior = "HARASSMENT"
                detected_behaviors.append("HARASSMENT")
                overall_risk_score = 72
                risk_level = "HIGH"
                
            # F) FOLLOWING: Trailing behind target with similar vector
            elif norm_separation < 0.38 and len(suspect.history) >= 8:
                primary_behavior = "FOLLOWING"
                detected_behaviors.append("FOLLOWING")
                overall_risk_score = 55
                risk_level = "MEDIUM"
                
        elif len(active_subjects) == 1:
            # Single person observed
            target = active_subjects[0]
            target_track_id = target.track_id
            primary_behavior = "NORMAL COMMUTE"
            overall_risk_score = 18
            risk_level = "LOW"
            
        else:
            # No persons detected in current frame
            primary_behavior = "NORMAL SURVEILLANCE"
            overall_risk_score = 10
            risk_level = "LOW"

        # 6. FACIAL DISTRESS AS SUPPORTING SIGNAL (Strict Spec Compliance)
        # "Facial distress must be a supporting signal, NOT proof of abuse."
        # It modulates the confidence/risk multiplier, but cannot fabricate a crime on its own.
        distress_present = any(s.distress_detected for s in active_subjects)
        distress_boost = 0
        if distress_present:
            if primary_behavior in ["PHYSICAL STRUGGLE", "CHASING", "AGGRESSIVE APPROACH", "STALKING", "HARASSMENT"]:
                # Solidifies high confidence of emergency
                distress_boost = 6
                overall_risk_score = min(100, overall_risk_score + distress_boost)
                if overall_risk_score >= 85:
                    risk_level = "CRITICAL"
                elif overall_risk_score >= 70:
                    risk_level = "HIGH"
            elif primary_behavior == "FOLLOWING":
                # Escalates following to potential stalking concern
                distress_boost = 18
                overall_risk_score += distress_boost
                primary_behavior = "FOLLOWING + DISTRESS SIGNAL"
                risk_level = "HIGH"
            else:
                # In isolation, facial distress is noted as health/distress baseline without abuse accusation
                overall_risk_score = min(overall_risk_score + 15, 38)
                risk_level = "LOW"

        # Format output bounding boxes in percentage (0 to 100)
        formatted_boxes = []
        for s in active_subjects:
            bx, by, bw, bh = s.last_box
            is_threat = (s.track_id == suspect_track_id and risk_level in ["HIGH", "CRITICAL"])
            is_target = (s.track_id == target_track_id)
            
            label = f"[ID_{s.track_id:02d}] "
            if is_threat:
                label += f"{primary_behavior}"
                role = "SUSPECT"
            elif is_target:
                label += f"Target (Woman) - {s.face_emotion}"
                role = "TARGET"
            else:
                label += f"Pedestrian - {s.face_emotion}"
                role = "PEDESTRIAN"
                
            formatted_boxes.append({
                "track_id": s.track_id,
                "role": role,
                "label": label,
                "category": s.category,
                "emotion": s.face_emotion,
                "distress": s.distress_detected,
                "is_threat": is_threat,
                "is_target": is_target,
                "box": {
                    "x": round((bx / float(w_frame)) * 100.0, 1),
                    "y": round((by / float(h_frame)) * 100.0, 1),
                    "width": round((bw / float(w_frame)) * 100.0, 1),
                    "height": round((bh / float(h_frame)) * 100.0, 1),
                },
                "speed": round(s.speed, 1)
            })

        return {
            "camera_id": camera_id,
            "timestamp": datetime.utcnow().isoformat(),
            "detected_persons_count": len(active_subjects),
            "boxes": formatted_boxes,
            "primary_behavior": primary_behavior,
            "detected_behaviors": detected_behaviors or ["NORMAL"],
            "risk_score": overall_risk_score,
            "risk_level": risk_level,  # LOW / MEDIUM / HIGH / CRITICAL
            "facial_distress_detected": distress_present,
            "facial_distress_role": "Supporting Verification Signal" if distress_present else "Baseline Normal",
            "motion_energy": round(motion_energy, 2),
            "inference_engine": "OpenCV HOG + Spatial-Temporal Tracker v3.2",
            "is_real_inference": True
        }


# Global singleton instance
behavior_engine = BehaviorRecognitionEngine()
