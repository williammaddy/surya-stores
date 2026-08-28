import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  PhoneCall,
  MapPin,
  FileText,
  User,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import orderService from '../../services/orderService';
import { formatCurrency } from '../../utils/formatCurrency';

const Checkout = () => {
  const { items, clearCart, grandTotal, totalItemsCount } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // Form State autofilled with logged in customer details
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address?.fullAddress || user?.address?.street || '',
    notes: '',
  });

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">Please add items to your cart before proceeding to checkout.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs shadow-md"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      addToast('Please fill in your Name, Phone Number, and Address.', 'error');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        items: items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        customerDetails: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          address: formData.address.trim(),
        },
        notes: formData.notes.trim(),
      };

      const res = await orderService.createOrder(payload);

      if (res.data.success && res.data.data) {
        const order = res.data.data;
        clearCart();
        addToast(`Order #${order.orderNumber} placed successfully!`, 'success');
        navigate(`/order-success/${order._id}`, { state: { order } });
      }
    } catch (err) {
      console.error('Order submission error:', err);
      const msg = err.response?.data?.message || 'Failed to submit order. Please try again.';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-royal-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <span className="text-xs font-black uppercase tracking-widest text-royal-700 block mb-1">
          Zero-Card Checkout
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Complete Your Order Request
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your items and provide your delivery/pickup contact details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer Details Form */}
        <form
          onSubmit={handleSubmitOrder}
          className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
        >
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" /> Customer Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Email Address (For receipt confirmation)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. rahul@example.com"
              className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>

          {/* Delivery Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Delivery Address / Pickup Note *</label>
            <textarea
              name="address"
              rows={3}
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. Flat 302, Green Valley Apartments, Anna Nagar, City (or write 'Store Pickup')"
              className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            ></textarea>
          </div>

          {/* Special Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Order Notes or Specific Requirements (Optional)</label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. Need latest 2026 edition book, please call after 5 PM"
              className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-gradient-to-r from-blue-600 to-royal-600 hover:from-blue-700 hover:to-royal-700 text-white font-black text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Processing Order...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" /> Submit Order Request (Pay on Delivery)
              </>
            )}
          </button>
        </form>

        {/* Right Column: Order Review */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-blue-600" /> Order Items ({totalItemsCount})
          </h2>

          <div className="divide-y divide-blue-50 max-h-72 overflow-y-auto space-y-3">
            {items.map((item) => (
              <div key={item.product} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 pr-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 overflow-hidden shrink-0">
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 line-clamp-1">{item.productName}</p>
                    <p className="text-slate-400 font-medium">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                </div>
                <span className="font-black text-slate-900 whitespace-nowrap">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-blue-50 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">{formatCurrency(grandTotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Estimated Delivery / Pickup</span>
              <span className="font-bold text-emerald-600">FREE / Local COD</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-blue-50 text-sm">
              <span className="font-black text-slate-900">Total Amount</span>
              <span className="text-xl font-black text-slate-900">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 text-xs text-royal-950 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Cash / UPI Payment on Delivery
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              You will not be charged now. Our shop staff will review inventory and contact you via phone/WhatsApp to confirm collection or dispatch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
