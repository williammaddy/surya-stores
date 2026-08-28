import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle,
  ShoppingBag,
  MessageSquare,
  Package,
  ArrowRight,
  Printer,
  Calendar,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import orderService from '../../services/orderService';
import { useSettings } from '../../context/SettingsContext';
import { formatCurrency } from '../../utils/formatCurrency';

const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const { settings } = useSettings();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const res = await orderService.getOrderById(id);
          if (res.data.success) {
            setOrder(res.data.data);
          }
        } catch (err) {
          console.error('Failed to load order:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  const orderNumber = order?.orderNumber || 'SURYA-ORDER';
  const customerName = order?.customerDetails?.name || 'Customer';
  const orderTotal = order?.total ? formatCurrency(order.total) : '₹0.00';

  const whatsappMessage = `Hello ${settings.storeName || 'Surya Stores'}, I have submitted order #${orderNumber} for ${customerName} (Total: ${orderTotal}). Please confirm availability and delivery!`;
  const whatsappUrl = `https://wa.me/${settings.whatsAppNumber?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Card */}
      <div className="glass-panel rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6 border border-white/90">
        <div className="w-20 h-20 rounded-full bg-emerald-100/90 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Order Request Received
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Thank You for Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-medium">
            Your order reference has been logged. Our store team is preparing your items and will contact you via phone/WhatsApp.
          </p>
        </div>

        {/* Order Details Badge */}
        <div className="bg-white/80 border border-blue-100 rounded-3xl p-6 text-left space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-blue-50 pb-4">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                Order Reference
              </span>
              <span className="text-lg font-black text-slate-900 font-mono">#{orderNumber}</span>
            </div>

            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                Payment Type
              </span>
              <span className="text-xs font-bold text-slate-800">Cash / UPI on Delivery</span>
            </div>

            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                Total Amount
              </span>
              <span className="text-lg font-black text-royal-700">{orderTotal}</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-1 font-medium">
            <p>
              <strong className="text-slate-800">Contact Name:</strong> {customerName}
            </p>
            <p>
              <strong className="text-slate-800">Phone:</strong> {order?.customerDetails?.phone}
            </p>
            <p>
              <strong className="text-slate-800">Address:</strong> {order?.customerDetails?.address}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {/* WhatsApp Direct Confirm Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4" /> Confirm on WhatsApp Now
          </a>

          <Link
            to="/orders"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <Package className="w-4 h-4" /> View My Orders
          </Link>

          <Link
            to="/products"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-blue-50 border border-blue-100 text-slate-800 font-bold text-xs flex items-center justify-center transition-colors shadow-2xs"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
