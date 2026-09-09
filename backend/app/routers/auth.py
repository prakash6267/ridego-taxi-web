from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.admin import Admin
from app.schemas.auth import LoginRequest, TokenResponse, AdminProfile
from app.utils.security import verify_password, create_access_token
from app.utils.dependencies import get_current_admin

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(
        (Admin.username == payload.username) | (Admin.email == payload.username)
    ).first()
    
    if not admin or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password"
        )
    
    access_token = create_access_token(subject=admin.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "admin": {
            "id": admin.id,
            "username": admin.username,
            "email": admin.email,
            "full_name": admin.full_name,
            "is_superadmin": admin.is_superadmin
        }
    }

@router.get("/me", response_model=AdminProfile)
def get_me(current_admin: Admin = Depends(get_current_admin)):
    return current_admin
