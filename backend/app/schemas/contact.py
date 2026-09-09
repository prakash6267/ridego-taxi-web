from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ContactCreateRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str

class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    subject: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
