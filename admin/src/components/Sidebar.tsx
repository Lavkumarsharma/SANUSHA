'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  Boxes,
  ShoppingCart,
  LayoutTemplate,
  Palette,
  Image as ImageIcon,
  Search,
  Settings,
  Ticket,
  LogOut,
} from 'lucide-react';
import { fetchApi, getImageUrl } from '@/lib/api';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [headerConfig, setHeaderConfig] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cachedHdr = localStorage.getItem('sanusha_cms_header_cache');
        if (cachedHdr) {
          const parsed = JSON.parse(cachedHdr);
          if (parsed && parsed.brandName) return parsed;
        }
      } catch (e) {}
    }
    return {
      brandName: 'SANUSHA',
      iconUrl: '',
      logoUrl: '',
    };
  });

  useEffect(() => {
    fetchApi('/cms/header')
      .then((data) => {
        if (data && data.brandName) {
          setHeaderConfig(data);
          if (typeof window !== 'undefined') {
            localStorage.setItem('sanusha_cms_header_cache', JSON.stringify(data));
          }
        }
      })
      .catch(() => {});
  }, []);

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/dashboard/products', icon: ShoppingBag },
    { label: 'Categories', href: '/dashboard/categories', icon: FolderTree },
    { label: 'Inventory', href: '/dashboard/inventory', icon: Boxes },
    { label: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
    { label: 'Discount Coupons', href: '/dashboard/coupons', icon: Ticket },
    { label: 'CMS Page Builder', href: '/dashboard/cms-builder', icon: LayoutTemplate },
    { label: 'Theme Customizer', href: '/dashboard/theme', icon: Palette },
    { label: 'Media Library', href: '/dashboard/media', icon: ImageIcon },
    { label: 'SEO Manager', href: '/dashboard/seo', icon: Search },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  if (pathname === '/') return null;

  return (
    <aside className="w-64 bg-white text-slate-700 h-screen sticky top-0 overflow-y-auto flex flex-col justify-between p-4 border-r border-slate-200 shrink-0 shadow-xs z-40">
      <div className="space-y-6">
        {/* Brand Header with Live Logo Sync (Purple 'S' box removed) */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-slate-100">
          {getImageUrl(headerConfig.iconUrl) ? (
            <img src={getImageUrl(headerConfig.iconUrl)} alt="Icon" className="w-7 h-7 object-contain rounded shrink-0" />
          ) : null}

          <div className="min-w-0 flex-1">
            {getImageUrl(headerConfig.logoUrl) ? (
              <img src={getImageUrl(headerConfig.logoUrl)} alt={headerConfig.brandName} className="h-7 w-auto object-contain" />
            ) : (
              <h1 className="font-bold text-slate-900 tracking-[0.2em] text-base truncate font-serif">
                {headerConfig.brandName}
              </h1>
            )}
            <span className="text-[9px] text-[#6C307D] font-bold uppercase tracking-wider block mt-0.5">
              ENTERPRISE CMS
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1 text-xs font-medium">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#6C307D] text-white font-bold shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status & Logout */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[10px]">
          <span className="text-slate-500 font-bold block">System Status</span>
          <span className="text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            REST API Connected
          </span>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem('sanusha_token');
            localStorage.removeItem('sanusha_user');
            window.location.href = '/';
          }}
          className="w-full flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors px-3 py-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
