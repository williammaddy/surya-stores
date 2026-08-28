import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProtectedAdminRoute = ({ children }) => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-800/90 border border-slate-700 p-8 rounded-3xl flex flex-col items-center gap-4 text-center max-w-xs shadow-2xl backdrop-blur-md">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white text-sm">Verifying Admin Access</h3>
            <p className="text-xs text-slate-400">Authenticating role permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Admin Privileges Required</h2>
        <p className="text-sm text-slate-500 max-w-md">
          You are currently signed in as <strong>{user?.email}</strong> (Customer). This area is restricted exclusively to store administrators.
        </p>
        <div className="pt-2 flex gap-3">
          <a
            href="/"
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
          >
            Return to Storefront
          </a>
          <a
            href="/admin/login"
            className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700"
          >
            Sign in as Admin
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedAdminRoute;
