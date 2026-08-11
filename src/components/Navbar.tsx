'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ChevronDown, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="bg-white sticky top-0 z-40 border-b border-[#EBE7DF] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif text-3xl font-bold tracking-[0.2em] text-gray-900 group-hover:text-[#6C307D] transition-colors">
            SANUSHA
          </span>
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
          <Link href="/shop" className="hover:text-[#6C307D] transition-colors py-2">
            NEW ARRIVALS
          </Link>
          <Link href="/shop" className="hover:text-[#6C307D] transition-colors py-2">
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
              placeholder="Search products..."
              className="w-full bg-[#FAF8F5] border border-[#EBE7DF] rounded-xs py-1.5 pl-3 pr-8 text-xs focus:outline-none focus:border-[#6C307D]"
            />
            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          </div>

          <Link
            href="/login"
            className="p-2 text-gray-700 hover:text-[#6C307D] transition-colors rounded-full hover:bg-gray-100"
            title="Sign In / Account"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </header>
  );
};
