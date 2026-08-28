import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8fafc] text-slate-900 selection:bg-sky-200 selection:text-slate-950">
      <div>
        <Navbar />
        <main className="min-w-0 pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>
      <Footer />
      {/* Mobile Native App Style Sticky Bottom Bar */}
      <MobileBottomNav />
    </div>
  );
};

export default CustomerLayout;
