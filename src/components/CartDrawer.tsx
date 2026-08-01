'use client';

import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, addToast } = useStore();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const freeShippingThreshold = 999;
  const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  const handleCheckout = () => {
    addToast('Checkout Initiated', 'Redirecting to secure payment gateway...');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={toggleCart}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#6C307D]" />
              <h2 className="text-base font-bold tracking-widest text-gray-900 uppercase">
                YOUR BAG ({cart.length})
              </h2>
            </div>
            <button
              onClick={toggleCart}
              className="text-gray-400 hover:text-gray-800 p-1 transition-colors"
              aria-label="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#FAF8F5] p-4 border-b border-[#EBE7DF] text-xs space-y-1.5">
            <p className="font-semibold text-gray-700">
              {subtotal >= freeShippingThreshold ? (
                <span className="text-emerald-700 font-bold">🎉 You qualify for FREE Express Shipping!</span>
              ) : (
                <>Add <span className="font-bold text-[#6C307D]">₹{(freeShippingThreshold - subtotal).toLocaleString('en-IN')}</span> more for FREE Shipping!</>
              )}
            </p>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6C307D] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-sm font-semibold text-gray-600">Your bag is currently empty.</p>
                <button
                  onClick={toggleCart}
                  className="bg-[#6C307D] text-white text-xs font-bold tracking-widest px-6 py-2.5 rounded-xs uppercase"
                >
                  START SHOPPING
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="pt-4 first:pt-0 flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover object-center rounded-xs border border-gray-100 bg-gray-50 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-gray-900">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Size: {item.selectedSize} | Color: {item.selectedColor}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 rounded-xs">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="p-1 text-gray-600 hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="p-1 text-gray-600 hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-gray-900">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-[#FAF8F5] space-y-4">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-700">
                    {subtotal >= freeShippingThreshold ? 'FREE' : '₹99'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-[#6C307D]">
                    ₹{(subtotal >= freeShippingThreshold ? subtotal : subtotal + 99).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold tracking-widest uppercase py-3 rounded-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                PROCEED TO CHECKOUT
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
