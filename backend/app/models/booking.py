from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    booking_code = Column(String(50), unique=True, index=True, nullable=False) # e.g. RG20260909125
    
    # Passenger Details
    passenger_name = Column(String(150), nullable=False)
    passenger_phone = Column(String(20), nullable=False)
    passenger_email = Column(String(255), nullable=True)
    
    # Trip Details
    pickup_address = Column(String(500), nullable=False)
    pickup_lat = Column(Float, nullable=True)
    pickup_lng = Column(Float, nullable=True)
    
    drop_address = Column(String(500), nullable=False)
    drop_lat = Column(Float, nullable=True)
    drop_lng = Column(Float, nullable=True)
    
    ride_date = Column(String(50), nullable=False) # YYYY-MM-DD
    ride_time = Column(String(50), nullable=False) # HH:MM
    
    # Selected Car & Driver
    car_id = Column(Integer, ForeignKey("cars.id"), nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=True)
    
    # Distance and Fare Snapshot (Calculated securely on backend)
    distance_km = Column(Float, nullable=False, default=0.0)
    duration_mins = Column(Float, nullable=True, default=0.0)
    base_fare = Column(Float, nullable=False)
    per_km_rate = Column(Float, nullable=False)
    total_fare = Column(Float, nullable=False)
    
    # Status
    status = Column(String(50), default="Pending") # Pending, Confirmed, Completed, Cancelled
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    car = relationship("Car", back_populates="bookings")
    driver = relationship("Driver", back_populates="bookings")
    payment = relationship("BookingPayment", back_populates="booking", uselist=False)
