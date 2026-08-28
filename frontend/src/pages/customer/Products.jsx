import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  Check,
  BookOpen,
} from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { ProductCardSkeleton } from '../../components/SkeletonLoader';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1, limit: 12 });

  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const selectedBrand = searchParams.get('brand') || 'all';
  const inStockOnly = searchParams.get('inStock') === 'true';
  const sortOption = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page'), 10) || 1;

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 12,
          sort: sortOption,
        };

        if (selectedCategory && selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        if (searchQuery && searchQuery.trim() !== '') {
          params.search = searchQuery.trim();
        }
        if (selectedBrand && selectedBrand !== 'all') {
          params.brand = selectedBrand;
        }
        if (inStockOnly) {
          params.inStock = 'true';
        }

        const res = await productService.getProducts(params);
        if (res.data.success) {
          setProducts(res.data.data);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [selectedCategory, searchQuery, selectedBrand, inStockOnly, sortOption, currentPage]);

  const updateFilters = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all' || value === false) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    if (!newParams.page) {
      params.set('page', '1');
    }

    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim() });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const availableBrands = [
    'Classmate',
    'Doms',
    'Pilot',
    'Camlin',
    'Nataraj',
    'Apsara',
    'Cello',
    'Flair',
    'Luxor',
    'Rorito',
    'Hauser',
    'Kangaro',
    'Reynolds',
    'Casio',
    'TNPL Copier',
    'Oxford',
    'Arihant Publications',
    'MTG Learning',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#f8fafc]">
      {/* Header Bar */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#dc2626] block mb-1">
            SURYA STORES TIRUPPUR
          </span>
          <h1 className="text-3xl font-black text-slate-900 font-display tracking-tight">
            Stationery, Guides &amp; Books Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Showing {pagination.total} genuine school guides, notebooks, fine pens &amp; supplies
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search items..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-[#bae6fd] rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#0284c7] focus:outline-none shadow-2xs"
            />
            <Search className="w-3.5 h-3.5 text-[#0284c7] absolute left-3 top-2.5" />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateFilters({ search: '' });
                }}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </form>

          {/* Sort Dropdown */}
          <select
            value={sortOption}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0284c7] focus:outline-none cursor-pointer shadow-2xs"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
          </select>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden px-3.5 py-2 rounded-lg bg-[#dc2626] text-white text-xs font-bold flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
          </button>
        </div>
      </div>

      {/* Main 2-Column Catalog Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Desktop Left Sidebar */}
        <aside className="hidden md:block bg-white rounded-xl p-5 border border-slate-200 space-y-6 sticky top-24 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#0284c7]" /> Filter By
            </span>
            {(selectedCategory !== 'all' || searchQuery || selectedBrand !== 'all' || inStockOnly) && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-[#dc2626] hover:underline"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
              Department
            </label>
            <div className="space-y-1">
              <button
                onClick={() => updateFilters({ category: 'all' })}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-[#0284c7] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-[#f0f9ff] hover:text-[#0284c7]'
                }`}
              >
                <span>All Departments</span>
              </button>

              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat._id}
                    onClick={() => updateFilters({ category: cat.slug })}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#0284c7] text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-[#f0f9ff] hover:text-[#0284c7]'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    {cat.productCount !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#f0f9ff] text-[#0284c7]'
                        }`}
                      >
                        {cat.productCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* In-Stock Only Toggle */}
          <div className="pt-3 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => updateFilters({ inStock: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-[#0284c7] focus:ring-[#0284c7] border-slate-300"
              />
              <span className="text-xs font-bold text-slate-800">In-Stock Only</span>
            </label>
          </div>

          {/* Brand Filter */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
              Brand / Manufacturer
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => updateFilters({ brand: e.target.value })}
              className="w-full py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0284c7]"
            >
              <option value="all">All Brands</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* Right Products Column */}
        <div className="md:col-span-3 space-y-5">
          {/* Active Filter Badges */}
          {(selectedCategory !== 'all' || searchQuery || selectedBrand !== 'all' || inStockOnly) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Applied:</span>
              {selectedCategory !== 'all' && (
                <span className="px-2.5 py-1 rounded-md bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] text-xs font-bold flex items-center gap-1">
                  Category: {selectedCategory}
                  <button onClick={() => updateFilters({ category: 'all' })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="px-2.5 py-1 rounded-md bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] text-xs font-bold flex items-center gap-1">
                  "{searchQuery}"
                  <button onClick={() => updateFilters({ search: '' })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedBrand !== 'all' && (
                <span className="px-2.5 py-1 rounded-md bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] text-xs font-bold flex items-center gap-1">
                  Brand: {selectedBrand}
                  <button onClick={() => updateFilters({ brand: 'all' })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                  In Stock Only
                  <button onClick={() => updateFilters({ inStock: false })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Grid Render */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <ProductCardSkeleton key={n} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center space-y-4 border border-slate-200">
              <div className="w-14 h-14 rounded-xl bg-[#f0f9ff] text-[#0284c7] flex items-center justify-center mx-auto">
                <PackageOpen className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-slate-900">No Matching Stationery Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find items matching your search or filters. Try clearing your filters or search terms.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2 rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] text-white font-extrabold text-xs shadow-xs transition-all"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => updateFilters({ page: Math.max(1, currentPage - 1) })}
                disabled={currentPage <= 1}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <span className="text-xs font-bold text-slate-600">
                Page {currentPage} of {pagination.totalPages}
              </span>

              <button
                onClick={() => updateFilters({ page: Math.min(pagination.totalPages, currentPage + 1) })}
                disabled={currentPage >= pagination.totalPages}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-2xs"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Filter Catalog</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-2">Category</label>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      updateFilters({ category: 'all' });
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
                      selectedCategory === 'all' ? 'bg-[#0284c7] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    All Departments
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => {
                        updateFilters({ category: c.slug });
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
                        selectedCategory === c.slug ? 'bg-[#0284c7] text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer py-2">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => updateFilters({ inStock: e.target.checked })}
                    className="w-3.5 h-3.5 rounded text-[#0284c7]"
                  />
                  <span className="text-xs font-bold text-slate-800">In-Stock Only</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-2.5 rounded-lg bg-[#dc2626] text-white text-xs font-bold shadow-xs"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
