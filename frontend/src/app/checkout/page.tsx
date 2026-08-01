'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  ArrowLeft,
  Lock,
  CheckCircle2,
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  QrCode,
  Building2,
  Smartphone,
  Tag,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toast } from '@/components/Toast';
import { useStore, getProductImage } from '@/store/useStore';
import { fetchApi } from '@/lib/api';

const INDIAN_STATES_AND_UTS = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export default function StorefrontCheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, addToast, appliedCoupon, couponDiscount, removeCoupon } = useStore();

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    landmark: '',
    city: '',
    state: 'Delhi',
    pincode: '',
    saveAddress: true,
  });

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'CARD' | 'NETBANKING'>('COD');
  const [upiId, setUpiId] = useState('');
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [formError, setFormError] = useState<string | null>(null);

  // Prefill user details if logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('sanusha_customer_user');
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          setAddressForm((prev) => ({
            ...prev,
            fullName: u.name || prev.fullName,
            email: u.email || prev.email,
          }));
        } catch (e) {}
      }
    }
  }, []);

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

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!addressForm.fullName.trim()) return setFormError('Please enter your Full Name');
    if (!addressForm.email.trim() || !addressForm.email.includes('@')) return setFormError('Please enter a valid Email Address');
    if (!addressForm.phone.trim() || addressForm.phone.length < 10) return setFormError('Please enter a valid 10-digit Phone Number');
    if (!addressForm.street.trim()) return setFormError('Please enter your Street Address / House No.');
    if (!addressForm.city.trim()) return setFormError('Please enter your City');
    if (!addressForm.pincode.trim() || addressForm.pincode.length < 6) return setFormError('Please enter a valid 6-digit Pincode');

    if (paymentMethod === 'UPI' && !upiId.trim() && !upiId.includes('@')) {
      return setFormError('Please enter a valid UPI ID (e.g. name@upi)');
    }

    if (cart.length === 0) {
      return setFormError('Your cart is empty');
    }

    setLoading(true);

    const fullShippingAddress = `${addressForm.street}, ${addressForm.landmark ? addressForm.landmark + ', ' : ''}${addressForm.city}, ${addressForm.state} - ${addressForm.pincode}, India`;

    try {
      const newOrder = await fetchApi('/orders', {
        method: 'POST',
        body: JSON.stringify({
          customerName: addressForm.fullName,
          email: addressForm.email,
          phone: addressForm.phone,
          shippingAddress: fullShippingAddress,
          subtotal,
          discount,
          shippingFee,
          total,
          paymentMethod,
          paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
          items: cart.map((it) => ({
            productId: it.product?.id?.length > 10 ? it.product.id : undefined,
            productName: it.product?.name || (it as any).name || 'Fashion Item',
            productImage: getProductImage(it.product || it),
            quantity: getItemQuantity(it),
            price: getItemPrice(it),
            size: (it as any).size || (it as any).selectedSize || 'M',
            color: (it as any).color || (it as any).selectedColor || 'Default',
          })),
        }),
      });

      setOrderSuccess({
        ...newOrder,
        shippingAddress: fullShippingAddress,
        paymentMethod,
      });
      addToast('Order Placed Successfully! 🎉', `Order #${newOrder.orderNumber} placed.`);
      clearCart();
    } catch (err: any) {
      setFormError(err.message || 'Failed to place order. Please try again.');
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
            alt="Secure Checkout Banner"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.8] contrast-105"
            style={{ imageRendering: 'auto' as any }}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
          <div className="relative z-10 text-center text-white space-y-1 px-4">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight drop-shadow-md">
              Secure Checkout
            </h1>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-200 font-medium pt-0.5">
              <Link href="/" className="hover:text-amber-200 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-amber-300/80" />
              <Link href="/cart" className="hover:text-amber-200 transition-colors">Cart</Link>
              <ChevronRight className="w-3 h-3 text-amber-300/80" />
              <span className="text-amber-200 font-bold">Checkout</span>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
          {orderSuccess ? (
            /* SUCCESS CONFIRMATION RECEIPT */
            <div className="max-w-2xl mx-auto bg-[#FAF8F5] border border-emerald-200 rounded-xs shadow-md p-8 sm:p-10 space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                  ORDER CONFIRMED &amp; PLACED
                </span>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mt-2">
                  Thank You for Your Order!
                </h2>
                <p className="text-xs text-gray-600 font-medium mt-1">
                  Your order reference is <span className="font-bold text-[#6C307D] font-mono text-sm">#{orderSuccess.orderNumber}</span>
                </p>
              </div>

              {/* Order Receipt Card */}
              <div className="bg-white border border-[#E2DDD2] rounded-xs p-6 text-left text-xs space-y-4 font-medium text-gray-700 shadow-2xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <span className="text-gray-400 uppercase text-[10px] font-bold block">Delivery Address</span>
                    <p className="font-bold text-gray-900 mt-1">{orderSuccess.customerName}</p>
                    <p className="text-gray-600">{orderSuccess.shippingAddress}</p>
                    <p className="text-gray-600 mt-1">Phone: {orderSuccess.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase text-[10px] font-bold block">Payment Method</span>
                    <p className="font-bold text-emerald-700 mt-1 uppercase">
                      {orderSuccess.paymentMethod === 'COD'
                        ? 'Cash on Delivery (Pay ₹' + orderSuccess.total.toLocaleString() + ' at delivery)'
                        : orderSuccess.paymentMethod + ' Instant Online Payment (PAID)'}
                    </p>
                    <p className="text-gray-500 text-[11px] mt-2">
                      Estimated Delivery: <span className="font-bold text-gray-900">3 - 5 Business Days</span>
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm font-serif font-bold text-gray-900 pt-1">
                  <span>Total Amount Paid / Due:</span>
                  <span className="text-[#6C307D] text-lg">₹{orderSuccess.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <Link
                  href="/account"
                  className="bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-xs shadow-md transition-all text-center"
                >
                  VIEW ORDER IN PROFILE
                </Link>
                <Link
                  href="/shop"
                  className="border border-[#6C307D] text-[#6C307D] hover:bg-[#FAF8F5] text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-xs transition-all text-center"
                >
                  CONTINUE SHOPPING
                </Link>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-16 bg-[#FAF8F5] border border-[#EBE7DF] rounded-xs max-w-md mx-auto space-y-4">
              <ShoppingBag className="w-12 h-12 text-[#6C307D] mx-auto" />
              <h3 className="text-lg font-serif font-bold text-gray-900">Your Cart is Empty</h3>
              <p className="text-xs text-gray-600 font-medium">Add products to your cart before proceeding to checkout.</p>
              <Link
                href="/shop"
                className="inline-block bg-[#6C307D] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xs hover:bg-[#522061]"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: ADDRESS & PAYMENT FORM */}
              <div className="lg:col-span-7 space-y-8">
                
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xs text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* STEP 1: SHIPPING ADDRESS FORM */}
                <div className="bg-[#FAF8F5] border border-[#EBE7DF] p-6 sm:p-8 rounded-xs space-y-5">
                  <div className="flex items-center gap-3 border-b border-[#EBE7DF] pb-4">
                    <div className="w-8 h-8 rounded-full bg-[#6C307D] text-white flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div>
                      <h2 className="font-serif font-bold text-gray-900 text-lg">Shipping &amp; Delivery Address</h2>
                      <p className="text-[11px] text-gray-500 font-medium">Where should we deliver your luxury order?</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs font-medium">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rajesh Kumar"
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                          className="w-full border border-gray-300 rounded-xs p-3 text-gray-900 bg-white font-medium focus:border-[#6C307D] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                          Phone Number (10 digits) *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9876543210"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          className="w-full border border-gray-300 rounded-xs p-3 text-gray-900 bg-white font-medium focus:border-[#6C307D] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                        Email Address (for order tracking &amp; invoice) *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rajesh@example.com"
                        value={addressForm.email}
                        onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-xs p-3 text-gray-900 bg-white font-medium focus:border-[#6C307D] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                        Flat / House No. / Building / Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Flat 402, Sunshine Heights, M.G. Road"
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        className="w-full border border-gray-300 rounded-xs p-3 text-gray-900 bg-white font-medium focus:border-[#6C307D] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. New Delhi"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          className="w-full border border-gray-300 rounded-xs p-3 text-gray-900 bg-white font-medium focus:border-[#6C307D] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                          State *
                        </label>
                        <select
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          className="w-full border border-gray-300 rounded-xs p-3 text-gray-900 bg-white font-medium focus:border-[#6C307D] outline-none"
                        >
                          <option value="">Select State / UT *</option>
                          {INDIAN_STATES_AND_UTS.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="e.g. 110016"
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                          className="w-full border border-gray-300 rounded-xs p-3 text-gray-900 bg-white font-medium focus:border-[#6C307D] outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* STEP 2: PAYMENT METHOD SELECTOR */}
                <div className="bg-[#FAF8F5] border border-[#EBE7DF] p-6 sm:p-8 rounded-xs space-y-5">
                  <div className="flex items-center gap-3 border-b border-[#EBE7DF] pb-4">
                    <div className="w-8 h-8 rounded-full bg-[#6C307D] text-white flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div>
                      <h2 className="font-serif font-bold text-gray-900 text-lg">Select Payment Method</h2>
                      <p className="text-[11px] text-gray-500 font-medium">All transactions are 256-bit SSL encrypted</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    
                    {/* Option A: Cash on Delivery */}
                    <label
                      onClick={() => setPaymentMethod('COD')}
                      className={`block p-4 border rounded-xs cursor-pointer transition-all ${
                        paymentMethod === 'COD'
                          ? 'border-[#6C307D] bg-purple-50/50 shadow-xs'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === 'COD'}
                            onChange={() => setPaymentMethod('COD')}
                            className="w-4 h-4 text-[#6C307D] focus:ring-0"
                          />
                          <Truck className="w-5 h-5 text-[#6C307D]" />
                          <div>
                            <span className="font-bold text-gray-900 text-xs block">Cash on Delivery (COD)</span>
                            <span className="text-[10px] text-gray-500 font-medium">Pay in cash when your order arrives</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          FREE COD
                        </span>
                      </div>
                    </label>

                    {/* Option B: UPI Payment */}
                    <label
                      onClick={() => setPaymentMethod('UPI')}
                      className={`block p-4 border rounded-xs cursor-pointer transition-all ${
                        paymentMethod === 'UPI'
                          ? 'border-[#6C307D] bg-purple-50/50 shadow-xs'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === 'UPI'}
                            onChange={() => setPaymentMethod('UPI')}
                            className="w-4 h-4 text-[#6C307D] focus:ring-0"
                          />
                          <QrCode className="w-5 h-5 text-[#6C307D]" />
                          <div>
                            <span className="font-bold text-gray-900 text-xs block">Instant UPI (GPay / PhonePe / Paytm)</span>
                            <span className="text-[10px] text-gray-500 font-medium">Fast &amp; secure instant payment</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                          INSTANT
                        </span>
                      </div>

                      {paymentMethod === 'UPI' && (
                        <div className="mt-3 pt-3 border-t border-purple-200/60 space-y-2">
                          <label className="block text-[10px] font-bold uppercase text-gray-700">Enter UPI ID</label>
                          <input
                            type="text"
                            placeholder="e.g. mobileNumber@ybl or username@okicici"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full border border-gray-300 rounded-xs p-2.5 text-xs text-gray-900 bg-white font-mono"
                          />
                        </div>
                      )}
                    </label>

                    {/* Option C: Credit / Debit Card */}
                    <label
                      onClick={() => setPaymentMethod('CARD')}
                      className={`block p-4 border rounded-xs cursor-pointer transition-all ${
                        paymentMethod === 'CARD'
                          ? 'border-[#6C307D] bg-purple-50/50 shadow-xs'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === 'CARD'}
                            onChange={() => setPaymentMethod('CARD')}
                            className="w-4 h-4 text-[#6C307D] focus:ring-0"
                          />
                          <CreditCard className="w-5 h-5 text-[#6C307D]" />
                          <div>
                            <span className="font-bold text-gray-900 text-xs block">Credit / Debit Card</span>
                            <span className="text-[10px] text-gray-500 font-medium">Visa, MasterCard, RuPay, Amex</span>
                          </div>
                        </div>
                      </div>

                      {paymentMethod === 'CARD' && (
                        <div className="mt-3 pt-3 border-t border-purple-200/60 space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Card Number</label>
                            <input
                              type="text"
                              placeholder="4532 •••• •••• 8921"
                              maxLength={19}
                              value={cardForm.number}
                              onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                              className="w-full border border-gray-300 rounded-xs p-2.5 text-xs text-gray-900 bg-white font-mono"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Expiry Date</label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                maxLength={5}
                                value={cardForm.expiry}
                                onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                                className="w-full border border-gray-300 rounded-xs p-2.5 text-xs text-gray-900 bg-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">CVV</label>
                              <input
                                type="password"
                                placeholder="•••"
                                maxLength={4}
                                value={cardForm.cvv}
                                onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                                className="w-full border border-gray-300 rounded-xs p-2.5 text-xs text-gray-900 bg-white font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </label>

                    {/* Option D: Netbanking */}
                    <label
                      onClick={() => setPaymentMethod('NETBANKING')}
                      className={`block p-4 border rounded-xs cursor-pointer transition-all ${
                        paymentMethod === 'NETBANKING'
                          ? 'border-[#6C307D] bg-purple-50/50 shadow-xs'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === 'NETBANKING'}
                            onChange={() => setPaymentMethod('NETBANKING')}
                            className="w-4 h-4 text-[#6C307D] focus:ring-0"
                          />
                          <Building2 className="w-5 h-5 text-[#6C307D]" />
                          <div>
                            <span className="font-bold text-gray-900 text-xs block">Netbanking</span>
                            <span className="text-[10px] text-gray-500 font-medium">All major Indian banks</span>
                          </div>
                        </div>
                      </div>

                      {paymentMethod === 'NETBANKING' && (
                        <div className="mt-3 pt-3 border-t border-purple-200/60">
                          <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="w-full border border-gray-300 rounded-xs p-2.5 text-xs text-gray-900 bg-white font-bold"
                          >
                            <option value="HDFC">HDFC Bank</option>
                            <option value="SBI">State Bank of India (SBI)</option>
                            <option value="ICICI">ICICI Bank</option>
                            <option value="AXIS">Axis Bank</option>
                            <option value="KOTAK">Kotak Mahindra Bank</option>
                          </select>
                        </div>
                      )}
                    </label>

                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: ORDER SUMMARY SIDEBAR */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#FAF8F5] border border-[#EBE7DF] p-6 rounded-xs space-y-5 sticky top-24 shadow-xs">
                  <h3 className="font-serif font-bold text-gray-900 text-lg border-b border-[#EBE7DF] pb-3 flex items-center justify-between">
                    <span>Order Summary</span>
                    <span className="text-xs font-sans font-bold text-[#6C307D]">
                      {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
                    </span>
                  </h3>

                  {/* Cart Items List */}
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {cart.map((item, idx) => {
                      const pName = item.product?.name || (item as any).name || 'Product';
                      const pImg = getProductImage(item.product || item);
                      const pPrice = getItemPrice(item);
                      const pQty = getItemQuantity(item);
                      const pSize = (item as any).size || (item as any).selectedSize || 'M';

                      return (
                        <div key={item.id || idx} className="flex items-center gap-3 bg-white p-2.5 rounded border border-gray-200 text-xs">
                          <img src={pImg} alt={pName} className="w-12 h-14 object-cover rounded shrink-0 border" />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-gray-900 truncate">{pName}</h4>
                            <p className="text-[10px] text-gray-500">Size: {pSize} | Qty: {pQty}</p>
                            <p className="font-serif font-bold text-gray-900 mt-0.5">₹{(pPrice * pQty).toLocaleString()}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2.5 text-xs font-medium text-gray-700 border-t border-[#EBE7DF] pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Promo Discount ({appliedCoupon?.code || 'PROMO'})</span>
                        <span>- ₹{discount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Express Shipping</span>
                      <span className="font-bold text-emerald-700 uppercase text-[10px]">FREE</span>
                    </div>

                    <div className="border-t border-[#EBE7DF] pt-3 flex justify-between items-center text-lg font-serif font-bold text-gray-900">
                      <span>Payable Amount</span>
                      <span className="text-[#6C307D] text-xl">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Submit Order Button */}
                  <button
                    type="submit"
                    disabled={loading || cart.length === 0}
                    className="w-full bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold uppercase tracking-widest py-4 rounded-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01]"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{loading ? 'Processing Order...' : `PLACE ORDER & PAY ₹${total.toLocaleString()}`}</span>
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 font-medium text-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Guaranteed 256-Bit SSL Encrypted &amp; Safe Checkout</span>
                  </div>

                </div>
              </div>

            </form>
          )}
        </section>
      </main>

      <Footer />
      <Toast />
    </div>
  );
}
