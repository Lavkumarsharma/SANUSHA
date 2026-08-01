'use client';

import React from 'react';
import { Gem, Sparkles, Tag, Leaf } from 'lucide-react';

export const BrandHighlights: React.FC = () => {
  const highlights = [
    {
      icon: Gem,
      title: 'PREMIUM QUALITY',
      subtitle: 'Finest fabrics & materials',
    },
    {
      icon: Sparkles,
      title: 'TREND-DRIVEN',
      subtitle: 'Stay ahead of the trends',
    },
    {
      icon: Tag,
      title: 'LIMITED EDITIONS',
      subtitle: 'Unique pieces, limited stock',
    },
    {
      icon: Leaf,
      title: 'SUSTAINABLE FASHION',
      subtitle: 'Better for you & the planet',
    },
  ];

  return (
    <section className="bg-[#FAF8F5] border-y border-[#EBE7DF] py-8 px-4 sm:px-8 my-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {highlights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3.5">
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
