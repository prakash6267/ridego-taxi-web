import React, { useState } from 'react';
import { Phone, MessageCircle } from 'lucide-react';

const FloatingActionButtons = ({ bookingDetails = {} }) => {
  const phone = "6267228958";
  
  const getWhatsAppUrl = () => {
    let message = "Hello RideGo, I want to inquire/book a commercial cab.";
    if (bookingDetails.name || bookingDetails.pickup) {
      message = `Hello RideGo,\nI would like to book a cab:\n- Name: ${bookingDetails.name || 'Passenger'}\n- Pickup: ${bookingDetails.pickup || 'Location'}\n- Drop: ${bookingDetails.drop || 'Location'}\n- Date: ${bookingDetails.date || 'Today'}\n- Time: ${bookingDetails.time || 'Immediate'}`;
    }
    return `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed bottom-6 right-5 sm:right-6 z-40 flex flex-col items-end space-y-3 pointer-events-auto">
      {/* WhatsApp Floating Action */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300 border border-emerald-300/40"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        <span className="hidden sm:block absolute right-16 px-3.5 py-1.5 rounded-xl bg-slate-900/95 text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-2xl border border-white/10">
          WhatsApp Us
        </span>
      </a>

      {/* Call Floating Action */}
      <a
        href={`tel:${phone}`}
        aria-label="Call 24/7 Helpline"
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 rounded-full shadow-2xl shadow-amber-500/50 hover:scale-110 active:scale-95 transition-all duration-300 border border-amber-300/60 animate-pulse-glow"
      >
        <Phone className="w-6 h-6 sm:w-7 sm:h-7 font-black" />
        <span className="hidden sm:block absolute right-16 px-3.5 py-1.5 rounded-xl bg-slate-900/95 text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-2xl border border-white/10">
          Call +91 62672 28958
        </span>
      </a>
    </div>
  );
};

export default FloatingActionButtons;
