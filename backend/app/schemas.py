from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str
    email: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# --- User Schemas ---
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "SECURITY_OFFICER"
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# --- Camera Schemas ---
class CameraBase(BaseModel):
    name: str
    location: str
    rtsp_url: str
    status: str = "Active"
    latitude: float
    longitude: float

class CameraCreate(CameraBase):
    pass

class CameraUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    rtsp_url: Optional[str] = None
    status: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class CameraResponse(CameraBase):
    id: int

    class Config:
        from_attributes = True

# --- Alert Schemas ---
class AlertBase(BaseModel):
    camera_id: int
    risk_score: int
    status: str = "New"
    following_score: int = 0
    proximity_score: int = 0
    aggression_score: int = 0
    explanation: Optional[str] = None
    explanation_ta: Optional[str] = None
    evidence_clip_url: Optional[str] = None

class AlertResponse(AlertBase):
    id: int
    timestamp: datetime
    camera_name: Optional[str] = None
    camera_location: Optional[str] = None

    class Config:
        from_attributes = True

class AlertUpdate(BaseModel):
    status: str
    
# --- Incident Schemas ---
class IncidentBase(BaseModel):
    alert_id: int
    status: str = "Escalated"
    resolution_notes: Optional[str] = None

class IncidentCreate(IncidentBase):
    pass

class IncidentResponse(IncidentBase):
    id: int
    escalated_by: int
    escalation_timestamp: datetime
    resolution_timestamp: Optional[datetime] = None
    camera_name: Optional[str] = None
    camera_location: Optional[str] = None
    risk_score: Optional[int] = None
    explanation: Optional[str] = None
    explanation_ta: Optional[str] = None

    class Config:
        from_attributes = True

class IncidentResolve(BaseModel):
    resolution_notes: str

# --- Dashboard Stats & Analytics ---
class StatsResponse(BaseModel):
    total_cameras: int
    active_cameras: int
    today_alerts: int
    high_risk_incidents: int
    resolved_cases: int

class AnalyticsLogResponse(BaseModel):
    id: int
    timestamp: datetime
    location: str
    avg_risk_score: float
    alert_count: int

    class Config:
        from_attributes = True
