import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Settings, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminSettings() {
  const { freeShippingThreshold, updateFreeShippingThreshold } = useContext(ShopContext);

  const [threshold, setThreshold] = useState(freeShippingThreshold);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Keep state in sync with context fetches
  useEffect(() => {
    setThreshold(freeShippingThreshold);
  }, [freeShippingThreshold]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');

    const numericVal = Number(threshold);
    if (isNaN(numericVal) || numericVal < 0) {
      setError('Please enter a valid positive shipping threshold amount.');
      setSaving(false);
      return;
    }

    try {
      await updateFreeShippingThreshold(numericVal);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#3B1E0A]/5 border border-orange-100 rounded-xl flex items-center justify-center text-[#3B1E0A]">
          <Settings size={22} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure global store constants and settings.</p>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-xl shadow-md border border-orange-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
          Shipping Configuration
        </h2>

        <form onSubmit={handleSave} className="space-y-6 max-w-lg">
          {/* Free Shipping Threshold Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              Free Shipping Threshold (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-semibold">
                ₹
              </span>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B1E0A]/30 focus:border-[#3B1E0A] text-sm font-medium"
                placeholder="e.g. 3500"
                min="0"
              />
            </div>
            <p className="text-xs text-gray-400 leading-normal">
              Minimum order value (in Indian Rupees) above which shipping is marked as free.
              This updates the top notice bars, mobile sliding menus, and popup banners automatically.
            </p>
          </div>

          {/* Messages */}
          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-4 py-3 rounded-xl">
              <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
              <span>Settings saved successfully!</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-[#3B1E0A] hover:bg-[#2B1507] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-md hover:shadow-lg active:scale-95 duration-200"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
