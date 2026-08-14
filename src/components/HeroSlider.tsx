'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface Slide {
  id: number;
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  mobileImage?: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    tagline: 'HANDCRAFTED LUXURY',
    titleLine1: 'CRAFTED WITH',
    titleLine2: 'MEANING.',
    subtitle: 'Thoughtful gifts, handcrafted treasures and timeless details made to be cherished.',
    ctaText: 'EXPLORE COLLECTION',
    ctaLink: '/shop',
    image: '/images/decor_hero_banner.jpg',
  },
];

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <section className="relative w-full aspect-[16/9] min-h-[420px] max-h-[85vh] bg-[#EAE7DF] overflow-hidden">
      {/* Background Slide Image with next/image priority loading */}
      <div className="absolute inset-0">
        {SLIDES.map((item, idx) => (
          <React.Fragment key={item.id}>
            <Image
              src={item.image}
              alt={item.titleLine1}
              fill
              priority={idx === 0}
              sizes="100vw"
              quality={85}
              className={`object-cover object-top sm:object-center transition-opacity duration-700 ease-in-out ${
                item.mobileImage ? 'hidden sm:block' : 'block'
              } ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            />
            {item.mobileImage && (
              <Image
                src={item.mobileImage}
                alt={item.titleLine1}
                fill
                priority={idx === 0}
                sizes="100vw"
                quality={85}
                className={`block sm:hidden object-cover object-center transition-opacity duration-700 ease-in-out ${
                  idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              />
            )}
          </React.Fragment>
        ))}
        {/* Soft overlay gradient for perfect text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent lg:via-white/30 z-10" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-6 sm:px-12 flex items-center">
        <div className="max-w-xl space-y-4 animate-in fade-in slide-in-from-left duration-500">
          <span className="inline-block text-xs font-bold tracking-[0.25em] text-[#6C307D] uppercase">
            {slide.tagline}
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-gray-900 leading-[1.05] tracking-tight">
            {slide.titleLine1} <br />
            <span className="text-[#6C307D] font-normal italic">{slide.titleLine2}</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-700 max-w-md font-medium leading-relaxed">
            {slide.subtitle}
          </p>

          <div className="pt-2">
            <a
              href={slide.ctaLink}
              className="inline-flex items-center gap-3 bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold tracking-widest uppercase px-7 py-3.5 rounded-sm shadow-md transition-all hover:gap-4 hover:shadow-lg"
            >
              {slide.ctaText}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
        className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-gray-800 flex items-center justify-center backdrop-blur-sm shadow-md transition-all hover:scale-105"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
        className="absolute z-10 right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-gray-800 flex items-center justify-center backdrop-blur-sm shadow-md transition-all hover:scale-105"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute z-10 bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              idx === currentSlide
                ? 'bg-[#6C307D] w-6'
                : 'bg-gray-400/60 hover:bg-gray-600'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
