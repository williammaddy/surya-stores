import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2, Store, Phone, Mail, Clock, MapPin, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import settingsService from '../../services/settingsService';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';

const AdminSettings = () => {
  const { settings, refreshSettings } = useSettings();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    phone: '',
    whatsAppNumber: '',
    email: '',
    address: '',
    businessHours: '',
    aboutText: '',
    lowStockThreshold: 10,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName || 'Surya Stores',
        phone: settings.phone || '+91 98765 43210',
        whatsAppNumber: settings.whatsAppNumber || '+91 98765 43210',
        email: settings.email || 'info@suryastores.com',
        address: settings.address || '',
        businessHours: settings.businessHours || '',
        aboutText: settings.aboutText || '',
        lowStockThreshold: settings.lowStockThreshold || 10,
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await settingsService.updateSettings(formData);
      if (res.data.success) {
        addToast('Store settings saved successfully.', 'success');
        refreshSettings();
      }
    } catch (err) {
      console.error('Settings update error:', err);
      addToast('Failed to update store settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Store Configuration &amp; Contact Details"
      subtitle="Modify physical store address, customer service phone, WhatsApp ordering number, and business hours."
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8 max-w-4xl"
      >
        {/* Store Brand & Alert Settings */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Store className="w-4 h-4 text-amber-600" /> General Store Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Store Name</label>
              <input
                type="text"
                name="storeName"
                required
                value={formData.storeName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Low Stock Warning Threshold (Units)</label>
              <input
                type="number"
                min="1"
                name="lowStockThreshold"
                required
                value={formData.lowStockThreshold}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 border-t border-slate-100 pt-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Phone className="w-4 h-4 text-amber-600" /> Customer Communication &amp; WhatsApp
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Phone Call Number</label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">WhatsApp Order Number</label>
              <input
                type="text"
                name="whatsAppNumber"
                required
                value={formData.whatsAppNumber}
                onChange={handleChange}
                placeholder="+919876543210"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Public Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Physical Address & Hours */}
        <div className="space-y-4 border-t border-slate-100 pt-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-600" /> Physical Location &amp; Hours
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Retail Shop Physical Address</label>
              <textarea
                rows={2}
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Opening &amp; Business Hours</label>
              <textarea
                rows={2}
                name="businessHours"
                required
                value={formData.businessHours}
                onChange={handleChange}
                placeholder="Mon - Sat: 9:00 AM - 9:30 PM | Sun: 10:00 AM - 2:00 PM"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
              ></textarea>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-700">About Store Summary (Displayed on Footer &amp; About page)</label>
            <textarea
              rows={3}
              name="aboutText"
              value={formData.aboutText}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
            ></textarea>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Store Settings
              </>
            )}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminSettings;
