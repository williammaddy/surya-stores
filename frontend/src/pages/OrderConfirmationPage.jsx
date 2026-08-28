import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  Printer,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { orderAPI } from '../services/api';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await orderAPI.getById(id);
        if (res.data.success) {
          setOrder(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching order receipt:', err);
        setError('Order not found or unable to load details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-medium text-slate-600">Retrieving order confirmation...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Order Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'Unable to locate this order.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 text-white font-bold text-sm"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hi Surya Store, I just placed Order #${order.id} for ₹${order.totalAmount.toFixed(
      2
    )} under the name ${order.customerName}. Please confirm the delivery/pickup!`
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Confirmation Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs uppercase tracking-wider border border-emerald-200 inline-block">
            Order Placed Successfully
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Thank You, {order.customerName}!
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Your order reference is <strong className="text-slate-900">#{order.id}</strong>. We have received your
            request and will contact you via phone shortly.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <a
            href={`https://wa.me/919876543210?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all inline-flex items-center gap-2 shadow-xs"
          >
            <MessageSquare className="w-4 h-4" /> Message on WhatsApp
          </a>

          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all inline-flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print Receipt
          </button>
        </div>
      </div>

      {/* Order Details Receipt Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Order Reference</span>
            <p className="text-xl font-black text-slate-900">#{order.id}</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status</span>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 inline-block mt-0.5">
              {order.orderStatus}
            </p>
          </div>
        </div>

        {/* Customer & Delivery Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Customer Info</span>
            <p className="font-bold text-slate-900">{order.customerName}</p>
            <p className="text-slate-600 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-600" /> {order.customerPhone}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Delivery Destination</span>
            <p className="text-slate-700 flex items-start gap-1.5 leading-relaxed">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              {order.customerAddress}
            </p>
            {order.notes && (
              <p className="text-slate-500 italic mt-1">Note: "{order.notes}"</p>
            )}
          </div>
        </div>

        {/* Line items table */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Ordered Products
          </h3>
          <div className="divide-y divide-slate-100">
            {order.items?.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      item.product?.imageUrl ||
                      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=100&q=80'
                    }
                    alt={item.product?.name}
                    className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">{item.product?.name}</span>
                    <span className="text-slate-500">
                      Qty: {item.quantity} × ₹{Number(item.priceAtOrder).toFixed(2)}
                    </span>
                  </div>
                </div>

                <span className="font-bold text-slate-900 text-sm">
                  ₹{(item.quantity * item.priceAtOrder).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total calculation */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-base">
          <span className="font-bold text-slate-900">Total Amount Payable (COD)</span>
          <span className="text-2xl font-black text-amber-700">₹{order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-amber-800"
        >
          <span>Continue Browsing Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
