import React, { useState, useEffect } from 'react';
import { 
  Car, Plus, Edit2, Trash2, CheckCircle2, XCircle, 
  DollarSign, Users, Wind, Image, Loader2, Save, X 
} from 'lucide-react';
import { adminApi } from '../api/adminApi';

const AdminCarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    model: '',
    car_number: '',
    car_type: 'Sedan',
    seats: 4,
    has_ac: true,
    image_url: '',
    base_fare: 50,
    per_km_rate: 10,
    minimum_fare: 150,
    is_active: true,
    sort_order: 1
  });

  const fetchCars = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllCars();
      setCars(data);
    } catch (err) {
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const openAddModal = () => {
    setEditingCar(null);
    setFormData({
      name: '',
      model: '',
      car_number: '',
      car_type: 'Sedan',
      seats: 4,
      has_ac: true,
      image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      base_fare: 50,
      per_km_rate: 10,
      minimum_fare: 150,
      is_active: true,
      sort_order: cars.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (car) => {
    setEditingCar(car);
    setFormData({
      name: car.name,
      model: car.model,
      car_number: car.car_number || '',
      car_type: car.car_type || 'Sedan',
      seats: car.seats,
      has_ac: car.has_ac,
      image_url: car.image_url || '',
      base_fare: car.base_fare,
      per_km_rate: car.per_km_rate,
      minimum_fare: car.minimum_fare,
      is_active: car.is_active,
      sort_order: car.sort_order || 0
    });
    setModalOpen(true);
  };

  const handleSaveCar = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCar) {
        await adminApi.updateCar(editingCar.id, formData);
      } else {
        await adminApi.createCar(formData);
      }
      setModalOpen(false);
      fetchCars();
    } catch (err) {
      alert('Failed to save car: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (car) => {
    try {
      await adminApi.updateCar(car.id, { is_active: !car.is_active });
      fetchCars();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDeleteCar = async (carId) => {
    if (!window.confirm('Delete this car? Existing historical bookings will retain snapshot records.')) return;
    try {
      await adminApi.deleteCar(carId);
      fetchCars();
    } catch (err) {
      alert('Failed to delete car: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Fleet & Dynamic Fare Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Updating per-km rates immediately updates future fare calculation across the website.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-400/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Cars Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-500">Loading fleet records...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <div
              key={car.id}
              className={`bg-white rounded-3xl p-5 border transition-all shadow-sm flex flex-col justify-between ${
                car.is_active ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div>
                {/* Header & Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                    {car.car_type}
                  </span>
                  <button
                    onClick={() => handleToggleActive(car)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase cursor-pointer ${
                      car.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {car.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>

                {/* Car Image */}
                <div className="h-32 w-full rounded-2xl overflow-hidden bg-slate-100 mb-3">
                  <img
                    src={car.image_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="font-bold text-slate-900 text-base">{car.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{car.model} {car.car_number && `(${car.car_number})`}</p>

                {/* Rates breakdown */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 text-xs mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Per KM Rate:</span>
                    <span className="font-black text-amber-600 text-sm">₹{car.per_km_rate} / km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Base Fare:</span>
                    <span className="font-semibold text-slate-800">₹{car.base_fare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Minimum Fare:</span>
                    <span className="font-semibold text-slate-800">₹{car.minimum_fare}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200/60 pt-1.5 text-[11px] text-slate-500">
                    <span>Seats: {car.seats}</span>
                    <span>AC: {car.has_ac ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => openEditModal(car)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Rate / Specs</span>
                </button>
                <button
                  onClick={() => handleDeleteCar(car.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Car Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <Car className="w-5 h-5 text-amber-500" />
                <span>{editingCar ? 'Edit Vehicle & Tariff' : 'Add New Vehicle'}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCar} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Display Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sedan Prime"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Model Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g. Maruti Suzuki Dzire"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Car Number</label>
                  <input
                    type="text"
                    value={formData.car_number}
                    onChange={(e) => setFormData({ ...formData, car_number: e.target.value })}
                    placeholder="e.g. MP-09-AB-1234"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category Type</label>
                  <select
                    value={formData.car_type}
                    onChange={(e) => setFormData({ ...formData, car_type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Ertiga">Ertiga</option>
                    <option value="Innova">Innova</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Rates Section */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-amber-900 uppercase">Tariff & Billing Rates (₹ INR)</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Per KM Rate *</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={formData.per_km_rate}
                      onChange={(e) => setFormData({ ...formData, per_km_rate: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Base Fare *</label>
                    <input
                      type="number"
                      step="1"
                      required
                      value={formData.base_fare}
                      onChange={(e) => setFormData({ ...formData, base_fare: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Minimum Fare *</label>
                    <input
                      type="number"
                      step="1"
                      required
                      value={formData.minimum_fare}
                      onChange={(e) => setFormData({ ...formData, minimum_fare: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Seats Count</label>
                  <input
                    type="number"
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) || 4 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div className="flex items-center space-x-6 pt-5">
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.has_ac}
                      onChange={(e) => setFormData({ ...formData, has_ac: e.target.checked })}
                      className="w-4 h-4 text-amber-500 rounded"
                    />
                    <span>AC Included</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 text-emerald-500 rounded"
                    />
                    <span>Active</span>
                  </label>
                </div>
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
                  {saving ? 'Saving...' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCarsPage;
