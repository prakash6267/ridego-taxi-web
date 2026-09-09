from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from app.database import Base

class SystemLog(Base):
    __tablename__ = "system_logs"

    id = Column(Integer, primary_key=True, index=True)
    correlation_id = Column(String(64), index=True, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    severity = Column(String(20), default="ERROR", index=True) # INFO, WARNING, ERROR, CRITICAL
    module = Column(String(100), default="general", index=True) # auth, booking, routing, car, driver, client, general
    endpoint = Column(String(255), nullable=True)
    http_method = Column(String(10), nullable=True)
    http_status = Column(Integer, nullable=True)
    error_message = Column(Text, nullable=False)
    stack_trace = Column(Text, nullable=True)
    client_ip = Column(String(50), nullable=True)
    user_agent = Column(String(300), nullable=True)
    
    # Resolution Tracking
    is_resolved = Column(Boolean, default=False, index=True)
    admin_notes = Column(Text, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    resolved_by = Column(String(100), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
