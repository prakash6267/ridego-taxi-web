from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.driver import Driver
from app.models.admin import Admin
from app.schemas.driver import DriverCreate, DriverUpdate, DriverResponse
from app.utils.dependencies import get_current_admin

router = APIRouter(prefix="/admin/drivers", tags=["Admin Drivers"])

@router.get("", response_model=List[DriverResponse])
def get_all_drivers_admin(db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    return db.query(Driver).order_by(Driver.id.desc()).all()

@router.post("", response_model=DriverResponse, status_code=status.HTTP_201_CREATED)
def create_driver(payload: DriverCreate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    driver = Driver(**payload.dict())
    db.add(driver)
    db.commit()
    db.refresh(driver)
    return driver

@router.put("/{driver_id}", response_model=DriverResponse)
def update_driver(
    driver_id: int, 
    payload: DriverUpdate, 
    db: Session = Depends(get_db), 
    admin: Admin = Depends(get_current_admin)
):
    driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    update_data = payload.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(driver, field, val)

    db.commit()
    db.refresh(driver)
    return driver

@router.delete("/{driver_id}")
def delete_driver(driver_id: int, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    db.delete(driver)
    db.commit()
    return {"success": True, "message": "Driver removed successfully"}
