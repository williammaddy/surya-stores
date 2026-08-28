import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home, ShoppingBag, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner font-black text-3xl">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Page Not Found</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Go to Home
          </Link>

          <Link
            to="/products"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Shop Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
