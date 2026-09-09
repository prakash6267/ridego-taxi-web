from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.database import get_db
from app.models.booking import Booking
from app.models.car import Car
from app.models.driver import Driver
from app.models.contact import ContactMessage
from app.models.system_log import SystemLog
from app.models.setting import Setting
from app.models.admin import Admin
from app.schemas.setting import DashboardStats, SettingResponse, SettingUpdate
from app.schemas.contact import ContactResponse
from app.utils.dependencies import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin Dashboard & Settings"])

@router.get("/dashboard-stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    total_b = db.query(Booking).count()
    pending_b = db.query(Booking).filter(Booking.status == "Pending").count()
    confirmed_b = db.query(Booking).filter(Booking.status == "Confirmed").count()
    completed_b = db.query(Booking).filter(Booking.status == "Completed").count()
    cancelled_b = db.query(Booking).filter(Booking.status == "Cancelled").count()

    total_revenue = db.query(func.sum(Booking.total_fare)).filter(Booking.status.in_(["Confirmed", "Completed"])).scalar() or 0.0
    active_cars = db.query(Car).filter(Car.is_active == True).count()
    avail_drivers = db.query(Driver).filter(Driver.is_active == True, Driver.status == "Available").count()
    unresolved_errors = db.query(SystemLog).filter(SystemLog.is_resolved == False).count()
    unread_messages = db.query(ContactMessage).filter(ContactMessage.is_read == False).count()

    return {
        "total_bookings": total_b,
        "pending_bookings": pending_b,
        "confirmed_bookings": confirmed_b,
        "completed_bookings": completed_b,
        "cancelled_bookings": cancelled_b,
        "total_revenue": round(float(total_revenue), 2),
        "active_cars_count": active_cars,
        "available_drivers_count": avail_drivers,
        "unresolved_errors_count": unresolved_errors,
        "unread_messages_count": unread_messages
    }

@router.get("/settings", response_model=List[SettingResponse])
def get_settings(db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    return db.query(Setting).all()

@router.put("/settings/{key}", response_model=SettingResponse)
def update_setting(key: str, payload: SettingUpdate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    setting = db.query(Setting).filter(Setting.key == key).first()
    if not setting:
        setting = Setting(key=key, value=payload.value, description=payload.description)
        db.add(setting)
    else:
        setting.value = payload.value
        if payload.description:
            setting.description = payload.description
            
    db.commit()
    db.refresh(setting)
    return setting

@router.get("/messages", response_model=List[ContactResponse])
def get_contact_messages(db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()

@router.put("/messages/{msg_id}/read")
def mark_message_as_read(msg_id: int, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    msg = db.query(ContactMessage).filter(ContactMessage.id == msg_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_read = not msg.is_read
    db.commit()
    return {"id": msg.id, "is_read": msg.is_read}
