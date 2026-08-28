import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  Phone,
  User,
  MapPin,
  FileText,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const CheckoutPage = () => {
  const { items, subtotal, deliveryFee, grandTotal, isFreeDelivery, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If cart is empty, redirect back to cart
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500">Add some items before checking out.</p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 text-white font-bold text-sm"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.customerName.trim()) {
      setErrorMsg('Please provide your full name.');
      return;
    }
    if (!formData.customerPhone.trim() || formData.customerPhone.trim().length < 8) {
      setErrorMsg('Please provide a valid phone number (at least 8 digits).');
      return;
    }
    if (!formData.customerAddress.trim()) {
      setErrorMsg('Please provide your complete delivery address or store pickup note.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      const orderPayload = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerAddress: formData.customerAddress.trim(),
        notes: formData.notes ? formData.notes.trim() : '',
        items: items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
        })),
      };

      const res = await orderAPI.create(orderPayload);

      if (res.data.success) {
        const createdOrder = res.data.data;
        clearCart();

        // Celebration confetti effect
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore if canvas not supported
        }

        addToast('Order placed successfully!', 'success');
        navigate(`/order-confirmation/${createdOrder.id}`);
      }
    } catch (err) {
      console.error('Order submission error:', err);
      const msg =
        err.response?.data?.message ||
        'Could not place order. Please check item stock or try again.';
      setErrorMsg(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Customer & Delivery Info */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
              Step 2 of 2
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Delivery &amp; Customer Details
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              No immediate online payment required. Pay via <strong>Cash or UPI on Delivery / Pickup</strong>.
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmitOrder} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none transition-all"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Contact Phone Number * (We will call to confirm)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none transition-all"
                  required
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Delivery Address &amp; Landmark *
              </label>
              <div className="relative">
                <textarea
                  name="customerAddress"
                  rows={3}
                  value={formData.customerAddress}
                  onChange={handleChange}
                  placeholder="e.g. Flat 302, Green Valley Apts, Near City Model School, Sector 4"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none transition-all"
                  required
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                If you prefer in-store pickup, write: "Store Pickup at Surya Complex".
              </p>
            </div>

            {/* Order Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Special Instructions / School Info (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Class 10 CBSE 2026 edition preferred / Call before 4 PM"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none transition-all"
                />
                <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Payment method info */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                COD
              </div>
              <div className="text-xs text-amber-950 space-y-0.5">
                <h4 className="font-bold">Payment on Delivery / Pickup</h4>
                <p className="text-amber-900/80">
                  Pay with Cash, Google Pay, PhonePe, or Paytm once your parcel arrives or when you collect it at the shop.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-lg shadow-amber-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm Order (Pay ₹{grandTotal.toFixed(2)} on Delivery)</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Summary: Item list & Totals */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 sticky top-28">
          <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-4">
            Items in Order ({items.length})
          </h3>

          {/* Mini item preview */}
          <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={
                      item.imageUrl ||
                      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=100&q=80'
                    }
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-slate-500">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 text-xs border-t border-slate-100 pt-4">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Charges</span>
              <span className="font-semibold text-slate-900">
                {isFreeDelivery ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-100 text-sm">
              <span className="font-extrabold text-slate-900">Total Payable</span>
              <span className="text-xl font-black text-amber-700">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-800">📦 Order Fulfillment Process:</p>
            <p>1. We receive your order and pack items.</p>
            <p>2. We call/message to confirm before dispatch.</p>
            <p>3. Pay cash/UPI on delivery.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
