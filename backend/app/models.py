from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="SECURITY_OFFICER")  # ADMIN, SECURITY_OFFICER
    is_active = Column(Boolean, default=True)

    # Relationships
    escalated_incidents = relationship("Incident", back_populates="escalator")

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    location = Column(String(255), nullable=False)
    rtsp_url = Column(String(255), nullable=False)
    status = Column(String(50), default="Active")  # Active, Offline
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    # Relationships
    alerts = relationship("Alert", back_populates="camera", cascade="all, delete-orphan")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(Integer, ForeignKey("cameras.id", ondelete="CASCADE"), nullable=False)
    risk_score = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    status = Column(String(50), default="New")  # New, Resolved, Escalated
    
    # Explainable AI metrics
    following_score = Column(Integer, default=0)
    proximity_score = Column(Integer, default=0)
    aggression_score = Column(Integer, default=0)
    explanation = Column(Text, nullable=True)
    explanation_ta = Column(Text, nullable=True)
    evidence_clip_url = Column(String(255), nullable=True)

    # Relationships
    camera = relationship("Camera", back_populates="alerts")
    incidents = relationship("Incident", back_populates="alert", cascade="all, delete-orphan")

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(Integer, ForeignKey("alerts.id", ondelete="CASCADE"), nullable=False)
    escalated_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    escalation_timestamp = Column(DateTime, default=datetime.utcnow)
    resolution_timestamp = Column(DateTime, nullable=True)
    resolution_notes = Column(Text, nullable=True)
    status = Column(String(50), default="Escalated")  # Escalated, Dispatched, Resolved

    # Relationships
    alert = relationship("Alert", back_populates="incidents")
    escalator = relationship("User", back_populates="escalated_incidents")

class AnalyticsLog(Base):
    __tablename__ = "analytics_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    location = Column(String(255), nullable=False)
    avg_risk_score = Column(Float, nullable=False)
    alert_count = Column(Integer, default=0)
