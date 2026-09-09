from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CarBase(BaseModel):
    name: str
    model: str
    car_number: Optional[str] = None
    car_type: str = "Sedan"
    seats: int = 4
    has_ac: bool = True
    image_url: Optional[str] = None
    base_fare: float = 50.0
    per_km_rate: float = 12.0
    minimum_fare: float = 150.0
    is_active: bool = True
    sort_order: int = 0

class CarCreate(CarBase):
    pass

class CarUpdate(BaseModel):
    name: Optional[str] = None
    model: Optional[str] = None
    car_number: Optional[str] = None
    car_type: Optional[str] = None
    seats: Optional[int] = None
    has_ac: Optional[bool] = None
    image_url: Optional[str] = None
    base_fare: Optional[float] = None
    per_km_rate: Optional[float] = None
    minimum_fare: Optional[float] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None

class CarResponse(CarBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class FareCalculationRequest(BaseModel):
    pickup_lat: float
    pickup_lng: float
    drop_lat: float
    drop_lng: float
    pickup_address: Optional[str] = None
    drop_address: Optional[str] = None
    car_id: Optional[int] = None

class CarFareEstimate(BaseModel):
    car_id: int
    name: str
    model: str
    car_type: str
    seats: int
    has_ac: bool
    image_url: Optional[str] = None
    base_fare: float
    per_km_rate: float
    minimum_fare: float
    distance_km: float
    duration_mins: float
    estimated_fare: float

class FareCalculationResponse(BaseModel):
    pickup_address: Optional[str]
    drop_address: Optional[str]
    distance_km: float
    duration_mins: float
    estimates: list[CarFareEstimate]
