import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalItemsCount, grandTotal } =
    useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner border border-blue-100">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Your Shopping Bag is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Explore our collection of 2026 school guides, textbooks, fine writing instruments, and art materials to add items.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-royal-600 hover:from-blue-700 hover:to-royal-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-95"
        >
          <ShoppingBag className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-royal-700 block mb-1">
            Shopping Cart
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Review Selected Items
          </h1>
          <p className="text-xs text-slate-500 mt-1">{totalItemsCount} item(s) selected in your bag</p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 shadow-xl divide-y divide-blue-50 space-y-6">
          {items.map((item) => {
            const lineSubtotal = item.price * item.quantity;
            return (
              <div key={item.product} className="pt-6 first:pt-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Thumbnail & Title */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 overflow-hidden shrink-0 shadow-inner">
                    <img
                      src={
                        item.image ||
                        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-royal-700 uppercase tracking-wider block">
                      {item.brand || item.categoryName}
                    </span>
                    <Link
                      to={`/products/${item.product}`}
                      className="font-extrabold text-slate-900 text-sm hover:text-royal-600 transition-colors line-clamp-2"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-xs text-slate-500">
                      Unit Price: <span className="font-bold text-slate-800">{formatCurrency(item.price)}</span>
                    </p>
                  </div>
                </div>

                {/* Stepper + Subtotal + Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-blue-100 rounded-full bg-white p-1 shadow-2xs">
                    <button
                      onClick={() => updateQuantity(item.product, item.quantity - 1)}
                      className="p-1.5 rounded-full text-slate-600 hover:bg-blue-50 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-black text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-1.5 rounded-full text-slate-600 hover:bg-blue-50 disabled:opacity-30 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[80px]">
                    <span className="text-sm font-black text-slate-900 block">
                      {formatCurrency(lineSubtotal)}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeFromCart(item.product)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-royal-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Add more items from catalog
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 sticky top-24">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Order Summary</h2>

          <div className="space-y-3 text-xs border-b border-blue-50 pb-4">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Items Subtotal ({totalItemsCount} qty)</span>
              <span className="font-bold text-slate-900">{formatCurrency(grandTotal)}</span>
            </div>

            <div className="flex justify-between text-slate-600 font-medium">
              <span>Store Pickup / Delivery</span>
              <span className="font-bold text-emerald-600">FREE / Local COD</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline pt-1">
            <span className="font-black text-slate-900 text-sm">Estimated Total</span>
            <span className="text-2xl font-black text-slate-900">{formatCurrency(grandTotal)}</span>
          </div>

          {/* Business Model Notice */}
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 text-xs text-royal-950 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Pay On Delivery / Pickup
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              No online credit/debit card required. Submit your order request and pay via cash or UPI when your stationery is ready.
            </p>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 rounded-full bg-gradient-to-r from-blue-600 to-royal-600 hover:from-blue-700 hover:to-royal-700 text-white font-black text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
