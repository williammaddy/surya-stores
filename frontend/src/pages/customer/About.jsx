import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Award,
  Users,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const About = () => {
  const { settings } = useSettings();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-black text-royal-700 uppercase tracking-widest bg-blue-100/80 px-3.5 py-1 rounded-full border border-blue-200 shadow-2xs">
          About {settings.storeName || 'Surya Stores'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Your Trusted Destination for Learning &amp; Creative Tools
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
          {settings.aboutText ||
            'Surya Stores is dedicated to empowering students, educators, professionals, and artists with authentic study materials and reliable stationery.'}
        </p>
      </div>

      {/* Story & Philosophy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/80 relative">
          <img
            src="https://images.unsplash.com/photo-1507842229451-7f01be8fd2ab?auto=format&fit=crop&w=900&q=80"
            alt="Surya Stores Bookshelf"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-8">
            <div className="text-white space-y-1">
              <h3 className="font-extrabold text-lg">Serving Students &amp; Creators Since 2012</h3>
              <p className="text-xs text-slate-200">Over 15,000+ satisfied learners, teachers, and schools</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Our Commitment to Authenticity
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              In an era of rapid curriculum updates, having the exact syllabus editions and reliable study guides is critical for exam confidence. We partner directly with authorized publishers including NCERT, Arihant, Oxford, MTG, and leading stationery manufacturers like Classmate, Camlin, and Pilot.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Whether you are preparing for 10th/12th board exams, searching for competitive entrance question banks, or picking up fine art acrylics, our shop provides transparent stock availability and friendly local guidance.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl glass-card border border-blue-100">
              <span className="text-2xl font-black text-royal-800">500+</span>
              <p className="text-xs font-bold text-slate-700 mt-0.5">Catalog Titles</p>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-blue-100">
              <span className="text-2xl font-black text-emerald-800">100%</span>
              <p className="text-xs font-bold text-slate-700 mt-0.5">Genuine Publications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-gradient-to-b from-slate-900 via-royal-950 to-[#020617] text-white rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl border border-slate-800">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Our Core Principles</h2>
          <p className="text-xs text-slate-400">Everything we do is guided by integrity and student success.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-3xl space-y-3 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-sky-400" />
            <h3 className="font-extrabold text-base">Verified Editions</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We guarantee 100% genuine curriculum prints with accurate solutions and syllabus compliance.
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-3xl space-y-3 shadow-inner">
            <Award className="w-8 h-8 text-emerald-400" />
            <h3 className="font-extrabold text-base">Affordable Pricing</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ensuring educational tools remain accessible to every household and institution.
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-3xl space-y-3 shadow-inner">
            <Users className="w-8 h-8 text-blue-400" />
            <h3 className="font-extrabold text-base">Community Connection</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Friendly local service where you can call, message, or visit our retail store anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center space-y-4 pt-4">
        <h2 className="text-2xl font-black text-slate-900">Have a Question or Need School Booklists?</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto font-medium">
          Send us your required list of books or stationery over WhatsApp for an instant quote.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-royal-600 hover:from-blue-700 hover:to-royal-700 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
        >
          <span>Contact Store Team</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default About;
