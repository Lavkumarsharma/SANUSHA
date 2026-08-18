'use client';

import React, { useEffect, useState } from 'react';

const ANNOUNCEMENTS = [
  'Handcrafted In India',
  'Thoughtfully Curated Collections',
  'Gift-Ready Luxury Packaging',
  'Delivered Across India',
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#FAF7F2] border-b border-[#E8DFC8] text-gray-800 text-[10px] sm:text-[11px] py-2 px-4 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-center relative overflow-hidden h-4">
        {ANNOUNCEMENTS.map((text, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={index}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              <span className="font-serif tracking-[0.2em] uppercase text-gray-800 font-medium flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#C5A059]" />
                {text}
                <span className="w-1 h-1 rounded-full bg-[#C5A059]" />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
