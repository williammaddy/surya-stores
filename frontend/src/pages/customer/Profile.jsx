import React, { useState } from 'react';
import { User, Phone, MapPin, Lock, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    fullAddress: user?.address?.fullAddress || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        addToast('Please provide your current password to set a new password.', 'error');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        addToast('New passwords do not match.', 'error');
        return;
      }
    }

    try {
      setLoading(true);
      const res = await updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          fullAddress: formData.fullAddress.trim() || `${formData.street}, ${formData.city} - ${formData.pincode}`,
        },
        currentPassword: formData.currentPassword || undefined,
        newPassword: formData.newPassword || undefined,
      });

      if (res.success) {
        setFormData((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      }
    } catch (err) {
      console.error('Update profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <span className="text-xs font-black uppercase tracking-widest text-royal-700 block mb-1">
          Account Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Customer Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your contact details and default delivery address.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-panel rounded-3xl p-6 sm:p-10 shadow-xl space-y-8"
      >
        {/* Personal Details */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" /> Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full px-4 py-2.5 bg-blue-50/50 border border-blue-100 rounded-2xl text-xs font-semibold text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="space-y-4 border-t border-blue-50 pt-6">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" /> Default Delivery Address
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Full Address</label>
              <textarea
                name="fullAddress"
                rows={3}
                value={formData.fullAddress}
                onChange={handleChange}
                placeholder="e.g. Flat 302, Green Valley Apartments, Anna Nagar, Chennai"
                className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Change Password (Optional) */}
        <div className="space-y-4 border-t border-blue-50 pt-6">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" /> Change Password (Optional)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-blue-50 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-royal-600 hover:from-blue-700 hover:to-royal-700 text-white font-black text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
