import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Bell,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children, title, subtitle }) => {
  const { admin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0">
        {/* Admin Brand */}
        <div className="p-6 border-b border-slate-800">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-white tracking-tight text-lg">SURYA ADMIN</div>
              <p className="text-[11px] text-amber-400 font-medium">Control Center</p>
            </div>
          </Link>
        </div>

        {/* Admin Nav items */}
        <nav className="p-4 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-md font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer actions in sidebar */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Store className="w-4 h-4" />
            View Public Store ↗
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-base tracking-tight">Surya Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xs flex flex-col">
          <div className="bg-slate-900 p-6 flex items-center justify-between border-b border-slate-800">
            <span className="font-bold text-white text-lg">Admin Navigation</span>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="p-4 space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
                      isActive ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
          <div className="p-6 border-t border-slate-800 space-y-3">
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="block text-center py-2.5 text-sm font-semibold rounded-xl bg-slate-800 text-slate-200"
            >
              Go to Store
            </Link>
            <button
              onClick={() => {
                setSidebarOpen(false);
                handleLogout();
              }}
              className="w-full text-center py-2.5 text-sm font-semibold rounded-xl bg-rose-900/40 text-rose-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 z-20 shadow-xs">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Admin: <span className="text-slate-800 font-bold">{admin?.username || 'admin'}</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
