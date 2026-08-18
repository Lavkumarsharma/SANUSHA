'use client';

import React from 'react';
import { Heart, Hand, Gem, Gift, Star } from 'lucide-react';

export const MeaningMeter: React.FC = () => {
  return (
    <section className="bg-[#18191B] text-white border-y border-[#333438] py-6 px-6 sm:px-12 select-none">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
        
        {/* MEANING METER INTRO */}
        <div className="md:col-span-1 flex items-center gap-3 border-b md:border-b-0 md:border-r border-[#333438] pb-4 md:pb-0 md:pr-6">
          <div className="w-10 h-10 rounded-full border border-[#C5A059] flex items-center justify-center shrink-0 bg-[#25262A]">
            <span className="font-serif text-sm font-bold text-[#C5A059]">S</span>
          </div>
          <div>
            <h4 className="font-serif text-xs font-bold tracking-[0.25em] uppercase text-[#C5A059]">
              Meaning Meter
            </h4>
            <p className="text-[10px] text-gray-400 font-sans leading-tight pt-0.5">
              Every Sanusha gift is crafted to create impact that lasts forever.
            </p>
          </div>
        </div>

        {/* 4 RATING CATEGORIES */}
        <div className="md:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
          
          {/* EMOTIONAL VALUE */}
          <div className="flex flex-col items-center sm:items-start space-y-1.5 sm:border-r border-[#333438] sm:pr-4">
            <div className="flex items-center gap-1.5 text-[#C5A059]">
              <Heart className="w-4 h-4 fill-[#C5A059]/20" />
              <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-slate-200">
                Emotional Value
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#C5A059]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-[#C5A059]" />
              ))}
            </div>
          </div>

          {/* CRAFTSMANSHIP */}
          <div className="flex flex-col items-center sm:items-start space-y-1.5 sm:border-r border-[#333438] sm:pr-4">
            <div className="flex items-center gap-1.5 text-[#C5A059]">
              <Hand className="w-4 h-4 fill-[#C5A059]/20" />
              <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-slate-200">
                Craftsmanship
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#C5A059]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-[#C5A059]" />
              ))}
            </div>
          </div>

          {/* EXCLUSIVITY */}
          <div className="flex flex-col items-center sm:items-start space-y-1.5 sm:border-r border-[#333438] sm:pr-4">
            <div className="flex items-center gap-1.5 text-[#C5A059]">
              <Gem className="w-4 h-4 fill-[#C5A059]/20" />
              <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-slate-200">
                Exclusivity
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#C5A059]">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-[#C5A059]" />
              ))}
              <Star className="w-3 h-3 text-gray-600" />
            </div>
          </div>

          {/* PRESENTATION */}
          <div className="flex flex-col items-center sm:items-start space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#C5A059]">
              <Gift className="w-4 h-4 fill-[#C5A059]/20" />
              <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-slate-200">
                Presentation
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#C5A059]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-[#C5A059]" />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
