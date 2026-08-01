'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    addToast('Subscribed!', 'Thank you for subscribing. Check your inbox for 10% off.');
    setEmail('');
  };

  return (
    <footer className="bg-[#FAF8F5] border-t border-[#EBE7DF] pt-14 pb-8 px-4 sm:px-8 text-gray-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#E8E4DA]">
        
        {/* Column 1: Brand Info */}
        <div className="space-y-4 lg:col-span-1">
          <a href="#" className="inline-block">
            <span className="font-brand-logo text-2xl font-bold tracking-[0.25em] text-[#6C307D]">
              SANUSHA
            </span>
          </a>
          <p className="text-xs text-gray-600 leading-relaxed max-w-xs font-medium">
            Timeless fashion, crafted with purpose. Designed to empower. Made to last.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3 pt-2">
            {/* Instagram */}
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white border border-[#E5E2DA] flex items-center justify-center text-gray-700 hover:text-[#6C307D] hover:border-[#6C307D] transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white border border-[#E5E2DA] flex items-center justify-center text-gray-700 hover:text-[#6C307D] hover:border-[#6C307D] transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
              </svg>
            </a>

            {/* Pinterest */}
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white border border-[#E5E2DA] flex items-center justify-center text-gray-700 hover:text-[#6C307D] hover:border-[#6C307D] transition-colors"
              aria-label="Pinterest"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z"/>
              </svg>
            </a>

            {/* TikTok */}
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white border border-[#E5E2DA] flex items-center justify-center text-gray-700 hover:text-[#6C307D] hover:border-[#6C307D] transition-colors"
              aria-label="TikTok"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 11-5.2-1.74 2.89 2.89 0 012.31-1.39h.09V9.06a6.34 6.34 0 105.25 6.28V9.75a8.28 8.28 0 004.77 1.51V7.81a4.84 4.84 0 01-3.77-1.12z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: SHOP */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold tracking-widest text-gray-900 uppercase">
            SHOP
          </h4>
          <ul className="space-y-2 text-xs font-medium text-gray-600">
            <li><a href="#products" className="hover:text-[#6C307D] transition-colors">All Products</a></li>
            <li><a href="#collections" className="hover:text-[#6C307D] transition-colors">Women</a></li>
            <li><a href="#collections" className="hover:text-[#6C307D] transition-colors">Men</a></li>
            <li><a href="#collections" className="hover:text-[#6C307D] transition-colors">Tops</a></li>
            <li><a href="#collections" className="hover:text-[#6C307D] transition-colors">Bottoms</a></li>
            <li><a href="#new-arrivals" className="hover:text-[#6C307D] transition-colors">New Arrivals</a></li>
          </ul>
        </div>

        {/* Column 3: HELP */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold tracking-widest text-gray-900 uppercase">
            HELP
          </h4>
          <ul className="space-y-2 text-xs font-medium text-gray-600">
            <li><a href="#" className="hover:text-[#6C307D] transition-colors">FAQs</a></li>
            <li><a href="#" className="hover:text-[#6C307D] transition-colors">Shipping & Delivery</a></li>
            <li><a href="#" className="hover:text-[#6C307D] transition-colors">Returns & Exchanges</a></li>
            <li><a href="#" className="hover:text-[#6C307D] transition-colors">Track Order</a></li>
            <li><a href="#" className="hover:text-[#6C307D] transition-colors">Size Guide</a></li>
          </ul>
        </div>

        {/* Column 4: ABOUT */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold tracking-widest text-gray-900 uppercase">
            ABOUT
          </h4>
          <ul className="space-y-2 text-xs font-medium text-gray-600">
            <li><a href="#" className="hover:text-[#6C307D] transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-[#6C307D] transition-colors">Our Story</a></li>
            <li><a href="#" className="hover:text-[#6C307D] transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-[#6C307D] transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-[#6C307D] transition-colors">Contact Us</a></li>
          </ul>
        </div>

        {/* Column 5: NEWSLETTER */}
        <div className="space-y-3 lg:col-span-1">
          <h4 className="text-xs font-bold tracking-widest text-gray-900 uppercase">
            NEWSLETTER
          </h4>
          <p className="text-xs text-gray-600 font-medium">
            Subscribe & get 10% off on your first order.
          </p>

          <form onSubmit={handleSubscribe} className="flex items-center gap-1 pt-1">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-white border border-[#E0DCD2] rounded-xs px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#6C307D] placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="bg-[#6C307D] hover:bg-[#522061] text-white p-2.5 rounded-xs transition-colors shrink-0"
              aria-label="Subscribe"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Copyright & Payment Methods */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-500">
        <p>© 2025 SANUSHA. All rights reserved.</p>

        {/* Payment Icons */}
        <div className="flex items-center gap-2">
          <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-[10px] font-extrabold text-blue-900 tracking-wider">
            VISA
          </span>
          <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-[10px] font-extrabold text-red-600 tracking-wider">
            mastercard
          </span>
          <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-[10px] font-extrabold text-orange-600 tracking-wider">
            UPI
          </span>
          <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-[10px] font-extrabold text-cyan-600 tracking-wider">
            Paytm
          </span>
        </div>
      </div>
    </footer>
  );
};
