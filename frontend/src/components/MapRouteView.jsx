import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const dropIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapRouteView = ({ pickup, drop, distanceKm, durationMins }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default Indore center coordinates
      const defaultCenter = [22.7196, 75.8577];
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;

    layerGroup.clearLayers();

    const bounds = [];

    if (pickup && pickup.lat && pickup.lng) {
      const pMarker = L.marker([pickup.lat, pickup.lng], { icon: pickupIcon })
        .bindPopup(`<strong>Pickup:</strong><br/>${pickup.address || 'Pickup Point'}`);
      layerGroup.addLayer(pMarker);
      bounds.push([pickup.lat, pickup.lng]);
    }

    if (drop && drop.lat && drop.lng) {
      const dMarker = L.marker([drop.lat, drop.lng], { icon: dropIcon })
        .bindPopup(`<strong>Drop:</strong><br/>${drop.address || 'Destination'}`);
      layerGroup.addLayer(dMarker);
      bounds.push([drop.lat, drop.lng]);
    }

    if (bounds.length === 2) {
      const polyline = L.polyline(bounds, {
        color: '#f59e0b',
        weight: 4,
        dashArray: '6, 8'
      });
      layerGroup.addLayer(polyline);
      map.fitBounds(L.latLngBounds(bounds), { padding: [50, 50], maxZoom: 14 });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 13);
    }
  }, [pickup, drop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Route Distance HUD */}
      {distanceKm > 0 && (
        <div className="absolute top-4 right-4 z-[400] bg-slate-900/90 text-white backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-slate-700 flex items-center space-x-4 text-xs font-semibold">
          <div>
            <span className="text-slate-400 block text-[10px]">Distance:</span>
            <span className="text-amber-400 text-sm font-bold">{distanceKm} km</span>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div>
            <span className="text-slate-400 block text-[10px]">Est. Duration:</span>
            <span className="text-white text-sm font-bold">~{durationMins || Math.round(distanceKm * 2.5)} mins</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapRouteView;
