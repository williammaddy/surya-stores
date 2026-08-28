import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  User,
  LogOut,
  Package,
  ShieldCheck,
  Phone,
  Sparkles,
  ChevronDown,
  Truck,
  RotateCcw,
  BookOpen,
  MapPin,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const Navbar = () => {
  const { totalItemsCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { settings } = useSettings();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'STORE CATALOG', path: '/products' },
    { label: 'SCHOOL GUIDES', path: '/products?category=school-guides' },
    { label: 'PENS & WRITING', path: '/products?category=stationery' },
    { label: 'ART & CRAFT', path: '/products?category=art-craft' },
    { label: 'CONTACT', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xs">
      {/* 1. TOP SURYA BLUE ANNOUNCEMENT BAR */}
      
      {/* 2. MAIN BRAND NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Official Surya Stores Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            {/* Red Emblem matching banner */}
            <div className="w-11 h-11 rounded-xl bg-[#dc2626] text-white flex items-center justify-center font-black shadow-md border-2 border-white shadow-red-500/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-lg tracking-tighter font-extrabold">SP</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tight text-[#dc2626] font-display block leading-none">
                  SURYA STORES
                </span>
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-md bg-[#dc2626] text-white">
                  WHOLESALE &amp; RETAIL
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-bold text-slate-700 tamil-font">சூர்யா ஸ்டோர்</span>
                <span className="text-[9px] uppercase font-bold text-slate-400">Tiruppur</span>
              </div>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md relative items-center"
          >
            <input
              type="text"
              placeholder="Search school guides, classmate notebooks, pilot pens, TNPL paper..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 bg-[#f0f9ff] border border-[#bae6fd] rounded-full text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:bg-white transition-all shadow-2xs"
            />
            <Search className="w-4 h-4 text-[#0284c7] absolute left-3.5" />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-1.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-full text-xs font-bold transition-all shadow-2xs active:scale-95"
            >
              Search
            </button>
          </form>

          {/* Right Action Icons (Cart, Account) */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Shopping Bag */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-[#f0f9ff] hover:bg-[#e0f2fe] border border-[#bae6fd] text-slate-800 transition-all font-bold text-xs shadow-2xs"
              title="Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#0284c7]" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-[#dc2626] text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold">Bag</span>
            </Link>

            {/* Auth Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-[#f0f9ff] border border-slate-200 text-slate-800 text-xs font-bold transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-[#dc2626] text-white flex items-center justify-center font-black text-[10px]">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline truncate max-w-[80px]">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setIsUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900 text-xs truncate">{user?.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    {isAdmin ? (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#0284c7] hover:bg-[#f0f9ff]"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#0284c7]" /> Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/orders"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#f0f9ff]"
                      >
                        <Package className="w-4 h-4 text-[#0284c7]" /> My Orders
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#f0f9ff]"
                    >
                      <User className="w-4 h-4 text-slate-400" /> My Profile
                    </Link>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#0284c7] transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex px-4 py-2 rounded-full text-xs font-extrabold bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-xs transition-all active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 py-2.5 text-xs font-bold border-t border-slate-100">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors tracking-wide ${
                  isActive
                    ? 'text-[#dc2626] font-black border-b-2 border-[#dc2626] pb-1'
                    : 'text-slate-600 hover:text-[#0284c7]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-5 py-5 space-y-4 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search books, guides, pens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 bg-[#f0f9ff] border border-[#bae6fd] rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
            />
            <Search className="w-4 h-4 text-[#0284c7] absolute left-3.5 top-3" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1 bg-[#dc2626] text-white rounded-full text-xs font-bold"
            >
              Search
            </button>
          </form>

          <div className="space-y-1 pt-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-[#f0f9ff] hover:text-[#0284c7] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl font-bold text-slate-800 hover:bg-[#f0f9ff]"
                >
                  📦 My Orders
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl font-bold text-slate-800 hover:bg-[#f0f9ff]"
                >
                  👤 My Profile
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl font-bold text-[#0284c7] hover:bg-[#f0f9ff]"
                  >
                    🛡️ Admin Control Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 font-bold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 py-2.5 rounded-full text-center font-bold bg-slate-100 text-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 py-2.5 rounded-full text-center font-bold bg-[#dc2626] text-white shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
