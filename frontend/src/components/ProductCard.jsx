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
    <div className="group relative bg-white rounded-xl border border-slate-200 p-2.5 sm:p-4 flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-md hover:border-[#38bdf8] transition-all duration-200 h-full">
      <div>
        {/* Product Image Frame */}
        <div className="relative aspect-square rounded-lg bg-[#f0f9ff] overflow-hidden block border border-slate-100 mb-2">
          <Link to={`/products/${productId}`} className="w-full h-full block">
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
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
            className={`absolute top-1.5 right-1.5 p-1 sm:p-1.5 rounded-full bg-white/90 shadow-2xs ${
              isWishlisted ? 'text-rose-500' : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
          </button>

          {/* Department Tag */}
          {product.category?.name && (
            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-extrabold uppercase bg-white/95 text-[#0284c7] shadow-2xs border border-sky-100 truncate max-w-[85px]">
              {product.category.name}
            </span>
          )}

          {/* Out of Stock */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs flex items-center justify-center">
              <span className="px-2 py-0.5 rounded-full bg-[#dc2626] text-white font-bold text-[9px] uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Product Meta */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between gap-1 text-[9px] sm:text-[10px]">
            <span className="font-extrabold uppercase text-[#0284c7] truncate">
              {product.brand || 'Surya Stores'}
            </span>
            <span className="font-bold text-emerald-600 shrink-0">● In Stock</span>
          </div>

          <Link
            to={`/products/${productId}`}
            className="block font-bold text-slate-900 text-xs sm:text-sm leading-tight group-hover:text-[#0284c7] transition-colors line-clamp-2 h-8 sm:h-9"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[10px] text-amber-500 pt-0.5">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-slate-400 text-[9px] font-semibold">(4.9)</span>
          </div>
        </div>
      </div>

      {/* Price & Add Button */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1">
          <span className="text-xs sm:text-sm font-black text-[#dc2626]">
            {formatCurrency(product.price)}
          </span>
          <span className="text-[9px] text-slate-400 line-through">
            {formatCurrency(originalPrice)}
          </span>
        </div>

        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-bold text-[11px] sm:text-xs flex items-center gap-1 transition-all shrink-0 ${
            isOutOfStock
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : isInCart
              ? 'bg-emerald-600 text-white'
              : 'bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white shadow-2xs'
          }`}
        >
          {isInCart ? (
            <>
              <Check className="w-3 h-3" /> <span className="hidden sm:inline">Added</span>
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
