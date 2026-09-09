from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.car import Car
from app.models.driver import Driver
from app.models.booking import Booking
from app.models.payment import BookingPayment
from app.schemas.car import FareCalculationRequest, FareCalculationResponse
from app.schemas.booking import BookingCreateRequest, BookingResponse
from app.services.fare_service import fare_service
from app.services.routing_service import routing_service

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("/calculate-fare", response_model=FareCalculationResponse)
async def calculate_fare(req: FareCalculationRequest, db: Session = Depends(get_db)):
    """Calculate distance via OSRM and dynamic fare estimates across fleet."""
    if not req.pickup_lat or not req.pickup_lng or not req.drop_lat or not req.drop_lng:
        raise HTTPException(status_code=400, detail="Pickup and drop coordinates are required")
    
    result = await fare_service.get_estimates_for_route(
        db=db,
        pickup_lat=req.pickup_lat,
        pickup_lng=req.pickup_lng,
        drop_lat=req.drop_lat,
        drop_lng=req.drop_lng,
        specific_car_id=req.car_id
    )

    return {
        "pickup_address": req.pickup_address,
        "drop_address": req.drop_address,
        "distance_km": result["distance_km"],
        "duration_mins": result["duration_mins"],
        "estimates": result["estimates"]
    }

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(payload: BookingCreateRequest, db: Session = Depends(get_db)):
    """
    Create a new taxi booking.
    CRITICAL SECURITY RULE: The backend independently recalculates distance and total fare
    using the active database rate for the chosen car. Frontend fare is never blindly trusted.
    """
    car = db.query(Car).filter(Car.id == payload.car_id, Car.is_active == True).first()
    if not car:
        raise HTTPException(status_code=404, detail="Selected car is not available or inactive")

    # Recalculate distance and duration
    if payload.pickup_lat and payload.pickup_lng and payload.drop_lat and payload.drop_lng:
        route_info = await routing_service.get_route_distance(
            payload.pickup_lat, payload.pickup_lng, payload.drop_lat, payload.drop_lng
        )
        distance_km = route_info["distance_km"]
        duration_mins = route_info["duration_mins"]
    else:
        # Fallback minimal distance if coords were omitted
        distance_km = 10.0
        duration_mins = 25.0

    # Backend enforces fare formula: Total = Base + (Distance x Per KM Rate), subject to Minimum Fare
    calculated_fare = fare_service.calculate_car_fare(
        base_fare=car.base_fare,
        per_km_rate=car.per_km_rate,
        minimum_fare=car.minimum_fare,
        distance_km=distance_km
    )

    booking_code = fare_service.generate_booking_code()

    # Create Booking
    booking = Booking(
        booking_code=booking_code,
        passenger_name=payload.passenger_name.strip(),
        passenger_phone=payload.passenger_phone.strip(),
        passenger_email=payload.passenger_email.strip() if payload.passenger_email else None,
        pickup_address=payload.pickup_address.strip(),
        pickup_lat=payload.pickup_lat,
        pickup_lng=payload.pickup_lng,
        drop_address=payload.drop_address.strip(),
        drop_lat=payload.drop_lat,
        drop_lng=payload.drop_lng,
        ride_date=payload.ride_date,
        ride_time=payload.ride_time,
        car_id=car.id,
        driver_id=None, # Will be assigned by Admin
        distance_km=distance_km,
        duration_mins=duration_mins,
        base_fare=car.base_fare,
        per_km_rate=car.per_km_rate,
        total_fare=calculated_fare,
        status="Confirmed", # Immediate confirmation upon test payment
        notes=payload.notes
    )

    db.add(booking)
    db.flush()

    # Record Payment
    payment_method = payload.payment.payment_method if payload.payment else "UPI/QR"
    txn_id = payload.payment.transaction_id if payload.payment else f"TXN-{booking_code}"
    
    payment = BookingPayment(
        booking_id=booking.id,
        payment_method=payment_method,
        transaction_id=txn_id,
        amount=calculated_fare,
        payment_status="Paid"
    )
    db.add(payment)
    db.commit()
    db.refresh(booking)

    return booking

@router.get("/{booking_identifier}", response_model=BookingResponse)
def get_booking_details(booking_identifier: str, db: Session = Depends(get_db)):
    """Retrieve booking by ID or unique Booking Code (e.g. RG20260909125)."""
    query = db.query(Booking)
    if booking_identifier.isdigit():
        booking = query.filter(Booking.id == int(booking_identifier)).first()
    else:
        booking = query.filter(Booking.booking_code == booking_identifier).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking record not found")
    
    return booking
