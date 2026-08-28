import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

const ProductCard = ({ product }) => {
  const { addToCart, items } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) return null;

  const productId = product._id || product.id;
  const isInCart = items.some((item) => item.product === productId);
  const isOutOfStock = product.stock <= 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  const imageSrc =
    product.image ||
    'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80';

  const originalPrice = Math.round(product.price * 1.25);

  return (
    <div className="group relative bg-white rounded-xl border border-slate-200 hover:border-[#38bdf8] p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md hover:shadow-sky-500/10 transition-all duration-200">
      <div>
        {/* Product Image Frame */}
        <div className="relative aspect-square rounded-lg bg-gradient-to-b from-[#f0f9ff] to-[#f8fafc] overflow-hidden block border border-slate-100">
          <Link to={`/products/${productId}`} className="w-full h-full block">
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-contain p-2.5 group-hover:scale-105 transition-transform duration-300 ease-out"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
              }}
            />
          </Link>

          {/* Wishlist Heart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
            className={`absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/95 shadow-xs transition-colors ${
              isWishlisted ? 'text-rose-500' : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
          </button>

          {/* Category Tag */}
          {product.category?.name && (
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] shadow-2xs">
              {product.category.name}
            </span>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex items-center justify-center">
              <span className="px-3 py-1 rounded-full bg-[#dc2626] text-white font-bold text-[10px] uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="pt-3 space-y-1">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#0284c7] truncate">
              {product.brand || 'Surya Stores'}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> In Stock
            </span>
          </div>

          <Link
            to={`/products/${productId}`}
            className="block font-bold text-slate-900 text-xs sm:text-sm leading-snug group-hover:text-[#0284c7] transition-colors line-clamp-2"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 pt-0.5 text-[11px] text-amber-500">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-slate-400 text-[10px] font-semibold">(4.9)</span>
          </div>
        </div>
      </div>

      {/* Price & Add To Cart Button */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm sm:text-base font-black text-[#dc2626]">
            {formatCurrency(product.price)}
          </span>
          <span className="text-[10px] text-slate-400 line-through">
            {formatCurrency(originalPrice)}
          </span>
        </div>

        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={`px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-all ${
            isOutOfStock
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : isInCart
              ? 'bg-emerald-600 text-white'
              : 'bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-xs active:scale-95'
          }`}
        >
          {isInCart ? (
            <>
              <Check className="w-3 h-3" /> Added
            </>
          ) : (
            <>
              <ShoppingBag className="w-3 h-3" /> Add
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
