import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  PhoneCall,
  ArrowLeft,
  AlertTriangle,
  Minus,
  Plus,
  Zap,
} from 'lucide-react';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await productAPI.getById(id);
        if (res.data.success) {
          setProduct(res.data.data);
          setQuantity(1);
        }
      } catch (err) {
        console.error('Error loading product details:', err);
        setError('Could not find or load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 animate-pulse grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-slate-200 rounded-2xl"></div>
          <div className="space-y-4 py-4">
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
            <div className="h-24 bg-slate-200 rounded"></div>
            <div className="h-12 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'The product you requested does not exist.'}</p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 text-white font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
  const isInCart = items.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  const imageSrc =
    product.imageUrl ||
    'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link to="/" className="hover:text-slate-900">
          Home
        </Link>
        <span>/</span>
        <Link to={`/catalog?category=${product.category?.slug}`} className="hover:text-slate-900">
          {product.category?.name || 'Category'}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10">
          {/* Left Column: Image Preview */}
          <div className="lg:col-span-6">
            <div className="relative aspect-square rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shadow-inner flex items-center justify-center">
              <img
                src={imageSrc}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
                }}
              />

              {product.featured && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950 shadow-md">
                  ★ Popular Choice
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category tag */}
              <div className="flex items-center gap-3">
                <Link
                  to={`/catalog?category=${product.category?.slug}`}
                  className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
                >
                  {product.category?.name}
                </Link>

                {isOutOfStock ? (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                    Only {product.stockQuantity} Remaining
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    ✓ In Stock ({product.stockQuantity} available)
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 inline-flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">
                  ₹{Number(product.price).toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 font-medium">Inclusive of all local taxes</span>
              </div>

              {/* Description */}
              <div className="prose prose-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Product Description
                </h4>
                <p>{product.description || 'Quality product available at Surya Store.'}</p>
              </div>
            </div>

            {/* Quantity Selector & Purchase Buttons */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => Math.min(product.stockQuantity, prev + 1))}
                    disabled={quantity >= product.stockQuantity || isOutOfStock}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                    isOutOfStock
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : isInCart
                      ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isInCart ? 'Add More to Cart' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="py-3.5 px-6 rounded-2xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  Buy Now (COD)
                </button>
              </div>

              {/* Assistance Link */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/919876543210?text=Hi%20Surya%20Store%2C%20I%20am%20interested%20in%20"${encodeURIComponent(
                    product.name
                  )}"%20(Price%3A%20%E2%82%B9${product.price}).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200/80 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Quick Inquiry on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Related Items from {product.category?.name}
            </h3>
            <Link
              to={`/catalog?category=${product.category?.slug}`}
              className="text-xs font-bold text-amber-700 hover:text-amber-800"
            >
              See All in Category →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {product.relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
