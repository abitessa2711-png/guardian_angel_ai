import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import engine, Base
from .config import settings
from .routers import auth, cameras, alerts, dashboard, analytics, users
from .websocket import manager
from .ai_engine import surveillance_simulation_loop

# Initialize DB tables automatically
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("[Server Startup] Initializing Guardian Angel AI...")
    simulation_task = asyncio.create_task(surveillance_simulation_loop())
    yield
    # Shutdown logic
    print("[Server Shutdown] Cleaning up resources...")
    simulation_task.cancel()
    try:
        await simulation_task
    except asyncio.CancelledError:
        pass

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Tamil Nadu Police CCTV safety alert system powered by Explainable AI.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to control room domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(cameras.router)
app.include_router(alerts.router)  # includes /alerts and /incidents
app.include_router(dashboard.router)
app.include_router(analytics.router)
app.include_router(users.router)

@app.get("/")
def read_root():
    return {
        "status": "Online",
        "system": settings.PROJECT_NAME,
        "region": "Tamil Nadu Control Room"
    }

@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # We keep the connection alive by waiting for any incoming ping/message
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"[WebSocket] Exception on socket: {e}")
        manager.disconnect(websocket)
