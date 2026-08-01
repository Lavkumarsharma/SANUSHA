'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

export const SummerBanner: React.FC = () => {
  return (
    <section className="py-10 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-sm overflow-hidden bg-[#ECE8DF] border border-[#E2DDD2] grid grid-cols-1 lg:grid-cols-12 items-center min-h-[360px]">
        
        {/* Left Text Content */}
        <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 space-y-4 z-10">
          <span className="inline-block text-xs font-bold tracking-[0.25em] text-gray-600 uppercase">
            SUMMER &apos;24 EDIT
          </span>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-gray-900 leading-tight tracking-tight">
            SIMPLIFY. <br />
            ELEVATE. <br />
            REPEAT.
          </h2>

          <p className="text-xs sm:text-sm text-gray-700 max-w-md font-medium leading-relaxed">
            Modern essentials for your everyday moments. Designed with breathable fabrics and timeless cuts.
          </p>

          <div className="pt-2">
            <a
              href="#new-arrivals"
              className="inline-flex items-center gap-2.5 bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-xs shadow-xs transition-all hover:gap-3.5"
            >
              EXPLORE COLLECTION
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right Image */}
        <div className="lg:col-span-6 h-72 sm:h-96 lg:h-full relative overflow-hidden">
          <img
            src="/images/summer_banner.jpg"
            alt="Summer '24 Edit Model"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient blending on large screens */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#ECE8DF] to-transparent" />
        </div>

      </div>
    </section>
  );
};
