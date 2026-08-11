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
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toast } from '@/components/Toast';
import { useStore } from '@/store/useStore';

const INDIAN_STATES_AND_UTS = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
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

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, addToast } = useStore();

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const [addressForm, setAddressForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    landmark: '',
    city: '',
    state: 'Delhi',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'CARD' | 'NETBANKING'>('COD');
  const [upiId, setUpiId] = useState('');
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [formError, setFormError] = useState<string | null>(null);

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

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = subtotal > 1000 ? Math.round(subtotal * 0.1) : 0;
  const shippingFee = 0;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!addressForm.fullName.trim()) return setFormError('Please enter your Full Name');
    if (!addressForm.email.trim() || !addressForm.email.includes('@')) return setFormError('Please enter a valid Email Address');
    if (!addressForm.phone.trim() || addressForm.phone.length < 10) return setFormError('Please enter a valid 10-digit Phone Number');
    if (!addressForm.street.trim()) return setFormError('Please enter your Street Address / House No.');
    if (!addressForm.city.trim()) return setFormError('Please enter your City');
    if (!addressForm.pincode.trim() || addressForm.pincode.length < 6) return setFormError('Please enter a valid 6-digit Pincode');

    if (paymentMethod === 'UPI' && !upiId.trim()) {
      return setFormError('Please enter a valid UPI ID (e.g. name@upi)');
    }

    if (cart.length === 0) {
      return setFormError('Your cart is empty');
    }

    setLoading(true);

    const fullShippingAddress = `${addressForm.street}, ${addressForm.landmark ? addressForm.landmark + ', ' : ''}${addressForm.city}, ${addressForm.state} - ${addressForm.pincode}, India`;

    setTimeout(() => {
      const mockOrderNumber = 'SN' + Math.floor(100000 + Math.random() * 900000);
      setOrderSuccess({
        orderNumber: mockOrderNumber,
        customerName: addressForm.fullName,
        shippingAddress: fullShippingAddress,
        phone: addressForm.phone,
        paymentMethod,
        total,
      });
      addToast('Order Placed Successfully! 🎉', `Order #${mockOrderNumber} confirmed.`);
      clearCart();
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow">
        {/* Banner */}
        <section className="relative w-full h-[100px] sm:h-[120px] bg-slate-950 flex items-center justify-center overflow-hidden border-b border-[#E2DDD2]">
          <img
            src="/images/decor_hero_banner.jpg"
            alt="Secure Checkout Banner"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.8] contrast-105"
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
                  <span>Total Amount Payable:</span>
                  <span className="text-[#6C307D] text-lg">₹{orderSuccess.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <Link
                  href="/account"
                  className="bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-xs shadow-md transition-all text-center"
                >
                  VIEW PROFILE
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
              <p className="text-xs text-gray-600 font-medium">Add decor pieces to your cart before proceeding to checkout.</p>
              <Link
                href="/shop"
                className="inline-block bg-[#6C307D] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xs hover:bg-[#522061]"
              >
                BROWSE STORE
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
                      <p className="text-[11px] text-gray-500 font-medium">Where should we deliver your handcrafted order?</p>
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
                        Email Address (for tracking &amp; receipt) *
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
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded border border-gray-200 text-xs">
                        <img src={item.product.image} alt={item.product.name} className="w-12 h-14 object-cover rounded shrink-0 border" />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-gray-900 truncate">{item.product.name}</h4>
                          <p className="text-[10px] text-gray-500">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                          <p className="font-serif font-bold text-gray-900 mt-0.5">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2.5 text-xs font-medium text-gray-700 border-t border-[#EBE7DF] pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Promo Discount</span>
                        <span>- ₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Express Shipping</span>
                      <span className="font-bold text-emerald-700 uppercase text-[10px]">FREE</span>
                    </div>

                    <div className="border-t border-[#EBE7DF] pt-3 flex justify-between items-center text-lg font-serif font-bold text-gray-900">
                      <span>Payable Amount</span>
                      <span className="text-[#6C307D] text-xl">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Submit Order Button */}
                  <button
                    type="submit"
                    disabled={loading || cart.length === 0}
                    className="w-full bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold uppercase tracking-widest py-4 rounded-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01]"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{loading ? 'Processing Order...' : `PLACE ORDER & PAY ₹${total.toLocaleString('en-IN')}`}</span>
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
