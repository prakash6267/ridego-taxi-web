import React, { useState, useEffect } from 'react';
import { Car, X, ShieldCheck, CheckCircle, Sparkles } from 'lucide-react';

const bookingsFeed = [
  { name: 'Rahul S.', car: 'Innova Crysta', route: 'Indore ➔ Ujjain Mahakal', time: '2 mins ago', type: 'Outstation' },
  { name: 'Dr. Priya V.', car: 'Swift Dzire', route: 'Vijay Nagar ➔ Airport', time: '4 mins ago', type: 'Airport Drop' },
  { name: 'Vikram Mehta', car: 'Maruti Ertiga', route: 'Indore ➔ Omkareshwar', time: '6 mins ago', type: 'Pilgrimage' },
  { name: 'Sunil J.', car: 'Toyota Innova', route: 'Indore ➔ Bhopal VIP Corridor', time: '8 mins ago', type: 'One-Way Drop' },
  { name: 'Ananya M.', car: 'Swift Dzire', route: 'Palasia ➔ Bypass Hub', time: '11 mins ago', type: 'City Taxi' },
  { name: 'Kavita Agarwal', car: 'Innova Crysta', route: 'Indore ➔ Maheshwar Fort', time: '14 mins ago', type: 'Tour Package' }
];

const LiveBookingToasts = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // Show initial toast after 3 seconds
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    // Cycle every 9 seconds
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % bookingsFeed.length);
        setVisible(true);
      }, 700);
    }, 9000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [dismissed]);

  if (dismissed || !visible) return null;

  const current = bookingsFeed[currentIdx];

  return (
    <div className="fixed bottom-6 left-5 sm:left-6 z-40 max-w-sm pointer-events-auto transition-all duration-500 transform animate-float-slow">
      <div className="glass-island-elevated p-3.5 sm:p-4 rounded-2xl border border-amber-400/30 shadow-2xl flex items-center space-x-3.5 backdrop-blur-xl">
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30">
            <Car className="w-5 h-5" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#07090C] animate-pulse" />
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center space-x-1.5 text-[10px] font-bold text-amber-400">
            <Sparkles className="w-3 h-3" />
            <span className="uppercase tracking-wider">Live Booking Confirmed</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 font-normal">{current.time}</span>
          </div>

          <p className="text-xs font-black text-white truncate mt-0.5">
            {current.name} booked {current.car}
          </p>

          <p className="text-[11px] text-slate-300 font-medium truncate flex items-center space-x-1">
            <span className="text-emerald-400 font-bold">{current.route}</span>
          </p>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          aria-label="Dismiss Notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default LiveBookingToasts;
