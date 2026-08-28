import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Lock, Mail, ArrowRight, Loader2, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result?.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  const handleQuickCustomer = () => {
    setEmail('customer@gmail.com');
    setPassword('customer123');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 border border-white/90">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Sign In</h1>
          <p className="text-xs text-slate-500 font-medium">
            Sign in to track orders, manage your bag, and view past purchases.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
              <Mail className="w-4 h-4 text-blue-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700">Password</label>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
              <Lock className="w-4 h-4 text-blue-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-royal-600 hover:from-blue-700 hover:to-royal-700 text-white font-black text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo button */}
       
        {/* Footer Link */}
        <div className="border-t border-blue-50 pt-4 text-center space-y-2 text-xs">
          <p className="text-slate-500 font-medium">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-extrabold text-royal-700 hover:underline">
              Create an Account
            </Link>
          </p>

          
        </div>
      </div>
    </div>
  );
};

export default Login;
