import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Calendar,
  Phone,
  MapPin,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import Modal from '../../components/Modal';
import { TableSkeleton } from '../../components/SkeletonLoader';
import orderService from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatCurrency';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  // View Order Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const { addToast } = useToast();

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 20,
        status: selectedStatus,
      };
      if (search.trim()) {
        params.search = search.trim();
      }

      const res = await orderService.getAllOrders(params);
      if (res.data.success) {
        setOrders(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load admin orders:', err);
      addToast('Failed to load orders.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders(1);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const res = await orderService.updateOrderStatus(orderId, newStatus);
      if (res.data.success) {
        addToast(`Order status updated to "${newStatus}".`, 'success');
        // Update local state
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update order status.';
      addToast(msg, 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Preparing':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Ready':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-900 border-slate-300';
    }
  };

  const statusOptions = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

  return (
    <AdminLayout
      title="Customer Order Requests"
      subtitle="Review incoming order reservations, update workflow status, and dispatch items."
    >
      <div className="space-y-6">
        {/* Controls Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by order # (e.g. SURYA-2026-0001), name, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-2xl">
            {['all', 'Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedStatus === st
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {st === 'all' ? 'All Orders' : st}
                </button>
              )
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <TableSkeleton rows={8} cols={6} />
          ) : orders.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">No Orders Found</h4>
              <p className="text-xs text-slate-400">There are no orders matching your current filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                    <th className="py-3.5 px-6">Order Reference</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Customer Details</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Current Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-6 font-mono font-black text-slate-900">
                        #{order.orderNumber}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{order.customerDetails?.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {order.customerDetails?.phone}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 font-black text-slate-900">
                        {formatCurrency(order.total)}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`py-1 px-2.5 rounded-lg text-xs font-black uppercase border focus:ring-2 focus:ring-amber-500 cursor-pointer ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {statusOptions.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsViewModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Order Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Order Details: #${selectedOrder?.orderNumber}`}
        subtitle="Complete receipt, line items, customer address, and status update."
        maxWidth="max-w-2xl"
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs">
            {/* Status Control Banner */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                  Workflow Status
                </span>
                <span className="font-black text-base text-amber-950">{selectedOrder.status}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Change Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  className="py-1.5 px-3 rounded-xl bg-white border border-amber-300 font-bold text-xs"
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="space-y-1">
                <p className="font-extrabold uppercase text-slate-900 text-[10px]">Customer</p>
                <p className="font-bold text-slate-800">{selectedOrder.customerDetails?.name}</p>
                <p className="text-slate-600">Phone: {selectedOrder.customerDetails?.phone}</p>
                <p className="text-slate-600">Email: {selectedOrder.customerDetails?.email}</p>
              </div>

              <div className="space-y-1">
                <p className="font-extrabold uppercase text-slate-900 text-[10px]">Delivery / Notes</p>
                <p className="text-slate-700 leading-relaxed">{selectedOrder.customerDetails?.address}</p>
                {selectedOrder.notes && (
                  <p className="text-amber-800 pt-1 font-semibold">Note: {selectedOrder.notes}</p>
                )}
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-2">
              <p className="font-extrabold uppercase text-slate-900 text-[10px]">Items List</p>
              <div className="border border-slate-100 rounded-2xl divide-y divide-slate-100 overflow-hidden">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900">{item.productName}</p>
                      <p className="text-[10px] text-slate-400">
                        {item.quantity} units × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <span className="font-black text-slate-900">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-sm">
              <span className="font-extrabold text-slate-800">Total Bill Payable</span>
              <span className="text-xl font-black text-amber-700">
                {formatCurrency(selectedOrder.total)}
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-6 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default AdminOrders;
