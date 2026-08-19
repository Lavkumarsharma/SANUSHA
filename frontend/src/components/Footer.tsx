'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi, getImageUrl } from '@/lib/api';

export const Footer: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [brandConfig, setBrandConfig] = useState<any>({
    brandName: 'SANUSHA',
    tagline: 'Thoughtful Gifting, Timeless Craft.',
    shortDescription: 'Thoughtfully curated gifts and handcrafted treasures designed to celebrate meaningful moments.',
    logoUrl: '',
  });

  useEffect(() => {
    // 1. Client-side localStorage hydration after initial render
    try {
      const cachedBrand = localStorage.getItem('sanusha_cms_brand_cache');
      const cachedHeader = localStorage.getItem('sanusha_cms_header_cache');
      const parsedHeader = cachedHeader ? JSON.parse(cachedHeader) : null;
      const parsedBrand = cachedBrand ? JSON.parse(cachedBrand) : null;
      if (parsedHeader || parsedBrand) {
        setBrandConfig((prev: any) => ({
          ...prev,
          brandName: parsedHeader?.brandName || parsedBrand?.brandName || prev.brandName,
          tagline: parsedBrand?.tagline || prev.tagline,
          shortDescription: parsedBrand?.shortDescription || prev.shortDescription,
          logoUrl: parsedHeader?.logoUrl || parsedBrand?.logoUrl || parsedBrand?.footerLogoUrl || prev.logoUrl,
        }));
      }
    } catch (e) {}

    // 2. Fetch fresh API data
    Promise.all([
      fetchApi('/cms/header').catch(() => null),
      fetchApi('/cms/brand').catch(() => null),
    ]).then(([headerData, brandData]) => {
      setBrandConfig((prev: any) => ({
        ...prev,
        brandName: headerData?.brandName || brandData?.brandName || prev.brandName,
        logoUrl: headerData?.logoUrl || brandData?.footerLogoUrl || brandData?.logoUrl || prev.logoUrl,
        tagline: brandData?.tagline || prev.tagline,
        shortDescription: brandData?.shortDescription || prev.shortDescription,
      }));
    });
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const logoImageUrl = getImageUrl(brandConfig.logoUrl);

  return (
    <footer className="bg-[#FAF7F2] border-t border-[#E8DFC8] pt-16 pb-12 px-6 sm:px-10 lg:px-16 text-xs text-gray-700">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-16">
        
        {/* COLUMN 1: ABOUT SANUSHA */}
        <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-8">
          <Link href="/" className="inline-block group">
            {logoImageUrl ? (
              <img
                src={logoImageUrl}
                alt={brandConfig.brandName || 'SANUSHA'}
                className="h-8 lg:h-10 w-auto object-contain"
              />
            ) : (
              <span className="font-serif text-2xl lg:text-3xl font-extrabold tracking-[0.28em] uppercase text-gray-900 group-hover:text-[#C5A059] transition-colors duration-300">
                {brandConfig.brandName || 'SANUSHA'}
              </span>
            )}
          </Link>

          <p className="font-serif italic text-sm text-[#8C7A5A] font-medium">
            {brandConfig.tagline || 'Thoughtful Gifting, Timeless Craft.'}
          </p>

          <p className="text-gray-600 leading-relaxed font-sans text-xs max-w-md pt-1">
            {brandConfig.shortDescription || 'Thoughtfully curated gifts and handcrafted treasures designed to celebrate meaningful moments.'}
          </p>
        </div>

        {/* COLUMN 2: SHOP */}
        <div>
          <h4 className="font-serif text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-4 border-b border-[#E8DFC8] pb-1 inline-block">
            Shop
          </h4>
          <ul className="space-y-2.5 text-gray-600 font-sans font-medium">
            <li>
              <Link href="/shop?filter=gifts" className="hover:text-[#C5A059] transition-colors">
                Gifts
              </Link>
            </li>
            <li>
              <Link href="/shop?filter=collections" className="hover:text-[#C5A059] transition-colors">
                Collections
              </Link>
            </li>
            <li>
              <Link href="/shop?filter=occasions" className="hover:text-[#C5A059] transition-colors">
                Occasions
              </Link>
            </li>
            <li>
              <Link href="/shop?filter=new-arrivals" className="hover:text-[#C5A059] transition-colors">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link href="/shop?filter=gift-boxes" className="hover:text-[#C5A059] transition-colors">
                Gift Boxes
              </Link>
            </li>
          </ul>
        </div>

        {/* COLUMN 3: CUSTOMER CARE */}
        <div>
          <h4 className="font-serif text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-4 border-b border-[#E8DFC8] pb-1 inline-block">
            Customer Care
          </h4>
          <ul className="space-y-2.5 text-gray-600 font-sans font-medium">
            <li>
              <Link href="/account" className="hover:text-[#C5A059] transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-[#C5A059] transition-colors">
                Shipping
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-[#C5A059] transition-colors">
                Returns
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-[#C5A059] transition-colors">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-[#C5A059] transition-colors">
                Track Order
              </Link>
            </li>
          </ul>
        </div>

        {/* COLUMN 4: DISCOVER */}
        <div>
          <h4 className="font-serif text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-4 border-b border-[#E8DFC8] pb-1 inline-block">
            Discover
          </h4>
          <ul className="space-y-2.5 text-gray-600 font-sans font-medium">
            <li>
              <Link href="/stories" className="hover:text-[#C5A059] transition-colors">
                Journal
              </Link>
            </li>
            <li>
              <Link href="/stories#artisan" className="hover:text-[#C5A059] transition-colors">
                Artisan Stories
              </Link>
            </li>
            <li>
              <Link href="/stories#guides" className="hover:text-[#C5A059] transition-colors">
                Gift Guides
              </Link>
            </li>
            <li>
              <Link href="/stories#sustainability" className="hover:text-[#C5A059] transition-colors">
                Sustainability
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* NEWSLETTER SECTION */}
      <div className="max-w-[1440px] mx-auto border-t border-[#E8DFC8] pt-12 pb-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="font-serif text-lg font-bold text-gray-900 tracking-wider uppercase mb-1">
            Stay Inspired
          </h3>
          <p className="text-gray-600 font-sans text-xs">
            Receive curated stories, gifting inspiration, and exclusive collections.
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md md:ml-auto w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="bg-white border border-[#E8DFC8] rounded-xs px-4 py-2.5 text-xs w-full text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#C5A059] transition-colors"
          />
          <button
            type="submit"
            className="bg-[#C5A059] hover:bg-[#B38D48] text-white px-6 py-2.5 font-bold uppercase tracking-widest text-[11px] rounded-xs transition-colors shadow-xs whitespace-nowrap"
          >
            {subscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </form>
      </div>

      {/* BOTTOM COPYRIGHT BAR */}
      <div className="max-w-[1440px] mx-auto border-t border-[#E8DFC8] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 font-sans gap-2">
        <p>© 2026 SANUSHA Luxury Gifting House. All rights reserved.</p>
        <div className="flex items-center space-x-6 text-gray-500 font-medium">
          <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};
