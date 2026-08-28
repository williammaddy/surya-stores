import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Minus,
  Plus,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  MessageSquare,
  AlertTriangle,
  Check,
  Sparkles,
} from 'lucide-react';
import productService from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { ProductDetailSkeleton } from '../../components/SkeletonLoader';
import ProductCard from '../../components/ProductCard';
import { formatCurrency } from '../../utils/formatCurrency';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  const { addToCart, items } = useCart();
  const { settings } = useSettings();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        setQuantity(1);
        const res = await productService.getProductById(id);
        if (res.data.success) {
          setProduct(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Product could not be found.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Product Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-500">{error || 'This product might have been moved or removed.'}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-bold text-xs shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>
    );
  }

  const isInCart = items.some((item) => item.product === product._id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
    }
  };

  const whatsappInquiryUrl = `https://wa.me/${settings.whatsAppNumber?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hello ${settings.storeName || 'Surya Stores'}, I am inquiring about "${product.name}" (SKU: ${product.sku || 'N/A'}). Is this available for immediate store pickup?`
  )}`;

  const imageSrc =
    product.image ||
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back Link */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-royal-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Shop Catalog
      </Link>

      {/* Main Product Presentation Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-xl border border-white/90 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image Showcase */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-4/3 sm:aspect-square rounded-3xl bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100/80 overflow-hidden shadow-inner">
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80';
              }}
            />

            {product.category?.name && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-900 border border-white shadow-xs">
                {product.category.name}
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2 border-b border-blue-50 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-royal-700">
                {product.brand || 'General Stationery'}
              </span>

              {product.sku && (
                <span className="text-xs font-mono font-bold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-blue-100 shadow-2xs">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Stock Badge */}
            <div className="pt-1">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span> Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Only {product.stock} left in stock!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> In Stock ({product.stock} units available)
                </span>
              )}
            </div>
          </div>

          {/* Price & Quantity Box */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                {formatCurrency(product.price)}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Inclusive of all taxes
              </span>
            </div>

            {/* Stepper + Add To Cart Button */}
            {!isOutOfStock && (
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <div className="flex items-center border border-blue-100 rounded-full bg-white p-1 shadow-xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2 rounded-full text-slate-600 hover:bg-blue-50 disabled:opacity-40 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="w-12 text-center text-sm font-black text-slate-900">
                    {quantity}
                  </span>

                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2 rounded-full text-slate-600 hover:bg-blue-50 disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 w-full py-3.5 px-6 rounded-full font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                    isInCart
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-royal-600 hover:from-blue-700 hover:to-royal-700 text-white shadow-blue-500/25 active:scale-98'
                  }`}
                >
                  {isInCart ? (
                    <>
                      <Check className="w-4 h-4" /> In Cart ({quantity} More Added)
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" /> Add to Shopping Bag
                    </>
                  )}
                </button>
              </div>
            )}

            {/* WhatsApp Quick Ask */}
            <div className="pt-2">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-full border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" /> Inquire Availability on WhatsApp
              </a>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-blue-50 pt-6 space-y-2">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">
              Product Details &amp; Specifications
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium">
              {product.description || 'Authentic stationery item verified by Surya Stores.'}
            </p>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-blue-50 pt-6 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Same-Day Store Pickup</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Genuine Item</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-royal-600 shrink-0" />
              <span>Easy Shop Exchange</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="space-y-6 pt-6">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            More From {product.category?.name || 'This Category'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {product.relatedProducts.map((rel) => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
