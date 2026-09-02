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
    Simulated AI analysis engine that computes fireworks MSME environmental
    and worker safety risk scores.
    """
    roll = random.random()
    if roll < 0.18:  # 18% High Risk Anomaly
        following_score = random.randint(75, 95)  # Represents thermal/temp index
        proximity_score = random.randint(80, 100) # Represents gas ppm & density index
        aggression_score = random.randint(60, 95) # Represents acoustic / violation index
    elif roll < 0.45:  # 27% Caution Warning
        following_score = random.randint(40, 74)
        proximity_score = random.randint(45, 75)
        aggression_score = random.randint(30, 59)
    else:  # 55% Safe / Normal
        following_score = random.randint(10, 35)
        proximity_score = random.randint(10, 40)
        aggression_score = random.randint(5, 25)

    # Calculate final safety risk score (weighted average: Temp 40%, Gas 35%, Activity 25%)
    final_score = int((following_score * 0.40) + (proximity_score * 0.35) + (aggression_score * 0.25))

    # Generate Explainable AI context text for Fireworks MSME Safety
    if final_score >= 75:
        temp_c = random.randint(42, 48)
        gas_ppm = random.randint(420, 680)
        reasons_en = [
            f"Thermal Anomaly: Ambient Temp reached {temp_c}°C (>38°C threshold)",
            f"Volatile Gas Concentration: {gas_ppm} PPM detected",
            "Exhaust Ventilation Response Protocol Triggered"
        ]
        reasons_ta = [
            f"வெப்ப முரண்பாடு: வெப்பநிலை {temp_c}°C-ஐ எட்டியுள்ளது (வரம்பு >38°C)",
            f"எரியும் வாயு செறிவு: {gas_ppm} PPM கண்டறியப்பட்டது",
            "தானியங்கி காற்றோட்ட அமைப்பு இயக்கம் தொடங்கப்பட்டது"
        ]
        explanation = "CRITICAL SAFETY ALARM: " + " | ".join(reasons_en) + "."
        explanation_ta = "தீவிர பாதுகாப்பு எச்சரிக்கை: " + " | ".join(reasons_ta) + "."
    elif final_score >= 45:
        temp_c = random.randint(34, 38)
        explanation = f"Caution: Elevated ambient temperature ({temp_c}°C) and worker density near chemical handling zone."
        explanation_ta = f"எச்சரிக்கை: வேதிப்பொருள் பகுதியில் உயர்ந்த வெப்பநிலை ({temp_c}°C) மற்றும் தொழிலாளர் அடர்த்தி பதிவாகியுள்ளது."
    else:
        explanation = "Normal environmental baseline. Temperature, humidity and gas PPM within safe regulatory limits."
        explanation_ta = "இயல்பான சுற்றுச்சூழல் நிலை. வெப்பநிலை, ஈரப்பதம் மற்றும் வாயு அளவு பாதுகாப்பான வரம்பில் உள்ளன."

    evidence_clip = f"/evidence/mock_clip_{random.randint(1, 4)}.mp4"

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
    Periodically queries active cameras, calculates simulated hazard telemetry,
    stores records, and broadcasts alerts via WebSockets.
    """
    print("[AI Engine] Starting PyroGuardian AI safety telemetry loop...")
    await asyncio.sleep(4)
    
    while True:
        try:
            db: Session = SessionLocal()
            try:
                cameras = db.query(Camera).filter(Camera.status == "Active").all()
                if not cameras:
                    db.close()
                    await asyncio.sleep(settings.AI_SIMULATION_INTERVAL_SECS)
                    continue

                camera = random.choice(cameras)
                risk_data = calculate_risk_scores(camera.name, camera.location)
                
                # Store alerts when risk threshold >= 40
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
                    
                    analytics_log = AnalyticsLog(
                        timestamp=datetime.utcnow(),
                        location=camera.location,
                        avg_risk_score=float(risk_data["risk_score"]),
                        alert_count=1
                    )
                    db.add(analytics_log)
                    db.commit()

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
                    print(f"[AI Engine] Broadcasted safety event for Camera '{camera.name}' with risk {alert.risk_score}%")
            finally:
                db.close()
        except Exception as e:
            print(f"[AI Engine] Error in telemetry simulation: {e}")
            
        await asyncio.sleep(settings.AI_SIMULATION_INTERVAL_SECS)
