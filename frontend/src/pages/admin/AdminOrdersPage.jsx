import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Search,
  Phone,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { orderAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const { addToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderAPI.getAllAdmin({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery || undefined,
        limit: 100,
      });

      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
      addToast('Failed to load orders.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await orderAPI.updateStatus(orderId, newStatus);
      if (res.data.success) {
        addToast(`Order #${orderId} status updated to "${newStatus}".`, 'success');
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update order status.';
      addToast(msg, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'pending':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const tabs = [
    { label: 'All Orders', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <AdminLayout
      title="Customer Orders & Dispatch"
      subtitle="View incoming COD and store pickup orders, confirm items, and manage fulfillment."
    >
      <div className="space-y-6">
        {/* Filter bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === tab.value
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search form */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="relative flex-1 sm:w-72">
              <input
                type="text"
                placeholder="Search by customer name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </form>

            <button
              onClick={fetchOrders}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
              title="Refresh list"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-sm border border-slate-200/80">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-200/80">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-slate-500 font-semibold text-sm">No orders found in this view.</p>
            </div>
          ) : (
            orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const dateFormatted = new Date(order.createdAt).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              });

              const whatsappMessage = encodeURIComponent(
                `Hello ${order.customerName}, this is Surya Store regarding your Order #${order.id} for ₹${order.totalAmount}. We are preparing your order!`
              );

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
                >
                  {/* Summary Bar */}
                  <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Order Info & Customer */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-slate-900">#{order.id}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> {dateFormatted}
                        </span>
                      </div>

                      <div className="border-l-0 sm:border-l border-slate-100 sm:pl-6 space-y-0.5">
                        <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="text-amber-700 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Phone className="w-3 h-3" /> {order.customerPhone}
                          </a>
                          <a
                            href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <MessageSquare className="w-3 h-3" /> WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Right: Total, Status Modifier, and Expand Trigger */}
                    <div className="flex items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="text-left lg:text-right">
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                          Total (COD)
                        </span>
                        <span className="text-lg font-black text-slate-900">
                          ₹{Number(order.totalAmount).toFixed(2)}
                        </span>
                      </div>

                      {/* Status Dropdown */}
                      <select
                        value={order.orderStatus}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="confirmed">📞 Confirmed</option>
                        <option value="completed">✅ Completed</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>

                      {/* Expand/Collapse Button */}
                      <button
                        onClick={() => toggleExpand(order.id)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="View details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Items & Address Drawer */}
                  {isExpanded && (
                    <div className="bg-slate-50/80 border-t border-slate-100 p-6 space-y-4 animate-in slide-in-from-top-1">
                      {/* Address and Notes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-1">
                          <span className="text-slate-400 font-bold uppercase tracking-wider block">
                            Delivery Address:
                          </span>
                          <p className="text-slate-800 font-medium flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            {order.customerAddress}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-1">
                          <span className="text-slate-400 font-bold uppercase tracking-wider block">
                            Customer Instructions:
                          </span>
                          <p className="text-slate-700 italic">
                            {order.notes ? `"${order.notes}"` : 'No special notes provided.'}
                          </p>
                        </div>
                      </div>

                      {/* Line items */}
                      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Ordered Items ({order.items?.length || 0})
                        </h4>

                        <div className="divide-y divide-slate-100 text-xs">
                          {order.items?.map((item) => (
                            <div key={item.id} className="py-2.5 flex items-center justify-between gap-4">
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
                                  <span className="text-slate-400">
                                    Qty: {item.quantity} × ₹{Number(item.priceAtOrder).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                              <span className="font-bold text-slate-900">
                                ₹{(item.quantity * item.priceAtOrder).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
