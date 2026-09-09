import uuid
import time
import logging
import traceback
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings
from app.database import init_db, SessionLocal
from app.utils.seeder import seed_database
from app.services.log_service import record_system_log

# Import Routers
from app.routers.auth import router as auth_router
from app.routers.cars import router as cars_router
from app.routers.bookings import router as bookings_router
from app.routers.contact import router as contact_router
from app.routers.admin_bookings import router as admin_bookings_router
from app.routers.admin_cars import router as admin_cars_router
from app.routers.admin_drivers import router as admin_drivers_router
from app.routers.admin_logs import router as admin_logs_router
from app.routers.admin_stats import router as admin_stats_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("taxigo_app")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database & Seed
    logger.info("Initializing database tables and initial seed data...")
    init_db()
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown
    logger.info("Shutting down TaxiGo application...")

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Commercial Taxi Booking API with Dynamic Fares, Distance Routing, and Error Logging",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Correlation-ID"]
)

# Correlation ID and Request Timing Middleware
@app.middleware("http")
async def correlation_and_timing_middleware(request: Request, call_next):
    correlation_id = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
    request.state.correlation_id = correlation_id
    
    start_time = time.time()
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Correlation-ID"] = correlation_id
        response.headers["X-Process-Time"] = f"{process_time:.4f}s"
        return response
    except Exception as exc:
        # Centralized catch for unexpected unhandled errors
        process_time = time.time() - start_time
        logger.error(f"Unhandled Exception in request {request.url.path}: {exc}\n{traceback.format_exc()}")
        
        # Log to system_logs database safely
        record_system_log(
            severity="CRITICAL",
            module="backend_api",
            endpoint=str(request.url.path),
            http_method=request.method,
            http_status=500,
            error_message=str(exc),
            correlation_id=correlation_id,
            stack_trace=traceback.format_exc(),
            client_ip=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )
        
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "detail": "An unexpected server error occurred. Please quote your correlation ID to support.",
                "correlation_id": correlation_id,
                "error_code": "INTERNAL_SERVER_ERROR"
            },
            headers={"X-Correlation-ID": correlation_id}
        )

# Exception Handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    correlation_id = getattr(request.state, "correlation_id", str(uuid.uuid4()))
    
    # Log 4xx warnings and 5xx errors
    severity = "ERROR" if exc.status_code >= 500 else ("WARNING" if exc.status_code in [401, 403, 404] else "INFO")
    
    if exc.status_code >= 400:
        record_system_log(
            severity=severity,
            module="http_router",
            endpoint=str(request.url.path),
            http_method=request.method,
            http_status=exc.status_code,
            error_message=str(exc.detail),
            correlation_id=correlation_id,
            client_ip=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "status_code": exc.status_code,
            "correlation_id": correlation_id
        },
        headers={"X-Correlation-ID": correlation_id}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    correlation_id = getattr(request.state, "correlation_id", str(uuid.uuid4()))
    error_details = str(exc.errors())
    
    record_system_log(
        severity="WARNING",
        module="validation",
        endpoint=str(request.url.path),
        http_method=request.method,
        http_status=422,
        error_message=f"Validation failed: {error_details[:500]}",
        correlation_id=correlation_id,
        client_ip=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent")
    )
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": exc.errors(),
            "status_code": 422,
            "correlation_id": correlation_id,
            "message": "Input validation error"
        },
        headers={"X-Correlation-ID": correlation_id}
    )

# Include API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(cars_router, prefix=settings.API_V1_STR)
app.include_router(bookings_router, prefix=settings.API_V1_STR)
app.include_router(contact_router, prefix=settings.API_V1_STR)
app.include_router(admin_bookings_router, prefix=settings.API_V1_STR)
app.include_router(admin_cars_router, prefix=settings.API_V1_STR)
app.include_router(admin_drivers_router, prefix=settings.API_V1_STR)
app.include_router(admin_logs_router, prefix=settings.API_V1_STR)
app.include_router(admin_stats_router, prefix=settings.API_V1_STR)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "contact_phone": settings.PRIMARY_CONTACT_PHONE,
        "timestamp": time.time()
    }
