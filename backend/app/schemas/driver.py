from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DriverBase(BaseModel):
    name: str
    phone: str
    license_number: Optional[str] = None
    vehicle_model: Optional[str] = None
    rating: float = 4.9
    status: str = "Available"
    is_active: bool = True

class DriverCreate(DriverBase):
    pass

class DriverUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    license_number: Optional[str] = None
    vehicle_model: Optional[str] = None
    rating: Optional[float] = None
    status: Optional[str] = None
    is_active: Optional[bool] = None

class DriverResponse(DriverBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
