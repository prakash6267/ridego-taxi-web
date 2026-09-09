import asyncio
from app.database import init_db, SessionLocal
from app.utils.seeder import seed_database
from app.models.car import Car
from app.models.admin import Admin
from app.models.driver import Driver
from app.models.booking import Booking
from app.models.system_log import SystemLog
from app.services.fare_service import fare_service
from app.services.routing_service import routing_service
from app.utils.security import verify_password, get_password_hash

async def run_tests():
    print("--- 1. Testing Database & Seeder ---")
    init_db()
    db = SessionLocal()
    seed_database(db)
    
    admin = db.query(Admin).filter(Admin.username == "admin").first()
    assert admin is not None, "Admin not found!"
    assert verify_password("admin123", admin.password_hash), "Admin password verification failed!"
    print(f"Admin verified: {admin.username} ({admin.email})")

    cars = db.query(Car).all()
    assert len(cars) >= 4, f"Expected at least 4 cars, got {len(cars)}"
    for car in cars:
        print(f"Car: {car.name} | Base: Rs.{car.base_fare} | Per KM: Rs.{car.per_km_rate} | Min: Rs.{car.minimum_fare}")

    drivers = db.query(Driver).all()
    print(f"Drivers seeded: {len(drivers)}")

    print("\n--- 2. Testing Dynamic Fare Calculation ---")
    # Distance = 20km, Sedan @ Rs. 10/km, Base Rs. 50 -> Expected = 50 + (20 * 10) = 250
    sedan = db.query(Car).filter(Car.car_type == "Sedan").first()
    fare = fare_service.calculate_car_fare(
        base_fare=sedan.base_fare,
        per_km_rate=sedan.per_km_rate,
        minimum_fare=sedan.minimum_fare,
        distance_km=20.0
    )
    print(f"Sedan Fare for 20km: Rs. {fare} (Expected: 250.0)")
    assert fare == 250.0, f"Fare mismatch! Got {fare}"

    print("\n--- 3. Testing Routing Service (Nominatim / OSRM / Haversine) ---")
    # Test Haversine calculation: Indore Railway Stn (22.7196, 75.8577) to Airport (22.7217, 75.8011) ~ 7-10km
    distance_info = await routing_service.get_route_distance(22.7196, 75.8577, 22.7217, 75.8011)
    print(f"Route calculated: {distance_info['distance_km']} km, {distance_info['duration_mins']} mins")
    assert distance_info["distance_km"] > 0, "Distance should be positive"

    print("\n--- 4. Testing Estimates for Route ---")
    estimates = await fare_service.get_estimates_for_route(
        db, 22.7196, 75.8577, 22.7217, 75.8011
    )
    print(f"Calculated estimates for {len(estimates['estimates'])} cars")
    for est in estimates['estimates']:
        print(f"  -> {est['name']}: Rs. {est['estimated_fare']} ({est['distance_km']} km)")

    print("\n--- 5. Testing Booking Code Generator ---")
    bcode = fare_service.generate_booking_code()
    print(f"Sample booking code: {bcode}")
    assert bcode.startswith("RG"), "Booking code must start with RG"

    db.close()
    print("\nALL BACKEND CORE TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(run_tests())
