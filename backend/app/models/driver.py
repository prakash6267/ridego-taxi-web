from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    license_number = Column(String(100), nullable=True)
    vehicle_model = Column(String(100), nullable=True)
    rating = Column(Float, default=4.9)
    status = Column(String(50), default="Available") # Available, On Trip, Off Duty
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    bookings = relationship("Booking", back_populates="driver")
