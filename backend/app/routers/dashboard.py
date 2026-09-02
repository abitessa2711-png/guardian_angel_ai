from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, time
from ..database import get_db
from ..models import Camera, Alert, Incident
from ..schemas import StatsResponse
from ..auth import verify_any_officer

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=StatsResponse)
def get_stats(
    db: Session = Depends(get_db),
    current_user=Depends(verify_any_officer)
):
    # Total and active cameras
    total_cameras = db.query(Camera).count()
    active_cameras = db.query(Camera).filter(Camera.status == "Active").count()
    
    # Alerts today (starting from midnight UTC)
    today_start = datetime.combine(datetime.utcnow().date(), time.min)
    today_alerts = db.query(Alert).filter(Alert.timestamp >= today_start).count()
    
    # High risk incidents today (risk_score >= 75)
    high_risk_incidents = db.query(Alert).filter(
        Alert.timestamp >= today_start,
        Alert.risk_score >= 75
    ).count()
    
    # Resolved cases
    resolved_alerts = db.query(Alert).filter(Alert.status == "Resolved").count()
    resolved_incidents = db.query(Incident).filter(Incident.status == "Resolved").count()
    resolved_cases = resolved_alerts + resolved_incidents
    
    return {
        "total_cameras": total_cameras,
        "active_cameras": active_cameras,
        "today_alerts": today_alerts,
        "high_risk_incidents": high_risk_incidents,
        "resolved_cases": resolved_cases
    }
