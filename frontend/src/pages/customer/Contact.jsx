import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';

const Contact = () => {
  const { settings } = useSettings();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const whatsappUrl = `https://wa.me/${settings.whatsAppNumber?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hello ${settings.storeName || 'Surya Stores'}, I would like to inquire about product availability and book reservation.`
  )}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      addToast('Please fill out Name, Phone, and your Message.', 'error');
      return;
    }
    setSubmitted(true);
    addToast('Thank you! Your message has been received. We will contact you shortly.', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-black text-royal-700 uppercase tracking-widest bg-blue-100/80 px-3.5 py-1 rounded-full border border-blue-200 shadow-2xs">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Contact &amp; Store Location
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Visit our physical store or send an inquiry via WhatsApp for quick book reservation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Store Details */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-8 shadow-xl space-y-8">
          <div className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {settings.storeName || 'Surya Stores'}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              We are located in the heart of the educational hub with ample parking and easy public transit access.
            </p>
          </div>

          <div className="space-y-6 text-xs text-slate-700 font-medium">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="font-black text-slate-900 block">Retail Store Address</span>
                <p className="text-slate-600 leading-relaxed">
                  {settings.address || 'Shop #12, Surya Complex, Main Market Road'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="font-black text-slate-900 block">Phone &amp; WhatsApp</span>
                <p className="text-slate-600">
                  <a href={`tel:${settings.phone?.replace(/[^0-9+]/g, '')}`} className="hover:text-royal-700 font-bold">
                    {settings.phone || '+91 98765 43210'}
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100 shadow-2xs">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="font-black text-slate-900 block">Email Support</span>
                <p className="text-slate-600">
                  <a href={`mailto:${settings.email}`} className="hover:text-royal-700 font-bold">
                    {settings.email || 'info@suryastores.com'}
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 shadow-2xs">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="font-black text-slate-900 block">Business Hours</span>
                <p className="text-slate-600 leading-relaxed">
                  {settings.businessHours || 'Mon - Sat: 9:00 AM - 9:30 PM | Sun: 10:00 AM - 2:00 PM'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" /> Message Us on WhatsApp
            </a>
          </div>
        </div>

        {/* Right Column: Online Message Form */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-8 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Send Us a Message</h2>
            <p className="text-xs text-slate-500 font-medium">
              Need to check book editions or place a bulk stationery requirement? Send us a quick note.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-black text-emerald-900 text-base">Message Sent Successfully!</h3>
              <p className="text-xs text-emerald-800 font-medium">
                Thank you for reaching out. Our store team will call or reply to your phone number shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: '', phone: '', subject: '', message: '' });
                }}
                className="px-6 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-black shadow-md"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Priya Sundaram"
                    className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Subject / Book Title</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Class 10 CBSE Maths Guide Availability"
                  className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Your Message or Booklist Details *</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="List the book titles, classes, and stationery quantities you require..."
                  className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-royal-600 hover:from-blue-700 hover:to-royal-700 text-white font-black text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Send className="w-4 h-4" /> Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
