import os
import sys
from datetime import datetime, timedelta

# Ensure parent directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, SessionLocal, Base
from app.models import User, Camera, Alert, Incident, AnalyticsLog
from app.auth import get_password_hash

def seed_database():
    print("[Seed] Initializing database schema...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("[Seed] Creating default users...")
        # Hashed password for Admin@123
        admin_pass = get_password_hash("Admin@123")
        # Hashed password for Officer@123
        officer_pass = get_password_hash("Officer@123")
        
        admin_user = User(
            name="DSP Meenakshi Sundaram",
            email="admin@trichypolice.gov.in",
            password_hash=admin_pass,
            role="ADMIN",
            is_active=True
        )
        officer_user = User(
            name="Sub-Inspector Rajesh Kumar",
            email="officer@trichypolice.gov.in",
            password_hash=officer_pass,
            role="SECURITY_OFFICER",
            is_active=True
        )
        db.add(admin_user)
        db.add(officer_user)
        db.commit()
        db.refresh(admin_user)
        db.refresh(officer_user)
        
        print("[Seed] Creating default cameras...")
        cameras = [
            Camera(
                name="CCTV-01 CHATRAM_BUS_STAND", 
                location="Chatram Bus Stand Outer Gates", 
                rtsp_url="rtsp://192.168.1.101/stream1", 
                status="Active", 
                latitude=10.8291, 
                longitude=78.6974
            ),
            Camera(
                name="CCTV-02 CENTRAL_BUS_STAND", 
                location="Central Bus Terminal Platform 1 Gate", 
                rtsp_url="rtsp://192.168.1.102/stream1", 
                status="Active", 
                latitude=10.7963, 
                longitude=78.6856
            ),
            Camera(
                name="CCTV-03 RAILWAY_JUNCTION", 
                location="Trichy Railway Junction Entrance", 
                rtsp_url="rtsp://192.168.1.103/stream1", 
                status="Active", 
                latitude=10.7905, 
                longitude=78.6821
            ),
            Camera(
                name="CCTV-04 ROCKFORT_TEMPLE_ROAD", 
                location="Rockfort Temple Bazaar Street", 
                rtsp_url="rtsp://192.168.1.104/stream1", 
                status="Active", 
                latitude=10.8275, 
                longitude=78.6968
            ),
            Camera(
                name="CCTV-05 SRIRANGAM_TEMPLE", 
                location="Srirangam Temple Entrance", 
                rtsp_url="rtsp://192.168.1.105/stream1", 
                status="Active", 
                latitude=10.8624, 
                longitude=78.6902
            ),
            Camera(
                name="CCTV-06 NIT_TRICHY", 
                location="NIT Trichy Highway Gate", 
                rtsp_url="rtsp://192.168.1.106/stream1", 
                status="Offline", 
                latitude=10.7614, 
                longitude=78.8132
            ),
            Camera(
                name="CCTV-07 LALGUDI_SUBWAY", 
                location="Lalgudi Junction Subway", 
                rtsp_url="rtsp://192.168.1.107/stream1", 
                status="Active", 
                latitude=10.8690, 
                longitude=78.8250
            ),
            Camera(
                name="CCTV-08 THILLAI_NAGAR", 
                location="Thillai Nagar Main Cross", 
                rtsp_url="rtsp://192.168.1.108/stream1", 
                status="Active", 
                latitude=10.8120, 
                longitude=78.6850
            ),
            Camera(
                name="CCTV-09 WORAIYUR_BAZAAR", 
                location="Woraiyur Bazaar Road", 
                rtsp_url="rtsp://192.168.1.109/stream1", 
                status="Active", 
                latitude=10.8190, 
                longitude=78.6730
            ),
            Camera(
                name="CCTV-10 KK_NAGAR_JNC", 
                location="KK Nagar Circle Road", 
                rtsp_url="rtsp://192.168.1.110/stream1", 
                status="Active", 
                latitude=10.7720, 
                longitude=78.7180
            ),
            Camera(
                name="CCTV-11 THENNUR_CROSS", 
                location="Thennur High Road Crossing", 
                rtsp_url="rtsp://192.168.1.111/stream1", 
                status="Active", 
                latitude=10.8150, 
                longitude=78.6910
            ),
            Camera(
                name="CCTV-12 MAIN_GUARD_GATE", 
                location="Main Guard Gate Entrance", 
                rtsp_url="rtsp://192.168.1.112/stream1", 
                status="Active", 
                latitude=10.8320, 
                longitude=78.6950
            ),
            Camera(
                name="CCTV-13 ROCKFORT_BAZAAR", 
                location="Rockfort Shopping Arch", 
                rtsp_url="rtsp://192.168.1.113/stream1", 
                status="Active", 
                latitude=10.8285, 
                longitude=78.6975
            ),
            Camera(
                name="CCTV-14 GANDHI_MARKET", 
                location="Gandhi Market Wholesale Gate", 
                rtsp_url="rtsp://192.168.1.114/stream1", 
                status="Active", 
                latitude=10.8210, 
                longitude=78.7010
            ),
            Camera(
                name="CCTV-15 CHINTAMANI_JNC", 
                location="Chintamani Junction", 
                rtsp_url="rtsp://192.168.1.115/stream1", 
                status="Active", 
                latitude=10.8260, 
                longitude=78.6930
            ),
            Camera(
                name="CCTV-16 PALAKKARAI_CROSS", 
                location="Palakkarai Cross Road", 
                rtsp_url="rtsp://192.168.1.116/stream1", 
                status="Offline", 
                latitude=10.8010, 
                longitude=78.6990
            )
        ]
        for camera in cameras:
            db.add(camera)
        db.commit()
        
        # Reload cameras to get IDs
        cameras = db.query(Camera).all()
        cam_map = {c.name: c for c in cameras}
        
        print("[Seed] Creating historical alerts...")
        now = datetime.utcnow()
        alerts = [
            # Critical Alert
            Alert(
                camera_id=cam_map["CCTV-04 ROCKFORT_TEMPLE_ROAD"].id,
                risk_score=94,
                timestamp=now - timedelta(minutes=45),
                status="Escalated",
                following_score=92,
                proximity_score=96,
                aggression_score=95,
                explanation="PROACTIVE CRITICAL THREAT: Subject followed target for 32 mins | Proximity under 0.8 meters | Isolated dark zone | Acoustic abuse scream detected.",
                explanation_ta="தீவிர அபாய எச்சரிக்கை: நபர் 32 நிமிடங்களாக இலக்கை பின்தொடர்கிறார் | நெருக்கம் 0.8 மீட்டருக்கும் குறைவு | ஆட்கள் நடமாட்டம் அற்ற பகுதி | அலறல் சத்தம் கண்டறியப்பட்டது.",
                evidence_clip_url="/evidence/mock_clip_1.mp4"
            ),
            # Medium Alert
            Alert(
                camera_id=cam_map["CCTV-01 CHATRAM_BUS_STAND"].id,
                risk_score=55,
                timestamp=now - timedelta(hours=2),
                status="New",
                following_score=58,
                proximity_score=62,
                aggression_score=40,
                explanation="Caution: Elevated following behavior (58%) and proximity (62%) near dark subway gate.",
                explanation_ta="எச்சரிக்கை: இருட்டான சுரங்கப்பாதை கேட் அருகில் நபர் அதிக நெருக்க விகிதத்தை (62%) காட்டுகிறார்.",
                evidence_clip_url="/evidence/mock_clip_2.mp4"
            ),
            # Resolved Alert
            Alert(
                camera_id=cam_map["CCTV-03 RAILWAY_JUNCTION"].id,
                risk_score=79,
                timestamp=now - timedelta(hours=3),
                status="Resolved",
                following_score=82,
                proximity_score=88,
                aggression_score=60,
                explanation="CRITICAL ALERT: Proximity under 1.0 meters for 70 seconds. Target showed pacing behavior.",
                explanation_ta="அபாய எச்சரிக்கை: 70 விநாடிகளாக நெருக்கம் 1.0 மீட்டருக்கும் குறைவாக உள்ளது. இலக்கு பதற்றமான நடத்தையை காட்டினார்.",
                evidence_clip_url="/evidence/mock_clip_3.mp4"
            ),
            # Normal Alert (Low Risk)
            Alert(
                camera_id=cam_map["CCTV-02 CENTRAL_BUS_STAND"].id,
                risk_score=28,
                timestamp=now - timedelta(hours=6),
                status="Resolved",
                following_score=20,
                proximity_score=35,
                aggression_score=15,
                explanation="Normal pedestrian flow. Low risk scores across all metrics.",
                explanation_ta="இயல்பான நடைபாதை ஒழுங்கு. அனைத்து அளவீடுகளிலும் குறைந்த ஆபத்து நிலைகளே உள்ளன.",
                evidence_clip_url="/evidence/mock_clip_4.mp4"
            )
        ]
        for alert in alerts:
            db.add(alert)
        db.commit()
        
        # Reload alerts to get IDs
        alerts = db.query(Alert).all()
        alert_map = {a.risk_score: a for a in alerts}
        
        print("[Seed] Creating historical incidents...")
        incidents = [
            Incident(
                alert_id=alert_map[94].id,
                escalated_by=officer_user.id,
                escalation_timestamp=now - timedelta(minutes=40),
                status="Escalated"
            ),
            Incident(
                alert_id=alert_map[79].id,
                escalated_by=officer_user.id,
                escalation_timestamp=now - timedelta(hours=2, minutes=55),
                resolution_timestamp=now - timedelta(hours=2, minutes=30),
                resolution_notes="Patrol car dispatch #04 checked Rockfort area. Threat resolved, suspect dispersed.",
                status="Resolved"
            )
        ]
        for inc in incidents:
            db.add(inc)
            
        print("[Seed] Creating historical analytics logs...")
        # Create analytics logs for past 5 days
        locations = ["Chatram Bus Stand Outer Gates", "Central Bus Terminal Platform 1 Gate", 
                     "Trichy Railway Junction Entrance", "Rockfort Temple Bazaar Street"]
        for day in range(5, 0, -1):
            log_date = now - timedelta(days=day)
            for loc in locations:
                db.add(AnalyticsLog(
                    timestamp=log_date,
                    location=loc,
                    avg_risk_score=float(random_avg_risk(day)),
                    alert_count=day + 2
                ))
                
        db.commit()
        print("[Seed] Seed data successfully populated!")
    except Exception as e:
        db.rollback()
        print(f"[Seed] Error seeding database: {e}")
    finally:
        db.close()

def random_avg_risk(day_offset):
    import random
    # Returns some realistic variation
    return random.randint(45, 78)

if __name__ == "__main__":
    seed_database()
