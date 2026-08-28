import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Layers,
  ShoppingBag,
  Users,
  IndianRupee,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Plus,
  ExternalLink,
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import userService from '../../services/userService';
import { DashboardStatSkeleton, TableSkeleton } from '../../components/SkeletonLoader';
import { formatCurrency } from '../../utils/formatCurrency';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await userService.getDashboardStats();
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

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

  return (
    <AdminLayout
      title="Store Management Dashboard"
      subtitle="Overview of catalog inventory, orders, customer activity, and sales."
    >
      <div className="space-y-8">
        {/* Quick Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            System Live: MongoDB Active • Real-Time Inventory Tracking
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/products"
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Product
            </Link>
            <Link
              to="/admin/categories"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </Link>
          </div>
        </div>

        {/* 4 Primary Metric Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <DashboardStatSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Revenue */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Order Value
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                  ₹
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {formatCurrency(stats?.totalRevenue || 0)}
                </span>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">Confirmed &amp; Completed Orders</p>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Orders
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {stats?.totalOrders || 0}
                </span>
                <p className="text-[11px] text-amber-700 font-bold mt-1">
                  {stats?.pendingOrders || 0} Pending • {stats?.completedOrders || 0} Completed
                </p>
              </div>
            </div>

            {/* Catalog Products */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Active Products
                </span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {stats?.totalProducts || 0}
                </span>
                <p className="text-[11px] text-blue-600 font-bold mt-1">
                  Across {stats?.totalCategories || 0} Departments
                </p>
              </div>
            </div>

            {/* Registered Customers */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Customers
                </span>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {stats?.totalCustomers || 0}
                </span>
                <p className="text-[11px] text-purple-600 font-bold mt-1">Registered Accounts</p>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Grid: Recent Orders & Low Stock Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Recent Orders (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-black text-slate-900 text-base">Recent Order Requests</h3>
                <p className="text-xs text-slate-400">Latest customer orders requiring review</p>
              </div>
              <Link
                to="/admin/orders"
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                View All Orders <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <TableSkeleton rows={4} cols={4} />
            ) : !stats?.recentOrders || stats.recentOrders.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No orders received yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 font-extrabold">Order #</th>
                      <th className="pb-3 font-extrabold">Customer</th>
                      <th className="pb-3 font-extrabold">Total</th>
                      <th className="pb-3 font-extrabold">Status</th>
                      <th className="pb-3 font-extrabold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats.recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 font-mono font-bold text-slate-900">
                          #{order.orderNumber}
                        </td>
                        <td className="py-3.5">
                          <p className="font-bold text-slate-800">{order.customerDetails?.name}</p>
                          <p className="text-[10px] text-slate-400">{order.customerDetails?.phone}</p>
                        </td>
                        <td className="py-3.5 font-black text-slate-900">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            to="/admin/orders"
                            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Low Stock Items (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-black text-slate-900 text-base flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Low Stock Alerts
                </h3>
                <p className="text-xs text-slate-400">
                  Items below threshold ({stats?.lowStockThreshold || 10} units)
                </p>
              </div>
              <Link
                to="/admin/products"
                className="text-xs font-bold text-amber-700 hover:text-amber-800"
              >
                Inventory
              </Link>
            </div>

            {loading ? (
              <TableSkeleton rows={4} cols={2} />
            ) : !stats?.lowStockProducts || stats.lowStockProducts.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-emerald-800">All inventory levels healthy!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.lowStockProducts.map((prod) => (
                  <div
                    key={prod._id}
                    className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{prod.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">SKU: {prod.sku || 'N/A'}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-amber-200 text-amber-900 font-black text-xs shrink-0">
                      {prod.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
