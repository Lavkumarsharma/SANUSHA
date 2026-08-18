'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Package, Gift, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchApi } from '@/lib/api';

const DEFAULT_ANNOUNCEMENTS = [
  { text: 'Handcrafted In India', icon: 'sparkles' },
  { text: 'Thoughtfully Curated Collections', icon: 'package' },
  { text: 'Gift-Ready Luxury Packaging', icon: 'gift' },
  { text: 'Delivered Across India', icon: 'truck' },
];

export const AnnouncementBar: React.FC = () => {
  const [announcements, setAnnouncements] = useState<any[]>(DEFAULT_ANNOUNCEMENTS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchApi('/cms/announcements')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAnnouncements(data.map((item: any) => typeof item === 'string' ? { text: item, icon: 'sparkles' } : item));
        }
      })
      .catch(() => {});
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  return (
    <div className="bg-[#FAF7F2] border-b border-[#E8DFC8] text-gray-800 text-[11px] font-sans py-2.5 px-4 sm:px-8 select-none">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        
        {/* Desktop 4-Item Grid with Icons */}
        <div className="hidden lg:grid grid-cols-4 gap-6 w-full max-w-5xl mx-auto text-center font-medium tracking-wide">
          <div className="flex items-center justify-center gap-2 hover:text-[#C5A059] transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{announcements[0]?.text || 'Handcrafted In India'}</span>
          </div>
          <div className="flex items-center justify-center gap-2 border-l border-[#E8DFC8] pl-6 hover:text-[#C5A059] transition-colors">
            <Package className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{announcements[1]?.text || 'Thoughtfully Curated Collections'}</span>
          </div>
          <div className="flex items-center justify-center gap-2 border-l border-[#E8DFC8] pl-6 hover:text-[#C5A059] transition-colors">
            <Gift className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{announcements[2]?.text || 'Gift-Ready Luxury Packaging'}</span>
          </div>
          <div className="flex items-center justify-center gap-2 border-l border-[#E8DFC8] pl-6 hover:text-[#C5A059] transition-colors">
            <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{announcements[3]?.text || 'Delivered Across India'}</span>
          </div>
        </div>

        {/* Mobile / Compact Carousel Slider with Counter Controls */}
        <div className="lg:hidden flex items-center justify-between w-full">
          <div className="flex items-center gap-2 mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="font-serif tracking-wider uppercase text-gray-900 font-medium">
              {announcements[currentIndex]?.text || 'Handcrafted In India'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
            <button onClick={handlePrev} className="p-0.5 hover:text-black">
              <ChevronLeft className="w-3 h-3" />
            </button>
            <span>{currentIndex + 1} / {announcements.length}</span>
            <button onClick={handleNext} className="p-0.5 hover:text-black">
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
