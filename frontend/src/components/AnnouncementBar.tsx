'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, Heart, ShoppingBag, Truck, RefreshCw, CreditCard } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { fetchApi } from '@/lib/api';

export const AnnouncementBar: React.FC = () => {
  const { wishlist, cart } = useStore();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const [userName, setUserName] = useState<string | null>(null);

  const [config, setConfig] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cachedHdr = localStorage.getItem('sanusha_cms_header_cache');
        if (cachedHdr) {
          const parsed = JSON.parse(cachedHdr);
          if (parsed && parsed.announcementText1) return parsed;
        }
      } catch (e) {}
    }
    return {
      announcementText1: 'FREE SHIPPING ON ORDERS OVER ₹999',
      announcementText2: 'EASY RETURNS',
      announcementText3: 'COD AVAILABLE',
    };
  });

  useEffect(() => {
    fetchApi('/cms/header')
      .then((data) => {
        if (data && data.announcementText1) {
          setConfig(data);
          if (typeof window !== 'undefined') {
            localStorage.setItem('sanusha_cms_header_cache', JSON.stringify(data));
          }
        }
      })
      .catch(() => {});

    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('sanusha_customer_user');
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          setUserName(u.name || u.email);
        } catch (e) {}
      }
    }
  }, []);

  return (
    <div className="bg-[#FAF8F5] border-b border-[#EBE7DF] text-[10px] sm:text-[11px] text-gray-700 py-1.5 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-between gap-2">
        <div className="flex items-center gap-4 sm:gap-6 font-medium tracking-wider uppercase text-gray-600 mx-auto sm:mx-0">
          <span className="flex items-center gap-1.5 hover:text-black transition-colors">
            <Truck className="w-3 h-3 text-[#6C307D]" />
            {config.announcementText1}
          </span>
          <span className="hidden md:inline text-gray-300">|</span>
          <span className="hidden sm:flex items-center gap-1.5 hover:text-black transition-colors">
            <RefreshCw className="w-3 h-3 text-[#6C307D]" />
            {config.announcementText2}
          </span>
          <span className="hidden md:inline text-gray-300">|</span>
          <span className="hidden md:flex items-center gap-1.5 hover:text-black transition-colors">
            <CreditCard className="w-3 h-3 text-[#6C307D]" />
            {config.announcementText3}
          </span>
        </div>
      </div>
    </div>
  );
};
