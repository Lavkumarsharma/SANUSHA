'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, User, ExternalLink } from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();

  if (pathname === '/') return null;

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
      {/* Title / Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search products, orders, categories..."
            className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 pl-9 pr-4 text-xs text-slate-800 focus:outline-none focus:border-[#6F472B] focus:bg-white"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 text-xs">
        {/* Customer Site Preview Link */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 bg-[#FAF6F0] text-[#6F472B] hover:bg-[#F3EBE0] border border-[#E8D9C8] px-3 py-1.5 rounded-md font-bold transition-colors"
        >
          <span>Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Notifications */}
        <button
          className="relative text-slate-500 hover:text-slate-900 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#6F472B] rounded-full" />
        </button>

        {/* User Profile Info */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#6F472B] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            SA
          </div>
          <div className="hidden md:block text-left">
            <span className="font-bold text-slate-900 block leading-none">Super Admin</span>
            <span className="text-[10px] text-slate-500 font-medium">admin@sanusha.com</span>
          </div>
        </div>
      </div>
    </header>
  );
};
