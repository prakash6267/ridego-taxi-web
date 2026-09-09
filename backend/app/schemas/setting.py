from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class SettingBase(BaseModel):
    key: str
    value: str
    description: Optional[str] = None

class SettingUpdate(BaseModel):
    value: str
    description: Optional[str] = None

class SettingResponse(SettingBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_bookings: int
    pending_bookings: int
    confirmed_bookings: int
    completed_bookings: int
    cancelled_bookings: int
    total_revenue: float
    active_cars_count: int
    available_drivers_count: int
    unresolved_errors_count: int
    unread_messages_count: int
