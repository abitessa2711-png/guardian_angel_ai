import os
import sys
from datetime import datetime, timedelta

# Ensure parent directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, SessionLocal, Base
from app.models import User, Camera, Alert, Incident, AnalyticsLog
from app.auth import get_password_hash

def seed_database():
    print("[Seed] Initializing PyroGuardian AI database schema...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("[Seed] Creating default safety officer & admin accounts...")
        admin_pass = get_password_hash("Admin@123")
        officer_pass = get_password_hash("Officer@123")
        
        admin_user = User(
            name="Safety Chief Er. M. Sundaram",
            email="admin@trichypolice.gov.in",
            password_hash=admin_pass,
            role="ADMIN",
            is_active=True
        )
        officer_user = User(
            name="Plant Supervisor K. Rajesh",
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
        
        print("[Seed] Registering 16 External Safe Observation Camera Nodes...")
        cameras = [
            Camera(
                name="CAM-01 RAW_MATERIAL_STORE", 
                location="Raw Chemical & Nitrate Store Outer Gate", 
                rtsp_url="rtsp://192.168.1.101/stream1", 
                status="Active", 
                latitude=9.4532, 
                longitude=77.8021
            ),
            Camera(
                name="CAM-02 MIXING_SHED_01_OUTER", 
                location="Chemical Mixing Room 1 (External Observation)", 
                rtsp_url="rtsp://192.168.1.102/stream1", 
                status="Active", 
                latitude=9.4538, 
                longitude=77.8028
            ),
            Camera(
                name="CAM-03 MIXING_SHED_02_OUTER", 
                location="Chemical Mixing Room 2 (External Observation)", 
                rtsp_url="rtsp://192.168.1.103/stream1", 
                status="Active", 
                latitude=9.4542, 
                longitude=77.8034
            ),
            Camera(
                name="CAM-04 CHEMICAL_GRINDING_GATE", 
                location="Pulverizer & Grinding Shed Outer Perch", 
                rtsp_url="rtsp://192.168.1.104/stream1", 
                status="Active", 
                latitude=9.4548, 
                longitude=77.8041
            ),
            Camera(
                name="CAM-05 DRYING_GROUNDS_NORTH", 
                location="Open Drying Yard North (Solar Radiation)", 
                rtsp_url="rtsp://192.168.1.105/stream1", 
                status="Active", 
                latitude=9.4554, 
                longitude=77.8049
            ),
            Camera(
                name="CAM-06 DRYING_GROUNDS_SOUTH", 
                location="Open Drying Yard South (Perimeter Watch)", 
                rtsp_url="rtsp://192.168.1.106/stream1", 
                status="Active", 
                latitude=9.4560, 
                longitude=77.8056
            ),
            Camera(
                name="CAM-07 FUSE_INSERTION_PORCH", 
                location="Fuse Cutting & Insertion Porch", 
                rtsp_url="rtsp://192.168.1.107/stream1", 
                status="Active", 
                latitude=9.4567, 
                longitude=77.8062
            ),
            Camera(
                name="CAM-08 PAPER_CASING_UNIT", 
                location="Paper Tube Winding & Casing Section", 
                rtsp_url="rtsp://192.168.1.108/stream1", 
                status="Active", 
                latitude=9.4572, 
                longitude=77.8070
            ),
            Camera(
                name="CAM-09 SPARKLER_SLURRY_SHED", 
                location="Sparkler Dipping & Slurry Bath Outer", 
                rtsp_url="rtsp://192.168.1.109/stream1", 
                status="Active", 
                latitude=9.4578, 
                longitude=77.8078
            ),
            Camera(
                name="CAM-10 FILLING_ASSEMBLY_LINE", 
                location="Final Firework Assembly & Filling Line", 
                rtsp_url="rtsp://192.168.1.110/stream1", 
                status="Active", 
                latitude=9.4583, 
                longitude=77.8085
            ),
            Camera(
                name="CAM-11 PACKAGING_BOXING_HALL", 
                location="Secondary Packaging & Box Storage", 
                rtsp_url="rtsp://192.168.1.111/stream1", 
                status="Active", 
                latitude=9.4589, 
                longitude=77.8092
            ),
            Camera(
                name="CAM-12 FINISHED_MAGAZINE_BUNKER", 
                location="Explosive Magazine Storage Vault Entry", 
                rtsp_url="rtsp://192.168.1.112/stream1", 
                status="Active", 
                latitude=9.4595, 
                longitude=77.8100
            ),
            Camera(
                name="CAM-13 WASTE_NEUTRALIZATION_PIT", 
                location="Chemical Residue Neutralization Pit", 
                rtsp_url="rtsp://192.168.1.113/stream1", 
                status="Active", 
                latitude=9.4601, 
                longitude=77.8108
            ),
            Camera(
                name="CAM-14 FIRE_HYDRANT_PUMP_HOUSE", 
                location="Industrial Fire Water Reserve & Pump House", 
                rtsp_url="rtsp://192.168.1.114/stream1", 
                status="Active", 
                latitude=9.4607, 
                longitude=77.8115
            ),
            Camera(
                name="CAM-15 CONTROL_ROOM_PERIMETER", 
                location="External Safety Supervisor Control Post", 
                rtsp_url="rtsp://192.168.1.115/stream1", 
                status="Active", 
                latitude=9.4613, 
                longitude=77.8122
            ),
            Camera(
                name="CAM-16 EMERGENCY_BUFFER_GATE", 
                location="Factory Boundary & Evacuation Path", 
                rtsp_url="rtsp://192.168.1.116/stream1", 
                status="Offline", 
                latitude=9.4619, 
                longitude=77.8130
            )
        ]
        for camera in cameras:
            db.add(camera)
        db.commit()
        
        cameras = db.query(Camera).all()
        cam_map = {c.name: c for c in cameras}
        
        print("[Seed] Creating historical fireworks safety alerts...")
        now = datetime.utcnow()
        alerts = [
            Alert(
                camera_id=cam_map["CAM-04 CHEMICAL_GRINDING_GATE"].id,
                risk_score=94,
                timestamp=now - timedelta(minutes=25),
                status="Escalated",
                following_score=92,
                proximity_score=96,
                aggression_score=95,
                explanation="CRITICAL SAFETY ALARM: Ambient temperature spike detected (44.5°C) in Grinding Zone | Volatile gas index 620 PPM | Automated exhaust ventilation active.",
                explanation_ta="தீவிர பாதுகாப்பு எச்சரிக்கை: அரைக்கும் பகுதியில் வெப்பநிலை உயர்வு (44.5°C) | எரியும் வாயு அளவு 620 PPM | தானியங்கி வெளியேற்றும் விசிறி இயக்கப்பட்டது.",
                evidence_clip_url="/evidence/mock_clip_1.mp4"
            ),
            Alert(
                camera_id=cam_map["CAM-01 RAW_MATERIAL_STORE"].id,
                risk_score=58,
                timestamp=now - timedelta(hours=1, minutes=15),
                status="New",
                following_score=55,
                proximity_score=62,
                aggression_score=40,
                explanation="Caution: Elevated worker density in Raw Chemical Store (4 workers detected without antistatic apron).",
                explanation_ta="எச்சரிக்கை: மூலப்பொருள் சேமிப்புக் கிடங்கில் அனுமதிக்கப்பட்ட அளவை விட கூடுதல் தொழிலாளர்கள் மற்றும் கவச உடை குறைபாடு.",
                evidence_clip_url="/evidence/mock_clip_2.mp4"
            ),
            Alert(
                camera_id=cam_map["CAM-12 FINISHED_MAGAZINE_BUNKER"].id,
                risk_score=78,
                timestamp=now - timedelta(hours=3),
                status="Resolved",
                following_score=80,
                proximity_score=85,
                aggression_score=65,
                explanation="Resolved: Restricted Zone buffer approach detected at Magazine Vault entry. Shift supervisor cleared inspection.",
                explanation_ta="தீர்க்கப்பட்டது: வெடிபொருள் கிடங்கு நுழைவு பகுதியில் அத்துமீறல் எச்சரிக்கை. மேற்பார்வையாளர் ஆய்வு செய்து அனுமதித்தார்.",
                evidence_clip_url="/evidence/mock_clip_3.mp4"
            ),
            Alert(
                camera_id=cam_map["CAM-05 DRYING_GROUNDS_NORTH"].id,
                risk_score=26,
                timestamp=now - timedelta(hours=5),
                status="Resolved",
                following_score=20,
                proximity_score=30,
                aggression_score=15,
                explanation="Normal environmental baseline: Solar radiation 680 W/m², ambient temp 32°C, safe drying parameters.",
                explanation_ta="இயல்பான சுற்றுச்சூழல் நிலை: சூரிய வெப்ப கதிர்வீச்சு மற்றும் வெப்பநிலை பாதுகாப்பான வரம்பிற்குள் உள்ளன.",
                evidence_clip_url="/evidence/mock_clip_4.mp4"
            )
        ]
        for alert in alerts:
            db.add(alert)
        db.commit()
        
        alerts = db.query(Alert).all()
        alert_map = {a.risk_score: a for a in alerts}
        
        print("[Seed] Creating historical incident records...")
        incidents = [
            Incident(
                alert_id=alert_map[94].id,
                escalated_by=officer_user.id,
                escalation_timestamp=now - timedelta(minutes=20),
                status="Escalated"
            ),
            Incident(
                alert_id=alert_map[78].id,
                escalated_by=officer_user.id,
                escalation_timestamp=now - timedelta(hours=2, minutes=50),
                resolution_timestamp=now - timedelta(hours=2, minutes=25),
                resolution_notes="Shift team verified magazine perimeter lock. Temperature stabilized at 28.5°C.",
                status="Resolved"
            )
        ]
        for inc in incidents:
            db.add(inc)
            
        print("[Seed] Creating historical analytics logs...")
        zones = [
            "Raw Chemical & Nitrate Store Outer Gate",
            "Chemical Mixing Room 1 (External Observation)",
            "Pulverizer & Grinding Shed Outer Perch",
            "Explosive Magazine Storage Vault Entry"
        ]
        for day in range(7, 0, -1):
            log_date = now - timedelta(days=day)
            for z in zones:
                db.add(AnalyticsLog(
                    timestamp=log_date,
                    location=z,
                    avg_risk_score=float(random_avg_risk(day)),
                    alert_count=day + 1
                ))
                
        db.commit()
        print("[Seed] PyroGuardian AI database successfully initialized and seeded!")
    except Exception as e:
        db.rollback()
        print(f"[Seed] Error seeding database: {e}")
    finally:
        db.close()

def random_avg_risk(day_offset):
    import random
    return random.randint(35, 68)

if __name__ == "__main__":
    seed_database()
