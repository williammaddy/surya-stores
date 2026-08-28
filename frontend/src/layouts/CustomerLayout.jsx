import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8fafc] text-slate-900 selection:bg-ice-200 selection:text-midnight-950">
      <div>
        <Navbar />
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
