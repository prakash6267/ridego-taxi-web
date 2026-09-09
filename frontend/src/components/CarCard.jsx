import React from 'react';
import { Users, Wind, CheckCircle2, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';

const CarCard = ({ car, isSelected, onSelect, distanceKm = null, calculatedFare = null }) => {
  return (
    <div
      onClick={() => onSelect && onSelect(car)}
      className={`relative group rounded-3xl p-5 transition-all duration-300 cursor-pointer overflow-hidden border ${
        isSelected
          ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/40 shadow-2xl shadow-amber-500/15 scale-[1.02]'
          : 'bg-[#13171F]/90 border-white/10 hover:border-amber-400/50 hover:bg-[#181D27] hover:-translate-y-1.5 shadow-xl'
      }`}
    >
      {/* Top Header Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-amber-400">
          {car.car_type || 'Cab'}
        </span>
        {isSelected && (
          <span className="flex items-center text-[10px] font-black text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full shadow-md shadow-amber-400/30 animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Selected
          </span>
        )}
      </div>

      {/* Car Image with subtle luxury overlay */}
      <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-900/60 mb-4 flex items-center justify-center border border-white/5">
        <img
          src={car.image_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'}
          alt={`${car.name} commercial taxi`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#13171F] via-transparent to-transparent opacity-80" />
      </div>

      {/* Title & Model */}
      <div className="mb-3">
        <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors">
          {car.name}
        </h3>
        <p className="text-xs text-slate-400 font-medium">{car.model}</p>
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 gap-2 py-3 border-y border-white/5 text-xs text-slate-300 mb-4 font-semibold">
        <div className="flex items-center space-x-1.5">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>{car.seats} Passenger Seats</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Wind className="w-3.5 h-3.5 text-amber-400" />
          <span>{car.has_ac ? 'AC Air Cooled' : 'Non-AC'}</span>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-1 mb-4 text-xs">
        <div className="flex items-center justify-between text-slate-400">
          <span>Per KM Tariff:</span>
          <span className="font-black text-amber-400 text-sm">₹{car.per_km_rate} / km</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Base Flag Down:</span>
          <span className="font-semibold text-slate-200">₹{car.base_fare}</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Minimum Fare:</span>
          <span className="font-semibold text-slate-200">₹{car.minimum_fare}</span>
        </div>
      </div>

      {/* Animated Estimated Fare if route distance is available */}
      {calculatedFare !== null ? (
        <div className="pt-3 border-t border-dashed border-white/10">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold text-slate-400">Est. Total ({distanceKm} km):</span>
            <span className="text-2xl font-black text-amber-400 tracking-tight">
              ₹<AnimatedNumber value={calculatedFare} />
            </span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all duration-200 ${
            isSelected
              ? 'btn-gold shadow-lg shadow-amber-400/20'
              : 'bg-slate-800 text-white group-hover:bg-amber-400 group-hover:text-slate-950'
          }`}
        >
          <span>{isSelected ? 'Ride Selected' : 'Choose This Cab'}</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default CarCard;
