import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Car, DollarSign, Phone, QrCode, Loader2 } from 'lucide-react';
import { adminApi } from '../api/adminApi';

const AdminFareSettingsPage = () => {
  const [settings, setSettings] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [sData, cData] = await Promise.all([
        adminApi.getSettings(),
        adminApi.getAllCars()
      ]);
      setSettings(sData);
      setCars(cData);
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateSetting = async (key, value) => {
    setSavingKey(key);
    try {
      await adminApi.updateSetting(key, { value });
      setSuccessMsg(`Updated setting "${key}" successfully.`);
      setTimeout(() => setSuccessMsg(''), 3000);
      loadData();
    } catch (err) {
      alert('Error updating setting: ' + err.message);
    } finally {
      setSavingKey(null);
    }
  };

  const handleQuickCarRateUpdate = async (carId, field, value) => {
    try {
      await adminApi.updateCar(carId, { [field]: parseFloat(value) || 0 });
      setSuccessMsg('Car rate updated live.');
      setTimeout(() => setSuccessMsg(''), 3000);
      loadData();
    } catch (err) {
      alert('Error updating rate: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Fare Settings & Global Parameters</h1>
        <p className="text-xs text-slate-500 mt-1">
          Adjust live per-kilometer tariffs, base flag down fares, and public business contact information.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Quick Tariff Matrix by Car Tier */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Fleet Rate Formula Matrix</h3>
            <p className="text-xs text-slate-500">Formula: Fare = Base + (Distance × Rate), Minimum Fare Enforced</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-3">Vehicle Tier</th>
                <th className="p-3">Base Fare (₹)</th>
                <th className="p-3">Per KM Rate (₹/km)</th>
                <th className="p-3">Minimum Fare (₹)</th>
                <th className="p-3">Sample 20 KM Fare</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cars.map((car) => {
                const sampleFare = Math.max(car.minimum_fare, car.base_fare + 20 * car.per_km_rate);
                return (
                  <tr key={car.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">
                      {car.name} <span className="text-slate-400 font-normal">({car.car_type})</span>
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        defaultValue={car.base_fare}
                        onBlur={(e) => handleQuickCarRateUpdate(car.id, 'base_fare', e.target.value)}
                        className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        step="0.5"
                        defaultValue={car.per_km_rate}
                        onBlur={(e) => handleQuickCarRateUpdate(car.id, 'per_km_rate', e.target.value)}
                        className="w-20 px-2 py-1 bg-amber-50 border border-amber-300 rounded-lg text-xs font-bold text-amber-700"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        defaultValue={car.minimum_fare}
                        onBlur={(e) => handleQuickCarRateUpdate(car.id, 'minimum_fare', e.target.value)}
                        className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-950">
                      ₹{sampleFare.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Configuration Parameters */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Business & Contact Parameters</h3>
            <p className="text-xs text-slate-500">Configurable phone, dummy UPI ID, and company information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settings.map((s) => (
            <div key={s.key} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                {s.key.replace(/_/g, ' ')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id={`setting-${s.key}`}
                  defaultValue={s.value}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  disabled={savingKey === s.key}
                  onClick={() => {
                    const inputEl = document.getElementById(`setting-${s.key}`);
                    if (inputEl) handleUpdateSetting(s.key, inputEl.value);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-white font-bold text-xs transition-colors"
                >
                  {savingKey === s.key ? 'Saving...' : 'Save'}
                </button>
              </div>
              {s.description && <p className="text-[10px] text-slate-400">{s.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminFareSettingsPage;
