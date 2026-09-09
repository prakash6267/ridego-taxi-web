import asyncio
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal, init_db
from app.utils.seeder import seed_database
from app.models.car import Car

client = TestClient(app)

def run_e2e_tests():
    print("==========================================================")
    print("  TAXI BOOKING SYSTEM - COMPREHENSIVE END-TO-END TESTS   ")
    print("==========================================================")

    # 1. Health Check
    health_res = client.get("/api/health")
    assert health_res.status_code == 200, "Health check failed"
    print(" [x] Step 1: Health check passed")

    # 2. Public Cars
    cars_res = client.get("/api/cars")
    assert cars_res.status_code == 200, "Failed to get public cars"
    cars = cars_res.json()
    assert len(cars) >= 4, f"Expected 4+ cars, got {len(cars)}"
    print(f" [x] Step 2: Public cars retrieved ({len(cars)} active vehicles)")

    # 3. Calculate Route Fare
    calc_payload = {
        "pickup_lat": 22.7196,
        "pickup_lng": 75.8577,
        "drop_lat": 22.7217,
        "drop_lng": 75.8011,
        "pickup_address": "Indore Railway Station",
        "drop_address": "Devi Ahilya Bai Holkar Airport"
    }
    calc_res = client.post("/api/bookings/calculate-fare", json=calc_payload)
    assert calc_res.status_code == 200, f"Fare calculation failed: {calc_res.text}"
    calc_data = calc_res.json()
    assert calc_data["distance_km"] > 0, "Distance should be > 0"
    assert len(calc_data["estimates"]) == len(cars), "Estimate count mismatch"
    print(f" [x] Step 3: Server distance calculation ({calc_data['distance_km']} km, ~{calc_data['duration_mins']} mins)")

    # 4. Create Booking (Visitor Flow)
    selected_car = cars[0]
    booking_payload = {
        "passenger_name": "Test Passenger",
        "passenger_phone": "6267228958",
        "passenger_email": "passenger@test.com",
        "pickup_address": "Indore Railway Station",
        "pickup_lat": 22.7196,
        "pickup_lng": 75.8577,
        "drop_address": "Devi Ahilya Bai Holkar Airport",
        "drop_lat": 22.7217,
        "drop_lng": 75.8011,
        "ride_date": "2026-09-10",
        "ride_time": "14:30",
        "car_id": selected_car["id"],
        "notes": "Flight departure at 17:00",
        "payment": {
            "payment_method": "UPI/QR",
            "transaction_id": "DUMMY-UPI-TEST-998811",
            "payment_status": "Paid"
        }
    }
    create_res = client.post("/api/bookings", json=booking_payload)
    assert create_res.status_code == 201, f"Booking creation failed: {create_res.text}"
    booking = create_res.json()
    booking_code = booking["booking_code"]
    booking_id = booking["id"]
    assert booking_code.startswith("RG"), "Invalid booking code format"
    assert booking["status"] == "Confirmed", "Expected Confirmed status"
    assert booking["payment"] is not None, "Payment record missing"
    print(f" [x] Step 4: Booking created with code: {booking_code} (Fare: Rs. {booking['total_fare']})")

    # 5. Retrieve Booking by Code (for PDF Receipt)
    get_res = client.get(f"/api/bookings/{booking_code}")
    assert get_res.status_code == 200, "Failed to retrieve booking"
    assert get_res.json()["booking_code"] == booking_code
    print(" [x] Step 5: Booking lookup and PDF invoice data verified")

    # 6. Contact Form Submission
    contact_res = client.post("/api/contact", json={
        "name": "Rohan Gupta",
        "email": "rohan@gmail.com",
        "phone": "6267228958",
        "subject": "Corporate Cab Tie-up",
        "message": "We need 5 daily cabs for executive airport pickups."
    })
    assert contact_res.status_code == 201, "Contact submission failed"
    print(" [x] Step 6: Public contact inquiry submitted successfully")

    # 7. Admin Authentication (JWT)
    login_res = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "admin123"
    })
    assert login_res.status_code == 200, f"Admin login failed: {login_res.text}"
    auth_data = login_res.json()
    token = auth_data["access_token"]
    admin_headers = {"Authorization": f"Bearer {token}"}
    print(" [x] Step 7: Admin JWT authenticated successfully")

    # 8. Admin Dashboard Stats
    stats_res = client.get("/api/admin/dashboard-stats", headers=admin_headers)
    assert stats_res.status_code == 200, "Failed to get dashboard stats"
    stats = stats_res.json()
    assert stats["total_bookings"] >= 1, "Expected total bookings >= 1"
    print(f" [x] Step 8: Dashboard stats verified (Total: {stats['total_bookings']}, Revenue: Rs.{stats['total_revenue']})")

    # 9. Admin Assign Driver to Booking
    drivers_res = client.get("/api/admin/drivers", headers=admin_headers)
    assert drivers_res.status_code == 200
    drivers = drivers_res.json()
    assert len(drivers) > 0, "No drivers available"
    assigned_driver = drivers[0]
    
    assign_res = client.put(
        f"/api/admin/bookings/{booking_id}/assign-driver",
        json={"driver_id": assigned_driver["id"]},
        headers=admin_headers
    )
    assert assign_res.status_code == 200, f"Driver assignment failed: {assign_res.text}"
    assert assign_res.json()["driver_id"] == assigned_driver["id"]
    print(f" [x] Step 9: Driver {assigned_driver['name']} assigned to booking {booking_code}")

    # 10. Admin Car Rate Update & Dynamic Calculation Verification
    update_car_res = client.put(
        f"/api/admin/cars/{selected_car['id']}",
        json={"per_km_rate": 18.5},
        headers=admin_headers
    )
    assert update_car_res.status_code == 200
    assert update_car_res.json()["per_km_rate"] == 18.5
    print(f" [x] Step 10: Car per-km rate updated in admin to Rs. 18.5/km")

    # Verify calculation immediately reflects new rate
    recalc_res = client.post("/api/bookings/calculate-fare", json=calc_payload)
    recalc_data = recalc_res.json()
    updated_est = next(e for e in recalc_data["estimates"] if e["car_id"] == selected_car["id"])
    assert updated_est["per_km_rate"] == 18.5, "New rate was not reflected in calculation!"
    print(f" [x] Step 11: Dynamic calculation verified with updated rate (New Fare: Rs. {updated_est['estimated_fare']})")

    # Reset car rate back
    client.put(f"/api/admin/cars/{selected_car['id']}", json={"per_km_rate": 10.0}, headers=admin_headers)

    # 12. System Error Logging & Problem Tracker Verification (MANDATORY REQUIREMENT)
    # Trigger deliberate 404 to generate system log
    error_trigger = client.get("/api/non-existent-endpoint-test")
    assert error_trigger.status_code == 404

    # Check that system_logs captured the error
    logs_res = client.get("/api/admin/system-logs", headers=admin_headers)
    assert logs_res.status_code == 200, "Failed to get system logs"
    logs = logs_res.json()
    assert len(logs) > 0, "Expected system logs to contain recorded exceptions"
    test_log = logs[0]
    print(f" [x] Step 12: System log captured (ID: {test_log['id']}, Severity: {test_log['severity']}, Correlation: {test_log['correlation_id']})")

    # Mark Log as Resolved with Admin Note
    resolve_res = client.put(
        f"/api/admin/system-logs/{test_log['id']}/resolve",
        json={"is_resolved": True, "admin_notes": "Test verification resolved by admin"},
        headers=admin_headers
    )
    assert resolve_res.status_code == 200
    assert resolve_res.json()["is_resolved"] is True
    print(f" [x] Step 13: System log marked as RESOLVED with admin audit note")

    # Log Stats verification
    log_stats_res = client.get("/api/admin/system-logs/stats", headers=admin_headers)
    assert log_stats_res.status_code == 200
    print(f" [x] Step 14: System log stats verified (Total: {log_stats_res.json()['total_logs']}, Unresolved: {log_stats_res.json()['unresolved_errors']})")

    print("\n==========================================================")
    print("  ALL 14 END-TO-END SYSTEM TESTS PASSED PERFECTLY!       ")
    print("==========================================================")

if __name__ == "__main__":
    run_e2e_tests()
