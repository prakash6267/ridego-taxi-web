from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.contact import ContactMessage
from app.schemas.contact import ContactCreateRequest, ContactResponse

router = APIRouter(prefix="/contact", tags=["Contact"])

@router.post("", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def submit_contact_message(payload: ContactCreateRequest, db: Session = Depends(get_db)):
    msg = ContactMessage(
        name=payload.name.strip(),
        email=payload.email.strip(),
        phone=payload.phone.strip() if payload.phone else None,
        subject=payload.subject.strip(),
        message=payload.message.strip(),
        is_read=False
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
