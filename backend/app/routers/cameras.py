from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Camera
from ..schemas import CameraCreate, CameraUpdate, CameraResponse
from ..auth import get_current_user, RoleChecker, verify_admin, verify_any_officer

router = APIRouter(prefix="/cameras", tags=["cameras"])

@router.get("/", response_model=List[CameraResponse])
def get_cameras(
    db: Session = Depends(get_db),
    current_user=Depends(verify_any_officer)
):
    return db.query(Camera).all()

@router.get("/{camera_id}", response_model=CameraResponse)
def get_camera(
    camera_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_any_officer)
):
    camera = db.query(Camera).filter(Camera.id == camera_id).first()
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return camera

@router.post("/", response_model=CameraResponse, status_code=status.HTTP_201_CREATED)
def create_camera(
    camera_in: CameraCreate,
    db: Session = Depends(get_db),
    current_user=Depends(verify_admin)
):
    db_camera = Camera(**camera_in.model_dump())
    db.add(db_camera)
    db.commit()
    db.refresh(db_camera)
    return db_camera

@router.put("/{camera_id}", response_model=CameraResponse)
def update_camera(
    camera_id: int,
    camera_in: CameraUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(verify_admin)
):
    camera = db.query(Camera).filter(Camera.id == camera_id).first()
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    update_data = camera_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(camera, field, value)
        
    db.commit()
    db.refresh(camera)
    return camera

@router.delete("/{camera_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_camera(
    camera_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(verify_admin)
):
    camera = db.query(Camera).filter(Camera.id == camera_id).first()
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    db.delete(camera)
    db.commit()
    return None
