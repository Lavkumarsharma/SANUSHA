'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

const DEFAULT_ANNOUNCEMENTS = [
  'Handcrafted In India',
  'Thoughtfully Curated Collections',
  'Gift-Ready Luxury Packaging',
  'Delivered Across India',
];

export const AnnouncementBar: React.FC = () => {
  const [announcements, setAnnouncements] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('sanusha_cms_announcements_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_ANNOUNCEMENTS;
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchApi('/cms/announcements')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAnnouncements(data);
          if (typeof window !== 'undefined') {
            localStorage.setItem('sanusha_cms_announcements_cache', JSON.stringify(data));
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements]);

  return (
    <div className="bg-[#FAF7F2] border-b border-[#E8DFC8] text-gray-800 text-[10px] sm:text-[11px] py-2 px-4 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-center relative overflow-hidden h-4">
        {announcements.map((text, index) => {
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
