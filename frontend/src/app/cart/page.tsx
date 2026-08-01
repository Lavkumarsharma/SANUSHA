'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toast } from '@/components/Toast';
import { useStore, getProductImage } from '@/store/useStore';
import { fetchApi } from '@/lib/api';

export default function ShoppingCartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    addToast,
    appliedCoupon,
    couponDiscount,
    couponError,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [couponInput, setCouponInput] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Safe Number Converters preventing NaN
  const getItemPrice = (item: any) => {
    const val = item?.product?.price ?? item?.price ?? 0;
    const num = typeof val === 'number' ? val : parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  const getItemQuantity = (item: any) => {
    const qty = item?.quantity ?? 1;
    const num = typeof qty === 'number' ? qty : parseInt(qty, 10);
    return isNaN(num) || num < 1 ? 1 : num;
  };

  const subtotal = cart.reduce((sum, item) => {
    return sum + getItemPrice(item) * getItemQuantity(item);
  }, 0);

  const discount = couponDiscount || 0;
  const shippingFee = 0;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const handleApplyCoupon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) return;

    setValidatingCoupon(true);
    const res = await applyCoupon(couponInput.trim(), subtotal);
    setValidatingCoupon(false);
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleQuickApply = async (code: string) => {
    setCouponInput(code);
    setValidatingCoupon(true);
    await applyCoupon(code, subtotal);
    setValidatingCoupon(false);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const newOrder = await fetchApi('/orders', {
        method: 'POST',
        body: JSON.stringify({
          customerName: 'Law Kumar',
          email: 'lawkumar@gmail.com',
          phone: '+91 98765 43210',
          shippingAddress: '123, Green Park Extension, New Delhi 110016 India',
          subtotal,
          discount,
          couponCode: appliedCoupon?.code || undefined,
          shippingFee,
          total,
          items: cart.map((it) => ({
            productId: it.product?.id?.length > 10 ? it.product.id : undefined,
            productName: it.product?.name || (it as any).name || 'Fashion Item',
            quantity: getItemQuantity(it),
            price: getItemPrice(it),
            size: it.size || 'M',
            color: it.color || 'Default',
          })),
        }),
      });

      setOrderSuccess(newOrder);
      addToast('Order Placed Successfully!', `Order #${newOrder.orderNumber} created.`);
      clearCart();
    } catch (err: any) {
      alert(err.message || 'Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow">
        {/* Sleek Slim Background Image Header Banner */}
        <section className="relative w-full h-[100px] sm:h-[120px] bg-slate-950 flex items-center justify-center overflow-hidden border-b border-[#E2DDD2]">
          <img
            src="/images/shop_banner.jpg"
            alt="Shopping Cart Banner"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.8] contrast-105"
            style={{ imageRendering: 'auto' as any }}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
          <div className="relative z-10 text-center text-white space-y-1 px-4">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight drop-shadow-md">
              Your Cart
            </h1>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-200 font-medium pt-0.5">
              <Link href="/" className="hover:text-amber-200 transition-colors">Home</Link>
              <span className="text-amber-300/80">/</span>
              <span className="text-amber-200 font-bold">Cart</span>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
          {orderSuccess ? (
            <div className="text-center py-16 bg-[#FAF8F5] border border-emerald-200 rounded-xs max-w-lg mx-auto space-y-4 shadow-sm p-8">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                Order Placed Successfully!
              </h2>
              <p className="text-xs text-gray-600 font-medium">
                Thank you for your order! Your order number is{' '}
                <span className="font-bold text-[#6C307D] font-mono">#{orderSuccess.orderNumber}</span>.
              </p>
              <div className="pt-3 flex justify-center gap-3">
                <Link
                  href="/account"
                  className="bg-[#6C307D] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xs hover:bg-[#522061]"
                >
                  VIEW ORDER IN PROFILE
                </Link>
                <Link
                  href="/shop"
                  className="border border-[#6C307D] text-[#6C307D] text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xs hover:bg-[#FAF8F5]"
                >
                  CONTINUE SHOPPING
                </Link>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-16 bg-[#FAF8F5] border border-[#EBE7DF] rounded-xs max-w-md mx-auto space-y-4">
              <ShoppingBag className="w-12 h-12 text-[#6C307D] mx-auto" />
              <h3 className="text-lg font-serif font-bold text-gray-900">Your Cart is Empty</h3>
              <Link
                href="/shop"
                className="inline-block bg-[#6C307D] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xs hover:bg-[#522061]"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <div className="border border-[#EBE7DF] rounded-xs overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] border-b border-[#EBE7DF] font-bold text-gray-900 uppercase">
                      <tr>
                        <th className="p-4">Product</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Quantity</th>
                        <th className="p-4">Total</th>
                        <th className="p-4 text-right">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBE7DF]">
                      {cart.map((item) => {
                        const price = getItemPrice(item);
                        const qty = getItemQuantity(item);
                        const lineTotal = price * qty;
                        const pName = item.product?.name || (item as any).name || 'Product';
                        const pImg = getProductImage(item.product || item);

                        return (
                          <tr key={item.id} className="hover:bg-[#FAF8F5]/50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-4">
                                <img
                                  src={pImg}
                                  alt={pName}
                                  className="w-14 h-14 object-cover rounded-xs border border-[#EBE7DF]"
                                />
                                <div>
                                  <h4 className="font-bold text-gray-900">{pName}</h4>
                                  <span className="text-[10px] text-gray-500 font-medium block">
                                    Size: {item.size || 'M'} • Color: {item.color || 'Default'}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 font-bold text-gray-900">₹{price.toLocaleString()}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2 border border-[#EBE7DF] rounded-xs w-24 justify-between px-2 py-1 bg-white font-bold">
                                <button
                                  onClick={() => updateQuantity(item.id, Math.max(1, qty - 1))}
                                  className="text-gray-500 hover:text-black text-sm"
                                >
                                  -
                                </button>
                                <span>{qty}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, qty + 1)}
                                  className="text-gray-500 hover:text-black text-sm"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="p-4 font-serif font-bold text-gray-900">
                              ₹{lineTotal.toLocaleString()}
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 font-bold text-[#6C307D] hover:underline uppercase tracking-wider"
                  >
                    <ArrowLeft className="w-4 h-4" /> Continue Shopping
                  </Link>

                  <button
                    onClick={clearCart}
                    className="text-gray-500 hover:text-red-600 font-bold uppercase tracking-wider text-[11px]"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Order Summary & Coupon Code Box */}
              <div className="lg:col-span-4 space-y-5">
                <div className="bg-[#FAF8F5] border border-[#EBE7DF] p-6 rounded-xs space-y-5 shadow-2xs">
                  <h3 className="font-serif font-bold text-gray-900 text-lg border-b border-[#EBE7DF] pb-3 flex items-center justify-between">
                    <span>Order Summary</span>
                    <span className="text-xs font-sans font-bold text-[#6C307D]">
                      {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
                    </span>
                  </h3>

                  {/* PROMO / DISCOUNT COUPON CARD */}
                  <div className="bg-white border border-[#E2DDD2] p-4 rounded-xs space-y-3">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-800">
                      <span>Promo / Coupon Code</span>
                    </label>

                    {appliedCoupon ? (
                      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xs flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800 font-mono uppercase">
                            <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded font-sans">
                              APPLIED
                            </span>
                            {appliedCoupon.code}
                          </div>
                          <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
                            You save ₹{discount.toLocaleString()} on this order!
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="text-xs text-red-600 hover:text-red-800 font-bold uppercase tracking-wider underline p-1"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter Promo Code"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                            className="flex-1 border border-gray-300 rounded-xs p-2 text-xs font-mono font-bold uppercase text-gray-900 focus:border-[#6C307D] outline-none"
                          />
                          <button
                            type="submit"
                            disabled={validatingCoupon || !couponInput.trim()}
                            className="bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xs disabled:opacity-50 transition-colors shrink-0"
                          >
                            {validatingCoupon ? '...' : 'Apply'}
                          </button>
                        </div>

                        {couponError && (
                          <p className="text-[11px] text-red-600 font-bold flex items-center gap-1">
                            ⚠️ {couponError}
                          </p>
                        )}
                      </form>
                    )}

                    {/* Quick Preset Coupons */}
                    {!appliedCoupon && (
                      <div className="pt-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          Available Coupons:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { code: 'SANUSHA10', label: '10% OFF' },
                            { code: 'WELCOME100', label: '₹100 OFF' },
                            { code: 'FESTIVE20', label: '20% OFF' },
                          ].map((cp) => (
                            <button
                              key={cp.code}
                              type="button"
                              onClick={() => handleQuickApply(cp.code)}
                              className="text-[10px] font-mono font-bold bg-[#FAF8F5] hover:bg-[#6C307D] hover:text-white text-gray-700 border border-[#E2DDD2] px-2 py-0.5 rounded-xs transition-colors"
                            >
                              + {cp.code}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5 text-xs font-medium text-gray-700">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Discount ({appliedCoupon?.code || 'PROMO'})</span>
                        <span>- ₹{discount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Shipping Fee</span>
                      <span className="font-bold text-emerald-700 uppercase text-[10px]">FREE</span>
                    </div>

                    <div className="border-t border-[#EBE7DF] pt-3 flex justify-between items-center text-base font-serif font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-[#6C307D]">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold uppercase tracking-widest py-4 rounded-xs shadow-md transition-all flex items-center justify-center gap-2 text-center hover:scale-[1.01]"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Proceed to Checkout</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
      <Toast />
    </div>
  );
}
