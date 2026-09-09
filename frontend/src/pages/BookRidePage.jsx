import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  MapPin, Navigation, Calendar, Clock, User, Phone, Mail, 
  Car, QrCode, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft,
  Copy, Check, ShieldCheck, Sparkles, Loader2, Download, Zap, MessageCircle
} from 'lucide-react';
import { carsApi } from '../api/carsApi';
import { bookingApi } from '../api/bookingApi';
import CarCard from '../components/CarCard';
import MapRouteView from '../components/MapRouteView';
import PdfReceiptGenerator from '../components/PdfReceiptGenerator';
import RouteTimelineCard from '../components/RouteTimelineCard';
import SEO from '../components/SEO';
import AnimatedNumber from '../components/AnimatedNumber';
import Toast from '../components/Toast';

const BookRidePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Step: 1 = Route, 2 = Car, 3 = Passenger & Payment, 4 = Confirmation
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [pickupQuery, setPickupQuery] = useState(location.state?.pickup || '');
  const [dropQuery, setDropQuery] = useState(location.state?.drop || '');
  const [pickupCoord, setPickupCoord] = useState(null);
  const [dropCoord, setDropCoord] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [isSearchingPickup, setIsSearchingPickup] = useState(false);
  const [isSearchingDrop, setIsSearchingDrop] = useState(false);

  // Fare & Estimates
  const [distanceKm, setDistanceKm] = useState(0);
  const [durationMins, setDurationMins] = useState(0);
  const [estimates, setEstimates] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Passenger Details
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [rideDate, setRideDate] = useState(new Date().toISOString().split('T')[0]);
  const [rideTime, setRideTime] = useState('10:00');
  const [notes, setNotes] = useState('');

  // Dummy Payment State
  const [paymentMethod, setPaymentMethod] = useState('UPI/QR');
  const [transactionId, setTransactionId] = useState('TXN-' + Math.floor(100000 + Math.random() * 900000));
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Confirmed Booking Output
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Initial load: Fetch cars
  useEffect(() => {
    const initCars = async () => {
      try {
        const data = await carsApi.getCars();
        if (data.length > 0) {
          if (location.state?.selectedCarId) {
            const found = data.find(c => c.id === location.state.selectedCarId);
            setSelectedCar(found || data[0]);
          } else {
            setSelectedCar(data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching cars:', err);
      }
    };
    initCars();
  }, [location.state]);

  // Autocomplete for Pickup
  useEffect(() => {
    if (pickupQuery.length < 3) {
      setPickupSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingPickup(true);
      try {
        const results = await carsApi.searchLocations(pickupQuery);
        setPickupSuggestions(results);
      } catch (e) {
        console.warn('Geocoding error:', e);
      } finally {
        setIsSearchingPickup(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [pickupQuery]);

  // Autocomplete for Drop
  useEffect(() => {
    if (dropQuery.length < 3) {
      setDropSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingDrop(true);
      try {
        const results = await carsApi.searchLocations(dropQuery);
        setDropSuggestions(results);
      } catch (e) {
        console.warn('Geocoding error:', e);
      } finally {
        setIsSearchingDrop(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [dropQuery]);

  // Calculate Distance and Dynamic Fares via Backend API
  const handleCalculateRoute = async () => {
    setToastMsg('');
    if (!pickupQuery.trim() || !dropQuery.trim()) {
      setToastMsg('Please enter both pickup location and drop destination.');
      return;
    }

    setIsCalculating(true);
    try {
      const pCoord = pickupCoord || {
        lat: 22.7196,
        lng: 75.8577,
        address: pickupQuery
      };
      const dCoord = dropCoord || {
        lat: 22.7217,
        lng: 75.8011,
        address: dropQuery
      };

      setPickupCoord(pCoord);
      setDropCoord(dCoord);

      const res = await bookingApi.calculateFare({
        pickup_lat: pCoord.lat,
        pickup_lng: pCoord.lng,
        drop_lat: dCoord.lat,
        drop_lng: dCoord.lng,
        pickup_address: pickupQuery,
        drop_address: dropQuery
      });

      setDistanceKm(res.distance_km);
      setDurationMins(res.duration_mins);
      setEstimates(res.estimates);

      if (res.estimates.length > 0) {
        const matched = res.estimates.find(e => e.car_id === selectedCar?.id) || res.estimates[0];
        setSelectedCar(matched);
      }

      setCurrentStep(2);
    } catch (err) {
      console.error('Calculation error:', err);
      setToastMsg(err.response?.data?.detail || "We couldn't calculate the route right now. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  // Submit Final Booking to Backend
  const handleFinalBookingSubmit = async (e) => {
    e.preventDefault();
    setToastMsg('');

    if (!passengerName.trim() || !passengerPhone.trim()) {
      setToastMsg('Please enter passenger full name and contact number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingPayload = {
        passenger_name: passengerName.trim(),
        passenger_phone: passengerPhone.trim(),
        passenger_email: passengerEmail ? passengerEmail.trim() : undefined,
        pickup_address: pickupQuery,
        pickup_lat: pickupCoord?.lat || 22.7196,
        pickup_lng: pickupCoord?.lng || 75.8577,
        drop_address: dropQuery,
        drop_lat: dropCoord?.lat || 22.7217,
        drop_lng: dropCoord?.lng || 75.8011,
        ride_date: rideDate,
        ride_time: rideTime,
        car_id: selectedCar.car_id || selectedCar.id,
        notes: notes || undefined,
        payment: {
          payment_method: paymentMethod,
          transaction_id: transactionId,
          payment_status: 'Paid'
        }
      };

      const result = await bookingApi.createBooking(bookingPayload);
      setConfirmedBooking(result);
      setCurrentStep(4);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } catch (err) {
      console.error('Booking submission error:', err);
      setToastMsg(err.response?.data?.detail || 'Something went wrong while creating your booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Book a Taxi Online | RideGo"
        description="Calculate real-time road distance and book a sanitized commercial cab with instant PDF receipt and 24x7 support."
        schemaType="TaxiService"
      />

      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header Breadcrumb & Stepper */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 text-amber-400 text-xs font-black uppercase tracking-widest">
            <Zap className="w-4 h-4" />
            <span>Automated Distance & Tariff Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Book Your Ride
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Choose your route, inspect real road distance, select from dynamic fleet, and receive instant digital confirmation.
          </p>

          {/* Stepper Wizard Indicator */}
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 pt-6">
            {[
              { num: 1, label: 'Route & Map' },
              { num: 2, label: 'Choose Car' },
              { num: 3, label: 'Passenger & Pay' },
              { num: 4, label: 'Confirmed' },
            ].map((step) => (
              <div key={step.num} className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-2xl flex items-center justify-center font-black text-xs transition-all ${
                    currentStep >= step.num
                      ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/25 scale-105'
                      : 'bg-slate-900 border border-white/10 text-slate-500'
                  }`}
                >
                  {currentStep > step.num ? <CheckCircle2 className="w-5 h-5 text-slate-950" /> : step.num}
                </div>
                <span className={`text-xs font-bold hidden sm:inline ${currentStep >= step.num ? 'text-white' : 'text-slate-500'}`}>
                  {step.label}
                </span>
                {step.num < 4 && <div className={`w-6 sm:w-10 h-0.5 ${currentStep > step.num ? 'bg-amber-400' : 'bg-slate-800'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: ROUTE & INTERACTIVE MAP VIEW */}
        {currentStep === 1 && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Inputs */}
              <div className="lg:col-span-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-base font-black text-white flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-amber-400" />
                    <span>Enter Travel Route</span>
                  </h3>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider bg-amber-400/10 px-2.5 py-1 rounded-full">
                    OSRM Distance
                  </span>
                </div>

                {/* Pickup Search */}
                <div className="relative">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Pickup Location / Landmark
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={pickupQuery}
                      onChange={(e) => setPickupQuery(e.target.value)}
                      placeholder="e.g. Indore Junction, Vijay Nagar..."
                      className="w-full pl-10 pr-10 py-3.5 bg-slate-900/90 border border-white/10 rounded-2xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium transition-colors"
                    />
                    {isSearchingPickup && (
                      <Loader2 className="w-4 h-4 text-amber-400 animate-spin absolute right-3.5 top-4" />
                    )}
                  </div>

                  {/* Suggestions dropdown */}
                  {pickupSuggestions.length > 0 && (
                    <div className="absolute z-30 w-full mt-1 bg-[#13171F] border border-white/15 rounded-2xl shadow-2xl max-h-52 overflow-y-auto divide-y divide-white/5">
                      {pickupSuggestions.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setPickupQuery(item.display_name);
                            setPickupCoord({ lat: item.lat, lng: item.lng, address: item.display_name });
                            setPickupSuggestions([]);
                          }}
                          className="p-3 text-xs text-slate-300 hover:bg-amber-400/10 hover:text-amber-400 cursor-pointer flex items-start space-x-2 transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{item.display_name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Drop Search */}
                <div className="relative">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Drop Destination
                  </label>
                  <div className="relative">
                    <Navigation className="w-4 h-4 text-red-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={dropQuery}
                      onChange={(e) => setDropQuery(e.target.value)}
                      placeholder="e.g. Airport, Ujjain, Omkareshwar..."
                      className="w-full pl-10 pr-10 py-3.5 bg-slate-900/90 border border-white/10 rounded-2xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium transition-colors"
                    />
                    {isSearchingDrop && (
                      <Loader2 className="w-4 h-4 text-amber-400 animate-spin absolute right-3.5 top-4" />
                    )}
                  </div>

                  {/* Suggestions dropdown */}
                  {dropSuggestions.length > 0 && (
                    <div className="absolute z-30 w-full mt-1 bg-[#13171F] border border-white/15 rounded-2xl shadow-2xl max-h-52 overflow-y-auto divide-y divide-white/5">
                      {dropSuggestions.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setDropQuery(item.display_name);
                            setDropCoord({ lat: item.lat, lng: item.lng, address: item.display_name });
                            setDropSuggestions([]);
                          }}
                          className="p-3 text-xs text-slate-300 hover:bg-amber-400/10 hover:text-amber-400 cursor-pointer flex items-start space-x-2 transition-colors"
                        >
                          <Navigation className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{item.display_name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isCalculating}
                  onClick={handleCalculateRoute}
                  className="btn-gold w-full py-4 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Calculating Real Road Distance...</span>
                    </>
                  ) : (
                    <>
                      <span>Find Distance & Available Cabs</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Map Preview */}
              <div className="lg:col-span-6 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>Interactive Route Map</span>
                  <span>Leaflet / OpenStreetMap</span>
                </div>
                <MapRouteView
                  pickup={pickupCoord}
                  drop={dropCoord}
                  distanceKm={distanceKm}
                  durationMins={durationMins}
                />
              </div>

            </div>
          </div>
        )}

        {/* STEP 2: DYNAMIC CAR SELECTION WITH ANIMATED ROUTE TIMELINE */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Route Timeline Component */}
            <RouteTimelineCard
              pickup={pickupQuery}
              drop={dropQuery}
              distanceKm={distanceKm}
              durationMins={durationMins}
              selectedCar={selectedCar}
            />

            {/* Cars Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {estimates.map((est) => (
                <CarCard
                  key={est.car_id}
                  car={est}
                  isSelected={selectedCar?.car_id === est.car_id || selectedCar?.id === est.car_id}
                  onSelect={(c) => setSelectedCar(c)}
                  distanceKm={distanceKm}
                  calculatedFare={est.estimated_fare}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="btn-dark px-6 py-3 rounded-2xl text-xs uppercase tracking-wider font-bold flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Route</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="btn-gold px-8 py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center space-x-2"
              >
                <span>Proceed to Passenger Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PASSENGER DETAILS & DUMMY UPI/QR PAYMENT */}
        {currentStep === 3 && (
          <form onSubmit={handleFinalBookingSubmit} className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Passenger Column */}
              <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-5">
                <h3 className="text-base font-black text-white flex items-center space-x-2 pb-3 border-b border-white/10">
                  <User className="w-5 h-5 text-amber-400" />
                  <span>Passenger Information</span>
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 bg-slate-900/90 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={passengerPhone}
                        onChange={(e) => setPassengerPhone(e.target.value)}
                        placeholder="e.g. 9826012345"
                        className="w-full px-4 py-3 bg-slate-900/90 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={passengerEmail}
                        onChange={(e) => setPassengerEmail(e.target.value)}
                        placeholder="e.g. rahul@gmail.com"
                        className="w-full px-4 py-3 bg-slate-900/90 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Ride Date
                      </label>
                      <input
                        type="date"
                        required
                        value={rideDate}
                        onChange={(e) => setRideDate(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900/90 border border-white/10 rounded-2xl text-white font-medium focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Pickup Time
                      </label>
                      <input
                        type="time"
                        required
                        value={rideTime}
                        onChange={(e) => setRideTime(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900/90 border border-white/10 rounded-2xl text-white font-medium focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Special Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Flight number, extra luggage, child seat needed..."
                      className="w-full px-4 py-2.5 bg-slate-900/90 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Dummy Payment Box */}
              <div className="lg:col-span-5 glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-base font-black text-white flex items-center space-x-2 pb-3 border-b border-white/10">
                    <QrCode className="w-5 h-5 text-amber-400" />
                    <span>Fare Breakdown & Payment</span>
                  </h3>

                  {/* Summary Rows */}
                  <div className="py-4 space-y-2 border-b border-white/10 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span className="text-white font-bold">{selectedCar?.name || 'Selected Cab'}</span>
                      <span className="font-black text-amber-400">₹{selectedCar?.per_km_rate}/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Road Distance:</span>
                      <span className="font-bold text-white">{distanceKm} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Base Flag Down:</span>
                      <span className="font-bold text-white">₹{selectedCar?.base_fare}</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/10">
                      <span>Total Payable:</span>
                      <span className="text-amber-400 text-xl font-black">
                        ₹<AnimatedNumber value={selectedCar?.estimated_fare || (selectedCar?.base_fare + distanceKm * selectedCar?.per_km_rate)} />
                      </span>
                    </div>
                  </div>

                  {/* Dummy UPI/QR Box */}
                  <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">Dummy UPI / Scan QR</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-400/20 text-amber-400">
                        Test Mode
                      </span>
                    </div>

                    {/* QR Code Container */}
                    <div className="w-36 h-36 mx-auto bg-white p-2 rounded-2xl shadow-xl flex items-center justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=6267228958@upi&pn=RideGo%20Commercial&am=${selectedCar?.estimated_fare}&cu=INR`}
                        alt="Payment QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* UPI ID copy */}
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-950 rounded-xl border border-white/10 text-xs">
                      <span className="font-mono text-slate-300 font-bold">6267228958@upi</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('6267228958@upi')}
                        className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1"
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Transaction Reference ID
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-gold w-full py-4 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Confirming Reservation...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm & Complete Booking</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="w-full py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    Back to Vehicle Selection
                  </button>
                </div>
              </div>

            </div>
          </form>
        )}

        {/* STEP 4: INSTANT BOOKING CONFIRMATION & PDF RECEIPT */}
        {currentStep === 4 && confirmedBooking && (
          <div className="space-y-8 animate-fadeIn">
            {/* Success Hero Banner */}
            <div className="glass-card p-8 sm:p-12 rounded-3xl border border-emerald-500/30 text-center space-y-4 shadow-2xl relative overflow-hidden">
              <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center mx-auto text-slate-950 shadow-xl shadow-emerald-500/30 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Reservation Confirmed
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">Ride Successfully Booked!</h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto">
                Your reservation ID is <strong className="text-amber-400 font-mono text-base">{confirmedBooking.booking_code}</strong>. A chauffeur is being dispatched for your scheduled pickup.
              </p>
            </div>

            {/* Render Printable / Downloadable PDF Receipt */}
            <PdfReceiptGenerator booking={confirmedBooking} />

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href={`https://wa.me/916267228958?text=Hello%20RideGo%2C%20I%20have%20booked%20cab%20ID%20${confirmedBooking.booking_code}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  setPickupQuery('');
                  setDropQuery('');
                  setConfirmedBooking(null);
                }}
                className="btn-dark px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider font-bold"
              >
                Book Another Trip
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookRidePage;
