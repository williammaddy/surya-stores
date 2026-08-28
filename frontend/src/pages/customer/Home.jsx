import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image1 from "./assets/shop1.jpeg"
import image2 from "./assets/shop2.jpeg"
import image3 from "./assets/shop3.jpeg"
import image4 from "./assets/shop4.jpeg"
import image5 from "./assets/shop5.jpeg"
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  Award,
  RotateCcw,
  Headphones,
  Sparkles,
  Search,
  MessageSquare,
  Zap,
  TrendingUp,
  BookOpen,
  MapPin,
  Phone,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import CategoryCard from '../../components/CategoryCard';
import { ProductCardSkeleton } from '../../components/SkeletonLoader';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');
  const [emailSub, setEmailSub] = useState('');
  const { settings } = useSettings();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const brandList = [
    'CLASSMATE',
    'DOMS',
    'PILOT',
    'CAMLIN',
    'NATARAJ',
    'APSARA',
    'CELLO',
    'FLAIR',
    'LUXOR',
    'RORITO',
    'HAUSER',
    'KANGARO',
    'REYNOLDS',
    'CASIO',
    'TNPL COPIER',
    'OXFORD',
  ];

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          productService.getProducts({ limit: 8 }),
          categoryService.getCategories(),
        ]);

        if (prodRes.data.success) {
          setFeaturedProducts(prodRes.data.data);
        }
        if (catRes.data.success) {
          setCategories(catRes.data.data);
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailSub.trim()) return;
    addToast('Thank you! You are now subscribed for store updates.', 'success');
    setEmailSub('');
  };

  const whatsappBooklistUrl = `https://wa.me/${settings.whatsAppNumber?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hello Surya Stores (Tiruppur), I want to send my school booklist / stationery requirements for pricing.`
  )}`;

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 bg-[#f8fafc]">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: OFFICIAL SURYA STORES LIGHT BLUE & CRIMSON RED STAGE */}
      {/* ========================================================================= */}
      <section className="relative bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#38bdf8] text-white overflow-hidden border-b-4 border-[#dc2626] shadow-md">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#dc2626] text-white text-[11px] font-black tracking-wider uppercase shadow-xs border border-white/30">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                <span>WHOLESALE &amp; RETAIL • TIRUPPUR</span>
              </div>

              {/* Headline */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-wide text-sky-100 tamil-font">
                    சூர்யா ஸ்டோர்
                  </span>
                  <span className="text-xs uppercase font-bold text-sky-200 tracking-widest">
                    (Kamatchiamman Koil St)
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-tight text-white drop-shadow-xs">
                  Your Complete Stationery, <br />
                  <span className="text-white bg-[#dc2626] px-2 py-0.5 rounded-lg inline-block my-1 shadow-sm">
                    School Guides &amp; Books
                  </span>{' '}
                  Destination.
                </h1>
              </div>

              <p className="text-xs sm:text-sm text-sky-50 max-w-xl leading-relaxed font-medium">
                Authorized dealer for Class 10, 11 &amp; 12 State Board &amp; CBSE Guides, Classmate Notebooks, Pilot &amp; Hauser Pens, Art Materials, TNPL Copier paper and STEM toys.
              </p>

              {/* Integrated Search Box */}
              <form
                onSubmit={handleHeroSearch}
                className="max-w-lg relative flex items-center bg-white rounded-full p-1.5 shadow-lg"
              >
                <div className="pl-3.5 text-[#0284c7]">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search 10th Maths guide, Pilot pens, Classmate notebooks..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="flex-1 bg-transparent border-none py-2 px-3 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-extrabold text-xs rounded-full transition-all active:scale-95 shrink-0 shadow-xs"
                >
                  Search
                </button>
              </form>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/products"
                  className="px-6 py-3 rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] text-white font-extrabold text-xs tracking-wider uppercase shadow-md transition-all active:scale-95"
                >
                  Explore Catalog
                </Link>
                <a
                  href={whatsappBooklistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg bg-white/95 hover:bg-white text-[#0284c7] font-extrabold text-xs tracking-wider uppercase shadow-sm transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" /> Send Booklist on WhatsApp
                </a>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 sm:aspect-16/11 bg-white">
                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80"
                  alt="Surya Stores Stationery Collection"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0c4a6e] via-[#0c4a6e]/70 to-transparent p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#38bdf8] block">
                        SURYA STORES TIRUPPUR
                      </span>
                      <span className="text-xs font-bold">17, Kamatchiamman Koil Street</span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#dc2626] text-white text-[10px] font-black uppercase">
                      Wholesale &amp; Retail
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. AUTHORIZED BRANDS RIBBON (From Real Banner) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">

    <div className="text-center mb-4">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0284c7]">
        OUR STORE
      </span>
    </div>

    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
      {[
        image1,
        image2,
        image3,
        image4,
        image5,
      ].map((image, i) => (
        <div
          key={i}
          className="
            w-24 h-24
            sm:w-32 sm:h-24
            md:w-40 md:h-28
            lg:w-48 lg:h-32
            rounded-xl
            overflow-hidden
            border border-slate-200
            shadow-sm
            hover:scale-105
            hover:shadow-md
            transition-all duration-200
            cursor-pointer
          "
        >
          <img
            src={image}
            alt={`Our stationery shop ${i + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>

  </div>
</section>
      {/* ========================================================================= */}
      {/* 3. 5-COLUMN TRUST RIBBON */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-4 bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">FREE DELIVERY</h4>
              <p className="text-[11px] text-slate-500 font-medium">Orders Over ₹499</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">ZERO-CARD COD</h4>
              <p className="text-[11px] text-slate-500 font-medium">Cash / UPI on Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">100% GENUINE</h4>
              <p className="text-[11px] text-slate-500 font-medium">Original Publications</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">EASY EXCHANGE</h4>
              <p className="text-[11px] text-slate-500 font-medium">Store Exchange Policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3 col-span-2 md:col-span-1">
            <div className="w-10 h-10 rounded-lg bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">24/7 SUPPORT</h4>
              <p className="text-[11px] text-slate-500 font-medium">WhatsApp Assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SHOP BY CATEGORY */}
      {/* ========================================================================= */}
     <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex items-end justify-between gap-4 mb-6">
    <div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#dc2626] block mb-1">
        STORE DEPARTMENTS
      </span>

      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
        Shop By Category
      </h2>
    </div>

    <Link
      to="/products"
      className="text-xs font-bold text-[#0284c7] hover:text-[#dc2626] flex items-center gap-1 group transition-colors"
    >
      All Departments
      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
    </Link>
  </div>

  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
    {categories.map((cat, idx) => (
      <div
        key={cat._id}
        className="
          group
          bg-white
          rounded-2xl
          border border-slate-200
          overflow-hidden
          shadow-sm
          hover:shadow-lg
          hover:-translate-y-1
          transition-all duration-300
          h-full
          cursor-pointer
        "
      >
        {/* Category Image */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={cat.image}
            alt={cat.name}
            className="
              w-full h-full
              object-cover
              group-hover:scale-110
              transition-transform duration-500
            "
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />

          {/* Number */}
          <span className="
            absolute top-3 left-3
            w-7 h-7
            rounded-full
            bg-white/90
            backdrop-blur-sm
            flex items-center justify-center
            text-[11px]
            font-black
            text-slate-800
          ">
            {String(idx + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 text-center">
          <h3 className="
            text-sm sm:text-base
            font-black
            text-slate-900
            group-hover:text-[#0284c7]
            transition-colors
            truncate
          ">
            {cat.name}
          </h3>

          <p className="text-[11px] text-slate-500 mt-1">
            Explore our collection
          </p>

          <div className="
            mt-3
            inline-flex items-center gap-1
            text-[10px]
            font-bold
            uppercase
            tracking-wider
            text-[#0284c7]
            group-hover:text-[#dc2626]
            transition-colors
          ">
            Shop Now
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

      {/* ========================================================================= */}
      {/* 5. BEST SELLERS & FEATURED PRODUCTS */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#dc2626]" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
              Featured Products &amp; Best Sellers
            </h2>
          </div>

          <Link
            to="/products"
            className="text-xs font-extrabold text-[#0284c7] hover:text-[#dc2626] flex items-center gap-1 uppercase tracking-wider group transition-colors"
          >
            VIEW ALL <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {[1, 2, 3, 4].map((n) => (
              <ProductCardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 6. WHOLESALE & SCHOOL BULK ORDERS DUAL PROMO */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: School Guides 2026 */}
          <div className="rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white p-7 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden border border-[#0284c7] shadow-md">
            <div className="space-y-3 sm:max-w-xs text-center sm:text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#bae6fd] block">
                STATE BOARD &amp; CBSE 2026
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-display leading-tight text-white">
                Class 10, 11 &amp; 12 Solved Question Banks
              </h3>
              <p className="text-xs text-sky-100 font-medium">
                Physics, Chemistry, Computer Science, Economics, English &amp; Tamil guides.
              </p>
              <div className="pt-1">
                <Link
                  to="/products?category=school-guides"
                  className="inline-block px-5 py-2.5 rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] text-white font-extrabold text-xs uppercase tracking-wider shadow-xs transition-all active:scale-95"
                >
                  Browse Guides
                </Link>
              </div>
            </div>

            <div className="w-32 sm:w-36 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80"
                alt="School Guides"
                className="w-full h-auto object-contain rounded-xl border-2 border-white shadow-md"
              />
            </div>
          </div>

          {/* Card 2: Wholesale Commercial & School Packs */}
          <div className="rounded-2xl bg-[#f0f9ff] text-slate-900 p-7 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden border border-[#bae6fd] shadow-sm">
            <div className="space-y-3 sm:max-w-xs text-center sm:text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#dc2626] block">
                WHOLESALE &amp; INSTITUTIONAL
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900 leading-tight">
                Bulk School Booklist &amp; Office Packs
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                TNPL Copier paper, files, registers &amp; student kits at wholesale pricing.
              </p>
              <div className="pt-1">
                <a
                  href={whatsappBooklistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs uppercase tracking-wider shadow-xs transition-all active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Request Wholesale Quote
                </a>
              </div>
            </div>

            <div className="w-32 sm:w-36 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=400&q=80"
                alt="Wholesale Stationery"
                className="w-full h-auto object-contain rounded-xl border border-sky-200 shadow-xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PHYSICAL STORE LOCATION & CONTACT CARD (Tiruppur) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#dc2626] text-white flex items-center justify-center shrink-0 shadow-md">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-[#dc2626] tracking-wider block">
                VISIT OUR RETAIL &amp; WHOLESALE OUTLET
              </span>
              <h3 className="text-lg font-black text-slate-900 font-display">
                Surya Stores (சூர்யா ஸ்டோர்)
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                17, Kamatchiamman Koil Street, Tiruppur - 641604, Tamil Nadu
              </p>
              <p className="text-xs text-slate-500">
                Business Hours: Mon - Sat: 9:00 AM - 9:30 PM | Sun: 10:00 AM - 2:00 PM
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <a
              href={`tel:${settings.phone?.replace(/[^0-9+]/g, '')}`}
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#0284c7]" /> Call Store
            </a>
            <a
              href={whatsappBooklistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] text-white font-extrabold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
