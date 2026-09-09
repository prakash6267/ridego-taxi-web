import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarCheck, Clock, CheckCircle2, XCircle, AlertTriangle, 
  DollarSign, Car, Users, MessageSquare, ArrowRight, RefreshCw, ShieldAlert 
} from 'lucide-react';
import { adminApi } from '../api/adminApi';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, bookingsData] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getBookings({ limit: 5 })
      ]);
      setStats(statsData);
      setRecentBookings(bookingsData);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Operations Dashboard</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Live fleet metrics, bookings, revenue, and system health</p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-sm hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Mandatory Unresolved Errors Alert if any */}
      {stats?.unresolved_errors_count > 0 && (
        <div className="bg-red-500 text-white p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-red-600 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-base">
                {stats.unresolved_errors_count} Unresolved System Errors Detected
              </h4>
              <p className="text-xs text-red-100">
                Check the system logs to inspect API exceptions or client reported errors.
              </p>
            </div>
          </div>
          <Link
            to="/admin/system-logs"
            className="px-4 py-2 rounded-xl bg-white text-red-600 font-black text-xs uppercase tracking-wider hover:bg-red-50 transition-colors shadow-md"
          >
            Review Logs
          </Link>
        </div>
      )}

      {/* 8 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Bookings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats?.total_bookings || 0}</p>
          <div className="flex items-center space-x-3 text-xs text-slate-500 pt-1">
            <span>Pending: <strong className="text-amber-600">{stats?.pending_bookings || 0}</strong></span>
            <span>Confirmed: <strong className="text-blue-600">{stats?.confirmed_bookings || 0}</strong></span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-600">₹{stats?.total_revenue?.toLocaleString() || '0'}</p>
          <p className="text-xs text-slate-500 pt-1">Completed: <strong className="text-emerald-600">{stats?.completed_bookings || 0}</strong> rides</p>
        </div>

        {/* Fleet & Drivers */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Fleet</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats?.active_cars_count || 0}</p>
          <p className="text-xs text-slate-500 pt-1">Drivers on Standby: <strong className="text-slate-900">{stats?.available_drivers_count || 0}</strong></p>
        </div>

        {/* Unresolved System Logs */}
        <div className={`p-6 rounded-3xl border shadow-sm space-y-2 ${stats?.unresolved_errors_count > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Errors</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stats?.unresolved_errors_count > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-3xl font-black ${stats?.unresolved_errors_count > 0 ? 'text-red-600' : 'text-slate-900'}`}>
            {stats?.unresolved_errors_count || 0}
          </p>
          <Link to="/admin/system-logs" className="text-xs font-bold text-amber-600 hover:underline inline-block pt-1">
            Manage Error Logs →
          </Link>
        </div>

      </div>

      {/* Recent Bookings Overview Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">Recent Customer Bookings</h3>
            <p className="text-xs text-slate-500">Latest dispatched and incoming reservations</p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center space-x-1"
          >
            <span>View All Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-3">Booking ID</th>
                <th className="p-3">Passenger</th>
                <th className="p-3">Route (Pickup → Drop)</th>
                <th className="p-3">Car & Rate</th>
                <th className="p-3">Total Fare</th>
                <th className="p-3">Status</th>
                <th className="p-3">Driver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">
                    No bookings recorded yet.
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">{b.booking_code}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-800">{b.passenger_name}</p>
                      <p className="text-[10px] text-slate-400">{b.passenger_phone}</p>
                    </td>
                    <td className="p-3 max-w-xs truncate">
                      <p className="font-medium text-slate-800">{b.pickup_address}</p>
                      <p className="text-[10px] text-slate-400">to {b.drop_address}</p>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-700">{b.car?.name || 'Cab'}</span>
                      <span className="block text-[10px] text-slate-400">₹{b.per_km_rate}/km ({b.distance_km} km)</span>
                    </td>
                    <td className="p-3 font-bold text-slate-950 text-sm">₹{b.total_fare}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        b.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                        b.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        b.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {b.driver ? (
                        <span className="font-semibold text-slate-800">{b.driver.name}</span>
                      ) : (
                        <span className="text-amber-600 font-bold text-[10px]">Unassigned</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
