import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Grid,
  ShoppingBag,
  User,
  MessageSquare,
  Package,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const MobileBottomNav = () => {
  const { totalItemsCount } = useCart();
  const { isAuthenticated } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();

  const whatsappUrl = `https://wa.me/${settings.whatsAppNumber?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hello Surya Stores, I would like to inquire about stationery and book availability.`
  )}`;

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Catalog', path: '/products', icon: Grid },
    {
      label: 'WhatsApp',
      href: whatsappUrl,
      icon: MessageSquare,
      isExternal: true,
    },
    {
      label: 'Bag',
      path: '/cart',
      icon: ShoppingBag,
      badge: totalItemsCount,
    },
    {
      label: isAuthenticated ? 'Orders' : 'Account',
      path: isAuthenticated ? '/orders' : '/login',
      icon: isAuthenticated ? Package : User,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-slate-200 shadow-lg select-none">
      <div className="flex items-center justify-around h-14 px-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = !item.isExternal && location.pathname === item.path;
          const Icon = item.icon;

          if (item.isExternal) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex flex-col items-center justify-center h-full text-[10px] font-bold text-slate-600 active:opacity-70 transition-opacity"
              >
                <div className="w-5 h-5 flex items-center justify-center text-emerald-600">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="mt-0.5 leading-none">{item.label}</span>
              </a>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex-1 flex flex-col items-center justify-center h-full text-[10px] font-bold transition-colors ${
                isActive ? 'text-[#dc2626]' : 'text-slate-500 active:text-slate-800'
              }`}
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#dc2626] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-0.5 leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
