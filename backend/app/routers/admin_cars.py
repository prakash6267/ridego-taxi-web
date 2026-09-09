from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.car import Car
from app.models.admin import Admin
from app.schemas.car import CarCreate, CarUpdate, CarResponse
from app.utils.dependencies import get_current_admin

router = APIRouter(prefix="/admin/cars", tags=["Admin Cars"])

@router.get("", response_model=List[CarResponse])
def get_all_cars_admin(db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    return db.query(Car).order_by(Car.sort_order.asc(), Car.id.asc()).all()

@router.post("", response_model=CarResponse, status_code=status.HTTP_201_CREATED)
def create_car(payload: CarCreate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    car = Car(**payload.dict())
    db.add(car)
    db.commit()
    db.refresh(car)
    return car

@router.put("/{car_id}", response_model=CarResponse)
def update_car(
    car_id: int, 
    payload: CarUpdate, 
    db: Session = Depends(get_db), 
    admin: Admin = Depends(get_current_admin)
):
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")

    update_data = payload.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(car, field, val)

    db.commit()
    db.refresh(car)
    return car

@router.delete("/{car_id}")
def delete_car(car_id: int, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")

    db.delete(car)
    db.commit()
    return {"success": True, "message": "Car removed successfully"}
