import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import orderService from '../../services/orderService';
import { TableSkeleton } from '../../components/SkeletonLoader';
import { formatCurrency } from '../../utils/formatCurrency';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getMyOrders();
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load customer orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Confirmed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Preparing':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Ready':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <span className="text-xs font-black uppercase tracking-widest text-royal-700 block mb-1">
          Customer Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          My Order History
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track the status of your stationery &amp; book orders.
        </p>
      </div>

      {loading ? (
        <div className="glass-panel rounded-3xl p-6">
          <TableSkeleton rows={4} cols={4} />
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-inner">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900">No Orders Yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            You haven't placed any order requests yet. Browse our stationery catalog to get started.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-royal-600 hover:from-blue-700 hover:to-royal-700 text-white font-black text-xs shadow-md transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" /> Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="glass-card rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Order Info */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono font-black text-sm text-slate-900 bg-white px-3 py-1 rounded-xl border border-blue-100 shadow-2xs">
                    #{order.orderNumber}
                  </span>
                  <span
                    className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span>•</span>
                  <span>{order.items.length} item(s)</span>
                  <span>•</span>
                  <span>Pay on Delivery</span>
                </div>
              </div>

              {/* Amount & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-blue-50">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Order Total
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    {formatCurrency(order.total)}
                  </span>
                </div>

                <Link
                  to={`/orders/${order._id}`}
                  className="px-4 py-2.5 rounded-full bg-blue-50 hover:bg-blue-100 text-royal-800 font-bold text-xs flex items-center gap-1.5 transition-colors border border-blue-200"
                >
                  <span>Details</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
