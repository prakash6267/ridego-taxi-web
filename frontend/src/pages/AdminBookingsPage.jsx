import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, CheckCircle2, XCircle, UserCheck, Trash2, 
  Eye, Calendar, Clock, MapPin, Car, Phone, ShieldCheck, Loader2 
} from 'lucide-react';
import { adminApi } from '../api/adminApi';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Driver Assignment Modal
  const [selectedBookingForDriver, setSelectedBookingForDriver] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Details Modal
  const [viewingBooking, setViewingBooking] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const [bData, dData] = await Promise.all([
        adminApi.getBookings({ status: statusFilter, search: searchTerm }),
        adminApi.getAllDrivers()
      ]);
      setBookings(bData);
      setDrivers(dData.filter(d => d.is_active));
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await adminApi.updateBookingStatus(bookingId, newStatus);
      fetchBookings();
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleAssignDriver = async (e) => {
    e.preventDefault();
    if (!selectedBookingForDriver || !selectedDriverId) return;
    setAssigning(true);
    try {
      await adminApi.assignDriver(selectedBookingForDriver.id, Number(selectedDriverId));
      setSelectedBookingForDriver(null);
      setSelectedDriverId('');
      fetchBookings();
    } catch (err) {
      alert('Failed to assign driver: ' + (err.response?.data?.detail || err.message));
    } finally {
      setAssigning(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to permanently delete this booking?')) return;
    try {
      await adminApi.deleteBooking(bookingId);
      fetchBookings();
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Booking Management</h1>
          <p className="text-xs text-slate-500 mt-1">Review trip status, assign chauffeurs, and manage customer rides</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500">Filter:</span>
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Booking ID, Passenger Name, Phone, or Location..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-400 font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">ID & Date</th>
                <th className="p-4">Passenger Details</th>
                <th className="p-4">Pickup / Drop</th>
                <th className="p-4">Vehicle & Distance</th>
                <th className="p-4">Total Fare</th>
                <th className="p-4">Driver</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                    <span>Loading bookings...</span>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-400">
                    No bookings found matching current filter.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-black text-slate-900 block text-xs">{b.booking_code}</span>
                      <span className="text-[10px] text-slate-400">{b.ride_date} {b.ride_time}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{b.passenger_name}</p>
                      <p className="text-[10px] text-slate-500 flex items-center mt-0.5">
                        <Phone className="w-3 h-3 mr-1 text-slate-400" /> {b.passenger_phone}
                      </p>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="font-medium text-slate-800 truncate" title={b.pickup_address}>
                        <span className="text-emerald-600 font-bold mr-1">P:</span>{b.pickup_address}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5" title={b.drop_address}>
                        <span className="text-red-600 font-bold mr-1">D:</span>{b.drop_address}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800">{b.car?.name || 'Cab'}</span>
                      <span className="block text-[10px] text-slate-400">
                        {b.distance_km} km @ ₹{b.per_km_rate}/km
                      </span>
                    </td>
                    <td className="p-4 font-black text-slate-900 text-sm">
                      ₹{b.total_fare}
                    </td>
                    <td className="p-4">
                      {b.driver ? (
                        <div>
                          <p className="font-bold text-slate-800">{b.driver.name}</p>
                          <p className="text-[10px] text-slate-400">{b.driver.phone}</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedBookingForDriver(b);
                            setSelectedDriverId(drivers[0]?.id || '');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-[10px] transition-colors"
                        >
                          + Assign Driver
                        </button>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        b.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                        b.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        b.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                      {b.status !== 'Completed' && b.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'Completed')}
                          title="Mark Completed"
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      {b.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'Cancelled')}
                          title="Cancel Booking"
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteBooking(b.id)}
                        title="Delete Record"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Driver Assignment Modal */}
      {selectedBookingForDriver && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-amber-500" />
                <span>Assign Driver to {selectedBookingForDriver.booking_code}</span>
              </h3>
              <button
                onClick={() => setSelectedBookingForDriver(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignDriver} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Select Chauffeur
                </label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-amber-400 font-medium"
                >
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.phone}) - {d.vehicle_model || 'Standard'} [Rating: {d.rating}★]
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForDriver(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigning}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md"
                >
                  {assigning ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingsPage;
