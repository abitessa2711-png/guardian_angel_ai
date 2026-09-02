import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Guardian Angel AI - Police Surveillance Control Room"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./guardian_angel.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "tn-police-surveillance-secret-key-guardian-angel-ai-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 hour shift
    AI_SIMULATION_INTERVAL_SECS: int = 7  # interval to simulate CCTV movement risk alerts

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
