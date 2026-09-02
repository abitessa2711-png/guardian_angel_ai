# 🛡️ Guardian Angel AI — Smart CCTV Women Safety Surveillance System

**AI-powered real-time women safety monitoring system using Deep Learning and Computer Vision to detect suspicious activities and anomalies from CCTV footage.**

---

## 🌟 Key Features

- 📹 **16-Camera Live Matrix Wall**: Police command center style multi-feed surveillance wall covering city bus stands, railway junctions, temple roads, dark subways, and highways.
- 🤖 **Deep Learning & Computer Vision**:
  - Spatial-temporal proximity tracking (stalking / suspect trailing detection).
  - Multi-person pose estimation and struggle/fight recognition.
  - Acoustic spike / scream decibel sensor simulation.
  - Isolated pedestrian vulnerability detection.
- 🚨 **Proactive Emergency Dispatcher**: Automated alert generation, SOS escalation to nearest patrol units, and real-time audio-visual sirens.
- 🌐 **Bilingual Interface**: Full real-time English and Tamil (தமிழ்) toggle for commands, telemetry, and threat feeds.
- 🎯 **Area Focus Analyzer**: Deep-dive single-camera monitoring with granular AI object detections (Face ID, Weapon, Fire, Abandoned Baggage).
- 📊 **Analytics & Heatmaps**: Incident hotspot visualization and risk level density charts.

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS with Surveillance HUD Theme
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Framework**: FastAPI (Python)
- **ASGI Server**: Uvicorn
- **Database**: SQLite (SQLAlchemy ORM)
- **Real-time Streaming**: WebSockets for instant alert broadcasting

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python seed.py              # Seeds database with admin credentials & camera nodes
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

---

## 🔐 Default Login Credentials
- **Email**: `admin@trichypolice.gov.in`
- **Password**: `Admin@123`

---

## 📜 License
MIT License
