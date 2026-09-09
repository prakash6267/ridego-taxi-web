import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ArrowRight, Zap, Clock, DollarSign } from 'lucide-react';

const PopularRouteShortcuts = () => {
  const navigate = useNavigate();

  const routes = [
    {
      pickup: 'Indore Railway Station Junction',
      drop: 'Devi Ahilya Bai Holkar Airport',
      distance: '~9 KM',
      time: '~18 Mins',
      fareSedan: '₹150',
      badge: 'Airport Quick Hop'
    },
    {
      pickup: 'Vijay Nagar, Indore',
      drop: 'Mahakaleshwar Temple, Ujjain',
      distance: '~52 KM',
      time: '~50 Mins',
      fareSedan: '₹570',
      badge: 'Pilgrimage Special'
    },
    {
      pickup: 'Bhawarkua Square, Indore',
      drop: 'Omkareshwar Jyotirlinga',
      distance: '~78 KM',
      time: '~1.5 Hours',
      fareSedan: '₹830',
      badge: 'Holy River Darshan'
    },
    {
      pickup: 'Indore Central Hub',
      drop: 'Bhopal VIP Road / Lalghati',
      distance: '~190 KM',
      time: '~3.5 Hours',
      fareSedan: '₹1,950',
      badge: 'Highway Express'
    }
  ];

  const handleSelectRoute = (r) => {
    navigate('/book-ride', {
      state: {
        pickup: r.pickup,
        drop: r.drop
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="text-amber-400 text-xs font-black uppercase tracking-widest flex items-center">
            <Zap className="w-3.5 h-3.5 mr-1" />
            1-Click Route Estimator
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Popular Regional Corridors
          </h3>
        </div>
        <p className="text-xs text-slate-400">Click any route to instantly calculate live distance & choose car</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {routes.map((r, idx) => (
          <div
            key={idx}
            onClick={() => handleSelectRoute(r)}
            className="glass-card-hover p-6 rounded-3xl border border-white/10 shadow-xl cursor-pointer flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/20">
                {r.badge}
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
                  <p className="font-bold text-white line-clamp-1">{r.pickup}</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-400 mt-1 shrink-0" />
                  <p className="font-bold text-slate-300 line-clamp-1">{r.drop}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Sedan from</span>
                <span className="text-base font-black text-amber-400">{r.fareSedan}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-bold">{r.distance}</span>
                <span className="text-[10px] text-slate-300 font-semibold">{r.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularRouteShortcuts;
