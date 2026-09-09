from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: dict

class AdminProfile(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    is_superadmin: bool
    created_at: datetime

    class Config:
        from_attributes = True
