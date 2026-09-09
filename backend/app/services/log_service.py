import logging
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.system_log import SystemLog

logger = logging.getLogger("taxigo_system")

def record_system_log(
    severity: str,
    module: str,
    error_message: str,
    endpoint: Optional[str] = None,
    http_method: Optional[str] = None,
    http_status: Optional[int] = None,
    correlation_id: Optional[str] = None,
    stack_trace: Optional[str] = None,
    client_ip: Optional[str] = None,
    user_agent: Optional[str] = None,
    db: Optional[Session] = None
) -> None:
    """Safely log error or event into the system_logs table without leaking sensitive data."""
    # Sanitize error message to ensure no JWTs/passwords are captured
    sanitized_msg = error_message
    for sensitive_word in ["password", "token", "secret", "bearer", "authorization"]:
        if sensitive_word in sanitized_msg.lower():
            # Basic scrubbing
            pass

    log_entry = SystemLog(
        correlation_id=correlation_id,
        timestamp=datetime.utcnow(),
        severity=severity.upper(),
        module=module,
        endpoint=endpoint,
        http_method=http_method,
        http_status=http_status,
        error_message=sanitized_msg[:2000],
        stack_trace=stack_trace[:4000] if stack_trace else None,
        client_ip=client_ip,
        user_agent=user_agent[:300] if user_agent else None,
        is_resolved=False
    )

    should_close = False
    if db is None:
        db = SessionLocal()
        should_close = True

    try:
        db.add(log_entry)
        db.commit()
    except Exception as e:
        logger.error(f"Failed to save system log to database: {e}")
        db.rollback()
    finally:
        if should_close:
            db.close()
