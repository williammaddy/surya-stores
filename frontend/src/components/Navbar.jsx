import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from "./ast/suryalogo.png"
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
  ChevronDown,
  Truck,
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
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      {/* 1. TOP ANNOUNCEMENT BAR (Hidden on very small screens for clean mobile UI) */}
      <div className="bg-[#0284c7] text-white text-[11px] font-medium py-1 px-3 sm:px-4 hidden sm:block border-b border-[#0369a1]">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-sky-200 shrink-0" />
            <span>Free Local Delivery on Orders Over ₹499 • 17, Kamatchiamman Koil St, Tiruppur</span>
          </div>

          <div className="flex items-center gap-3 text-sky-100">
            <a
              href={`tel:${settings.phone?.replace(/[^0-9+]/g, '')}`}
              className="hover:text-white font-semibold transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3" /> {settings.phone || '+91 98765 43210'}
            </a>
            {isAdmin && (
              <>
                <span>•</span>
                <Link to="/admin" className="text-amber-300 font-bold hover:underline">
                  Admin Panel
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-4">
          {/* Official Surya Stores Brand Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
  
  {/* Logo */}
  <div className="w-9 h-9 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center">
    <img
      src={logo}
      alt="Surya Stores Logo"
      className="w-full h-full object-contain"
    />
  </div>

  {/* Store Name */}
  <div className="min-w-0">
    <div className="flex items-center gap-1.5">
      <span className="font-black text-lg sm:text-2xl tracking-tight text-[#dc2626] font-display leading-none">
        SURYA STORES
      </span>

      <span className="hidden sm:inline-block text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-[#dc2626] text-white">
        WHOLESALE &amp; RETAIL
      </span>
    </div>

    <div className="flex items-center gap-1 mt-0.5 text-slate-500">
      <span className="text-[10px] sm:text-xs font-bold text-slate-700 tamil-font">
        சூர்யா ஸ்டோர்
      </span>

      <span className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-400">
        • Tiruppur
      </span>
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
              placeholder="Search school guides, notebooks, pens, TNPL paper..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-2 bg-[#f0f9ff] border border-[#bae6fd] rounded-full text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-[#0284c7] absolute left-3" />
            <button
              type="submit"
              className="absolute right-1 px-3.5 py-1.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-full text-xs font-bold"
            >
              Search
            </button>
          </form>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Bag */}
            <Link
              to="/cart"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0f9ff] hover:bg-[#e0f2fe] border border-[#bae6fd] text-slate-800 font-bold text-xs"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#0284c7]" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#dc2626] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span>Bag</span>
            </Link>

            {/* Desktop User Dropdown */}
            {isAuthenticated ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold"
                >
                  <div className="w-5 h-5 rounded-full bg-[#dc2626] text-white flex items-center justify-center font-black text-[9px]">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="truncate max-w-[70px]">{user?.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isUserDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in"
                    onMouseLeave={() => setIsUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-1.5 border-b border-slate-100">
                      <p className="font-bold text-slate-900 text-xs truncate">{user?.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    {isAdmin ? (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#0284c7] hover:bg-[#f0f9ff]"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#0284c7]" /> Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/orders"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#f0f9ff]"
                      >
                        <Package className="w-3.5 h-3.5 text-[#0284c7]" /> My Orders
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#f0f9ff]"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" /> My Profile
                    </Link>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#0284c7]"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#dc2626] text-white shadow-2xs"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 py-2 text-xs font-bold border-t border-slate-100">
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

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search books, guides, pens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-18 py-2 bg-[#f0f9ff] border border-[#bae6fd] rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
            />
            <Search className="w-4 h-4 text-[#0284c7] absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 px-3 py-1 bg-[#dc2626] text-white rounded-full text-xs font-bold"
            >
              Search
            </button>
          </form>

          {/* Links */}
          <div className="grid grid-cols-2 gap-1 pt-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-2.5 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-[#f0f9ff] hover:text-[#0284c7]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Bar */}
          <div className="pt-2 border-t border-slate-100 text-xs">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 truncate">Hi, {user?.name}</span>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="font-bold text-rose-600 px-2 py-1 hover:bg-rose-50 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center rounded-lg font-bold bg-slate-100 text-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center rounded-lg font-bold bg-[#dc2626] text-white"
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
