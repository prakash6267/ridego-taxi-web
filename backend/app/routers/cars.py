from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.car import Car
from app.schemas.car import CarResponse
from app.services.routing_service import routing_service

router = APIRouter(tags=["Public Cars & Geocoding"])

@router.get("/cars", response_model=List[CarResponse])
def get_public_cars(db: Session = Depends(get_db)):
    """Retrieve all active cars and their real-time rate configurations."""
    return db.query(Car).filter(Car.is_active == True).order_by(Car.sort_order.asc(), Car.per_km_rate.asc()).all()

@router.get("/cars/{car_id}", response_model=CarResponse)
def get_car_by_id(car_id: int, db: Session = Depends(get_db)):
    car = db.query(Car).filter(Car.id == car_id, Car.is_active == True).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found or inactive")
    return car

@router.get("/locations/search")
async def search_locations(q: str = Query(..., min_length=2, description="Search term for city, landmark, street")):
    """Location search / autocomplete using Nominatim."""
    results = await routing_service.search_locations(q)
    return results
