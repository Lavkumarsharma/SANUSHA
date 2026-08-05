'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi, getImageUrl } from '@/lib/api';

export const Footer: React.FC = () => {
  const [footerConfig, setFooterConfig] = useState({
    brandDescription: 'Timeless fashion, crafted with purpose. Designed to empower. Made to last.',
    col1Title: 'SHOP',
    col1Links: [
      { id: '1', label: 'All Products', url: '/shop' },
      { id: '2', label: "Women's Collection", url: '/category/women' },
      { id: '3', label: "Men's Collection", url: '/category/men' },
      { id: '4', label: 'New Arrivals', url: '/shop' },
    ],
    col2Title: 'CUSTOMER CARE',
    col2Links: [
      { id: '1', label: 'My Account', url: '/account' },
      { id: '2', label: 'Wishlist', url: '/wishlist' },
      { id: '3', label: 'Shopping Cart', url: '/cart' },
    ],
    newsletterTitle: 'NEWSLETTER',
    newsletterSubtitle: 'Subscribe & get 10% off your first order.',
    newsletterButtonText: 'JOIN',
    copyrightText: '© 2026 SANUSHA Enterprise Platform. All rights reserved.',
  });

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
    Promise.all([
      fetchApi('/cms/footer').catch(() => null),
      fetchApi('/cms/header').catch(() => null),
    ]).then(([ftr, hdr]) => {
      if (ftr) {
        setFooterConfig((prev: any) => ({
          ...prev,
          ...ftr,
          col1Links: ftr.col1Links !== undefined ? ftr.col1Links : prev.col1Links,
          col2Links: ftr.col2Links !== undefined ? ftr.col2Links : prev.col2Links,
        }));
      }
      if (hdr && hdr.brandName) {
        setHeaderConfig(hdr);
        if (typeof window !== 'undefined') {
          localStorage.setItem('sanusha_cms_header_cache', JSON.stringify(hdr));
        }
      }
    });
  }, []);

  return (
    <footer className="bg-[#FAF8F5] border-t border-[#EBE7DF] pt-14 pb-8 px-4 sm:px-8 text-xs text-gray-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand Tagline & Dual Logo Display */}
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            {getImageUrl(headerConfig.iconUrl) ? (
              <img src={getImageUrl(headerConfig.iconUrl)} alt="Brand Icon" className="h-9 w-auto object-contain" />
            ) : null}
            {getImageUrl(headerConfig.logoUrl) ? (
              <img src={getImageUrl(headerConfig.logoUrl)} alt={headerConfig.brandName} className="h-9 w-auto object-contain" />
            ) : (
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-gray-900 block group-hover:text-[#6C307D] transition-colors">
                {headerConfig.brandName}
              </span>
            )}
          </Link>

          <p className="text-gray-600 leading-relaxed font-medium">
            {footerConfig.brandDescription}
          </p>
        </div>

        {/* Column 1 Links */}
        <div>
          <h4 className="font-bold text-gray-900 uppercase tracking-widest mb-3">
            {footerConfig.col1Title}
          </h4>
          <ul className="space-y-2 text-gray-600 font-medium">
            {(footerConfig.col1Links || []).map((link, idx) => (
              <li key={link.id || idx}>
                <Link href={link.url} className="hover:text-[#6C307D]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2 Links */}
        <div>
          <h4 className="font-bold text-gray-900 uppercase tracking-widest mb-3">
            {footerConfig.col2Title}
          </h4>
          <ul className="space-y-2 text-gray-600 font-medium">
            {(footerConfig.col2Links || []).map((link, idx) => (
              <li key={link.id || idx}>
                {link.url && link.url.startsWith('http') ? (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#6C307D] font-bold text-[#6C307D]"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.url || '/'} className="hover:text-[#6C307D]">
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Section */}
        <div>
          <h4 className="font-bold text-gray-900 uppercase tracking-widest mb-3">
            {footerConfig.newsletterTitle}
          </h4>
          <p className="text-gray-600 mb-3">{footerConfig.newsletterSubtitle}</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-white border border-[#EBE7DF] rounded-xs px-3 py-2 text-xs w-full focus:outline-none focus:border-[#6C307D]"
            />
            <button className="bg-[#6C307D] text-white px-4 py-2 font-bold uppercase rounded-xs hover:bg-[#522061] transition-colors">
              {footerConfig.newsletterButtonText}
            </button>
          </div>
        </div>
      </div>

      {/* Clean Copyright Notice */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-[#EBE7DF] text-center text-[11px] text-gray-500 font-medium">
        <p>{footerConfig.copyrightText}</p>
      </div>
    </footer>
  );
};
