import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    freeDeliveryThreshold,
    isFreeDelivery,
    deliveryFee,
    grandTotal,
    totalItemsCount,
  } = useCart();

  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-amber-100/70 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Your Cart is Empty
          </h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Looks like you haven't added any stationery, books, or guides to your cart yet.
          </p>
        </div>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-600/25 transition-all"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
            Review Your Order
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-amber-900">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-amber-700" />
            {isFreeDelivery
              ? '🎉 Congratulations! You have unlocked FREE Local Delivery!'
              : `Add ₹${amountNeededForFreeDelivery.toFixed(2)} more to get FREE Local Delivery!`}
          </span>
          <span>₹{subtotal.toFixed(2)} / ₹{freeDeliveryThreshold}</span>
        </div>
        <div className="w-full bg-amber-200/60 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Main Grid: Cart Items & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Product Thumbnail & Details */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <img
                  src={
                    item.imageUrl ||
                    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80'
                  }
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-100"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                    {item.categoryName}
                  </span>
                  <Link
                    to={`/product/${item.id}`}
                    className="font-bold text-slate-900 text-sm sm:text-base hover:text-amber-700 transition-colors line-clamp-1 block"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Price: <strong className="text-slate-900 font-semibold">₹{item.price.toFixed(2)}</strong> each
                  </p>
                </div>
              </div>

              {/* Quantity Modifier & Line Item Total */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                {/* Stepper */}
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-lg hover:bg-white text-slate-700 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-lg hover:bg-white text-slate-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[70px]">
                  <span className="text-sm font-extrabold text-slate-900 block">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6 sticky top-28">
          <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-4">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600 items-center">
              <span className="flex items-center gap-1">
                Local Delivery
                {isFreeDelivery && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    FREE
                  </span>
                )}
              </span>
              <span className="font-semibold text-slate-900">
                {isFreeDelivery ? '₹0.00' : `₹${deliveryFee.toFixed(2)}`}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-extrabold text-base text-slate-900">Total Payable</span>
              <span className="text-2xl font-black text-amber-700">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 group transition-all"
            >
              <span>Proceed to Checkout (COD)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              to="/catalog"
              className="w-full py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs text-center block transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
            <p className="flex items-center gap-1.5 font-medium text-emerald-700">
              <ShieldCheck className="w-4 h-4 shrink-0" /> Pay after delivery / pickup at store.
            </p>
            <p>Our team will phone you to confirm your items before dispatch.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
