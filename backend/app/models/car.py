from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False) # e.g. "Sedan Prime", "Innova Crysta"
    model = Column(String(100), nullable=False) # e.g. "Toyota Innova", "Maruti Dzire"
    car_number = Column(String(50), nullable=True)
    car_type = Column(String(50), default="Sedan") # Sedan, SUV, Ertiga, Innova, Luxury
    seats = Column(Integer, default=4)
    has_ac = Column(Boolean, default=True)
    image_url = Column(String(500), nullable=True)
    
    # Fare Structure
    base_fare = Column(Float, nullable=False, default=50.0) # Base starting fare in INR
    per_km_rate = Column(Float, nullable=False, default=12.0) # Per KM rate in INR
    minimum_fare = Column(Float, nullable=False, default=150.0) # Minimum trip fare
    
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    bookings = relationship("Booking", back_populates="car")
