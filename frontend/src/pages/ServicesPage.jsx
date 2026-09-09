import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plane, Compass, MapPin, Repeat, Building, HeartHandshake, 
  Clock, ShieldCheck, ArrowRight, CheckCircle2, Phone, Star, Sparkles, ChevronRight
} from 'lucide-react';
import SEO from '../components/SEO';

const ServicesPage = () => {
  const services = [
    {
      id: 'airport',
      title: 'Airport Transfers',
      icon: Plane,
      badge: 'Zero Waiting Fee',
      description: 'Guaranteed on-time pickups and drops to and from Devi Ahilya Bai Holkar Airport (Indore) and regional terminals. Flight delay tracking included.',
      features: ['Flight delay monitoring', 'Doorstep luggage assistance', 'Meet & Greet service', 'Fixed upfront airport pricing']
    },
    {
      id: 'local',
      title: 'Local City Taxi & Hourly Rentals',
      icon: Compass,
      badge: '4hr / 8hr / 12hr Packages',
      description: 'Point-to-point city transfers or dedicated hourly cab rental for shopping, client meetings, and sightseeing across town.',
      features: ['Flexible stopovers', 'Clean air-conditioned fleet', 'Affordable minimum fares', 'Experienced local chauffeurs']
    },
    {
      id: 'outstation',
      title: 'Outstation Intercity Cabs',
      icon: MapPin,
      badge: 'Pan-India Corridors',
      description: 'Comfortable long-distance journeys connecting Indore to Ujjain, Omkareshwar, Bhopal, Ahmedabad, Pune, and neighboring states.',
      features: ['Distance-based toll calculations', 'Well-maintained highway sedans & SUVs', 'Comfortable rest stops', 'Experienced highway chauffeurs']
    },
    {
      id: 'oneway',
      title: 'One-Way Intercity Drops',
      icon: ArrowRight,
      badge: 'Pay Only One-Way',
      description: 'Save up to 40% on outstation travel by paying only for one-way distance without paying return fare charges.',
      features: ['No return fare penalty', 'Available on all major highway routes', 'Instant digital booking confirmation', 'Free cancellation up to 2 hours prior']
    },
    {
      id: 'roundtrip',
      title: 'Round-Trip Weekend Tours',
      icon: Repeat,
      badge: 'Multi-Day Itineraries',
      description: 'Plan seamless religious pilgrimages, family holidays, or weekend road trips with dedicated chauffeur and vehicle staying with you.',
      features: ['Driver daily allowance included', 'Multi-city itinerary support', 'Transparent night halt charges', 'Spacious 6/7 seater SUVs']
    },
    {
      id: 'corporate',
      title: 'Corporate & Business Travel',
      icon: Building,
      badge: 'GST Invoicing Available',
      description: 'Executive mobility solutions with premium sedans and luxury SUVs for corporate clients, VIP delegations, and business summits.',
      features: ['Consolidated monthly billing', 'Priority 24x7 helpline', 'Formal chauffeur attire', 'Instant GST tax invoice']
    },
    {
      id: 'wedding',
      title: 'Wedding & Event Fleet',
      icon: HeartHandshake,
      badge: 'Decorated Fleet',
      description: 'Coordinated convoy and guest logistics for royal weddings, family functions, conferences, and mega events.',
      features: ['Dedicated fleet coordinator', 'Decorated luxury bridal cars', 'Bulk tempo & SUV dispatch', '24/7 on-ground standby']
    },
    {
      id: '247',
      title: '24×7 Emergency & Night Cabs',
      icon: Clock,
      badge: 'Rapid Response',
      description: 'Round-the-clock emergency medical runs, late-night train connections, and early morning pickups with rapid response dispatch.',
      features: ['Under 15-minute emergency pickup', 'SOS safety tracking', 'Active phone helpline 6267228958', 'Reliable night-time service']
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0D10] text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Taxi Services | Airport, Local & Outstation | RideGo"
        description="Explore our complete commercial cab services: airport transfers, local city rentals, outstation cabs, one-way drops, corporate mobility, and wedding convoys."
        schemaType="TaxiService"
      />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-amber-400 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Tailored Commercial Mobility</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Our Taxi Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            From quick city hops to multi-day intercity tours, our commercial cab fleet delivers safe, transparently metered, and comfortable journeys.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="glass-card-hover rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-amber-400">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
                    {srv.description}
                  </p>

                  <div className="space-y-2 border-t border-white/5 pt-4 mb-6">
                    {srv.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center text-xs text-slate-300 space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/book-ride"
                  className="w-full py-3 rounded-2xl bg-slate-900 border border-white/10 group-hover:bg-amber-400 group-hover:text-slate-950 group-hover:border-amber-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md"
                >
                  <span>Book Service</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Need Custom Corporate or Convoy Booking?</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto mb-8">
            Speak directly with our logistics manager to set up monthly corporate billing, wedding fleet logistics, or customized outstation tour packages.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:6267228958"
              className="btn-gold px-8 py-4 rounded-2xl text-xs uppercase tracking-wider flex items-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call +91 62672 28958</span>
            </a>
            <Link
              to="/contact"
              className="btn-dark px-8 py-4 rounded-2xl text-xs uppercase tracking-wider font-bold"
            >
              Inquire via Contact Form
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServicesPage;
