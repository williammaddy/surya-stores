import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, Mail, Phone, Lock, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    fullAddress: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      addToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        address: {
          fullAddress: formData.fullAddress.trim(),
        },
      });

      if (res.success) {
        navigate('/');
      }
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 border border-white/90">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Customer Account</h1>
          <p className="text-xs text-slate-500 font-medium">
            Join Surya Stores for easy order tracking and fast local checkout.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
                <User className="w-4 h-4 text-blue-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Phone Number *</label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
                <Phone className="w-4 h-4 text-blue-500 absolute left-3.5 top-3" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. rahul@example.com"
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
              <Mail className="w-4 h-4 text-blue-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Delivery Address / Locality</label>
            <div className="relative">
              <input
                type="text"
                name="fullAddress"
                value={formData.fullAddress}
                onChange={handleChange}
                placeholder="e.g. Flat 302, Green Valley Apartments, City"
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
              <MapPin className="w-4 h-4 text-blue-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Password (min 6 chars) *</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
                <Lock className="w-4 h-4 text-blue-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Confirm Password *</label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
                <Lock className="w-4 h-4 text-blue-500 absolute left-3.5 top-3" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-royal-600 hover:from-blue-700 hover:to-royal-700 text-white font-black text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Registering...
              </>
            ) : (
              <>
                <span>Create My Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="border-t border-blue-50 pt-4 text-center text-xs text-slate-500 font-medium">
          Already registered?{' '}
          <Link to="/login" className="font-extrabold text-royal-700 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
