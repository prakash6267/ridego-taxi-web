import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Edit2, Trash2, Phone, Award, ShieldCheck, 
  CheckCircle2, XCircle, Loader2, Save, X 
} from 'lucide-react';
import { adminApi } from '../api/adminApi';

const AdminDriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    license_number: '',
    vehicle_model: '',
    rating: 4.9,
    status: 'Available',
    is_active: true
  });

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllDrivers();
      setDrivers(data);
    } catch (err) {
      console.error('Error fetching drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const openAddModal = () => {
    setEditingDriver(null);
    setFormData({
      name: '',
      phone: '',
      license_number: '',
      vehicle_model: '',
      rating: 4.9,
      status: 'Available',
      is_active: true
    });
    setModalOpen(true);
  };

  const openEditModal = (driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      phone: driver.phone,
      license_number: driver.license_number || '',
      vehicle_model: driver.vehicle_model || '',
      rating: driver.rating,
      status: driver.status || 'Available',
      is_active: driver.is_active
    });
    setModalOpen(true);
  };

  const handleSaveDriver = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingDriver) {
        await adminApi.updateDriver(editingDriver.id, formData);
      } else {
        await adminApi.createDriver(formData);
      }
      setModalOpen(false);
      fetchDrivers();
    } catch (err) {
      alert('Failed to save driver: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDriver = async (driverId) => {
    if (!window.confirm('Delete this driver record?')) return;
    try {
      await adminApi.deleteDriver(driverId);
      fetchDrivers();
    } catch (err) {
      alert('Failed to delete driver: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Chauffeur & Driver Roster</h1>
          <p className="text-xs text-slate-500 mt-1">Manage verified chauffeurs, assigned vehicles, and availability status</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-400/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Chauffeur</span>
        </button>
      </div>

      {/* Drivers Table / Cards */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-500">Loading driver records...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className={`bg-white rounded-3xl p-6 border transition-all shadow-sm flex flex-col justify-between ${
                driver.is_active ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    driver.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                    driver.status === 'On Trip' ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {driver.status}
                  </span>
                  <span className="flex items-center text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    <Award className="w-3.5 h-3.5 mr-1 text-amber-500" />
                    {driver.rating} ★
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{driver.name}</h3>
                <p className="text-xs text-slate-500 flex items-center mt-1">
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  +91 {driver.phone}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <p><strong className="text-slate-700">Assigned Vehicle:</strong> {driver.vehicle_model || 'Unassigned'}</p>
                  <p><strong className="text-slate-700">License:</strong> {driver.license_number || 'Verified'}</p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => openEditModal(driver)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Driver</span>
                </button>
                <button
                  onClick={() => handleDeleteDriver(driver.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Driver Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <Users className="w-5 h-5 text-amber-500" />
                <span>{editingDriver ? 'Edit Chauffeur' : 'Register New Chauffeur'}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDriver} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 6267228958"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Assigned Vehicle Model</label>
                <input
                  type="text"
                  value={formData.vehicle_model}
                  onChange={(e) => setFormData({ ...formData, vehicle_model: e.target.value })}
                  placeholder="e.g. Maruti Dzire (MP-09-AB-1234)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Commercial License</label>
                  <input
                    type="text"
                    value={formData.license_number}
                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                    placeholder="DL-MP09-..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Duty Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="Available">Available</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Off Duty">Off Duty</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="activeDriverCheck"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded"
                />
                <label htmlFor="activeDriverCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Active in Dispatch System
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md"
                >
                  {saving ? 'Saving...' : 'Save Chauffeur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDriversPage;
