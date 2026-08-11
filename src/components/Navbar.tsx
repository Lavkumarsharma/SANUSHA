'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ChevronDown, User, Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '@/store/useStore';

export const Navbar: React.FC = () => {
  const { cart, wishlist } = useStore();
  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalWishlistCount = wishlist.length;

  return (
    <header className="bg-white sticky top-0 z-40 border-b border-[#EBE7DF] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* Brand Emblem Logo Only */}
        <Link href="/" className="flex items-center group">
          <img
            src="/icon.svg"
            alt="SANUSHA Brand Emblem Logo"
            className="h-9 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-bold tracking-[0.15em] uppercase text-gray-800">
          <Link href="/" className="hover:text-[#6C307D] transition-colors py-2 border-b-2 border-[#6C307D]">
            HOME
          </Link>
          <div className="relative group py-2">
            <Link href="/shop" className="hover:text-[#6C307D] transition-colors flex items-center gap-1">
              SHOP <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#6C307D]" />
            </Link>
          </div>
          <Link href="/shop?filter=new-arrivals" className="hover:text-[#6C307D] transition-colors py-2">
            NEW ARRIVALS
          </Link>
          <Link href="/shop#collections" className="hover:text-[#6C307D] transition-colors py-2">
            COLLECTIONS
          </Link>
          <Link href="/account" className="hover:text-[#6C307D] transition-colors py-2">
            MY ACCOUNT
          </Link>
        </nav>

        {/* Search Bar & User Actions */}
        <div className="flex items-center gap-4">
          <div className="relative w-48 sm:w-64">
            <input
              type="text"
              placeholder="Search decor products..."
              className="w-full bg-[#FAF8F5] border border-[#EBE7DF] rounded-xs py-1.5 pl-3 pr-8 text-xs focus:outline-none focus:border-[#6C307D]"
            />
            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="p-1.5 text-gray-700 hover:text-[#6C307D] transition-colors rounded-full hover:bg-gray-100"
              title="Sign In / Account"
            >
              <User className="w-5 h-5" />
            </Link>

            <Link
              href="/wishlist"
              className="p-1.5 text-gray-700 hover:text-[#6C307D] transition-colors rounded-full hover:bg-gray-100 relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {totalWishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#6C307D] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="p-1.5 text-gray-700 hover:text-[#6C307D] transition-colors rounded-full hover:bg-gray-100 relative"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute top-0 right-0 bg-slate-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {totalCartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
};
