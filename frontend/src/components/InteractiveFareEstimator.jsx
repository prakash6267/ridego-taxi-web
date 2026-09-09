import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Zap, ArrowRight, ShieldCheck, Check, Info, Sparkles, Navigation } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';

const vehicleTiers = [
  {
    id: 1,
    name: 'Sedan Comfort',
    model: 'Swift Dzire / Etios',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    seats: 4,
    baseFare: 100,
    perKm: 10,
    tag: 'Most Economical'
  },
  {
    id: 2,
    name: 'Family MPV',
    model: 'Maruti Ertiga XL',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    seats: 6,
    baseFare: 150,
    perKm: 13,
    tag: 'Best for Family'
  },
  {
    id: 3,
    name: 'Prime SUV',
    model: 'Mahindra Scorpio / XUV',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    seats: 6,
    baseFare: 200,
    perKm: 15,
    tag: 'Spacious & Rugged'
  },
  {
    id: 4,
    name: 'Executive Luxury',
    model: 'Toyota Innova Crysta',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
    seats: 7,
    baseFare: 300,
    perKm: 20,
    tag: 'VIP Commercial'
  }
];

const InteractiveFareEstimator = () => {
  const navigate = useNavigate();
  const [distanceKm, setDistanceKm] = useState(55); // Default Indore to Ujjain ~55km
  const [tripType, setTripType] = useState('oneway'); // 'oneway' | 'roundtrip'

  const multiplier = tripType === 'roundtrip' ? 2 : 1;
  const effectiveDistance = distanceKm * multiplier;

  const handleBookSelected = (tier) => {
    navigate('/book-ride', {
      state: {
        presetDistance: effectiveDistance,
        selectedCarId: tier.id,
        tripType: tripType
      }
    });
  };

  return (
    <div className="glass-island-elevated rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/10">
        <div>
          <div className="inline-flex items-center space-x-2 text-amber-400 text-xs font-black uppercase tracking-widest mb-2">
            <Calculator className="w-4 h-4" />
            <span>Interactive Road Fare Estimator</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Calculate Trip Fare In Real-Time
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Drag the slider to adjust your estimated road distance. Transparent formula: <span className="text-amber-400 font-mono font-bold">Base Fare + (Distance × ₹/km)</span>.
          </p>
        </div>

        {/* Trip Type Selector */}
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-white/10 self-start lg:self-center">
          <button
            type="button"
            onClick={() => setTripType('oneway')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              tripType === 'oneway'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-lg shadow-amber-400/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            One-Way Drop
          </button>
          <button
            type="button"
            onClick={() => setTripType('roundtrip')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              tripType === 'roundtrip'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-lg shadow-amber-400/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Round-Trip (2× Km)
          </button>
        </div>
      </div>

      {/* Interactive Slider Controller */}
      <div className="py-8 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center space-x-2">
            <Navigation className="w-4 h-4 text-amber-400" />
            <span>Selected Distance:</span>
          </label>
          <div className="text-right">
            <span className="text-3xl sm:text-4xl font-black text-gold-gradient font-mono">
              {distanceKm}
            </span>
            <span className="text-sm font-bold text-slate-400 ml-1">km {tripType === 'roundtrip' && `(Total: ${effectiveDistance} km)`}</span>
          </div>
        </div>

        {/* Custom Range Slider */}
        <div className="relative pt-2">
          <input
            type="range"
            min="10"
            max="350"
            step="5"
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="w-full h-3 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none ring-1 ring-white/10"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2">
            <span>10 km (City Drop)</span>
            <span>55 km (Ujjain)</span>
            <span>150 km (Regional)</span>
            <span>200 km (Bhopal)</span>
            <span>350 km (Outstation)</span>
          </div>
        </div>
      </div>

      {/* Real-time Dynamic Vehicle Fare Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {vehicleTiers.map((tier) => {
          const estimatedFare = tier.baseFare + (effectiveDistance * tier.perKm);

          return (
            <div
              key={tier.id}
              className="glass-card rounded-3xl p-5 border border-white/10 flex flex-col justify-between hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-400/10 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-400 border border-amber-400/30">
                    {tier.tag}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{tier.seats} Seats</span>
                </div>

                <div className="h-32 rounded-2xl overflow-hidden mb-4 relative bg-slate-900">
                  <img
                    src={tier.image}
                    alt={tier.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 text-[11px] font-black text-white">
                    {tier.model}
                  </div>
                </div>

                <h3 className="text-base font-black text-white">{tier.name}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ₹{tier.perKm}/km + ₹{tier.baseFare} Base
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Estimated Total</span>
                  <div className="text-2xl font-black text-white flex items-baseline space-x-1">
                    <span className="text-amber-400 text-lg font-bold">₹</span>
                    <AnimatedNumber value={estimatedFare} />
                    <span className="text-[10px] text-emerald-400 font-bold ml-1">No Surge</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBookSelected(tier)}
                  className="btn-shimmer-gold w-full py-3 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2"
                >
                  <span>Select & Book</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assurance Footer */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-4">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Fares strictly recalculated by exact GPS road distance upon booking.</span>
        </div>
        <div className="flex items-center space-x-4 font-bold text-[11px] uppercase tracking-wider text-amber-400">
          <span>✓ Instant PDF Receipt</span>
          <span>✓ Zero Peak Surcharge</span>
          <span>✓ Verified Chauffeur</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveFareEstimator;
