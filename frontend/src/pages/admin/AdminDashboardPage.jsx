import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  Phone,
  RefreshCw,
  Layers,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { adminAPI } from '../../services/api';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getDashboard();
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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

  return (
    <AdminLayout
      title="Store Performance & Analytics"
      subtitle="Real-time sales, order fulfillment, and inventory health metrics."
    >
      <div className="space-y-8">
        {/* Refresh button */}
        <div className="flex justify-end">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Stats</span>
          </button>
        </div>

        {/* 4 Key Metric Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenue */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Total Revenue
              </span>
              <p className="text-2xl font-black text-slate-900 mt-0.5">
                ₹{Number(stats?.totalRevenue || 0).toFixed(2)}
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
                From active orders
              </span>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Total Orders
              </span>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{stats?.totalOrders || 0}</p>
              <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">
                {stats?.ordersByStatus?.pending || 0} pending confirmation
              </span>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Active Catalog
              </span>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{stats?.totalProducts || 0}</p>
              <span className="text-[11px] text-slate-500 font-semibold mt-0.5 block">
                Across 4 departments
              </span>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Low Stock Items
              </span>
              <p className="text-2xl font-black text-rose-600 mt-0.5">
                {stats?.lowStockCount || 0}
              </p>
              <span className="text-[11px] text-rose-500 font-semibold mt-0.5 block">
                Stock ≤ 10 units
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Recent Orders & Inventory Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Orders Table */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Recent Customer Orders</h3>
                <p className="text-xs text-slate-500">Latest orders placed via COD / Store pickup</p>
              </div>
              <Link
                to="/admin/orders"
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                View All Orders <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-sm">Loading orders...</div>
            ) : !stats?.recentOrders || stats.recentOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">No orders recorded yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Items</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 font-bold text-slate-900">#{order.id}</td>
                        <td className="py-3.5">
                          <p className="font-semibold text-slate-800">{order.customerName}</p>
                          <p className="text-[11px] text-slate-400">{order.customerPhone}</p>
                        </td>
                        <td className="py-3.5 text-slate-600">
                          {order.items?.length || 0} product(s)
                        </td>
                        <td className="py-3.5 font-bold text-slate-900">
                          ₹{Number(order.totalAmount).toFixed(2)}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Low Stock Warning Box */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Low Stock Warning
                </h3>
                <p className="text-xs text-slate-500">Restock needed soon</p>
              </div>
              <Link
                to="/admin/products"
                className="text-xs font-bold text-amber-700 hover:text-amber-800"
              >
                Manage
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-400 text-xs">Checking stock...</div>
            ) : !stats?.lowStockProducts || stats.lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-emerald-600 text-xs font-semibold">
                ✓ All items have healthy stock levels!
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {stats.lowStockProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{prod.name}</p>
                      <p className="text-slate-500 text-[11px]">{prod.category?.name}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-rose-600 text-white font-black text-xs shrink-0 shadow-xs">
                      {prod.stockQuantity} left
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

export default AdminDashboardPage;
