import random
import asyncio
from datetime import datetime
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import Camera, Alert, AnalyticsLog
from .websocket import manager
from .config import settings

def calculate_risk_scores(camera_name: str, location: str) -> dict:
    """
    Simulated AI analysis engine that computes safety scores.
    Returns:
        dict: Containing following_score, proximity_score, aggression_score, 
              final_risk, and explanation.
    """
    # Decide risk category: HIGH, MEDIUM, LOW
    roll = random.random()
    if roll < 0.2:  # 20% High Risk
        following_score = random.randint(75, 95)
        proximity_score = random.randint(80, 100)
        aggression_score = random.randint(60, 95)
    elif roll < 0.5:  # 30% Medium Risk
        following_score = random.randint(40, 74)
        proximity_score = random.randint(50, 79)
        aggression_score = random.randint(30, 59)
    else:  # 50% Low Risk / Normal
        following_score = random.randint(5, 39)
        proximity_score = random.randint(10, 49)
        aggression_score = random.randint(5, 29)

    # Calculate final risk score (weighted average)
    # Following (40%), Proximity (35%), Aggression (25%)
    final_score = int((following_score * 0.40) + (proximity_score * 0.35) + (aggression_score * 0.25))

    # Generate Explainable AI context text
    if final_score >= 75:
        reasons_en = []
        reasons_ta = []
        mins = random.randint(30, 45)
        db_level = random.randint(85, 95)
        
        if following_score >= 75:
            reasons_en.append(f"Subject has been following target for {mins} minutes")
            reasons_ta.append(f"நபர் இலக்கை {mins} நிமிடங்களாக தொடர்ந்து பின்தொடர்கிறார்")
        if proximity_score >= 80:
            reasons_en.append("Proximity warning: Critical distance under 1.0m maintained")
            reasons_ta.append("நெருக்க எச்சரிக்கை: ஆபத்தான இடைவெளி 1.0 மீட்டருக்கும் குறைவாக உள்ளது")
        if aggression_score >= 60:
            reasons_en.append(f"Aggressive behavior detected | Acoustic scream sensor triggered ({db_level}dB)")
            reasons_ta.append(f"ஆக்ரோஷமான நடத்தை கண்டறியப்பட்டது | அலறல் ஒலி உணரி தூண்டப்பட்டது ({db_level}dB)")
        
        explanation = "CRITICAL ALERT: " + " | ".join(reasons_en) + "."
        explanation_ta = "அபாய எச்சரிக்கை: " + " | ".join(reasons_ta) + "."
    elif final_score >= 45:
        explanation = f"Caution: Isolated low-light zone. Subject following target (Proximity Risk: {proximity_score}%)."
        explanation_ta = f"எச்சரிக்கை: ஆட்கள் நடமாட்டம் அற்ற பகுதி. இருண்ட சந்து அருகில் பின்தொடரும் நபர் (நெருக்க விகிதம்: {proximity_score}%)."
    else:
        explanation = "Normal pedestrian flow. Safe proximity, acoustics, and movement trails."
        explanation_ta = "இயல்பான நடைபாதை ஒழுங்கு. நெருக்கம், ஒலி மற்றும் அசைவு வேகம் பாதுகாப்பான வரம்பிற்குள் உள்ளது."

    # Evidence mock URL path
    evidence_clip = f"/evidence/mock_clip_{random.randint(1, 5)}.mp4"

    return {
        "following_score": following_score,
        "proximity_score": proximity_score,
        "aggression_score": aggression_score,
        "risk_score": final_score,
        "explanation": explanation,
        "explanation_ta": explanation_ta,
        "evidence_clip_url": evidence_clip
    }

async def surveillance_simulation_loop():
    """
    Loop that periodically queries the DB for active cameras, calculates
    a simulated alert, writes it to the database, and broadcasts it via WebSockets.
    """
    print("[AI Engine] Starting surveillance simulation loop...")
    await asyncio.sleep(5)  # Wait for startup and seeding
    
    while True:
        try:
            db: Session = SessionLocal()
            try:
                # Fetch active cameras
                cameras = db.query(Camera).filter(Camera.status == "Active").all()
                if not cameras:
                    db.close()
                    await asyncio.sleep(settings.AI_SIMULATION_INTERVAL_SECS)
                    continue

                # Choose a camera to simulate alert
                camera = random.choice(cameras)
                
                # Analyze camera
                risk_data = calculate_risk_scores(camera.name, camera.location)
                
                # Only save alerts with a minimum risk score of 40 to prevent cluttering,
                # but occasionally broadcast low risk data
                if risk_data["risk_score"] >= 40:
                    alert = Alert(
                        camera_id=camera.id,
                        risk_score=risk_data["risk_score"],
                        timestamp=datetime.utcnow(),
                        status="New",
                        following_score=risk_data["following_score"],
                        proximity_score=risk_data["proximity_score"],
                        aggression_score=risk_data["aggression_score"],
                        explanation=risk_data["explanation"],
                        explanation_ta=risk_data["explanation_ta"],
                        evidence_clip_url=risk_data["evidence_clip_url"]
                    )
                    db.add(alert)
                    db.commit()
                    db.refresh(alert)
                    
                    # Log to AnalyticsLogs
                    analytics_log = AnalyticsLog(
                        timestamp=datetime.utcnow(),
                        location=camera.location,
                        avg_risk_score=float(risk_data["risk_score"]),
                        alert_count=1
                    )
                    db.add(analytics_log)
                    db.commit()

                    # Broadcast the alert to WebSocket clients
                    ws_payload = {
                        "type": "NEW_ALERT",
                        "data": {
                            "id": alert.id,
                            "camera_id": camera.id,
                            "camera_name": camera.name,
                            "camera_location": camera.location,
                            "risk_score": alert.risk_score,
                            "timestamp": alert.timestamp.isoformat(),
                            "status": alert.status,
                            "following_score": alert.following_score,
                            "proximity_score": alert.proximity_score,
                            "aggression_score": alert.aggression_score,
                            "explanation": alert.explanation,
                            "explanation_ta": alert.explanation_ta,
                            "evidence_clip_url": alert.evidence_clip_url
                        }
                    }
                    await manager.broadcast(ws_payload)
                    print(f"[AI Engine] Generated alert ID {alert.id} for Camera '{camera.name}' with risk {alert.risk_score}%")
            finally:
                db.close()
        except Exception as e:
            print(f"[AI Engine] Error in simulation loop: {e}")
            
        await asyncio.sleep(settings.AI_SIMULATION_INTERVAL_SECS)
