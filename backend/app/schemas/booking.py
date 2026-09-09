from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.schemas.car import CarResponse
from app.schemas.driver import DriverResponse

class PaymentCreate(BaseModel):
    payment_method: str = "UPI/QR"
    transaction_id: Optional[str] = "DUMMY-TXN-123456"
    payment_status: str = "Paid"

class BookingCreateRequest(BaseModel):
    passenger_name: str
    passenger_phone: str
    passenger_email: Optional[str] = None
    
    pickup_address: str
    pickup_lat: Optional[float] = None
    pickup_lng: Optional[float] = None
    
    drop_address: str
    drop_lat: Optional[float] = None
    drop_lng: Optional[float] = None
    
    ride_date: str
    ride_time: str
    
    car_id: int
    notes: Optional[str] = None
    
    payment: Optional[PaymentCreate] = None

class PaymentResponse(BaseModel):
    id: int
    payment_method: str
    transaction_id: Optional[str]
    amount: float
    payment_status: str
    payment_date: datetime

    class Config:
        from_attributes = True

class BookingResponse(BaseModel):
    id: int
    booking_code: str
    passenger_name: str
    passenger_phone: str
    passenger_email: Optional[str]
    pickup_address: str
    pickup_lat: Optional[float]
    pickup_lng: Optional[float]
    drop_address: str
    drop_lat: Optional[float]
    drop_lng: Optional[float]
    ride_date: str
    ride_time: str
    car_id: int
    driver_id: Optional[int]
    distance_km: float
    duration_mins: Optional[float]
    base_fare: float
    per_km_rate: float
    total_fare: float
    status: str
    notes: Optional[str]
    created_at: datetime
    
    car: Optional[CarResponse] = None
    driver: Optional[DriverResponse] = None
    payment: Optional[PaymentResponse] = None

    class Config:
        from_attributes = True

class AssignDriverRequest(BaseModel):
    driver_id: int

class UpdateBookingStatusRequest(BaseModel):
    status: str # Pending, Confirmed, Completed, Cancelled
