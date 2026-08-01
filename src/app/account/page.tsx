'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Home as HomeIcon,
  Trash2,
  Headset,
  ArrowRight,
  Gift,
  Award,
} from 'lucide-react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { ValuePropsBar } from '@/components/ValuePropsBar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { QuickViewModal } from '@/components/QuickViewModal';
import { Toast } from '@/components/Toast';
import { useStore, PRODUCTS_DATA } from '@/store/useStore';

export default function AccountPage() {
  const { addToast } = useStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  // User details state matching reference screenshot
  const [userInfo, setUserInfo] = useState({
    fullName: 'Law Kumar',
    email: 'lawkumar@gmail.com',
    phone: '+91 98765 43210',
    dob: '12 May 1998',
    gender: 'Male',
    memberSince: '24 January 2024',
  });

  const sidebarNavItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, href: '/wishlist' },
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
      price: 2499,
      status: 'Delivered',
      image: '/images/pdp_linen_main.jpg',
    },
    {
      id: '#SN12330',
      date: 'Delivered on 10 May 2024',
      name: 'Cargo Parachute Pants',
      price: 1899,
      status: 'Delivered',
      image: '/images/prod_cargo_pants.jpg',
    },
    {
      id: '#SN12315',
      date: 'Delivered on 02 May 2024',
      name: 'Minimal Sneakers',
      price: 3199,
      status: 'Delivered',
      image: '/images/cat_bottoms.jpg',
    },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    addToast('Profile Updated', 'Your personal information has been saved.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow">
        {/* Profile Hero Banner matching reference screenshot */}
        <section className="relative w-full bg-[#ECE8DF] border-b border-[#E2DDD2] overflow-hidden py-12 sm:py-16 px-4 sm:px-8">
          <div
            className="absolute inset-0 bg-cover bg-right sm:bg-center opacity-85"
            style={{ backgroundImage: `url('/images/hero_banner.jpg')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#ECE8DF] via-[#ECE8DF]/80 to-transparent" />
          </div>

          <div className="relative max-w-7xl mx-auto space-y-3">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight">
              My Profile
            </h1>
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">
              <Link href="/" className="hover:text-[#6C307D] transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-500">My Account</span>
              <span>/</span>
              <span className="text-gray-900 font-bold">Profile</span>
            </div>
          </div>
        </section>

        {/* Main Profile Layout */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Sidebar Navigation (3 cols) */}
            <aside className="lg:col-span-3 space-y-6">
              
              {/* User Avatar Card */}
              <div className="bg-[#FAF8F5] border border-[#EBE7DF] rounded-xs p-6 text-center space-y-3 shadow-xs">
                <div className="w-20 h-20 rounded-full bg-[#F3EBF5] text-[#6C307D] font-bold text-2xl flex items-center justify-center mx-auto border-2 border-[#6C307D]">
                  LK
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{userInfo.fullName}</h3>
                  <p className="text-xs text-gray-500 font-medium">{userInfo.email}</p>
                </div>
              </div>

              {/* Sidebar Menu Items matching reference screenshot */}
              <nav className="bg-white border border-[#EBE7DF] rounded-xs overflow-hidden divide-y divide-gray-100 text-xs font-semibold">
                {sidebarNavItems.map((item) => {
                  const Icon = item.icon;
                  const isCurrent = activeTab === item.id;

                  if (item.href) {
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="flex items-center gap-3 px-5 py-3.5 text-gray-700 hover:text-[#6C307D] hover:bg-[#FAF8F5] transition-colors"
                      >
                        <Icon className="w-4 h-4 text-[#6C307D]" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'logout') {
                          addToast('Logged Out', 'You have been signed out.');
                        } else {
                          setActiveTab(item.id as any);
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

              {/* Need Help Card matching reference */}
              <div className="bg-[#FAF8F5] border border-[#EBE7DF] rounded-xs p-5 space-y-3 text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-900">
                  <Headset className="w-4 h-4 text-[#6C307D]" />
                  <span>Need Help?</span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium">We&apos;re here to help you</p>
                <button
                  onClick={() => addToast('Customer Care', 'Opening live support chat...')}
                  className="w-full bg-white border border-[#6C307D] text-[#6C307D] text-xs font-bold uppercase tracking-wider py-2 rounded-xs hover:bg-[#6C307D] hover:text-white transition-colors"
                >
                  CONTACT SUPPORT
                </button>
              </div>

            </aside>

            {/* Right Main Content Area (9 cols) */}
            <main className="lg:col-span-9 space-y-8">
              
              {/* Card 1: Personal Information */}
              <div className="bg-white border border-[#EBE7DF] rounded-xs p-6 space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Personal Information</h2>
                    <p className="text-xs text-gray-500 font-medium">Manage your personal details</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="inline-flex items-center gap-1.5 border border-[#6C307D] text-[#6C307D] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-xs hover:bg-[#6C307D] hover:text-white transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    {isEditing ? 'CANCEL' : 'EDIT PROFILE'}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Full Name</label>
                      <input
                        type="text"
                        value={userInfo.fullName}
                        onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })}
                        className="w-full border border-gray-300 rounded-xs p-2 focus:outline-none focus:border-[#6C307D]"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Date of Birth</label>
                      <input
                        type="text"
                        value={userInfo.dob}
                        onChange={(e) => setUserInfo({ ...userInfo, dob: e.target.value })}
                        className="w-full border border-gray-300 rounded-xs p-2 focus:outline-none focus:border-[#6C307D]"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Email Address</label>
                      <input
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-xs p-2 focus:outline-none focus:border-[#6C307D]"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Gender</label>
                      <input
                        type="text"
                        value={userInfo.gender}
                        onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value })}
                        className="w-full border border-gray-300 rounded-xs p-2 focus:outline-none focus:border-[#6C307D]"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                        className="w-full border border-gray-300 rounded-xs p-2 focus:outline-none focus:border-[#6C307D]"
                      />
                    </div>
                    <div className="col-span-2 pt-2">
                      <button
                        type="submit"
                        className="bg-[#6C307D] text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-xs"
                      >
                        SAVE CHANGES
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-xs">
                    <div>
                      <span className="text-gray-400 font-medium block mb-1">Full Name</span>
                      <span className="font-bold text-gray-900 text-sm">{userInfo.fullName}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 font-medium block mb-1">Date of Birth</span>
                      <span className="font-bold text-gray-900 text-sm">{userInfo.dob}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 font-medium block mb-1">Email Address</span>
                      <span className="font-bold text-gray-900 text-sm">{userInfo.email}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 font-medium block mb-1">Gender</span>
                      <span className="font-bold text-gray-900 text-sm">{userInfo.gender}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 font-medium block mb-1">Phone Number</span>
                      <span className="font-bold text-gray-900 text-sm">{userInfo.phone}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 font-medium block mb-1">Member Since</span>
                      <span className="font-bold text-gray-900 text-sm">{userInfo.memberSince}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 2: Address Book */}
              <div className="bg-white border border-[#EBE7DF] rounded-xs p-6 space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Address Book</h2>
                    <p className="text-xs text-gray-500 font-medium">Manage your saved addresses</p>
                  </div>
                  <button
                    onClick={() => addToast('Add Address', 'Opening address form...')}
                    className="inline-flex items-center gap-1.5 text-[#6C307D] text-xs font-bold uppercase tracking-wider hover:underline"
                  >
                    <Plus className="w-4 h-4" />
                    ADD NEW ADDRESS
                  </button>
                </div>

                {/* Saved Address Box matching reference */}
                <div className="bg-[#FAF8F5] border border-[#EBE7DF] rounded-xs p-5 flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-[#6C307D] flex items-center justify-center shrink-0 mt-0.5">
                      <HomeIcon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">Home</span>
                        <span className="bg-purple-100 text-[#6C307D] text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-xs">
                          DEFAULT
                        </span>
                      </div>
                      <p className="text-gray-600 font-medium leading-relaxed">
                        123, Green Park Extension <br />
                        New Delhi, Delhi 110016 <br />
                        India
                      </p>
                      <p className="text-gray-700 font-semibold pt-1">
                        Phone: {userInfo.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-600 self-end sm:self-start">
                    <button
                      onClick={() => addToast('Edit Address', 'Opening address edit modal.')}
                      className="hover:text-[#6C307D] flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => addToast('Address Deleted', 'Default address removed.')}
                      className="hover:text-red-500 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Row (Order Summary + Account Overview Cards) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Card 3: Order Summary matching reference */}
                <div className="bg-white border border-[#EBE7DF] rounded-xs p-6 space-y-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">Order Summary</h3>
                        <p className="text-[11px] text-gray-500 font-medium">View your recent orders</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-[11px] font-bold text-[#6C307D] uppercase tracking-wider flex items-center gap-1 hover:underline"
                      >
                        VIEW ALL ORDERS <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="divide-y divide-gray-100 py-2 space-y-3">
                      {recentOrders.map((ord, idx) => (
                        <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <img
                              src={ord.image}
                              alt={ord.name}
                              className="w-12 h-14 object-cover rounded-xs border border-gray-100"
                            />
                            <div>
                              <h4 className="font-bold text-gray-900">{ord.name}</h4>
                              <p className="text-[10px] text-gray-400">Order ID: {ord.id}</p>
                              <p className="text-[10px] text-gray-500">{ord.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-gray-900">₹{ord.price.toLocaleString('en-IN')}</span>
                            <span className="block text-[10px] font-bold text-emerald-600 mt-0.5">{ord.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 text-center">
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-[#6C307D] hover:underline inline-flex items-center gap-1"
                    >
                      View All Orders <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card 4: Account Overview matching reference */}
                <div className="bg-white border border-[#EBE7DF] rounded-xs p-6 space-y-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="border-b border-gray-100 pb-3">
                      <h3 className="text-sm font-bold text-gray-900">Account Overview</h3>
                      <p className="text-[11px] text-gray-500 font-medium">Your account activity at a glance</p>
                    </div>

                    <div className="divide-y divide-gray-100 py-2 text-xs space-y-2">
                      <div className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-gray-700 font-medium">
                          <ShoppingBag className="w-4 h-4 text-[#6C307D]" />
                          <span>Total Orders</span>
                        </div>
                        <span className="font-bold text-gray-900">12</span>
                      </div>

                      <div className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-gray-700 font-medium">
                          <Heart className="w-4 h-4 text-[#6C307D]" />
                          <span>Wishlist Items</span>
                        </div>
                        <span className="font-bold text-gray-900">8</span>
                      </div>

                      <div className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-gray-700 font-medium">
                          <MapPin className="w-4 h-4 text-[#6C307D]" />
                          <span>Addresses</span>
                        </div>
                        <span className="font-bold text-gray-900">2</span>
                      </div>

                      <div className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-gray-700 font-medium">
                          <Gift className="w-4 h-4 text-[#6C307D]" />
                          <span>Coupons</span>
                        </div>
                        <span className="font-bold text-gray-900">3</span>
                      </div>

                      <div className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-gray-700 font-medium">
                          <Award className="w-4 h-4 text-[#6C307D]" />
                          <span>Reward Points</span>
                        </div>
                        <span className="font-bold text-gray-900">450</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 text-center">
                    <button
                      onClick={() => addToast('Account Details', 'Viewing activity summary.')}
                      className="text-xs font-bold text-[#6C307D] hover:underline inline-flex items-center gap-1"
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </main>
          </div>
        </section>

        {/* Stay Updated Banner matching reference screenshot */}
        <section className="bg-[#FAF8F5] border-y border-[#EBE7DF] py-6 px-4 sm:px-8 my-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#6C307D] text-white flex items-center justify-center shrink-0">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Stay Updated with SANUSHA
                </h4>
                <p className="text-xs text-gray-600 font-medium">
                  Subscribe to our newsletter and get 10% off on your next order.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto max-w-md">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-white border border-gray-300 rounded-xs px-4 py-2.5 text-xs focus:outline-none focus:border-[#6C307D]"
              />
              <button
                onClick={() => addToast('Subscribed', 'Thank you for subscribing!')}
                className="bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-xs transition-colors shrink-0"
              >
                SUBSCRIBE
              </button>
            </div>
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
