import React from 'react';
import { MapPin, Navigation, Clock, Zap, Car } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';

const RouteTimelineCard = ({ pickup, drop, distanceKm, durationMins, selectedCar = null }) => {
  if (!pickup && !drop) return null;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Subtle gold decorative gradient in background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[90px] pointer-events-none" />

      <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs font-black text-white uppercase tracking-wider">Live Route Telemetry</span>
        </div>
        {distanceKm > 0 && (
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/15 text-amber-400 border border-amber-400/30">
            OSRM Calculated
          </span>
        )}
      </div>

      {/* Vertical Animated Route Timeline */}
      <div className="relative pl-6 space-y-6">
        {/* Route connecting line */}
        <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-emerald-500 via-amber-400 to-red-500 rounded-full" />

        {/* Pickup point */}
        <div className="relative flex items-start space-x-3">
          <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">Pickup Point</span>
            <p className="text-xs font-bold text-white mt-0.5">{pickup || 'Select pickup location'}</p>
          </div>
        </div>

        {/* Distance & Time pill in middle of timeline */}
        {distanceKm > 0 && (
          <div className="relative flex items-center space-x-3 py-1">
            <div className="absolute -left-6 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[9px] shadow-md shadow-amber-400/40">
              <Zap className="w-3 h-3" />
            </div>
            <div className="flex items-center space-x-4 bg-slate-900/90 px-4 py-2 rounded-2xl border border-white/10 text-xs">
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Distance</span>
                <span className="text-sm font-black text-amber-400">
                  <AnimatedNumber value={distanceKm} suffix=" KM" />
                </span>
              </div>
              <div className="h-5 w-px bg-white/10" />
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Est. Time</span>
                <span className="text-xs font-bold text-white">~{durationMins || Math.round(distanceKm * 2.5)} Mins</span>
              </div>
            </div>
          </div>
        )}

        {/* Drop point */}
        <div className="relative flex items-start space-x-3">
          <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-red-500/20 border-2 border-red-400 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest block">Drop Destination</span>
            <p className="text-xs font-bold text-white mt-0.5">{drop || 'Select drop destination'}</p>
          </div>
        </div>
      </div>

      {/* Selected Car Rate Pill if chosen */}
      {selectedCar && distanceKm > 0 && (
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Car className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white">{selectedCar.name}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-bold">Estimated Fare</span>
            <span className="text-base font-black text-amber-400">
              ₹<AnimatedNumber value={selectedCar.estimated_fare || (selectedCar.base_fare + distanceKm * selectedCar.per_km_rate)} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteTimelineCard;
