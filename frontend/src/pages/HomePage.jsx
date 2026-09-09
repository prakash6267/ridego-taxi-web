import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Car, Shield, Clock, MapPin, ArrowRight, Phone, MessageCircle, 
  CheckCircle2, Star, Sparkles, Navigation, Award, ThumbsUp, 
  DollarSign, ChevronRight, ShieldCheck, Zap, ArrowUpRight, Users, Check,
  Plane, Compass, ShieldAlert, HeartHandshake, Filter
} from 'lucide-react';
import { carsApi } from '../api/carsApi';
import CarCard from '../components/CarCard';
import SEO from '../components/SEO';
import AnimatedNumber from '../components/AnimatedNumber';
import PopularRouteShortcuts from '../components/PopularRouteShortcuts';
import HeroCanvas from '../components/HeroCanvas';
import InteractiveFareEstimator from '../components/InteractiveFareEstimator';
import FaqSection from '../components/FaqSection';

const HomePage = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [selectedFleetCategory, setSelectedFleetCategory] = useState('all'); // 'all' | 'sedan' | 'suv' | 'mpv'
  
  // Quick Estimator State
  const [activeTab, setActiveTab] = useState('oneway'); // 'oneway' | 'roundtrip' | 'airport' | 'outstation'
  const [quickPickup, setQuickPickup] = useState('');
  const [quickDrop, setQuickDrop] = useState('');
  
  // Testimonial index
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await carsApi.getCars();
        setCars(data);
      } catch (err) {
        console.error('Failed to load cars for homepage:', err);
      } finally {
        setLoadingCars(false);
      }
    };
    fetchCars();
  }, []);

  // Quick Corridor Chips
  const popularChips = [
    { label: '✈️ Airport Drop', pickup: 'Indore City', drop: 'Devi Ahilya Bai Holkar Airport (IDR)' },
    { label: '🛕 Ujjain Mahakal', pickup: 'Indore Junction', drop: 'Mahakaleshwar Jyotirlinga, Ujjain' },
    { label: '🌊 Omkareshwar', pickup: 'Indore Central', drop: 'Omkareshwar Temple, Khandwa' },
    { label: '🏛️ Bhopal Corridor', pickup: 'Indore Vijay Nagar', drop: 'Bhopal Central VIP Road' },
  ];

  const handleApplyChip = (chip) => {
    setQuickPickup(chip.pickup);
    setQuickDrop(chip.drop);
  };

  const handleQuickBook = (e) => {
    e.preventDefault();
    navigate('/book-ride', {
      state: {
        pickup: quickPickup,
        drop: quickDrop,
        tripType: activeTab === 'roundtrip' ? 'roundtrip' : 'oneway'
      }
    });
  };

  // Testimonials
  const testimonials = [
    {
      quote: "Booked an Innova Crysta for our family trip from Indore to Ujjain. The chauffeur arrived 15 mins early, car was spotless, and billing was strictly per-km. Zero peak surge charges.",
      name: "Dr. Vivek Agrawal",
      role: "Senior Consultant",
      city: "Indore",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      car: "Innova Crysta"
    },
    {
      quote: "Immediate downloadable PDF invoice right after booking made my corporate expense claim seamless. Transparent rates with zero airport waiting surcharges.",
      name: "Pooja Deshmukh",
      role: "Corporate Mobility Lead",
      city: "Bhopal",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      car: "Swift Dzire"
    },
    {
      quote: "Called their helpline at 2 AM for an emergency airport drop. Chauffeur arrived at my doorstep in 12 minutes. Dependable 24x7 service.",
      name: "Manish Patidar",
      role: "Frequent Business Traveler",
      city: "Indore",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      car: "Maruti Ertiga"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Filter cars
  const filteredCars = cars.filter((car) => {
    if (selectedFleetCategory === 'all') return true;
    if (selectedFleetCategory === 'sedan') return car.name.toLowerCase().includes('sedan') || car.model?.toLowerCase().includes('dzire') || car.model?.toLowerCase().includes('etios');
    if (selectedFleetCategory === 'suv') return car.name.toLowerCase().includes('suv') || car.model?.toLowerCase().includes('scorpio') || car.model?.toLowerCase().includes('creta');
    if (selectedFleetCategory === 'mpv') return car.name.toLowerCase().includes('innova') || car.name.toLowerCase().includes('ertiga') || car.model?.toLowerCase().includes('ertiga') || car.model?.toLowerCase().includes('crysta');
    return true;
  });

  return (
    <div className="min-h-screen bg-[#07090C] text-slate-100 overflow-hidden">
      <SEO
        title="Premium Taxi Booking Service | RideGo"
        description="Book premium commercial taxis, outstation cabs, and airport transfers with real-time distance calculation and transparent per-km rates. 24x7 support at +91 62672 28958."
        schemaType="TaxiService"
      />

      {/* ========================================================
          1. CINEMATIC HERO SECTION WITH DYNAMIC CANVAS
          ======================================================== */}
      <section className="relative pt-6 pb-20 lg:pt-12 lg:pb-32 overflow-hidden border-b border-white/5">
        
        {/* Dynamic Interactive Background Canvas */}
        <HeroCanvas />

        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-amber-500/10 blur-[200px] rounded-full pointer-events-none" />
        <div className="absolute -top-10 right-0 w-96 h-96 bg-yellow-400/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Headline & Value Props */}
            <div className="lg:col-span-7 space-y-7">
              
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-500/10 animate-fadeIn">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Indore & Central India's Premier Taxi Brand</span>
              </div>
              
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white">
                  YOUR RIDE. <br />
                  <span className="text-gold-gradient">YOUR WAY.</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-medium pt-1">
                  Premium commercial taxi service for city, airport, and outstation journeys. Transparent distance-based pricing with verified professional chauffeurs.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/book-ride"
                  className="btn-shimmer-gold px-8 py-4 rounded-2xl text-xs uppercase tracking-wider flex items-center space-x-2 group"
                >
                  <span>Book A Ride Online</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="tel:6267228958"
                  className="px-6 py-4 rounded-2xl bg-slate-900 border border-white/10 hover:border-amber-400 text-white text-xs uppercase tracking-wider font-bold flex items-center space-x-2 transition-all hover:bg-slate-800 shadow-lg"
                >
                  <Phone className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>Call +91 62672 28958</span>
                </a>

                <a
                  href="https://wa.me/916267228958?text=Hello%20RideGo%2C%20I%20want%20to%20inquire%20about%20a%20taxi%20booking."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-5 py-4 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Animated Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                    <AnimatedNumber value={10000} suffix="+" />
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Completed Rides</p>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                    4.9<span className="text-amber-400 text-lg">★</span>
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Rider Rating</p>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                    24/7
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Live Helpline</p>
                </div>
              </div>
            </div>

            {/* Right Interactive Quick Route Booking Widget */}
            <div className="lg:col-span-5 relative">
              
              {/* Floating Route Badge */}
              <div className="absolute -top-4 -left-3 z-20 hidden sm:flex items-center space-x-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-400/30 animate-bounce">
                <Zap className="w-4 h-4" />
                <span>Automatic Distance Meter</span>
              </div>

              <div className="glass-island-elevated rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-400/25 relative overflow-hidden">
                
                {/* Trip Mode Tab Selector */}
                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/90 rounded-2xl border border-white/10 mb-6 text-center">
                  {[
                    { id: 'oneway', label: 'One-Way' },
                    { id: 'roundtrip', label: 'Round-Trip' },
                    { id: 'airport', label: 'Airport' },
                    { id: 'outstation', label: 'Outstation' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                        activeTab === tab.id
                          ? 'bg-amber-400 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-lg font-black text-white">Instant Fare Estimator</h3>
                    <p className="text-[11px] text-slate-400">Enter locations for route & live pricing</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-400/15 text-emerald-400 border border-emerald-400/30">
                    Live Dispatch
                  </span>
                </div>

                {/* Popular Route Shortcuts Chips */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Popular Corridors:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {popularChips.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyChip(chip)}
                        className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-white/5 hover:border-amber-400/40 text-[10px] text-slate-300 hover:text-amber-400 transition-colors"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleQuickBook} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Pickup Location
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Indore Junction, Rajwada, Vijay Nagar..."
                        value={quickPickup}
                        onChange={(e) => setQuickPickup(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs font-medium transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Drop Destination
                    </label>
                    <div className="relative">
                      <Navigation className="w-4 h-4 text-red-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Airport, Ujjain, Omkareshwar, Bhopal..."
                        value={quickDrop}
                        onChange={(e) => setQuickDrop(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs font-medium transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-shimmer-gold w-full py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2"
                  >
                    <span>Check Distance & Choose Cab</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 font-semibold">
                    <span className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1" /> Instant Booking</span>
                    <span className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1" /> PDF Receipt</span>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          2. POPULAR REGIONAL CORRIDORS (1-CLICK SHORTCUTS)
          ======================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PopularRouteShortcuts />
      </section>

      {/* ========================================================
          3. INTERACTIVE REAL-TIME FARE CALCULATOR SLIDER
          ======================================================== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InteractiveFareEstimator />
      </section>

      {/* ========================================================
          4. DYNAMIC CAR FLEET SHOWCASE WITH FILTER TABS
          ======================================================== */}
      <section className="py-20 bg-[#0E1117] border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Car className="w-4 h-4" />
                <span>Live Database Synchronized Fleet</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Explore Our Commercial Fleet
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Transparent tariffs starting from ₹10/km for Sedans to ₹20/km for Luxury Innova Crysta.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-white/10 self-start md:self-auto">
              {[
                { id: 'all', label: 'All Fleet' },
                { id: 'sedan', label: 'Sedans' },
                { id: 'mpv', label: 'MPVs' },
                { id: 'suv', label: 'SUVs' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFleetCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    selectedFleetCategory === cat.id
                      ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {loadingCars ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-88 rounded-3xl bg-slate-900/60 animate-pulse border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onSelect={() => navigate('/book-ride', { state: { selectedCarId: car.id } })}
                />
              ))}
            </div>
          )}

          <div className="text-center pt-10">
            <Link
              to="/book-ride"
              className="inline-flex items-center space-x-2 text-xs font-black text-amber-400 hover:text-amber-300 uppercase tracking-wider"
            >
              <span>View Full Tariffs & Reserve Your Cab</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================
          5. WHY CHOOSE US (6 PILLAR INTERACTIVE GLASS GRID)
          ======================================================== */}
      <section className="py-24 relative overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              Standard of Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Why Ride With RideGo?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We eliminate guesswork with automated distance metering, verified drivers, and guaranteed zero surge spikes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="glass-card-hover p-7 rounded-3xl border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">Transparent Metering</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fares calculated strictly by exact road distance. Zero hidden surge multipliers during rain or peak traffic hours.
              </p>
            </div>

            <div className="glass-card-hover p-7 rounded-3xl border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">Verified Chauffeurs</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Commercial badge verified, background-checked chauffeurs with an average 4.9-star passenger satisfaction rating.
              </p>
            </div>

            <div className="glass-card-hover p-7 rounded-3xl border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">On-Time Punctuality</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Assigned cab reaches your doorstep 10 minutes prior to scheduled pickup for airport and outstation trips.
              </p>
            </div>

            <div className="glass-card-hover p-7 rounded-3xl border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">Clean & Sanitized Fleet</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multi-point daily inspection, air freshener, functional AC, and comfortable leather seating.
              </p>
            </div>

            <div className="glass-card-hover p-7 rounded-3xl border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">Instant PDF Invoicing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download printable, commercial invoice receipts right after booking for smooth tax and company claims.
              </p>
            </div>

            <div className="glass-card-hover p-7 rounded-3xl border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">24×7 Live Dispatch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct phone helpline +91 62672 28958 manned by local dispatchers around the clock.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          6. HOW IT WORKS (4-STEP TIMELINE)
          ======================================================== */}
      <section className="py-24 bg-[#0E1117] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              Effortless Booking Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              How It Works in 4 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              { num: '01', title: 'ENTER LOCATION', desc: 'Type pickup & drop points with Nominatim live address suggestions.' },
              { num: '02', title: 'CHOOSE YOUR RIDE', desc: 'Select from Sedan, SUV, Ertiga or Luxury Innova with dynamic rates.' },
              { num: '03', title: 'CONFIRM BOOKING', desc: 'Scan dummy UPI/QR, submit transaction ID, and get unique booking code.' },
              { num: '04', title: 'ENJOY YOUR RIDE', desc: 'Download instant commercial PDF receipt and meet your chauffeur.' },
            ].map((step) => (
              <div key={step.num} className="glass-card p-7 rounded-3xl border border-white/10 space-y-3 relative group hover:border-amber-400/50 transition-all">
                <div className="text-4xl font-black text-amber-400/25 group-hover:text-amber-400 transition-colors font-mono">
                  {step.num}
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. TESTIMONIALS SLIDER
          ======================================================== */}
      <section className="py-24 border-b border-white/5 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
            Verified Rider Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Trusted by 10,000+ Passengers
          </h2>

          <div className="glass-island-elevated p-8 sm:p-12 rounded-3xl border border-amber-400/20 shadow-2xl space-y-6">
            <div className="flex justify-center text-amber-400 space-x-1">
              {[...Array(testimonials[testimonialIdx].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>

            <blockquote className="text-base sm:text-lg text-slate-200 font-medium italic leading-relaxed">
              "{testimonials[testimonialIdx].quote}"
            </blockquote>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <img
                src={testimonials[testimonialIdx].avatar}
                alt={testimonials[testimonialIdx].name}
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/50"
              />
              <div className="text-left">
                <h4 className="font-black text-white text-sm">{testimonials[testimonialIdx].name}</h4>
                <p className="text-xs text-amber-400 font-semibold">{testimonials[testimonialIdx].role} • {testimonials[testimonialIdx].city}</p>
              </div>
            </div>

            {/* Indicator Dots */}
            <div className="flex justify-center space-x-2 pt-4">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`h-2 rounded-full transition-all ${
                    testimonialIdx === i ? 'w-8 bg-amber-400' : 'w-2 bg-slate-700'
                  }`}
                  aria-label={`Testimonial slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. FREQUENTLY ASKED QUESTIONS SECTION
          ======================================================== */}
      <section className="py-24 bg-[#0E1117] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FaqSection />
        </div>
      </section>

      {/* ========================================================
          9. FINAL CALL / WHATSAPP ACTION STRIP
          ======================================================== */}
      <section className="py-16 bg-gradient-to-r from-amber-500/15 via-amber-400/5 to-transparent px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">Need a Commercial Cab Right Now?</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Our dispatch team is standing by 24 hours a day, 7 days a week.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:6267228958"
              className="btn-shimmer-gold px-7 py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call +91 62672 28958</span>
            </a>
            <Link
              to="/book-ride"
              className="px-6 py-3.5 rounded-2xl bg-slate-900 border border-white/10 hover:border-amber-400 text-white text-xs uppercase tracking-wider font-bold transition-all"
            >
              Book Online Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
