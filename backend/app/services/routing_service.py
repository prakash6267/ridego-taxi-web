import math
import logging
import httpx
from typing import Optional, Dict, Any, List
from app.config import settings

logger = logging.getLogger(__name__)

class RoutingService:
    """Modular Routing & Geocoding Service supporting Nominatim, OSRM, and Haversine fallback."""

    @staticmethod
    def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate great-circle distance between two points on the Earth in kilometers."""
        R = 6371.0 # Earth radius in km
        dLat = math.radians(lat2 - lat1)
        dLon = math.radians(lon2 - lon1)
        a = math.sin(dLat / 2) * math.sin(dLat / 2) + \
            math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
            math.sin(dLon / 2) * math.sin(dLon / 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance = R * c
        # Multiply by road circuity factor (~1.25 for typical city/highway road paths)
        return round(distance * 1.25, 2)

    @classmethod
    async def search_locations(cls, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search address suggestions using OpenStreetMap Nominatim."""
        if not query or len(query.strip()) < 2:
            return []
            
        url = f"{settings.NOMINATIM_BASE_URL}/search"
        params = {
            "q": query.strip(),
            "format": "json",
            "addressdetails": 1,
            "limit": limit,
            "countrycodes": "in" # Default prioritization, flexible
        }
        headers = {
            "User-Agent": "TaxiGoCommercialApp/1.0 (contact@taxigo.com)"
        }
        
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                resp = await client.get(url, params=params, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    results = []
                    for item in data:
                        results.append({
                            "display_name": item.get("display_name"),
                            "lat": float(item.get("lat")),
                            "lng": float(item.get("lon")),
                            "type": item.get("type", "location")
                        })
                    return results
        except Exception as e:
            logger.warning(f"Nominatim geocode search failed: {e}")
            
        return []

    @classmethod
    async def get_route_distance(
        cls, 
        pickup_lat: float, 
        pickup_lng: float, 
        drop_lat: float, 
        drop_lng: float
    ) -> Dict[str, float]:
        """
        Calculate route road distance (km) and estimated duration (minutes) using OSRM,
        with graceful fallback to Haversine estimate.
        """
        # Coordinate sanity check
        if pickup_lat == drop_lat and pickup_lng == drop_lng:
            return {"distance_km": 1.0, "duration_mins": 5.0}

        osrm_url = f"{settings.OSRM_BASE_URL}/route/v1/driving/{pickup_lng},{pickup_lat};{drop_lng},{drop_lat}"
        params = {
            "overview": "false",
            "steps": "false"
        }

        try:
            async with httpx.AsyncClient(timeout=3.5) as client:
                resp = await client.get(osrm_url, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    if data.get("code") == "Ok" and data.get("routes"):
                        route = data["routes"][0]
                        distance_meters = route.get("distance", 0)
                        duration_seconds = route.get("duration", 0)
                        
                        distance_km = round(distance_meters / 1000.0, 2)
                        duration_mins = round(duration_seconds / 60.0, 1)
                        
                        # Minimum 1 km for billing sanity
                        distance_km = max(distance_km, 1.0)
                        duration_mins = max(duration_mins, 3.0)
                        
                        return {
                            "distance_km": distance_km,
                            "duration_mins": duration_mins
                        }
        except Exception as e:
            logger.warning(f"OSRM routing failed: {e}. Falling back to Haversine calculation.")

        # Fallback Haversine calculation
        fallback_distance = cls.haversine_distance(pickup_lat, pickup_lng, drop_lat, drop_lng)
        fallback_distance = max(fallback_distance, 1.0)
        # Average speed estimate: 30 km/h in city/suburb
        fallback_duration = round((fallback_distance / 30.0) * 60.0, 1)
        fallback_duration = max(fallback_duration, 5.0)

        return {
            "distance_km": fallback_distance,
            "duration_mins": fallback_duration
        }

routing_service = RoutingService()
