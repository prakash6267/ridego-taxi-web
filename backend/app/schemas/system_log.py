from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ClientErrorLogCreate(BaseModel):
    module: str = "frontend"
    endpoint: Optional[str] = None
    error_message: str
    stack_trace: Optional[str] = None
    user_agent: Optional[str] = None

class SystemLogResolve(BaseModel):
    is_resolved: bool = True
    admin_notes: Optional[str] = None

class SystemLogResponse(BaseModel):
    id: int
    correlation_id: Optional[str]
    timestamp: datetime
    severity: str
    module: str
    endpoint: Optional[str]
    http_method: Optional[str]
    http_status: Optional[int]
    error_message: str
    stack_trace: Optional[str]
    client_ip: Optional[str]
    user_agent: Optional[str]
    is_resolved: bool
    admin_notes: Optional[str]
    resolved_at: Optional[datetime]
    resolved_by: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class SystemLogStats(BaseModel):
    total_logs: int
    unresolved_errors: int
    critical_errors: int
    warning_count: int
