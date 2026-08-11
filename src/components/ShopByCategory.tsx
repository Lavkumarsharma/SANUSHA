'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';

export const ShopByCategory: React.FC = () => {
  const { setSelectedCategory } = useStore();

  const categories = [
    { title: 'DECOR ACCENTS', image: '/images/cat_decor_accents.jpg', count: '45+ Pieces' },
    { title: 'TEXTILES & CUSHIONS', image: '/images/cat_textiles_cushions.jpg', count: '30+ Designs' },
    { title: 'HOME FRAGRANCE', image: '/images/cat_home_fragrance.jpg', count: '25+ Aromas' },
    { title: 'WALL & ART', image: '/images/cat_wall_art.jpg', count: '40+ Artworks' },
  ];

  return (
    <section id="collections" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Heading */}
      <div className="text-center mb-10 space-y-1">
        <span className="text-xs font-bold tracking-[0.25em] text-[#6C307D] uppercase">
          EXPLORE COLLECTIONS
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight">
          Curated Home Decor Categories
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat, idx) => (
          <a
            key={idx}
            href="#products"
            onClick={() => setSelectedCategory(cat.title)}
            className="group relative h-80 sm:h-96 rounded-sm overflow-hidden bg-gray-100 shadow-xs block"
          >
            {/* Image */}
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity group-hover:from-black/70" />

            {/* Card Content Overlay */}
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <h3 className="text-lg sm:text-xl font-bold tracking-widest uppercase">
                {cat.title}
              </h3>

              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-200 group-hover:text-white group-hover:gap-2.5 transition-all">
                <span>EXPLORE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
