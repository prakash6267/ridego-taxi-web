from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.booking import Booking
from app.models.driver import Driver
from app.models.admin import Admin
from app.schemas.booking import BookingResponse, AssignDriverRequest, UpdateBookingStatusRequest
from app.utils.dependencies import get_current_admin

router = APIRouter(prefix="/admin/bookings", tags=["Admin Bookings"])

@router.get("", response_model=List[BookingResponse])
def get_all_bookings(
    status: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    query = db.query(Booking)
    if status and status != "All":
        query = query.filter(Booking.status == status)
    
    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            (Booking.booking_code.ilike(search_fmt)) |
            (Booking.passenger_name.ilike(search_fmt)) |
            (Booking.passenger_phone.ilike(search_fmt)) |
            (Booking.pickup_address.ilike(search_fmt)) |
            (Booking.drop_address.ilike(search_fmt))
        )

    return query.order_by(Booking.created_at.desc()).offset(offset).limit(limit).all()

@router.put("/{booking_id}/status", response_model=BookingResponse)
def update_booking_status(
    booking_id: int,
    payload: UpdateBookingStatusRequest,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.status = payload.status
    db.commit()
    db.refresh(booking)
    return booking

@router.put("/{booking_id}/assign-driver", response_model=BookingResponse)
def assign_driver_to_booking(
    booking_id: int,
    payload: AssignDriverRequest,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    driver = db.query(Driver).filter(Driver.id == payload.driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    booking.driver_id = driver.id
    booking.status = "Confirmed"
    db.commit()
    db.refresh(booking)
    return booking

@router.delete("/{booking_id}")
def delete_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # If associated payment exists, remove it
    if booking.payment:
        db.delete(booking.payment)
    db.delete(booking)
    db.commit()
    return {"success": True, "message": "Booking deleted successfully"}
