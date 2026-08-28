import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Bookmark,
  Gamepad2,
  GraduationCap,
  CheckCircle2,
  PhoneCall,
  ShoppingBag,
  TrendingUp,
  Percent,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productAPI, categoryAPI } from '../services/api';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          productAPI.getAll({ featured: 'true', limit: 8 }),
          categoryAPI.getAll(),
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

  const categoryIcons = {
    stationery: Bookmark,
    toys: Gamepad2,
    books: BookOpen,
    'school-guides': GraduationCap,
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50/40 to-amber-100/30 border-b border-amber-100 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300/80 text-amber-900 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>2026 Academic Year Stationery & Guides Ready!</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Everything for School, Study &amp; Play at{' '}
                <span className="text-amber-700 underline decoration-amber-300 decoration-wavy decoration-2">
                  Surya Store
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Your trusted one-stop shop for CBSE/State school guidebooks, premium stationery, creative art
                supplies, and educational toys. Order online with <strong>Cash on Delivery</strong> or quick store pickup!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/catalog"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-lg shadow-amber-600/25 hover:shadow-xl hover:shadow-amber-600/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Browse Full Catalog</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/catalog?category=school-guides"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-5 h-5 text-amber-600" />
                  <span>School Guides &amp; Notes</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Cash on Delivery
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Fast Local Delivery
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Genuine Publications
                </span>
              </div>
            </div>

            {/* Right Hero Graphic Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative background glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl opacity-20 blur-xl"></div>

                <div className="relative rounded-3xl bg-white p-4 shadow-2xl border border-amber-100 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80"
                    alt="Surya Store Showcase"
                    className="rounded-2xl object-cover w-full h-[360px]"
                  />

                  {/* Floating badge */}
                  <div className="absolute bottom-7 left-7 right-7 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-amber-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                        Neighborhood Favorite
                      </span>
                      <p className="font-extrabold text-slate-900 text-sm">Over 500+ Stationery &amp; Book Items</p>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs">
                      100% Stocked
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
              Explore Departments
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/catalog"
            className="text-sm font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
          >
            All Categories <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug] || BookOpen;
            return (
              <Link
                key={category.id}
                to={`/catalog?category=${category.slug}`}
                className="group relative rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-xs">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    {category.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 relative z-10">
                  <span>{category.productCount} items in stock</span>
                  <span className="text-amber-700 group-hover:translate-x-1 transition-transform">
                    Explore →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular / Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">
              <TrendingUp className="w-3.5 h-3.5" /> Best Sellers
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Products
            </h2>
          </div>
          <Link
            to="/catalog"
            className="text-sm font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
          >
            View Full Inventory <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse space-y-4">
                <div className="aspect-4/3 bg-slate-200 rounded-xl"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* School Guides Promotion Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-8 sm:p-12 overflow-hidden shadow-xl border border-slate-800">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider">
              Exam Season Ready
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Class 10 &amp; 12 NCERT, All-In-One &amp; Sample Papers in Stock
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Ensure top scores with the latest solved papers, chapterwise revision notes, and reference books
              for CBSE, ICSE, and State Boards.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/catalog?category=school-guides"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors shadow-md"
              >
                Browse School Guides
              </Link>
              <a
                href="https://wa.me/919876543210?text=Hello%20Surya%20Store%2C%20do%20you%20have%20guides%20for%20my%20syllabus%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors border border-slate-700 flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-amber-400" />
                Ask Stock on WhatsApp
              </a>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 hidden lg:block pointer-events-none">
            <GraduationCap className="w-full h-full text-amber-400" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
