from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from ..models import Alert, Camera, Incident, User
from ..schemas import AlertResponse, IncidentResponse, IncidentResolve
from ..auth import verify_any_officer, get_current_user
from ..websocket import manager

router = APIRouter(tags=["alerts-incidents"])

@router.get("/alerts", response_model=List[AlertResponse])
def get_alerts(
    db: Session = Depends(get_db),
    current_user=Depends(verify_any_officer)
):
    # Retrieve alerts ordered by timestamp descending
    alerts = db.query(Alert).order_by(Alert.timestamp.desc()).all()
    
    response = []
    for alert in alerts:
        response.append(
            AlertResponse(
                id=alert.id,
                camera_id=alert.camera_id,
                risk_score=alert.risk_score,
                timestamp=alert.timestamp,
                status=alert.status,
                following_score=alert.following_score,
                proximity_score=alert.proximity_score,
                aggression_score=alert.aggression_score,
                explanation=alert.explanation,
                explanation_ta=alert.explanation_ta,
                evidence_clip_url=alert.evidence_clip_url,
                camera_name=alert.camera.name if alert.camera else "Unknown Camera",
                camera_location=alert.camera.location if alert.camera else "Unknown Location"
            )
        )
    return response

@router.post("/alerts/{alert_id}/resolve", response_model=AlertResponse)
async def resolve_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_any_officer)
):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    alert.status = "Resolved"
    db.commit()
    db.refresh(alert)
    
    # If there is a matching active incident, resolve it too
    incident = db.query(Incident).filter(Incident.alert_id == alert_id, Incident.status != "Resolved").first()
    if incident:
        incident.status = "Resolved"
        incident.resolution_timestamp = datetime.utcnow()
        incident.resolution_notes = "Resolved directly from alert actions panel."
        db.commit()
        db.refresh(incident)
        
    # Broadcast updates via WebSocket
    await manager.broadcast({
        "type": "ALERT_UPDATE",
        "data": {
            "id": alert.id,
            "status": alert.status
        }
    })
    
    if incident:
        await manager.broadcast({
            "type": "INCIDENT_UPDATE",
            "data": {
                "id": incident.id,
                "alert_id": incident.alert_id,
                "status": incident.status,
                "resolution_notes": incident.resolution_notes,
                "resolution_timestamp": incident.resolution_timestamp.isoformat() if incident.resolution_timestamp else None
            }
        })
        
    return AlertResponse(
        id=alert.id,
        camera_id=alert.camera_id,
        risk_score=alert.risk_score,
        timestamp=alert.timestamp,
        status=alert.status,
        following_score=alert.following_score,
        proximity_score=alert.proximity_score,
        aggression_score=alert.aggression_score,
        explanation=alert.explanation,
        explanation_ta=alert.explanation_ta,
        evidence_clip_url=alert.evidence_clip_url,
        camera_name=alert.camera.name if alert.camera else "Unknown Camera",
        camera_location=alert.camera.location if alert.camera else "Unknown Location"
    )

@router.post("/alerts/{alert_id}/escalate", response_model=IncidentResponse)
async def escalate_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_any_officer)
):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    # Mark alert as escalated
    alert.status = "Escalated"
    db.commit()
    
    # Broadcast alert update
    await manager.broadcast({
        "type": "ALERT_UPDATE",
        "data": {
            "id": alert.id,
            "status": alert.status
        }
    })
    
    # Check if incident already exists
    existing_incident = db.query(Incident).filter(Incident.alert_id == alert_id).first()
    if existing_incident:
        # Just return existing
        return IncidentResponse(
            id=existing_incident.id,
            alert_id=existing_incident.alert_id,
            status=existing_incident.status,
            resolution_notes=existing_incident.resolution_notes,
            escalated_by=existing_incident.escalated_by,
            escalation_timestamp=existing_incident.escalation_timestamp,
            resolution_timestamp=existing_incident.resolution_timestamp,
            camera_name=alert.camera.name if alert.camera else "Unknown Camera",
            camera_location=alert.camera.location if alert.camera else "Unknown Location",
            risk_score=alert.risk_score,
            explanation=alert.explanation,
            explanation_ta=alert.explanation_ta
        )

    # Create new Incident entry
    incident = Incident(
        alert_id=alert_id,
        escalated_by=current_user.id,
        escalation_timestamp=datetime.utcnow(),
        status="Escalated"
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    
    # Broadcast new incident via WebSocket
    await manager.broadcast({
        "type": "INCIDENT_UPDATE",
        "data": {
            "id": incident.id,
            "alert_id": incident.alert_id,
            "status": incident.status,
            "resolution_notes": incident.resolution_notes,
            "escalated_by": incident.escalated_by,
            "escalation_timestamp": incident.escalation_timestamp.isoformat() if incident.escalation_timestamp else None,
            "camera_name": alert.camera.name if alert.camera else "Unknown Camera",
            "camera_location": alert.camera.location if alert.camera else "Unknown Location",
            "risk_score": alert.risk_score,
            "explanation": alert.explanation,
            "explanation_ta": alert.explanation_ta
        }
    })
    
    return IncidentResponse(
        id=incident.id,
        alert_id=incident.alert_id,
        status=incident.status,
        resolution_notes=incident.resolution_notes,
        escalated_by=incident.escalated_by,
        escalation_timestamp=incident.escalation_timestamp,
        resolution_timestamp=incident.resolution_timestamp,
        camera_name=alert.camera.name if alert.camera else "Unknown Camera",
        camera_location=alert.camera.location if alert.camera else "Unknown Location",
        risk_score=alert.risk_score,
        explanation=alert.explanation,
        explanation_ta=alert.explanation_ta
    )

@router.get("/incidents", response_model=List[IncidentResponse])
def get_incidents(
    db: Session = Depends(get_db),
    current_user=Depends(verify_any_officer)
):
    incidents = db.query(Incident).join(Alert).order_by(Incident.escalation_timestamp.desc()).all()
    
    response = []
    for inc in incidents:
        alert = inc.alert
        response.append(
            IncidentResponse(
                id=inc.id,
                alert_id=inc.alert_id,
                status=inc.status,
                resolution_notes=inc.resolution_notes,
                escalated_by=inc.escalated_by,
                escalation_timestamp=inc.escalation_timestamp,
                resolution_timestamp=inc.resolution_timestamp,
                camera_name=alert.camera.name if alert and alert.camera else "Unknown Camera",
                camera_location=alert.camera.location if alert and alert.camera else "Unknown Location",
                risk_score=alert.risk_score if alert else 0,
                explanation=alert.explanation if alert else "",
                explanation_ta=alert.explanation_ta if alert else ""
            )
        )
    return response

@router.post("/incidents/{incident_id}/dispatch", response_model=IncidentResponse)
async def dispatch_incident(
    incident_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_any_officer)
):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    incident.status = "Dispatched"
    db.commit()
    db.refresh(incident)
    
    # Simulate SMS dispatch to Patrol unit console
    print(f"\n[SMS SIMULATION] >>> EMERGENCY PATROL DISPATCHED to {incident.alert.camera.location} (Risk Score: {incident.alert.risk_score}%)! Officer ID: {current_user.id}\n")
    
    alert = incident.alert
    
    # Broadcast updates via WebSocket
    await manager.broadcast({
        "type": "INCIDENT_UPDATE",
        "data": {
            "id": incident.id,
            "alert_id": incident.alert_id,
            "status": incident.status,
            "resolution_notes": incident.resolution_notes,
            "escalated_by": incident.escalated_by,
            "escalation_timestamp": incident.escalation_timestamp.isoformat() if incident.escalation_timestamp else None,
            "camera_name": alert.camera.name if alert and alert.camera else "Unknown Camera",
            "camera_location": alert.camera.location if alert and alert.camera else "Unknown Location",
            "risk_score": alert.risk_score if alert else 0,
            "explanation": alert.explanation if alert else "",
            "explanation_ta": alert.explanation_ta if alert else ""
        }
    })
    
    return IncidentResponse(
        id=incident.id,
        alert_id=incident.alert_id,
        status=incident.status,
        resolution_notes=incident.resolution_notes,
        escalated_by=incident.escalated_by,
        escalation_timestamp=incident.escalation_timestamp,
        resolution_timestamp=incident.resolution_timestamp,
        camera_name=alert.camera.name if alert and alert.camera else "Unknown Camera",
        camera_location=alert.camera.location if alert and alert.camera else "Unknown Location",
        risk_score=alert.risk_score if alert else 0,
        explanation=alert.explanation if alert else "",
        explanation_ta=alert.explanation_ta if alert else ""
    )

@router.post("/incidents/{incident_id}/resolve", response_model=IncidentResponse)
async def resolve_incident(
    incident_id: int,
    notes: IncidentResolve,
    db: Session = Depends(get_db),
    current_user=Depends(verify_any_officer)
):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    incident.status = "Resolved"
    incident.resolution_timestamp = datetime.utcnow()
    incident.resolution_notes = notes.resolution_notes
    
    # Also resolve the underlying alert
    alert = incident.alert
    if alert:
        alert.status = "Resolved"
        
    db.commit()
    db.refresh(incident)
    
    # Broadcast updates via WebSocket
    await manager.broadcast({
        "type": "INCIDENT_UPDATE",
        "data": {
            "id": incident.id,
            "alert_id": incident.alert_id,
            "status": incident.status,
            "resolution_notes": incident.resolution_notes,
            "resolution_timestamp": incident.resolution_timestamp.isoformat() if incident.resolution_timestamp else None
        }
    })
    
    if alert:
        await manager.broadcast({
            "type": "ALERT_UPDATE",
            "data": {
                "id": alert.id,
                "status": alert.status
            }
        })
        
    return IncidentResponse(
        id=incident.id,
        alert_id=incident.alert_id,
        status=incident.status,
        resolution_notes=incident.resolution_notes,
        escalated_by=incident.escalated_by,
        escalation_timestamp=incident.escalation_timestamp,
        resolution_timestamp=incident.resolution_timestamp,
        camera_name=alert.camera.name if alert and alert.camera else "Unknown Camera",
        camera_location=alert.camera.location if alert and alert.camera else "Unknown Location",
        risk_score=alert.risk_score if alert else 0,
        explanation=alert.explanation if alert else "",
        explanation_ta=alert.explanation_ta if alert else ""
    )
