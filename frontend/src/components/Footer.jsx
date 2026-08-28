import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();

  const whatsappUrl = `https://wa.me/${settings.whatsAppNumber?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hello Surya Stores (Tiruppur), I have an inquiry regarding stationery and textbook availability.`
  )}`;

  return (
    <footer className="bg-[#0c4a6e] text-white border-t-4 border-[#dc2626] pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#dc2626] text-white flex items-center justify-center font-black border-2 border-white shadow-sm">
                <span>SP</span>
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-white font-display block leading-none">
                  SURYA STORES
                </span>
                <span className="text-[10px] uppercase font-bold text-sky-200 block">
                  சூர்யா ஸ்டோர் • Wholesale &amp; Retail
                </span>
              </div>
            </Link>

            <p className="text-xs text-sky-100 max-w-sm leading-relaxed font-medium">
              Complete Stationery, School Textbooks, Board Exam Guides, Office Files, TNPL Copier Reams &amp; Educational Toys.
            </p>

            <div className="pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] text-white font-extrabold text-xs shadow-xs transition-all active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Shop Inquiry
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black text-[#38bdf8] uppercase tracking-wider">STORE DEPARTMENTS</h4>
            <ul className="space-y-2 text-xs font-medium text-sky-100">
              <li>
                <Link to="/products?category=school-guides" className="hover:text-white transition-colors">
                  10th, 11th &amp; 12th Solved Guides
                </Link>
              </li>
              <li>
                <Link to="/products?category=stationery" className="hover:text-white transition-colors">
                  Classmate Notebooks &amp; Registers
                </Link>
              </li>
              <li>
                <Link to="/products?category=stationery" className="hover:text-white transition-colors">
                  Pilot, Hauser &amp; Doms Pens
                </Link>
              </li>
              <li>
                <Link to="/products?category=art-craft" className="hover:text-white transition-colors">
                  Art &amp; Craft Materials
                </Link>
              </li>
              <li>
                <Link to="/products?category=toys" className="hover:text-white transition-colors">
                  STEM Toys &amp; Board Games
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black text-[#38bdf8] uppercase tracking-wider">CUSTOMER SERVICE</h4>
            <ul className="space-y-2 text-xs font-medium text-sky-100">
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Customer Profile &amp; Address
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Store Team
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-sky-300 font-bold hover:text-white">
                  Staff &amp; Admin Portal →
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Info */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black text-[#38bdf8] uppercase tracking-wider">STORE DETAILS</h4>
            <ul className="space-y-2 text-xs text-sky-100 font-medium">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#38bdf8] shrink-0 mt-0.5" />
                <span>17, Kamatchiamman Koil Street, Tiruppur - 641604</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                <a href={`tel:${settings.phone?.replace(/[^0-9+]/g, '')}`} className="hover:text-white">
                  {settings.phone || '+91 98765 43210'}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#38bdf8] shrink-0 mt-0.5" />
                <span>{settings.businessHours || 'Mon - Sat: 9:00 AM - 9:30 PM'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Trust & Copyright */}
        <div className="mt-10 pt-6 border-t border-sky-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-sky-200 font-medium">
          <p>© {new Date().getFullYear()} Surya Stores (சூர்யா ஸ்டோர்), Tiruppur. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-white text-[11px] font-bold">
            <span className="text-[#38bdf8]">● Cash on Delivery</span>
            <span>•</span>
            <span className="text-[#38bdf8]">● UPI on Delivery</span>
            <span>•</span>
            <span className="text-[#38bdf8]">● Tiruppur Shop Pickup</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
