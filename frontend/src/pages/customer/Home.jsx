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
  Search,
  MessageSquare,
  TrendingUp,
  MapPin,
  Phone,
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

  const whatsappBooklistUrl = `https://wa.me/${settings.whatsAppNumber?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hello Surya Stores (Tiruppur), I want to send my school booklist / stationery requirements for pricing.`
  )}`;

  return (
    <div className="space-y-8 sm:space-y-16 pb-12 bg-[#f8fafc] overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: CLEAN MOBILE & DESKTOP BANNER */}
      {/* ========================================================================= */}
      <section className="relative bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#38bdf8] text-white overflow-hidden border-b-4 border-[#dc2626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-5">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#dc2626] text-white text-[10px] sm:text-xs font-black uppercase shadow-xs">
                <span>WHOLESALE &amp; RETAIL • TIRUPPUR</span>
              </div>

              {/* Headline */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-2xl font-black text-sky-100 tamil-font">
                    சூர்யா ஸ்டோர்
                  </span>
                  <span className="text-[10px] sm:text-xs uppercase font-bold text-sky-200">
                    (Kamatchiamman Koil St)
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-tight text-white">
                  Your Complete Stationery &amp;{' '}
                  <span className="bg-[#dc2626] px-2 py-0.5 rounded text-white inline-block">
                    School Guides
                  </span>{' '}
                  Store.
                </h1>
              </div>

              <p className="text-xs sm:text-sm text-sky-50 leading-relaxed font-medium">
                10th, 11th &amp; 12th State Board &amp; CBSE Guides, Classmate Notebooks, Pilot Pens, Art Supplies and TNPL Copier paper.
              </p>

              {/* Search Bar */}
              <form
                onSubmit={handleHeroSearch}
                className="max-w-lg relative flex items-center bg-white rounded-full p-1 shadow-md"
              >
                <div className="pl-3 text-[#0284c7]">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search books, guides, pens..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="flex-1 bg-transparent border-none py-1.5 px-2.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-extrabold text-xs rounded-full transition-all shrink-0"
                >
                  Search
                </button>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <Link
                  to="/products"
                  className="flex-1 sm:flex-initial text-center px-5 py-2.5 rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] text-white font-extrabold text-xs uppercase shadow-xs transition-all active:scale-95"
                >
                  Catalog
                </Link>
                <a
                  href={whatsappBooklistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial text-center px-4 py-2.5 rounded-lg bg-white text-[#0284c7] font-extrabold text-xs uppercase shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Send Booklist
                </a>
              </div>
            </div>

            {/* Right Column (Hero image hidden on tiny mobile screens to avoid scrolling clutter) */}
            <div className="hidden sm:block lg:col-span-5 relative">
              <div className="relative rounded-xl overflow-hidden shadow-xl border-4 border-white aspect-16/10 bg-white">
                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
                  alt="Surya Stores Stationery Collection"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. BRANDS RIBBON */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
  <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs">

    <div className="text-center mb-4">
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#0284c7]">
        OUR STORE
      </span>
    </div>

    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
      {[
        image1,
        image2,
        image3,
        image4,
        image5,
      ].map((image, index) => (
        <div
          key={index}
          className="
            w-32 h-24
            sm:w-40 sm:h-28
            md:w-48 md:h-32
            lg:w-52 lg:h-36
            rounded-xl
            overflow-hidden
            border border-slate-200
            shadow-sm
            bg-slate-50
            shrink-0
            hover:scale-[1.03]
            hover:shadow-lg
            transition-all duration-300
          "
        >
          <img
            src={image}
            alt={`Surya Stores ${index + 1}`}
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
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-2xs">
          <div className="flex items-center gap-2 p-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] font-black uppercase text-slate-900 leading-tight">FREE DELIVERY</h4>
              <p className="text-[9px] text-slate-500 font-medium">Over ₹499</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] font-black uppercase text-slate-900 leading-tight">ZERO-CARD COD</h4>
              <p className="text-[9px] text-slate-500 font-medium">Cash / UPI</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] font-black uppercase text-slate-900 leading-tight">100% GENUINE</h4>
              <p className="text-[9px] text-slate-500 font-medium">Original Prints</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] font-black uppercase text-slate-900 leading-tight">EASY EXCHANGE</h4>
              <p className="text-[9px] text-slate-500 font-medium">Shop Policy</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 col-span-2 sm:col-span-1">
            <div className="w-8 h-8 rounded-lg bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] font-black uppercase text-slate-900 leading-tight">WHATSAPP HELP</h4>
              <p className="text-[9px] text-slate-500 font-medium">Instant Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SHOP BY CATEGORY */}
      {/* ========================================================================= */}
      

      {/* ========================================================================= */}
      {/* 5. BEST SELLERS & FEATURED PRODUCTS */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-4">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#dc2626]" />
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 font-display">
              Featured Products
            </h2>
          </div>

          <Link
            to="/products"
            className="text-xs font-extrabold text-[#0284c7] hover:text-[#dc2626] flex items-center gap-1 uppercase"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {[1, 2, 3, 4].map((n) => (
              <ProductCardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 6. PHYSICAL STORE LOCATION & CONTACT CARD */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white border border-slate-200 p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3 w-full">
            <div className="w-10 h-10 rounded-lg bg-[#dc2626] text-white flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <span className="text-[9px] font-black uppercase text-[#dc2626] tracking-wider block">
                VISIT OUR STORE
              </span>
              <h3 className="text-base font-black text-slate-900 font-display">
                Surya Stores (சூர்யா ஸ்டோர்)
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                17, Kamatchiamman Koil Street, Tiruppur - 641604
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <a
              href={`tel:${settings.phone?.replace(/[^0-9+]/g, '')}`}
              className="flex-1 md:flex-initial px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 text-center flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-[#0284c7]" /> Call Store
            </a>
            <a
              href={whatsappBooklistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-initial px-4 py-2 rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] text-white font-extrabold text-xs shadow-xs text-center flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
