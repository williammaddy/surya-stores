import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  MessageSquare,
  Package,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import orderService from '../../services/orderService';
import { useSettings } from '../../context/SettingsContext';
import { ProductDetailSkeleton } from '../../components/SkeletonLoader';
import { formatCurrency } from '../../utils/formatCurrency';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { settings } = useSettings();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await orderService.getOrderById(id);
        if (res.data.success) {
          setOrder(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Order could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Order Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-500">{error || 'Unable to find this order reference.'}</p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Return to My Orders
        </Link>
      </div>
    );
  }

  const whatsappMessage = `Hello ${settings.storeName || 'Surya Stores'}, I am inquiring about my order #${order.orderNumber}.`;
  const whatsappUrl = `https://wa.me/${settings.whatsAppNumber?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-royal-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </Link>

      {/* Main Order Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
        {/* Header with status badge */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-blue-50 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-xl text-slate-900">
                #{order.orderNumber}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-blue-100 text-royal-800 border border-blue-200">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 transition-all self-start sm:self-auto shadow-md shadow-emerald-600/20 active:scale-95"
          >
            <MessageSquare className="w-4 h-4" /> Ask Support on WhatsApp
          </a>
        </div>

        {/* Customer & Delivery Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/80 rounded-3xl p-6 border border-blue-100 text-xs shadow-2xs">
          <div className="space-y-2 font-medium">
            <h4 className="font-black uppercase text-slate-900 tracking-wider">
              Customer Details
            </h4>
            <p className="text-slate-700"><strong className="text-slate-900">Name:</strong> {order.customerDetails?.name}</p>
            <p className="text-slate-700"><strong className="text-slate-900">Phone:</strong> {order.customerDetails?.phone}</p>
            <p className="text-slate-700"><strong className="text-slate-900">Email:</strong> {order.customerDetails?.email}</p>
          </div>

          <div className="space-y-2 font-medium">
            <h4 className="font-black uppercase text-slate-900 tracking-wider">
              Delivery / Pickup Address
            </h4>
            <p className="text-slate-700 leading-relaxed">{order.customerDetails?.address}</p>
            {order.notes && (
              <p className="text-royal-800 pt-1">
                <strong>Notes:</strong> {order.notes}
              </p>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-4">
          <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">
            Order Items ({order.items?.length || 0})
          </h3>

          <div className="border border-blue-50 rounded-3xl overflow-hidden divide-y divide-blue-50 bg-white">
            {order.items?.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 overflow-hidden shrink-0">
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-900">{item.productName}</h5>
                    <p className="text-slate-400 font-medium">
                      Qty: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-slate-900">{formatCurrency(item.subtotal)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Breakdown */}
        <div className="border-t border-blue-50 pt-6 space-y-2 text-xs font-medium">
          <div className="flex justify-between text-slate-600">
            <span>Items Subtotal</span>
            <span className="font-bold text-slate-900">{formatCurrency(order.subtotal)}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Delivery / Store Pickup</span>
            <span className="font-bold text-emerald-600">FREE / Local COD</span>
          </div>

          <div className="flex justify-between items-baseline pt-4 border-t border-blue-50 text-base">
            <span className="font-black text-slate-900">Total Payable</span>
            <span className="text-2xl font-black text-royal-700">{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* COD reminder */}
        <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 text-xs text-royal-950 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <p className="text-[11px] leading-relaxed font-medium">
            Please keep exact cash or your UPI app ready when collecting your parcel at our shop or upon delivery.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
