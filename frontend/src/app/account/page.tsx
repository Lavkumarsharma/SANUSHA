'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  Tag,
  Bell,
  RotateCcw,
  Ruler,
  Clock,
  Settings,
  LogOut,
  Edit,
  Plus,
  Trash2,
  Headset,
  ArrowRight,
  Copy,
  Building,
  Upload,
} from 'lucide-react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toast } from '@/components/Toast';
import { useStore, getProductImage } from '@/store/useStore';
import { fetchApi } from '@/lib/api';

export default function CustomerAccountPage() {
  const router = useRouter();
  const { addToast, wishlist, addToCart } = useStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Editable Profile Data dynamically retrieved from session
  const [userInfo, setUserInfo] = useState({
    fullName: 'lav kumar',
    email: 'lawkumar0000000556588@gmail.com',
    picture: '',
    phone: '+91 98765 43210',
    dob: '12 May 1998',
    gender: 'Male',
    memberSince: '24 January 2024',
  });

  const [liveOrders, setLiveOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('sanusha_customer_token');
      const userStr = localStorage.getItem('sanusha_customer_user');

      if (!token || !userStr) {
        router.push('/login');
        return;
      }

      try {
        const u = JSON.parse(userStr);
        setUserInfo((prev) => ({
          ...prev,
          fullName: u.name || 'lav kumar',
          email: u.email || 'lawkumar0000000556588@gmail.com',
          picture: u.picture || '',
          phone: u.phone || '+91 98765 43210',
        }));
      } catch (e) {}
    }

    fetchApi('/orders')
      .then((data) => {
        if (Array.isArray(data)) {
          setLiveOrders(data);
        }
      })
      .catch((err) => console.error('Error fetching live orders:', err))
      .finally(() => setLoadingOrders(false));
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sanusha_customer_token');
      localStorage.removeItem('sanusha_customer_user');
      addToast('Signed Out', 'You have been successfully logged out.');
      router.push('/login');
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setUserInfo((prev) => {
        const updated = { ...prev, picture: base64 };
        if (typeof window !== 'undefined') {
          const userObj = JSON.parse(localStorage.getItem('sanusha_customer_user') || '{}');
          userObj.picture = base64;
          localStorage.setItem('sanusha_customer_user', JSON.stringify(userObj));
        }
        return updated;
      });
      setImgError(false);
      addToast('Profile Picture Updated', 'New avatar uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const sidebarNavItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'coupons', label: 'Coupons & Offers', icon: Tag },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
    { id: 'size', label: 'Size Guide', icon: Ruler },
    { id: 'recently', label: 'Recently Viewed', icon: Clock },
    { id: 'settings', label: 'Account Settings', icon: Settings },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ];

  const recentOrders = [
    {
      id: '#SN12345',
      date: 'Delivered on 18 May 2024',
      name: 'Oversized Linen Shirt',
      size: 'L',
      color: 'Sand Beige',
      price: '₹2,499',
      status: 'Delivered',
      image: '/images/pdp_linen_main.jpg',
    },
    {
      id: '#SN12344',
      date: 'Delivered on 02 April 2024',
      name: 'Tailored Linen Trousers',
      size: '32',
      color: 'Off White',
      price: '₹3,299',
      status: 'Delivered',
      image: '/images/cat_bottoms.jpg',
    },
  ];

  const savedAddresses = [
    {
      id: '1',
      title: 'Home Address (Default)',
      name: userInfo.fullName,
      street: '123, Green Park Extension, Block B',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110016',
      phone: userInfo.phone,
      isDefault: true,
    },
  ];

  const savedCoupons = [
    {
      code: 'SANUSHA10',
      discount: '10% OFF',
      description: 'Applicable on all orders above ₹999',
      expiry: 'Valid till 31 Dec 2026',
    },
    {
      code: 'LUXURY20',
      discount: '20% OFF',
      description: 'Exclusive on Women & Men Collection',
      expiry: 'Valid till 15 Aug 2026',
    },
  ];

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    addToast('Coupon Copied!', `Promo code ${code} copied to clipboard.`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    if (typeof window !== 'undefined') {
      const userObj = JSON.parse(localStorage.getItem('sanusha_customer_user') || '{}');
      const updatedUser = { ...userObj, name: userInfo.fullName, email: userInfo.email, phone: userInfo.phone, picture: userInfo.picture };
      localStorage.setItem('sanusha_customer_user', JSON.stringify(updatedUser));
    }
    addToast('Profile Updated', 'Personal information saved successfully.');
  };

  // High-res Google UI Avatar URL fallback
  const fallbackAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.fullName)}&background=6C307D&color=ffffff&size=128&bold=true`;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow">
        {/* Profile Hero Banner */}
        <section className="relative w-full bg-[#ECE8DF] border-b border-[#E2DDD2] overflow-hidden py-12 sm:py-16 px-4 sm:px-8">
          <div
            className="absolute inset-0 bg-cover bg-right sm:bg-center opacity-85"
            style={{ backgroundImage: `url('/images/hero_banner.jpg')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#ECE8DF] via-[#ECE8DF]/80 to-transparent" />
          </div>

          <div className="relative max-w-7xl mx-auto space-y-3">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight">
              My Account
            </h1>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">
              <Link href="/" className="hover:text-[#6C307D]">Home</Link>
              <span>/</span>
              <span className="text-gray-500">My Account</span>
              <span>/</span>
              <span className="text-gray-900 font-bold capitalize">{activeTab}</span>
            </div>
          </div>
        </section>

        {/* Account Dashboard Layout */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Sidebar Navigation (Sticky on Desktop) */}
            <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
              <div className="bg-[#FAF8F5] border border-[#EBE7DF] rounded-xs p-6 text-center space-y-3 shadow-xs">
                
                {/* Profile Picture Container with referrerPolicy="no-referrer" for Google CDN Images */}
                <div className="relative w-20 h-20 mx-auto group">
                  {!imgError && userInfo.picture ? (
                    <img
                      src={userInfo.picture}
                      alt={userInfo.fullName}
                      referrerPolicy="no-referrer"
                      onError={() => setImgError(true)}
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#6C307D] shadow-md"
                    />
                  ) : (
                    <img
                      src={fallbackAvatarUrl}
                      alt={userInfo.fullName}
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#6C307D] shadow-md"
                    />
                  )}

                  {/* Quick Photo Upload Overlay */}
                  <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[9px] font-bold uppercase">
                    <Upload className="w-4 h-4 mb-0.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-900 capitalize">{userInfo.fullName}</h3>
                  <p className="text-xs text-gray-500 font-medium break-all">{userInfo.email}</p>
                </div>
              </div>

              <nav className="bg-white border border-[#EBE7DF] rounded-xs overflow-hidden divide-y divide-gray-100 text-xs font-semibold">
                {sidebarNavItems.map((item) => {
                  const Icon = item.icon;
                  const isCurrent = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'logout') {
                          handleLogout();
                        } else {
                          setActiveTab(item.id);
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors ${
                        isCurrent
                          ? 'bg-[#F7F2F8] text-[#6C307D] font-bold border-l-4 border-[#6C307D]'
                          : 'text-gray-700 hover:text-[#6C307D] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isCurrent ? 'text-[#6C307D]' : 'text-gray-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Main Content View */}
            <div className="lg:col-span-9 space-y-8">
              
              {/* TAB 1: PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="bg-white border border-[#EBE7DF] rounded-xs p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div>
                      <h2 className="text-lg font-serif font-bold text-gray-900">Personal Information</h2>
                      <p className="text-xs text-gray-500">Manage your personal details and contact info</p>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="border border-[#6C307D] text-[#6C307D] hover:bg-[#6C307D] hover:text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
                    </button>
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-medium">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-bold mb-1">Full Name</label>
                          <input
                            type="text"
                            value={userInfo.fullName}
                            onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })}
                            className="w-full border border-gray-300 rounded p-2.5 text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-bold mb-1">Email Address</label>
                          <input
                            type="email"
                            value={userInfo.email}
                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                            className="w-full border border-gray-300 rounded p-2.5 text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-bold mb-1">Phone Number</label>
                          <input
                            type="text"
                            value={userInfo.phone}
                            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                            className="w-full border border-gray-300 rounded p-2.5 text-gray-900"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-[#6C307D] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-[#522061]"
                      >
                        Save Changes
                      </button>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                      <div>
                        <span className="text-gray-400 font-medium block mb-1">Full Name</span>
                        <span className="font-bold text-gray-900 text-sm block capitalize">{userInfo.fullName}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium block mb-1">Date of Birth</span>
                        <span className="font-bold text-gray-900 text-sm block">{userInfo.dob}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium block mb-1">Email Address</span>
                        <span className="font-bold text-gray-900 text-sm block break-all">{userInfo.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium block mb-1">Gender</span>
                        <span className="font-bold text-gray-900 text-sm block">{userInfo.gender}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium block mb-1">Phone Number</span>
                        <span className="font-bold text-gray-900 text-sm block">{userInfo.phone}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium block mb-1">Member Since</span>
                        <span className="font-bold text-gray-900 text-sm block">{userInfo.memberSince}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="bg-white border border-[#EBE7DF] rounded-xs p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-lg font-serif font-bold text-gray-900">My Orders</h2>
                    <span className="text-xs text-gray-500 font-bold">
                      {liveOrders.length} {liveOrders.length === 1 ? 'Order' : 'Orders'} Placed
                    </span>
                  </div>

                  {loadingOrders ? (
                    <div className="py-12 text-center text-xs text-gray-400 font-medium">
                      Loading your order history...
                    </div>
                  ) : liveOrders.length === 0 ? (
                    <div className="py-12 text-center space-y-3">
                      <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
                      <p className="text-xs text-gray-500 font-medium">You haven't placed any orders yet.</p>
                      <Link
                        href="/shop"
                        className="inline-block bg-[#6C307D] text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-xs"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {liveOrders.map((order) => {
                        const orderDateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                        const orderStatusUpper = (order.status || 'PENDING').toUpperCase();

                        return (
                          <div key={order.id} className="border border-gray-200 rounded-xs overflow-hidden shadow-2xs">
                            {/* Order Header Bar */}
                            <div className="bg-[#FAF8F5] p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                              <div>
                                <span className="text-gray-400 font-bold uppercase text-[10px] block">Order Reference</span>
                                <span className="font-mono font-bold text-[#6C307D] text-sm">#{order.orderNumber}</span>
                              </div>
                              <div>
                                <span className="text-gray-400 font-bold uppercase text-[10px] block">Date Placed</span>
                                <span className="font-bold text-gray-700">{orderDateStr}</span>
                              </div>
                              <div>
                                <span className="text-gray-400 font-bold uppercase text-[10px] block">Payment Method</span>
                                <span className="font-bold text-gray-800 uppercase">
                                  {order.paymentMethod || 'COD'} ({order.paymentStatus || 'PENDING'})
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-400 font-bold uppercase text-[10px] block">Status</span>
                                {orderStatusUpper === 'PENDING' && (
                                  <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                    🟡 ORDER PLACED (PROCESSING)
                                  </span>
                                )}
                                {orderStatusUpper === 'PROCESSING' && (
                                  <span className="bg-blue-100 text-blue-900 border border-blue-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                    ⚙️ PACKING AT WAREHOUSE
                                  </span>
                                )}
                                {orderStatusUpper === 'SHIPPED' && (
                                  <span className="bg-purple-100 text-purple-900 border border-purple-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                    🚚 IN TRANSIT ({order.trackingNumber || 'AWB-IN-PROGRESS'})
                                  </span>
                                )}
                                {orderStatusUpper === 'DELIVERED' && (
                                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                    ✅ DELIVERED
                                  </span>
                                )}
                                {orderStatusUpper === 'CANCELLED' && (
                                  <span className="bg-red-100 text-red-900 border border-red-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                    🔴 CANCELLED
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-4 divide-y divide-gray-100 space-y-3">
                              {(order.items || []).map((it: any, i: number) => (
                                <div key={it.id || i} className="flex items-center justify-between gap-4 pt-2 first:pt-0 text-xs">
                                  <Link href={`/product/${it.productId || it.id}`} className="flex items-center gap-3 group">
                                    <img
                                      src={getProductImage(it)}
                                      alt={it.productName || 'SANUSHA Apparel Item'}
                                      className="w-12 h-14 object-cover rounded border shrink-0 bg-white group-hover:scale-105 transition-transform"
                                    />
                                    <div>
                                      <h4 className="font-bold text-gray-900 group-hover:text-[#6C307D] transition-colors">{it.productName || 'SANUSHA Apparel Item'}</h4>
                                      <p className="text-gray-500 text-[11px]">Size: {it.size || 'M'} | Qty: {it.quantity || 1}</p>
                                    </div>
                                  </Link>
                                  <span className="font-serif font-bold text-gray-900 text-sm">
                                    ₹{(it.price * (it.quantity || 1)).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Order Footer & Total */}
                            <div className="bg-[#FAF8F5] p-4 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                              <div>
                                <span className="text-gray-400 text-[10px] uppercase font-bold block">Delivery Address</span>
                                <span className="text-gray-700 font-medium">{order.shippingAddress}</span>
                              </div>
                              <div className="text-right sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0">
                                <span className="text-gray-400 text-[10px] uppercase font-bold block">Order Total</span>
                                <span className="font-serif font-bold text-[#6C307D] text-lg">
                                  ₹{(order.total || 0).toLocaleString()}
                                </span>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: WISHLIST TAB */}
              {activeTab === 'wishlist' && (
                <div className="bg-white border border-[#EBE7DF] rounded-xs p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-lg font-serif font-bold text-gray-900">Saved Wishlist Items</h2>
                    <Link href="/wishlist" className="text-[#6C307D] font-bold text-xs hover:underline">
                      View Full Wishlist ({wishlist.length})
                    </Link>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">
                    You have {wishlist.length} saved luxury item(s) in your wishlist.
                  </p>
                </div>
              )}

              {/* TAB 4: ADDRESSES TAB */}
              {activeTab === 'addresses' && (
                <div className="bg-white border border-[#EBE7DF] rounded-xs p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-lg font-serif font-bold text-gray-900">Shipping Addresses</h2>
                    <button className="bg-[#6C307D] text-white text-xs font-bold uppercase px-3.5 py-2 rounded-xs flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" /> Add New Address
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedAddresses.map((addr) => (
                      <div key={addr.id} className="border border-gray-200 p-4 rounded-xs space-y-2 text-xs relative">
                        {addr.isDefault && (
                          <span className="bg-[#6C307D] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                            Default
                          </span>
                        )}
                        <h4 className="font-bold text-gray-900 text-sm">{addr.title}</h4>
                        <p className="text-gray-700 font-semibold capitalize">{addr.name}</p>
                        <p className="text-gray-500">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-gray-500">Phone: {addr.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: COUPONS TAB */}
              {activeTab === 'coupons' && (
                <div className="bg-white border border-[#EBE7DF] rounded-xs p-6 sm:p-8 space-y-6 shadow-xs">
                  <h2 className="text-lg font-serif font-bold text-gray-900 border-b pb-3">Available Discount Coupons</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedCoupons.map((c) => (
                      <div key={c.code} className="border-2 border-dashed border-[#6C307D]/40 bg-[#FAF6F0] p-4 rounded-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[#6C307D] text-lg font-serif">{c.discount}</span>
                          <button
                            onClick={() => handleCopyCoupon(c.code)}
                            className="bg-[#6C307D] text-white hover:bg-[#522061] px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" /> Copy {c.code}
                          </button>
                        </div>
                        <p className="text-xs text-gray-700 font-medium">{c.description}</p>
                        <span className="text-[10px] text-gray-400 font-bold block">{c.expiry}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Toast />
    </div>
  );
}
