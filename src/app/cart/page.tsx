'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  Plus,
  Minus,
  Heart,
  Trash2,
  Lock,
  Tag,
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { ValuePropsBar } from '@/components/ValuePropsBar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { QuickViewModal } from '@/components/QuickViewModal';
import { Toast } from '@/components/Toast';
import { useStore, PRODUCTS_DATA } from '@/store/useStore';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    wishlist,
    toggleWishlist,
    addToCart,
    addToast,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(759); // Default coupon discount matching reference
  const [appliedCoupon, setAppliedCoupon] = useState('SANUSHA10');

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const finalTotal = Math.max(0, subtotal - (subtotal > 0 ? discountAmount : 0));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    if (
      couponCode.toUpperCase() === 'SANUSHA10' ||
      couponCode.toUpperCase() === 'FIRST10'
    ) {
      const calcDiscount = Math.round(subtotal * 0.1);
      setDiscountAmount(calcDiscount);
      setAppliedCoupon(couponCode.toUpperCase());
      addToast('Coupon Applied!', `10% discount (-₹${calcDiscount}) applied.`);
    } else {
      addToast('Invalid Coupon', 'Please enter a valid code like SANUSHA10.');
    }
  };

  const handleProceedToCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow">
        {/* Cart Hero Banner matching reference screenshot */}
        <section className="relative w-full bg-[#ECE8DF] border-b border-[#E2DDD2] overflow-hidden py-12 sm:py-16 px-4 sm:px-8">
          <div
            className="absolute inset-0 bg-cover bg-right sm:bg-center opacity-85"
            style={{ backgroundImage: `url('/images/summer_banner.jpg')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#ECE8DF] via-[#ECE8DF]/80 to-transparent" />
          </div>

          <div className="relative max-w-7xl mx-auto space-y-3">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight">
              Your Cart
            </h1>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">
              <Link href="/" className="hover:text-[#6C307D] transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-bold">Cart</span>
            </div>
          </div>
        </section>

        {/* Main Cart Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          {cart.length === 0 ? (
            <div className="text-center py-16 bg-[#FAF8F5] rounded-xs border border-[#EBE7DF] space-y-4 max-w-xl mx-auto">
              <ShoppingBag className="w-12 h-12 text-[#6C307D] mx-auto opacity-70" />
              <h3 className="text-lg font-serif font-bold text-gray-900">Your bag is currently empty</h3>
              <p className="text-xs text-gray-600 font-medium max-w-xs mx-auto">
                Explore our latest luxury linen co-ords, oversized tees, and modern fashion edits.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xs transition-colors shadow-xs"
              >
                START SHOPPING
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Cart Table & Actions (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Table Header matching reference */}
                <div className="hidden sm:grid grid-cols-12 pb-3 border-b border-gray-200 text-xs font-bold text-gray-900 uppercase tracking-wider">
                  <div className="col-span-6">PRODUCT</div>
                  <div className="col-span-2 text-center">PRICE</div>
                  <div className="col-span-2 text-center">QUANTITY</div>
                  <div className="col-span-2 text-right">TOTAL</div>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-gray-200">
                  {cart.map((item, idx) => {
                    const isWishlisted = wishlist.includes(item.product.id);
                    const itemTotal = item.product.price * item.quantity;

                    return (
                      <div
                        key={idx}
                        className="py-6 first:pt-0 flex flex-col sm:grid sm:grid-cols-12 items-center gap-4 sm:gap-2"
                      >
                        {/* Product Thumbnail & Details (col-span-6) */}
                        <div className="sm:col-span-6 flex gap-4 w-full">
                          <Link href={`/product/${item.product.id}`} className="shrink-0">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xs border border-gray-100 bg-gray-50"
                            />
                          </Link>

                          <div className="flex flex-col justify-between py-0.5 flex-grow">
                            <div>
                              <Link href={`/product/${item.product.id}`}>
                                <h3 className="text-sm font-bold text-gray-900 hover:text-[#6C307D] transition-colors">
                                  {item.product.name}
                                </h3>
                              </Link>
                              <p className="text-xs text-gray-500 mt-1 font-medium">
                                Size: {item.selectedSize} &nbsp;•&nbsp; Color: {item.selectedColor}
                              </p>
                            </div>

                            {/* Move to Wishlist Link */}
                            <button
                              onClick={() => {
                                toggleWishlist(item.product.id);
                                addToast('Wishlist Updated', `Moved ${item.product.name} to wishlist.`);
                              }}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-[#6C307D] transition-colors mt-2"
                            >
                              <span>Move to Wishlist</span>
                              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                            </button>
                          </div>
                        </div>

                        {/* Price (col-span-2) */}
                        <div className="sm:col-span-2 text-center text-xs font-bold text-gray-900 w-full sm:w-auto flex justify-between sm:justify-center">
                          <span className="sm:hidden text-gray-500 font-medium">Price:</span>
                          <span>₹{item.product.price.toLocaleString('en-IN')}</span>
                        </div>

                        {/* Quantity Stepper (col-span-2) */}
                        <div className="sm:col-span-2 flex justify-center w-full sm:w-auto">
                          <div className="inline-flex items-center border border-gray-300 rounded-xs bg-[#FAF8F5]">
                            <button
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="p-1.5 text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="p-1.5 text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Item Total & Remove Cross (col-span-2) */}
                        <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                          <span className="text-xs font-bold text-gray-900">
                            ₹{itemTotal.toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-gray-900 p-1 transition-colors"
                            aria-label="Remove Item"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Action Bar matching reference */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 border border-gray-300 hover:border-gray-500 bg-white text-gray-800 text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-xs transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    CONTINUE SHOPPING
                  </Link>

                  <button
                    onClick={() => {
                      clearCart();
                      addToast('Cart Cleared', 'All items removed from cart.');
                    }}
                    className="inline-flex items-center gap-1.5 border border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-500 text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    CLEAR CART
                  </button>
                </div>

              </div>

              {/* Right Column: ORDER SUMMARY (4 cols) */}
              <div className="lg:col-span-4 bg-[#FAF8F5] border border-[#EBE7DF] rounded-xs p-6 space-y-6 shadow-xs">
                <h3 className="text-sm font-bold tracking-widest text-gray-900 uppercase">
                  ORDER SUMMARY
                </h3>

                {/* Summary Items */}
                <div className="space-y-3 text-xs font-medium text-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} Items)</span>
                    <span className="font-bold text-gray-900">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-bold text-emerald-700 uppercase">FREE</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount</span>
                      <span className="font-bold">- ₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="w-full h-[1px] bg-gray-200 my-2" />

                  <div className="flex justify-between items-baseline pt-1">
                    <div>
                      <span className="text-sm font-bold text-gray-900">Total</span>
                      <p className="text-[10px] text-gray-500 font-normal">
                        (Inclusive of all taxes)
                      </p>
                    </div>
                    <span className="text-xl font-bold text-[#6C307D]">
                      ₹{finalTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Buttons matching reference screenshot */}
                <div className="space-y-3">
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold tracking-widest uppercase py-3.5 rounded-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Lock className="w-4 h-4" />
                    PROCEED TO CHECKOUT
                  </button>

                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-white hover:bg-gray-50 border border-[#6C307D] text-[#6C307D] text-xs font-bold tracking-widest uppercase py-3 rounded-xs transition-colors"
                  >
                    BUY NOW
                  </button>
                </div>

                {/* Have a Coupon Accordion Box */}
                <form onSubmit={handleApplyCoupon} className="pt-2">
                  <div className="bg-white border border-[#E0DCD2] rounded-xs p-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                      <Tag className="w-4 h-4 text-[#6C307D]" />
                      <span>Have a coupon?</span>
                    </div>

                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="w-full bg-[#F8F6F2] border border-[#E0DCD2] rounded-xs px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#6C307D] placeholder:text-gray-400"
                      />
                      <button
                        type="submit"
                        className="bg-[#6C307D] hover:bg-[#522061] text-white px-3 rounded-xs text-xs font-bold transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {appliedCoupon && (
                      <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        ✓ Coupon {appliedCoupon} applied (-₹{discountAmount})
                      </p>
                    )}
                  </div>
                </form>

              </div>
            </div>
          )}
        </section>

        {/* YOU MAY ALSO LIKE Related Products Carousel */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 border-t border-[#EBE7DF]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-gray-900 tracking-wider uppercase">
              YOU MAY ALSO LIKE
            </h2>

            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-xs font-bold tracking-widest text-[#6C307D] hover:text-[#522061] uppercase transition-colors"
            >
              VIEW ALL
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {PRODUCTS_DATA.slice(2, 8).map((relProduct) => {
              const relWishlisted = wishlist.includes(relProduct.id);

              return (
                <div
                  key={relProduct.id}
                  className="group relative flex flex-col justify-between bg-white rounded-sm border border-[#F0ECE1] overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
                    <button
                      onClick={() => toggleWishlist(relProduct.id)}
                      className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-gray-600 hover:text-red-500 shadow-xs"
                      aria-label="Wishlist"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          relWishlisted ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                    </button>

                    <Link href={`/product/${relProduct.id}`}>
                      <img
                        src={relProduct.image}
                        alt={relProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  </div>

                  <div className="p-3 flex flex-col justify-between flex-grow space-y-2">
                    <div>
                      <Link href={`/product/${relProduct.id}`}>
                        <h3 className="text-xs font-semibold text-gray-900 line-clamp-1 group-hover:text-[#6C307D] transition-colors">
                          {relProduct.name}
                        </h3>
                      </Link>
                      <span className="text-xs font-bold text-gray-900 mt-1 block">
                        ₹{relProduct.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(relProduct)}
                      className="w-full bg-[#F5F3EF] hover:bg-[#6C307D] text-gray-800 hover:text-white text-[10px] font-bold tracking-wider uppercase py-1.5 rounded-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      ADD TO BAG
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <ValuePropsBar />
      </main>

      <Footer />

      <CartDrawer />
      <QuickViewModal />
      <Toast />
    </div>
  );
}
