from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.models.system_log import SystemLog
from app.models.admin import Admin
from app.schemas.system_log import (
    SystemLogResponse, SystemLogResolve, SystemLogStats, ClientErrorLogCreate
)
from app.utils.dependencies import get_current_admin
from app.services.log_service import record_system_log

router = APIRouter(prefix="/admin/system-logs", tags=["Admin System Logs"])

@router.get("", response_model=List[SystemLogResponse])
def get_system_logs(
    severity: Optional[str] = None,
    module: Optional[str] = None,
    is_resolved: Optional[bool] = None,
    search: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    query = db.query(SystemLog)
    
    if severity and severity != "ALL":
        query = query.filter(SystemLog.severity == severity.upper())
        
    if module and module != "ALL":
        query = query.filter(SystemLog.module == module.lower())
        
    if is_resolved is not None:
        query = query.filter(SystemLog.is_resolved == is_resolved)
        
    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            (SystemLog.error_message.ilike(search_term)) |
            (SystemLog.endpoint.ilike(search_term)) |
            (SystemLog.correlation_id.ilike(search_term))
        )
        
    return query.order_by(SystemLog.timestamp.desc()).offset(offset).limit(limit).all()

@router.get("/stats", response_model=SystemLogStats)
def get_log_stats(db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    total = db.query(SystemLog).count()
    unresolved = db.query(SystemLog).filter(SystemLog.is_resolved == False).count()
    critical = db.query(SystemLog).filter(SystemLog.severity == "CRITICAL").count()
    warnings = db.query(SystemLog).filter(SystemLog.severity == "WARNING").count()

    return {
        "total_logs": total,
        "unresolved_errors": unresolved,
        "critical_errors": critical,
        "warning_count": warnings
    }

@router.put("/{log_id}/resolve", response_model=SystemLogResponse)
def resolve_system_log(
    log_id: int,
    payload: SystemLogResolve,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    log_entry = db.query(SystemLog).filter(SystemLog.id == log_id).first()
    if not log_entry:
        raise HTTPException(status_code=404, detail="Log entry not found")

    log_entry.is_resolved = payload.is_resolved
    log_entry.admin_notes = payload.admin_notes
    if payload.is_resolved:
        log_entry.resolved_at = datetime.utcnow()
        log_entry.resolved_by = admin.username
    else:
        log_entry.resolved_at = None
        log_entry.resolved_by = None

    db.commit()
    db.refresh(log_entry)
    return log_entry

@router.delete("/archive")
def archive_resolved_logs(db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    """Clear/Archive all resolved system logs."""
    deleted_count = db.query(SystemLog).filter(SystemLog.is_resolved == True).delete()
    db.commit()
    return {"success": True, "message": f"Archived {deleted_count} resolved logs."}

@router.post("/client-error")
def capture_client_error(payload: ClientErrorLogCreate, request: Request, db: Session = Depends(get_db)):
    """Frontend captures uncaught errors and posts here for unified logging."""
    record_system_log(
        severity="ERROR",
        module=payload.module or "frontend",
        error_message=payload.error_message,
        endpoint=payload.endpoint,
        stack_trace=payload.stack_trace,
        client_ip=request.client.host if request.client else None,
        user_agent=payload.user_agent or request.headers.get("user-agent"),
        db=db
    )
    return {"status": "logged"}
