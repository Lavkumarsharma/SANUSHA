'use client';

import React from 'react';
import { Truck, PackageCheck, ShieldCheck, Headset } from 'lucide-react';

export const ValuePropsBar: React.FC = () => {
  const items = [
    {
      icon: Truck,
      title: 'FREE SHIPPING',
      subtitle: 'On orders over ₹999',
    },
    {
      icon: PackageCheck,
      title: 'EASY RETURNS',
      subtitle: 'Within 7 days',
    },
    {
      icon: ShieldCheck,
      title: 'SECURE PAYMENTS',
      subtitle: '100% secure checkout',
    },
    {
      icon: Headset,
      title: 'CUSTOMER SUPPORT',
      subtitle: "We're here to help",
    },
  ];

  return (
    <section className="bg-[#FAF8F5] border-b border-[#EBE7DF] py-6 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-3.5 ${
                idx !== 0 ? 'pt-4 md:pt-0 md:pl-6' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5E2DA] flex items-center justify-center text-[#6C307D] shrink-0 shadow-xs">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-wider text-gray-900 uppercase">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-500 font-medium">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
