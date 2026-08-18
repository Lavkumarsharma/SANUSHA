'use client';

import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Gift, HeadphoneOff, Headphones } from 'lucide-react';

export const TrustBar: React.FC = () => {
  return (
    <section className="bg-[#FAF7F2] border-y border-[#E8DFC8] py-8 px-6 sm:px-12 select-none">
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
        
        {/* FREE SHIPPING */}
        <div className="flex items-center justify-center gap-3">
          <Truck className="w-6 h-6 text-[#C5A059] shrink-0 stroke-[1.5]" />
          <div className="text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Free Shipping
            </h4>
            <p className="text-[10px] text-gray-500 font-sans">On orders above ₹999</p>
          </div>
        </div>

        {/* EASY RETURNS */}
        <div className="flex items-center justify-center gap-3 border-l border-[#E8DFC8] pl-6">
          <RotateCcw className="w-6 h-6 text-[#C5A059] shrink-0 stroke-[1.5]" />
          <div className="text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Easy Returns
            </h4>
            <p className="text-[10px] text-gray-500 font-sans">Within 7 days</p>
          </div>
        </div>

        {/* SECURE PAYMENTS */}
        <div className="flex items-center justify-center gap-3 border-l border-[#E8DFC8] pl-6">
          <ShieldCheck className="w-6 h-6 text-[#C5A059] shrink-0 stroke-[1.5]" />
          <div className="text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Secure Payments
            </h4>
            <p className="text-[10px] text-gray-500 font-sans">100% safe & secure</p>
          </div>
        </div>

        {/* GIFT-READY PACKAGING */}
        <div className="flex items-center justify-center gap-3 border-l border-[#E8DFC8] pl-6">
          <Gift className="w-6 h-6 text-[#C5A059] shrink-0 stroke-[1.5]" />
          <div className="text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Gift-Ready Packaging
            </h4>
            <p className="text-[10px] text-gray-500 font-sans">Premium & elegant</p>
          </div>
        </div>

        {/* CUSTOMER SUPPORT */}
        <div className="flex items-center justify-center gap-3 border-l border-[#E8DFC8] pl-6">
          <Headphones className="w-6 h-6 text-[#C5A059] shrink-0 stroke-[1.5]" />
          <div className="text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Customer Support
            </h4>
            <p className="text-[10px] text-gray-500 font-sans">We&apos;re here to help</p>
          </div>
        </div>

      </div>
    </section>
  );
};
