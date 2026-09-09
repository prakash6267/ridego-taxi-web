from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.admin import Admin
from app.utils.security import decode_access_token

security_bearer = HTTPBearer(auto_error=False)

def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security_bearer),
    db: Session = Depends(get_db)
) -> Admin:
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    admin_id = payload.get("sub")
    try:
        admin_id_int = int(admin_id)
        admin = db.query(Admin).filter(Admin.id == admin_id_int).first()
    except (ValueError, TypeError):
        admin = db.query(Admin).filter(Admin.username == admin_id).first()
        
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin account not found or deactivated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return admin
