import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, CheckCircle2, Car, ShieldCheck, Printer } from 'lucide-react';

const PdfReceiptGenerator = ({ booking }) => {
  const receiptRef = useRef(null);

  const handleDownloadPdf = async () => {
    if (!receiptRef.current) return;
    try {
      const element = receiptRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`TaxiGo_Receipt_${booking?.booking_code || 'Booking'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF receipt:', error);
      window.print();
    }
  };

  if (!booking) return null;

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          onClick={() => window.print()}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print</span>
        </button>
        <button
          onClick={handleDownloadPdf}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-400/20 transition-all hover:scale-105"
        >
          <Download className="w-4 h-4" />
          <span>Download Receipt PDF</span>
        </button>
      </div>

      {/* Printable / Renderable Receipt Document */}
      <div
        ref={receiptRef}
        className="p-8 sm:p-10 bg-white border border-slate-200 rounded-3xl shadow-sm text-slate-800 max-w-3xl mx-auto"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-slate-950 font-black">
              <Car className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                TAXI<span className="text-amber-500">GO</span>
              </h2>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Commercial Cab Invoice & Receipt
              </p>
            </div>
          </div>
          <div className="sm:text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-1">
              {booking.status || 'Confirmed'}
            </span>
            <p className="text-sm font-black text-slate-900">ID: {booking.booking_code}</p>
            <p className="text-xs text-slate-500">Issued: {new Date(booking.created_at || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Passenger & Trip Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-100 text-sm">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Passenger Information</h4>
            <p className="font-bold text-slate-900 text-base">{booking.passenger_name}</p>
            <p className="text-slate-600">Mobile: +91 {booking.passenger_phone}</p>
            {booking.passenger_email && <p className="text-slate-600">Email: {booking.passenger_email}</p>}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ride Schedule & Fleet</h4>
            <p className="font-bold text-slate-900">Date: {booking.ride_date} at {booking.ride_time}</p>
            <p className="text-slate-600">Vehicle: {booking.car?.name || 'Commercial Cab'} ({booking.car?.car_type || 'Standard'})</p>
            <p className="text-slate-600">
              Assigned Driver: {booking.driver ? `${booking.driver.name} (+91 ${booking.driver.phone})` : 'Assigned before pickup'}
            </p>
          </div>
        </div>

        {/* Route Details */}
        <div className="py-6 border-b border-slate-100 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Route Breakdown</h4>
          <div className="bg-slate-50 p-4 rounded-2xl space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 mt-1 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase block">Pickup Location</span>
                <p className="font-semibold text-slate-800">{booking.pickup_address}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="w-3 h-3 rounded-full bg-red-500 mt-1 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase block">Drop Location</span>
                <p className="font-semibold text-slate-800">{booking.drop_address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Table */}
        <div className="py-6 border-b border-slate-200">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Fare Breakdown</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase text-left">
                <th className="pb-2">Description</th>
                <th className="pb-2 text-center">Distance / Rate</th>
                <th className="pb-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 font-medium text-slate-800">Base Fare & Flag Down</td>
                <td className="py-3 text-center text-slate-500">Standard</td>
                <td className="py-3 text-right font-semibold">₹{booking.base_fare?.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-slate-800">Distance Charges</td>
                <td className="py-3 text-center text-slate-500">{booking.distance_km} km × ₹{booking.per_km_rate}/km</td>
                <td className="py-3 text-right font-semibold">₹{(booking.distance_km * booking.per_km_rate).toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-slate-800">Tolls, Taxes & Sanitization</td>
                <td className="py-3 text-center text-slate-500">Included</td>
                <td className="py-3 text-right font-semibold">₹0.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-900">
                <td colSpan="2" className="pt-4 text-base font-black text-slate-900 uppercase">Total Amount Paid</td>
                <td className="pt-4 text-right text-xl font-black text-amber-600">₹{booking.total_fare?.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Payment & Security Verification */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-2 text-emerald-600 font-semibold">
            <ShieldCheck className="w-5 h-5" />
            <span>Payment Verified ({booking.payment?.payment_method || 'UPI/QR'} - {booking.payment?.transaction_id || 'SUCCESS'})</span>
          </div>
          <div className="text-right">
            <p className="font-semibold text-slate-700">Support Helpline: +91 62672 28958</p>
            <p>Thank you for choosing TaxiGo Commercial Cabs!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfReceiptGenerator;
