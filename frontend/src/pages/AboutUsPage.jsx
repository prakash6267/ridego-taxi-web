import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Award, Users, Car, CheckCircle2, HeartHandshake, 
  MapPin, Clock, Phone, Sparkles, TrendingUp, ChevronRight
} from 'lucide-react';
import SEO from '../components/SEO';
import AnimatedNumber from '../components/AnimatedNumber';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-[#0B0D10] text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="About RideGo | Professional Taxi Service"
        description="Learn about RideGo's mission, commercial fleet standards, verified chauffeurs, and commitment to transparent distance-based fares."
        schemaType="Organization"
      />

      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 text-amber-400 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Our Journey & Operational Excellence</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Setting the Benchmark in Commercial Fleet Mobility
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            RideGo was founded to bring absolute transparency, verified passenger safety, and dependable punctuality to commercial cab transport across Central India.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 text-center shadow-xl">
            <div className="text-3xl sm:text-4xl font-black text-amber-400">
              <AnimatedNumber value={10000} suffix="+" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Completed Trips</p>
          </div>
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 text-center shadow-xl">
            <div className="text-3xl sm:text-4xl font-black text-white">
              4.9 <span className="text-amber-400 text-2xl">★</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Passenger Rating</p>
          </div>
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 text-center shadow-xl">
            <div className="text-3xl sm:text-4xl font-black text-amber-400">
              <AnimatedNumber value={100} suffix="%" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Verified Chauffeurs</p>
          </div>
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 text-center shadow-xl">
            <div className="text-3xl sm:text-4xl font-black text-white">
              24 / 7
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Helpline Dispatch</p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-amber-400 text-xs font-black uppercase tracking-widest">Our Core Mission</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Safe, Transparent & Accessible Cab Service
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We eliminate the frustration of arbitrary driver surcharges, unmetered rates, and cancellations. By combining automatic route distance calculation with database-driven per-kilometer tariffs, we ensure that every customer knows exactly what they are paying for before embarking on their journey.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Zero hidden surge pricing during peak hours, rush traffic, or rainfall.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Instant commercial invoices and receipts for smooth tax and business reimbursements.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Direct phone helpline +91 62672 28958 manned by local dispatchers around the clock.
                </p>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1000&q=80"
              alt="Fleet Chauffeurs"
              className="w-full h-96 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-transparent to-transparent flex items-end p-8">
              <div className="text-white">
                <p className="font-black text-lg">Professional Chauffeur Standards</p>
                <p className="text-xs text-slate-400">Background-checked, well-mannered, and GPS equipped.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quality Standards */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-8 border border-white/10 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-amber-400 text-xs font-black uppercase tracking-widest">Our Fleet Guarantees</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">How We Maintain Elite Fleet Standards</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/5 space-y-3">
              <ShieldCheck className="w-8 h-8 text-amber-400" />
              <h3 className="text-base font-bold text-white">1. Chauffeur Screening</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All drivers undergo commercial badge verification, police background clearance, and customer etiquette training.
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/5 space-y-3">
              <Car className="w-8 h-8 text-amber-400" />
              <h3 className="text-base font-bold text-white">2. Daily Vehicle Inspection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every cab in our fleet undergoes daily cleaning, tire inspection, brake assessment, and air-conditioning performance checks.
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/5 space-y-3">
              <Clock className="w-8 h-8 text-amber-400" />
              <h3 className="text-base font-bold text-white">3. Punctuality Promise</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our smart dispatch algorithm ensures your assigned cab arrives at least 10 minutes prior to outstation and airport pickup times.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Experience the RideGo Standard</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/book-ride"
              className="btn-gold px-8 py-4 rounded-2xl text-xs uppercase tracking-wider flex items-center space-x-2"
            >
              <span>Book Your Cab Today</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:6267228958"
              className="btn-dark px-8 py-4 rounded-2xl text-xs uppercase tracking-wider font-bold flex items-center space-x-2"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call Helpline +91 62672 28958</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUsPage;
