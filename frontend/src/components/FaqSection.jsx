import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, MessageCircle, Sparkles } from 'lucide-react';

const faqs = [
  {
    question: 'How is the final taxi fare calculated?',
    answer: 'All fares are calculated strictly using our transparent formula: Base Fare + (Exact GPS Road Distance × Per-Km Rate). The distance is calculated in real time using OpenStreetMap route metering. There are zero hidden fees and no peak-traffic surge multipliers.'
  },
  {
    question: 'How do I pay and confirm my booking?',
    answer: 'You can pay instantly using UPI QR code scanning or copy our official UPI ID (6267228958@upi) from any UPI app (GPay, PhonePe, Paytm, BHIM). Once you submit the test/actual transaction reference ID, your booking code (e.g. RG83910) is generated with an instant downloadable PDF invoice.'
  },
  {
    question: 'Can I book an urgent cab in the middle of the night?',
    answer: 'Yes, absolutely. Our dispatch desk and commercial fleet operate 24 hours a day, 7 days a week, 365 days a year. You can book directly online or call our 24/7 helpline at +91 62672 28958 for immediate vehicle dispatch in under 15 minutes.'
  },
  {
    question: 'Are toll charges and state taxes included?',
    answer: 'For one-way intercity drops and airport transfers, standard route distance is included. Highway toll booth charges and state entry taxes (if applicable across state borders) can be settled directly with the chauffeur or included in corporate invoicing.'
  },
  {
    question: 'What is the cancellation and refund policy?',
    answer: 'You can cancel any booking free of charge up to 2 hours before the scheduled pickup time. In case of unexpected flight delays or emergencies, simply notify our 24/7 helpline and we will reschedule your cab at zero extra charge.'
  },
  {
    question: 'Are your chauffeurs background-verified and cars sanitized?',
    answer: 'Yes! Every chauffeur holds a valid commercial driving badge, police verification clearance, and minimum 5+ years of highway driving experience. Every car is deep-cleaned, air-conditioned, and GPS-tracked for maximum passenger safety.'
  }
];

const FaqSection = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? -1 : idx);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 text-amber-400 text-xs font-black uppercase tracking-widest">
          <HelpCircle className="w-4 h-4" />
          <span>Transparent Travel Policies</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Everything you need to know about booking, transparent fares, and commercial ride guarantees.
        </p>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'glass-island-elevated border-amber-400/40 shadow-xl'
                  : 'glass-card border-white/5 hover:border-white/15'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
              >
                <span className={`text-sm sm:text-base font-black ${
                  isOpen ? 'text-amber-400' : 'text-white'
                }`}>
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 ${
                  isOpen ? 'bg-amber-400 text-slate-950 rotate-180' : 'bg-slate-800 text-slate-400'
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="glass-card rounded-2xl p-6 text-center border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <h4 className="text-sm font-black text-white">Still have questions?</h4>
          <p className="text-xs text-slate-400">Speak directly with our dispatch manager.</p>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href="tel:6267228958"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-400 text-white font-bold text-xs"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>+91 62672 28958</span>
          </a>
          <a
            href="https://wa.me/916267228958?text=Hello%20RideGo%2C%20I%20have%20a%20question%20about%20taxi%20booking."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
