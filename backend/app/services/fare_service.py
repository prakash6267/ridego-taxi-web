import random
from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.car import Car
from app.services.routing_service import routing_service

class FareService:
    @staticmethod
    def calculate_car_fare(base_fare: float, per_km_rate: float, minimum_fare: float, distance_km: float) -> float:
        """
        Calculate total fare based on formula:
        Total Fare = Base Fare + (Distance x Per KM Rate), subject to Minimum Fare.
        """
        raw_fare = base_fare + (distance_km * per_km_rate)
        final_fare = max(raw_fare, minimum_fare)
        return round(final_fare, 2)

    @classmethod
    async def get_estimates_for_route(
        cls, 
        db: Session, 
        pickup_lat: float, 
        pickup_lng: float, 
        drop_lat: float, 
        drop_lng: float,
        specific_car_id: int = None
    ) -> Dict[str, Any]:
        """Calculate route distance via OSRM and get fare estimates across all active cars."""
        route_info = await routing_service.get_route_distance(
            pickup_lat, pickup_lng, drop_lat, drop_lng
        )
        distance_km = route_info["distance_km"]
        duration_mins = route_info["duration_mins"]

        query = db.query(Car).filter(Car.is_active == True)
        if specific_car_id:
            query = query.filter(Car.id == specific_car_id)
        
        cars = query.order_by(Car.sort_order.asc(), Car.per_km_rate.asc()).all()

        estimates = []
        for car in cars:
            fare = cls.calculate_car_fare(
                base_fare=car.base_fare,
                per_km_rate=car.per_km_rate,
                minimum_fare=car.minimum_fare,
                distance_km=distance_km
            )
            estimates.append({
                "car_id": car.id,
                "name": car.name,
                "model": car.model,
                "car_type": car.car_type,
                "seats": car.seats,
                "has_ac": car.has_ac,
                "image_url": car.image_url,
                "base_fare": car.base_fare,
                "per_km_rate": car.per_km_rate,
                "minimum_fare": car.minimum_fare,
                "distance_km": distance_km,
                "duration_mins": duration_mins,
                "estimated_fare": fare
            })

        return {
            "distance_km": distance_km,
            "duration_mins": duration_mins,
            "estimates": estimates
        }

    @staticmethod
    def generate_booking_code() -> str:
        """Generate a unique booking ID such as RG20260909125."""
        today_str = datetime.utcnow().strftime("%Y%m%d")
        rand_suffix = random.randint(100, 999)
        return f"RG{today_str}{rand_suffix}"

fare_service = FareService()
