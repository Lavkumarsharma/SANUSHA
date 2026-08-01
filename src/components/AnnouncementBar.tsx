'use client';

import React from 'react';
import Link from 'next/link';
import { User, Heart, ShoppingBag, Truck, RefreshCw, CreditCard } from 'lucide-react';
import { useStore } from '@/store/useStore';

export const AnnouncementBar: React.FC = () => {
  const { wishlist, cart } = useStore();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length > 0 ? wishlist.length : 4;

  return (
    <div className="bg-[#F8F6F2] border-b border-[#EBE7DF] text-xs text-gray-700 py-2.5 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left Announcements */}
        <div className="flex items-center gap-4 sm:gap-6 font-medium text-[11px] sm:text-xs tracking-wide uppercase text-gray-600">
          <span className="flex items-center gap-1.5 hover:text-black transition-colors">
            <Truck className="w-3.5 h-3.5 text-[#6C307D]" />
            FREE SHIPPING ON ORDERS OVER ₹999
          </span>
          <span className="hidden md:inline text-gray-300">|</span>
          <span className="hidden sm:flex items-center gap-1.5 hover:text-black transition-colors">
            <RefreshCw className="w-3.5 h-3.5 text-[#6C307D]" />
            EASY RETURNS
          </span>
          <span className="hidden md:inline text-gray-300">|</span>
          <span className="hidden md:flex items-center gap-1.5 hover:text-black transition-colors">
            <CreditCard className="w-3.5 h-3.5 text-[#6C307D]" />
            COD AVAILABLE
          </span>
        </div>

        {/* Right Actions matching reference */}
        <div className="flex items-center gap-5 text-[11px] font-medium tracking-wide">
          <Link href="/account" className="flex items-center gap-1.5 text-gray-700 hover:text-[#6C307D] transition-colors">
            <User className="w-3.5 h-3.5" />
            <span className="uppercase">SIGN IN / REGISTER</span>
          </Link>

          <Link 
            href="/wishlist"
            className="relative flex items-center gap-1 text-gray-700 hover:text-[#6C307D] transition-colors"
            title="View Wishlist"
          >
            <Heart className="w-4 h-4 text-[#6C307D]" />
            <span className="text-gray-600 font-bold">({wishlistCount})</span>
          </Link>

          <Link 
            href="/cart" 
            className="relative flex items-center gap-1 text-gray-700 hover:text-[#6C307D] transition-colors"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#6C307D]" />
            <span className="text-gray-600 font-bold">({cartCount})</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
