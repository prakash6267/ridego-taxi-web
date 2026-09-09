import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, 
  AlertCircle, Clock, ShieldCheck, Loader2, Sparkles 
} from 'lucide-react';
import { bookingApi } from '../api/bookingApi';
import SEO from '../components/SEO';
import Toast from '../components/Toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'error' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await bookingApi.submitContact(formData);
      setToast({
        message: 'Thank you! Your message has been received. Our dispatch team will contact you shortly.',
        type: 'success'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      });
    } catch (err) {
      console.error('Contact form submission error:', err);
      setToast({
        message: err.response?.data?.detail || 'Failed to send message. Please call our 24/7 helpline directly.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Contact RideGo | Taxi Booking & Support"
        description="Get in touch with RideGo 24x7 support team. Call +91 62672 28958 or send an inquiry for commercial cab bookings and outstation packages."
        schemaType="LocalBusiness"
      />

      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: 'error' })} 
      />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-amber-400 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>24/7 Helpline & Regional Dispatch</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Get in Touch With Us
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Have questions about an upcoming journey, outstation package, or corporate tie-up? We are here to assist you 24 hours a day.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <a
            href="tel:6267228958"
            className="glass-card-hover p-6 rounded-3xl border border-white/10 shadow-xl group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors mb-4">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-sm font-black text-white">Direct Phone Helpline</h3>
            <p className="text-[11px] text-slate-400 mt-1">24×7 Rapid Dispatch</p>
            <p className="text-sm font-black text-amber-400 mt-3">+91 62672 28958</p>
          </a>

          <a
            href="https://wa.me/916267228958?text=Hello%20RideGo%2C%20I%20have%20an%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card-hover p-6 rounded-3xl border border-white/10 shadow-xl group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors mb-4">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-white">WhatsApp Support</h3>
            <p className="text-[11px] text-slate-400 mt-1">Chat & Quick Inquiry</p>
            <p className="text-sm font-black text-emerald-400 mt-3">+91 62672 28958</p>
          </a>

          <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-400/10 text-blue-400 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-white">Official Email</h3>
            <p className="text-[11px] text-slate-400 mt-1">Invoicing & Inquiries</p>
            <p className="text-xs font-semibold text-slate-200 mt-3">contact@ridego.com</p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-400/10 text-purple-400 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-white">Head Office</h3>
            <p className="text-[11px] text-slate-400 mt-1">Fleet Operations Hub</p>
            <p className="text-xs font-semibold text-slate-200 mt-3">Central Ring Road, Indore, MP</p>
          </div>
        </div>

        {/* Contact Form & Coverage Information */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Form */}
          <div className="lg:col-span-7 glass-card p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-6">
            <div className="pb-4 border-b border-white/10">
              <h2 className="text-xl font-black text-white">Send Us a Direct Message</h2>
              <p className="text-xs text-slate-400 mt-1">Our support staff typically responds within 15 minutes.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Anand Sharma"
                    className="w-full px-4 py-3 bg-slate-900/90 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9826012345"
                    className="w-full px-4 py-3 bg-slate-900/90 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. anand@gmail.com"
                    className="w-full px-4 py-3 bg-slate-900/90 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Inquiry Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/90 border border-white/10 rounded-2xl text-white font-medium focus:outline-none focus:border-amber-400"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Airport Transfer Query">Airport Transfer Query</option>
                    <option value="Outstation Package">Outstation Package</option>
                    <option value="Corporate Tie-Up">Corporate Tie-Up</option>
                    <option value="Feedback / Complaint">Feedback / Complaint</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Message Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your travel itinerary, scheduled date, or query..."
                  className="w-full px-4 py-3 bg-slate-900/90 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full py-4 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Transmitting Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Regional Hubs & Dispatch */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl space-y-5">
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span>Primary Hub & Coverage Radius</span>
              </h3>
              
              <div className="space-y-4 text-xs text-slate-400">
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-white/5 space-y-1">
                  <h4 className="font-bold text-white text-xs">Central India Hub</h4>
                  <p>Indore (HQ), Ujjain (Mahakaleshwar), Omkareshwar, Bhopal, Dewas, Dhar, Pithampur Industrial Corridor.</p>
                </div>

                <div className="p-4 bg-slate-900/90 rounded-2xl border border-white/5 space-y-1">
                  <h4 className="font-bold text-white text-xs">Intercity Corridors</h4>
                  <p>Daily direct highway cabs to Ahmedabad, Surat, Pune, Mumbai, Jaipur, and Nagpur.</p>
                </div>

                <div className="flex items-center space-x-2.5 text-xs text-amber-400 pt-2 font-bold">
                  <Clock className="w-4 h-4" />
                  <span>24 Hours a Day / 365 Days a Year</span>
                </div>
              </div>
            </div>

            {/* Helpline Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent border border-amber-400/30 text-center space-y-3">
              <h4 className="font-black text-white text-base">Need An Immediate Taxi?</h4>
              <p className="text-xs text-slate-400">Call our direct booking dispatch line right now.</p>
              <a
                href="tel:6267228958"
                className="btn-gold inline-flex items-center space-x-2 px-6 py-3 rounded-2xl text-xs uppercase tracking-wider"
              >
                <Phone className="w-4 h-4" />
                <span>+91 62672 28958</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactPage;
