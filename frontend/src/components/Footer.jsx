import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Car, ShieldCheck, Clock, MessageCircle, 
  ChevronRight, Sparkles, Zap, Award, ArrowUp, Copy, Check, Send
} from 'lucide-react';

const Footer = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailSubscribed, setEmailSubscribed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const currentScroll = window.scrollY;
      if (totalScroll > 0) {
        setScrollProgress((currentScroll / totalScroll) * 100);
      }
      setShowScrollTop(currentScroll > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('6267228958');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setEmailSubscribed(true);
    setTimeout(() => {
      setEmailInput('');
      setEmailSubscribed(false);
    }, 4000);
  };

  const regionalHubs = [
    { name: 'Indore (HQ)', activeCabs: '22 Cabs', status: 'Optimal' },
    { name: 'Ujjain Mahakal', activeCabs: '8 Cabs', status: 'Optimal' },
    { name: 'Bhopal VIP Road', activeCabs: '6 Cabs', status: 'Optimal' },
    { name: 'Omkareshwar', activeCabs: '4 Cabs', status: 'Standby' },
    { name: 'DABH Airport', activeCabs: '5 Cabs', status: 'Instant' },
    { name: 'Pithampur SEZ', activeCabs: '3 Cabs', status: 'Standby' },
  ];

  return (
    <footer className="bg-[#050608] text-slate-400 border-t border-white/10 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Giant stylized watermark in background */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[120px] sm:text-[200px] font-black text-white/[0.012] select-none pointer-events-none whitespace-nowrap tracking-tighter">
        RIDEGO FLEET
      </div>

      {/* ========================================================
          1. CONTINUOUS LIVE ROUTE TELEMETRY MARQUEE
          ======================================================== */}
      <div className="bg-[#090C12] border-b border-white/5 py-3 overflow-hidden">
        <div className="flex animate-marquee-smooth items-center space-x-8 text-xs font-bold whitespace-nowrap">
          <div className="flex items-center space-x-2 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="uppercase tracking-widest text-[10px]">LIVE CORRIDORS:</span>
          </div>
          <span className="text-slate-300">✈️ Indore ⇄ DABH Airport (12 km • ~15 mins)</span>
          <span className="text-amber-400">🛕 Indore ⇄ Ujjain Mahakal (55 km • ₹10/km)</span>
          <span className="text-slate-300">🌊 Indore ⇄ Omkareshwar Jyotirlinga (78 km • ₹12/km)</span>
          <span className="text-amber-400">🏛️ Indore ⇄ Bhopal VIP Corridor (195 km • ₹10/km)</span>
          <span className="text-slate-300">🏰 Indore ⇄ Mandu Heritage Fortress (95 km • ₹12/km)</span>
          <span className="text-amber-400">🏢 Indore ⇄ Pithampur Industrial Hub (35 km • ₹10/km)</span>
          
          {/* Repeat for seamless loop */}
          <div className="flex items-center space-x-2 text-amber-400 pl-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="uppercase tracking-widest text-[10px]">LIVE CORRIDORS:</span>
          </div>
          <span className="text-slate-300">✈️ Indore ⇄ DABH Airport (12 km • ~15 mins)</span>
          <span className="text-amber-400">🛕 Indore ⇄ Ujjain Mahakal (55 km • ₹10/km)</span>
          <span className="text-slate-300">🌊 Indore ⇄ Omkareshwar Jyotirlinga (78 km • ₹12/km)</span>
          <span className="text-amber-400">🏛️ Indore ⇄ Bhopal VIP Corridor (195 km • ₹10/km)</span>
        </div>
      </div>

      {/* ========================================================
          2. INSTANT VIP ACTION & NEWSLETTER STRIP
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="glass-island-elevated rounded-3xl p-8 sm:p-10 border border-amber-400/20 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 text-amber-400 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Priority Commercial Taxi Dispatch</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready for a Seamless Journey?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
              Book online with automatic distance calculation or call our 24/7 helpline for instant cab dispatch.
            </p>
          </div>

          {/* Quick Newsletter / Fare Alert Form */}
          <div className="w-full lg:w-auto">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative min-w-[280px]">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="Enter email for VIP fare alerts..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium transition-colors"
                />
              </div>
              <button
                type="submit"
                className="btn-shimmer-gold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shrink-0"
              >
                {emailSubscribed ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950 font-bold" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <span>Get Alerts</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* ========================================================
          3. REGIONAL HUBS LIVE STATUS STRIP
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center space-x-2">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>Active Regional Fleet Hubs:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {regionalHubs.map((hub, idx) => (
            <div
              key={idx}
              className="glass-card p-3 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-amber-400/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate">{hub.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-2">
                <span className="text-amber-400 font-bold">{hub.activeCabs}</span>
                <span className="text-emerald-400">{hub.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          4. MAIN FOOTER CONTENT & DIRECTORY
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-xl shadow-amber-500/30">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white flex items-center">
                  RIDE<span className="text-gold-gradient ml-0.5">GO</span>
                </span>
                <span className="block text-[9px] tracking-widest text-slate-400 font-bold uppercase -mt-1">
                  Commercial Fleet Operations
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-medium">
              Government-licensed commercial taxi fleet operator providing transparent GPS distance metering, verified chauffeurs, zero peak surges, and immediate PDF invoice receipts.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold">
              <span className="flex items-center text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4 mr-1.5" /> Govt. Licensed
              </span>
              <span className="flex items-center text-amber-400 bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-500/20">
                <Clock className="w-4 h-4 mr-1.5" /> 24×7 Active Fleet
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 border-l-2 border-amber-400 pl-3">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><Link to="/" className="hover:text-amber-400 transition-colors flex items-center"><span>Home</span></Link></li>
              <li><Link to="/book-ride" className="hover:text-amber-400 transition-colors flex items-center"><span>Book Online</span></Link></li>
              <li><Link to="/services" className="hover:text-amber-400 transition-colors flex items-center"><span>Fleet Services</span></Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition-colors flex items-center"><span>About RideGo</span></Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition-colors flex items-center"><span>Contact Support</span></Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 border-l-2 border-amber-400 pl-3">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><Link to="/services" className="hover:text-amber-400 transition-colors">Airport Transfers</Link></li>
              <li><Link to="/services" className="hover:text-amber-400 transition-colors">Local City Taxi</Link></li>
              <li><Link to="/services" className="hover:text-amber-400 transition-colors">Outstation Cabs</Link></li>
              <li><Link to="/services" className="hover:text-amber-400 transition-colors">One-Way Drops</Link></li>
              <li><Link to="/services" className="hover:text-amber-400 transition-colors">Corporate Mobility</Link></li>
              <li><Link to="/services" className="hover:text-amber-400 transition-colors">Wedding Convoys</Link></li>
            </ul>
          </div>

          {/* Direct VIP Contact Desk */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 border-l-2 border-amber-400 pl-3">
              Direct Contact
            </h4>
            <ul className="space-y-3.5 text-xs">
              
              {/* Phone with 1-click copy */}
              <li className="flex items-start space-x-2.5">
                <Phone className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">24/7 Helpline</span>
                  <div className="flex items-center space-x-2">
                    <a href="tel:6267228958" className="hover:text-amber-400 font-black text-white text-sm font-mono">
                      +91 62672 28958
                    </a>
                    <button
                      onClick={handleCopyPhone}
                      className="text-slate-400 hover:text-amber-400 p-1 rounded transition-colors"
                      title="Copy phone number"
                    >
                      {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </li>

              {/* WhatsApp */}
              <li className="flex items-start space-x-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">WhatsApp Dispatch</span>
                  <a href="https://wa.me/916267228958" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 font-bold text-slate-200">
                    +91 62672 28958
                  </a>
                </div>
              </li>

              {/* Email */}
              <li className="flex items-start space-x-2.5">
                <Mail className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Email Inquiries</span>
                  <span className="text-slate-200 font-medium">contact@ridego.com</span>
                </div>
              </li>

              {/* Central Hub */}
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Central Hub</span>
                  <span className="text-slate-300">Central Ring Road, Indore, MP - 452001</span>
                </div>
              </li>

            </ul>
          </div>

        </div>

        {/* Trust Badges Bar */}
        <div className="border-t border-white/5 mt-12 pt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">ISO 9001:2015</p>
              <p className="text-[10px] text-slate-400">Quality Certified Fleet</p>
            </div>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-center space-x-3">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Govt. Verified</p>
              <p className="text-[10px] text-slate-400">Commercial Badge Drivers</p>
            </div>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-center space-x-3">
            <Zap className="w-5 h-5 text-yellow-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Zero Peak Surge</p>
              <p className="text-[10px] text-slate-400">Transparent Km Pricing</p>
            </div>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-center space-x-3">
            <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">100% On-Time</p>
              <p className="text-[10px] text-slate-400">Punctuality Guarantee</p>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="border-t border-white/5 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RideGo Commercial Cabs. All rights reserved.</p>
          <div className="flex items-center space-x-6 font-semibold">
            <span>Automatic Road Distance Meter</span>
            <span>Zero Hidden Surcharges</span>
            <span>Instant PDF Receipt</span>
          </div>
        </div>

      </div>

      {/* ========================================================
          5. RADIAL SCROLL PROGRESS & BACK TO TOP BUTTON
          ======================================================== */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-24 right-5 sm:right-6 z-40 w-12 h-12 rounded-full glass-island-elevated flex items-center justify-center text-amber-400 hover:text-white shadow-2xl transition-all duration-300 hover:scale-110 group"
        >
          {/* Circular SVG Progress Ring */}
          <svg className="w-12 h-12 absolute inset-0 -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="transparent"
              className="text-slate-800"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="transparent"
              strokeDasharray="125.6"
              strokeDashoffset={125.6 - (125.6 * scrollProgress) / 100}
              className="text-amber-400 transition-all duration-150"
            />
          </svg>
          <ArrowUp className="w-5 h-5 relative z-10 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

    </footer>
  );
};

export default Footer;
