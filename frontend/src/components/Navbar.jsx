import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Phone, Menu, X, Car, ShieldCheck, Sparkles, 
  ChevronRight, Zap, MessageCircle, Clock, MapPin, Award
} from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Book Ride', path: '/book-ride' },
    { name: 'Fleet Services', path: '/services' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sticky top-0 z-50 transition-all duration-300">
      
      {/* 1. TOP LIVE DISPATCH & ANNOUNCEMENT BAR */}
      <div className="bg-[#05070A] border-b border-white/5 py-1.5 px-4 overflow-hidden relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-medium text-slate-400">
          
          {/* Left Live Pulse */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 hidden sm:inline">
              LIVE DISPATCH
            </span>
            <span className="text-slate-300 hidden md:inline font-mono">
              | 45+ Commercial Cabs Active in Indore & Region
            </span>
          </div>

          {/* Center / Marquee Highlights */}
          <div className="flex items-center space-x-6 text-[10px] uppercase font-bold tracking-wider text-slate-400">
            <span className="hidden lg:flex items-center text-slate-300">
              <Sparkles className="w-3 h-3 text-amber-400 mr-1" />
              Zero Surge Spikes
            </span>
            <span className="hidden lg:flex items-center text-slate-300">
              <ShieldCheck className="w-3 h-3 text-emerald-400 mr-1" />
              Govt. Verified Chauffeurs
            </span>
            <span className="flex items-center text-amber-300 font-mono">
              <Clock className="w-3 h-3 mr-1" />
              24×7 Rapid Dispatch
            </span>
          </div>

          {/* Right Direct Links */}
          <div className="flex items-center space-x-3 text-xs">
            <a
              href="https://wa.me/916267228958?text=Hello%20RideGo%2C%20I%20want%20to%20inquire%20about%20a%20cab%20booking."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider hidden sm:inline">WhatsApp</span>
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="tel:6267228958"
              className="flex items-center space-x-1 text-white hover:text-amber-400 font-black transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span className="text-[11px] font-mono">+91 62672 28958</span>
            </a>
          </div>

        </div>
      </div>

      {/* 2. MAIN FLOATING ISLAND NAVBAR */}
      <div className={`px-3 sm:px-6 lg:px-8 transition-all duration-300 ${
        scrolled ? 'pt-2 pb-2' : 'pt-4 pb-2'
      }`}>
        <header className={`max-w-7xl mx-auto rounded-3xl transition-all duration-300 relative ${
          scrolled 
            ? 'glass-island-elevated px-5 py-2.5 shadow-2xl shadow-black/90 ring-1 ring-amber-400/25' 
            : 'bg-[#0E121A]/85 border border-white/10 px-6 py-3.5 backdrop-blur-2xl shadow-xl'
        }`}>
          <div className="flex items-center justify-between">
            
            {/* Brand Logo with Dynamic Neon Glow */}
            <Link to="/" className="flex items-center space-x-3.5 group">
              <div className="relative">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-xl shadow-amber-500/40 group-hover:scale-105 group-hover:shadow-amber-500/60 transition-all duration-300 border border-amber-300/40">
                  <Car className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0B0D10] animate-pulse" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center leading-none">
                  RIDE<span className="text-gold-gradient ml-0.5">GO</span>
                </span>
                <span className="block text-[9px] tracking-widest text-slate-400 font-extrabold uppercase mt-1 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-ping" />
                  Commercial Cabs
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 bg-slate-950/70 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 relative ${
                      active
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-lg shadow-amber-400/30 scale-[1.02]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Helpline & Animated Book CTA */}
            <div className="hidden lg:flex items-center space-x-3.5">
              
              {/* Dynamic 24/7 Helpline Pill with Equalizer */}
              <a
                href="tel:6267228958"
                className="flex items-center space-x-3 px-4 py-2 rounded-2xl bg-slate-900/95 border border-white/10 hover:border-amber-400/60 text-slate-200 transition-all hover:bg-slate-800/90 group shadow-md"
              >
                <div className="relative w-8 h-8 rounded-xl bg-amber-400/15 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                  <div className="absolute inset-0 rounded-xl bg-amber-400/25 animate-ping opacity-75" />
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">24/7 Helpline</span>
                    {/* Equalizer Wave */}
                    <div className="flex items-end space-x-0.5 h-3">
                      <span className="w-0.5 bg-emerald-400 rounded-full eq-bar-1" />
                      <span className="w-0.5 bg-emerald-400 rounded-full eq-bar-2" />
                      <span className="w-0.5 bg-emerald-400 rounded-full eq-bar-3" />
                      <span className="w-0.5 bg-emerald-400 rounded-full eq-bar-4" />
                    </div>
                  </div>
                  <span className="text-xs font-black tracking-wide text-white group-hover:text-amber-400 font-mono">
                    +91 62672 28958
                  </span>
                </div>
              </a>

              {/* Book Ride Button */}
              <Link
                to="/book-ride"
                className="btn-shimmer-gold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider flex items-center space-x-2 group"
              >
                <span>Book A Ride</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Mobile Menu Action Triggers */}
            <div className="flex md:hidden items-center space-x-2">
              <a
                href="tel:6267228958"
                className="p-2.5 rounded-2xl bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/30"
                aria-label="Call 24/7 Helpline"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-2xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </header>

        {/* Mobile Animated Glass Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 max-w-7xl mx-auto glass-island-elevated rounded-3xl p-5 space-y-3 shadow-2xl border border-amber-400/30 backdrop-blur-3xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>45+ Commercial Cabs Active</span>
              </div>
              <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                24×7 Available
              </span>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
                  isActive(link.path)
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-3 border-t border-white/10 space-y-2.5">
              <a
                href="tel:6267228958"
                className="flex items-center justify-center space-x-2 w-full py-3.5 rounded-2xl bg-slate-900 text-amber-400 font-black text-xs uppercase tracking-wider border border-white/10"
              >
                <Phone className="w-4 h-4" />
                <span>Call Helpline +91 62672 28958</span>
              </a>
              <a
                href="https://wa.me/916267228958?text=Hello%20RideGo%2C%20I%20want%20to%20book%20a%20cab."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 w-full py-3.5 rounded-2xl bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Booking</span>
              </a>
              <Link
                to="/book-ride"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-shimmer-gold block text-center w-full py-3.5 rounded-2xl text-xs uppercase tracking-wider"
              >
                Book A Ride Online
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Navbar;
