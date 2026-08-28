import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  Grid,
  Check,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productAPI, categoryAPI } from '../services/api';

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params extraction
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const minPriceParam = searchParams.get('min_price') || '';
  const maxPriceParam = searchParams.get('max_price') || '';
  const inStockParam = searchParams.get('in_stock') === 'true';

  // Local state for interactive filtering
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Form input states
  const [searchInput, setSearchInput] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSort, setSelectedSort] = useState(sortParam);
  const [minPriceInput, setMinPriceInput] = useState(minPriceParam);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPriceParam);
  const [inStockOnly, setInStockOnly] = useState(inStockParam);

  // Sync state with URL params when URL changes
  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSearchInput(searchParam);
    setSelectedSort(sortParam);
    setMinPriceInput(minPriceParam);
    setMaxPriceInput(maxPriceParam);
    setInStockOnly(inStockParam);
  }, [categoryParam, searchParam, sortParam, minPriceParam, maxPriceParam, inStockParam]);

  // Load categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryAPI.getAll();
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch products whenever params change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          category: categoryParam !== 'all' ? categoryParam : undefined,
          search: searchParam || undefined,
          sort: sortParam,
          min_price: minPriceParam || undefined,
          max_price: maxPriceParam || undefined,
          in_stock: inStockParam ? 'true' : undefined,
          limit: 100,
        };

        const res = await productAPI.getAll(params);
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, searchParam, sortParam, minPriceParam, maxPriceParam, inStockParam]);

  // Apply filters to URL
  const applyFilters = (newOverrides = {}) => {
    const newParams = new URLSearchParams();

    const cat = newOverrides.category !== undefined ? newOverrides.category : selectedCategory;
    const q = newOverrides.search !== undefined ? newOverrides.search : searchInput;
    const s = newOverrides.sort !== undefined ? newOverrides.sort : selectedSort;
    const minP = newOverrides.min_price !== undefined ? newOverrides.min_price : minPriceInput;
    const maxP = newOverrides.max_price !== undefined ? newOverrides.max_price : maxPriceInput;
    const stk = newOverrides.in_stock !== undefined ? newOverrides.in_stock : inStockOnly;

    if (cat && cat !== 'all') newParams.set('category', cat);
    if (q && q.trim()) newParams.set('search', q.trim());
    if (s && s !== 'newest') newParams.set('sort', s);
    if (minP) newParams.set('min_price', minP);
    if (maxP) newParams.set('max_price', maxP);
    if (stk) newParams.set('in_stock', 'true');

    setSearchParams(newParams);
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSelectedCategory('all');
    setSelectedSort('newest');
    setMinPriceInput('');
    setMaxPriceInput('');
    setInStockOnly(false);
    setSearchParams(new URLSearchParams());
    setMobileFilterOpen(false);
  };

  const hasActiveFilters =
    categoryParam !== 'all' ||
    Boolean(searchParam) ||
    sortParam !== 'newest' ||
    Boolean(minPriceParam) ||
    Boolean(maxPriceParam) ||
    inStockParam;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
            Store Catalog
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {categoryParam !== 'all'
              ? categories.find((c) => c.slug === categoryParam)?.name || 'Catalog'
              : 'All Products & Books'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Showing <strong className="text-slate-900">{products.length}</strong> items available in inventory
          </p>
        </div>

        {/* Top Search Input */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <input
              type="text"
              placeholder="Search in catalog..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput('');
                  applyFilters({ search: '' });
                }}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-1.5 text-sm font-semibold shrink-0"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6 sticky top-28">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" /> Filter &amp; Sort
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Categories list */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Categories
            </label>
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  applyFilters({ category: 'all' });
                }}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                  categoryParam === 'all'
                    ? 'bg-amber-600 text-white font-semibold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>All Departments</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    applyFilters({ category: cat.slug });
                  }}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                    categoryParam === cat.slug
                      ? 'bg-amber-600 text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md ${
                      categoryParam === cat.slug
                        ? 'bg-amber-700 text-amber-100'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {cat.productCount}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort selection */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Sort By
            </label>
            <select
              value={selectedSort}
              onChange={(e) => {
                setSelectedSort(e.target.value);
                applyFilters({ sort: e.target.value });
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Price Range (₹)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => applyFilters()}
              className="w-full mt-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
            >
              Apply Price
            </button>
          </div>

          {/* In stock toggle */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  applyFilters({ in_stock: e.target.checked });
                }}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
              />
              <span className="text-sm font-medium text-slate-800">In Stock Items Only</span>
            </label>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active filter badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 bg-amber-50/60 border border-amber-200/60 p-3 rounded-2xl">
              <span className="text-xs font-bold text-amber-900">Active Filters:</span>
              {categoryParam !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-xs font-medium text-amber-900 shadow-xs">
                  Category: {categories.find((c) => c.slug === categoryParam)?.name || categoryParam}
                  <button onClick={() => applyFilters({ category: 'all' })}>
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-700" />
                  </button>
                </span>
              )}
              {searchParam && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-xs font-medium text-amber-900 shadow-xs">
                  Search: "{searchParam}"
                  <button onClick={() => applyFilters({ search: '' })}>
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-700" />
                  </button>
                </span>
              )}
              {(minPriceParam || maxPriceParam) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-xs font-medium text-amber-900 shadow-xs">
                  Price: ₹{minPriceParam || '0'} - ₹{maxPriceParam || '∞'}
                  <button onClick={() => applyFilters({ min_price: '', max_price: '' })}>
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-700" />
                  </button>
                </span>
              )}
              {inStockParam && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-xs font-medium text-amber-900 shadow-xs">
                  In Stock Only
                  <button onClick={() => applyFilters({ in_stock: false })}>
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-700" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Grid display */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse space-y-4">
                  <div className="aspect-4/3 bg-slate-200 rounded-xl"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-8 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No products found</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                We couldn't find any products matching your current filters. Try changing your search keyword or
                resetting filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-colors inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-900 text-base">Filter Catalog</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="all">All Departments</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Sort Order
                </label>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                </select>
              </div>

              {/* Price range */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Price Range (₹)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* In stock */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                />
                <span className="text-sm font-medium text-slate-800">In Stock Only</span>
              </label>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => applyFilters()}
                className="w-full py-3 rounded-xl bg-amber-600 text-white font-bold text-sm shadow-md"
              >
                Apply Filters
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
