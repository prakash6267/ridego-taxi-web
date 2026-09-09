import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import PdfReceiptGenerator from '../components/PdfReceiptGenerator';
import SEO from '../components/SEO';
import Toast from '../components/Toast';
import { Search, Loader2, AlertCircle, ArrowLeft, Car, Sparkles } from 'lucide-react';

const BookingDetailsPage = () => {
  const { code } = useParams();
  const [searchCode, setSearchCode] = useState(code || '');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(!!code);
  const [toastMsg, setToastMsg] = useState('');

  const fetchBooking = async (bCode) => {
    if (!bCode) return;
    setLoading(true);
    setToastMsg('');
    try {
      const data = await bookingApi.getBooking(bCode.trim());
      setBooking(data);
    } catch (err) {
      console.error('Booking lookup error:', err);
      setToastMsg('No booking record found for the provided ID. Please verify your reference number.');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) {
      fetchBooking(code);
    }
  }, [code]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooking(searchCode);
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Track Booking & Invoice Receipt | RideGo"
        description="Lookup your RideGo commercial booking details, view driver assignment status, and download your official PDF invoice receipt."
      />

      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top bar navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <div className="inline-flex items-center space-x-2 text-amber-400 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Booking & Invoice Portal</span>
          </div>
        </div>

        {/* Lookup Box */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Search By Booking Reference ID
          </label>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="e.g. RG20260909125..."
                className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-white/10 rounded-2xl text-white text-xs focus:outline-none focus:border-amber-400 font-mono font-bold"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-gold px-8 py-3 rounded-2xl text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Track Trip'}
            </button>
          </form>
        </div>

        {loading && (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Retrieving booking receipt...</p>
          </div>
        )}

        {booking && !loading && (
          <div className="space-y-6 animate-fadeIn">
            <PdfReceiptGenerator booking={booking} />
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingDetailsPage;
