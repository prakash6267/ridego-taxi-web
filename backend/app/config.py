import os
import json
from pydantic_settings import BaseSettings
from typing import Optional, Union, List
from pydantic import field_validator

class Settings(BaseSettings):
    APP_NAME: str = "TaxiGo Commercial API"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    API_V1_STR: str = "/api"
    
    # Security & Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-taxigo-jwt-key-2026-secure-token-998811")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Primary Business Info
    PRIMARY_CONTACT_PHONE: str = "6267228958"
    PRIMARY_CONTACT_EMAIL: str = "contact@taxigo.com"
    DEFAULT_UPI_ID: str = "6267228958@upi"
    
    # Database Settings
    MYSQL_USER: str = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT: str = os.getenv("MYSQL_PORT", "3306")
    MYSQL_DB: str = os.getenv("MYSQL_DB", "taxigo_db")
    
    # Database URL: Supports MySQL via mysql+pymysql, defaults to SQLite for immediate execution
    DATABASE_URL: Optional[str] = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./taxi_booking.db"
    )
    
    # Map & Routing Service URLs
    NOMINATIM_BASE_URL: str = "https://nominatim.openstreetmap.org"
    OSRM_BASE_URL: str = "https://router.project-osrm.org"
    
    # CORS - can be a list or a comma-separated string or '*'
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            v_stripped = v.strip()
            # If it's a JSON array string like '["*"]'
            if v_stripped.startswith("[") and v_stripped.endswith("]"):
                try:
                    return json.loads(v_stripped)
                except Exception:
                    pass
            # If it's a comma-separated string or single string like '*'
            return [i.strip() for i in v_stripped.split(",") if i.strip()]
        elif isinstance(v, (list, tuple)):
            return list(v)
        return ["*"]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
