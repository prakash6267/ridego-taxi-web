from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class BookingPayment(Base):
    __tablename__ = "booking_payments"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), unique=True, nullable=False)
    payment_method = Column(String(50), default="UPI/QR") # UPI/QR, Cash, Card
    transaction_id = Column(String(100), nullable=True) # e.g. DUMMY-UPI-987654321
    amount = Column(Float, nullable=False)
    payment_status = Column(String(50), default="Paid") # Pending, Paid, Failed, Refunded
    payment_date = Column(DateTime, default=datetime.utcnow)

    booking = relationship("Booking", back_populates="payment")
