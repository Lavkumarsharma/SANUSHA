'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '@/lib/api';

export interface HeroSlide {
  id?: string;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  bannerUrl?: string;
  mobileBannerUrl?: string;
  videoUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  showOverlay?: boolean;
  active?: boolean;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  autoPlayInterval?: number;
  renderStyledTitle?: (title: string) => React.ReactNode;
}

function isVideoUrl(url?: string): boolean {
  if (!url) return false;
  const trimmed = url.toLowerCase();
  return (
    trimmed.endsWith('.mp4') ||
    trimmed.endsWith('.webm') ||
    trimmed.endsWith('.mov') ||
    trimmed.endsWith('.ogg') ||
    trimmed.includes('/video/upload/')
  );
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  autoPlayInterval = 6000,
  renderStyledTitle,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imagesPreloaded, setImagesPreloaded] = useState<Record<string, boolean>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeSlides = slides.filter((s) => s.active !== false);
  const totalSlides = activeSlides.length;

  // Preload a given slide's images into browser memory cache
  const preloadSlideAssets = useCallback((slide: HeroSlide) => {
    if (!slide) return;
    const desktop = getImageUrl(slide.bannerUrl);
    const mobile = getImageUrl(slide.mobileBannerUrl);

    [desktop, mobile].forEach((url) => {
      if (url && !isVideoUrl(url) && !imagesPreloaded[url]) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          setImagesPreloaded((prev) => ({ ...prev, [url]: true }));
        };
      }
    });
  }, [imagesPreloaded]);

  // Pre-warm consecutive next slide asset in background array before timer ticks
  useEffect(() => {
    if (totalSlides === 0) return;
    const nextIdx = (currentIdx + 1) % totalSlides;
    if (activeSlides[nextIdx]) {
      preloadSlideAssets(activeSlides[nextIdx]);
    }
  }, [currentIdx, totalSlides, activeSlides, preloadSlideAssets]);

  // Pre-warm all slides on initial mount
  useEffect(() => {
    activeSlides.forEach((slide) => preloadSlideAssets(slide));
  }, [activeSlides, preloadSlideAssets]);

  // Auto-play interval timer with pause-on-hover support
  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIdx((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIdx((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSlides, isPaused, autoPlayInterval, nextSlide]);

  if (totalSlides === 0) return null;

  return (
    <section
      className="relative w-full aspect-[3/4] sm:aspect-[16/9] min-h-[480px] sm:min-h-[420px] max-h-[85vh] bg-[#111827] overflow-hidden select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Homepage Hero Carousel"
    >
      {activeSlides.map((slide, idx) => {
        const isCurrent = idx === currentIdx;
        const desktopImg = getImageUrl(slide.bannerUrl) || '/images/decor_hero_banner.jpg';
        const mobileImg = getImageUrl(slide.mobileBannerUrl) || '';
        const videoSrc = slide.videoUrl || (isVideoUrl(slide.bannerUrl) ? slide.bannerUrl : '');
        const hasTextContent = !!(slide.title?.trim() || slide.subtitle?.trim() || slide.badgeText?.trim());
        const shouldShowOverlay = slide.showOverlay !== false && hasTextContent;

        return (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 transform-gpu transition-all duration-1000 ease-out ${
              isCurrent
                ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                : 'opacity-0 scale-105 z-0 pointer-events-none'
            }`}
            style={{ willChange: 'opacity, transform' }}
            aria-hidden={!isCurrent}
          >
            {/* Asset Renderer: Video or HTML5 Responsive <picture> Tag */}
            {videoSrc ? (
              <video
                src={getImageUrl(videoSrc)}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                // @ts-ignore
                fetchPriority={isCurrent ? 'high' : 'low'}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <picture className="w-full h-full block">
                {mobileImg && (
                  <source
                    media="(max-width: 1023px)"
                    srcSet={mobileImg}
                    type={mobileImg.endsWith('.webp') ? 'image/webp' : undefined}
                  />
                )}
                <source
                  media="(min-width: 1024px)"
                  srcSet={desktopImg}
                  type={desktopImg.endsWith('.webp') ? 'image/webp' : undefined}
                />
                <img
                  src={desktopImg}
                  alt={slide.title || 'SANUSHA Luxury Collection'}
                  width={1920}
                  height={1080}
                  // @ts-ignore
                  fetchPriority={isCurrent ? 'high' : 'low'}
                  loading={isCurrent ? 'eager' : 'lazy'}
                  decoding="async"
                  className="w-full h-full object-cover object-top sm:object-center transition-transform duration-1000 ease-out"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/decor_hero_banner.jpg';
                  }}
                />
              </picture>
            )}

            {/* Dark Gradient Text Overlay for Contrast */}
            {shouldShowOverlay && (
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
                  <div className="max-w-md sm:max-w-xl text-left text-white space-y-4">
                    {slide.badgeText && (
                      <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-amber-200 text-[10px] sm:text-xs font-extrabold tracking-[0.3em] uppercase px-3.5 py-1.5 rounded-full border border-amber-300/30 shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        {slide.badgeText}
                      </span>
                    )}

                    {slide.title && (
                      renderStyledTitle ? (
                        renderStyledTitle(slide.title)
                      ) : (
                        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase leading-tight text-white drop-shadow-md">
                          {slide.title}
                        </h1>
                      )
                    )}

                    {slide.subtitle && (
                      <p className="text-base sm:text-lg text-slate-200 font-light leading-relaxed drop-shadow-md max-w-lg pt-1">
                        {slide.subtitle}
                      </p>
                    )}

                    {/* Action Buttons */}
                    {(slide.buttonText || slide.secondaryButtonText) && (
                      <div className="pt-3 flex flex-wrap items-center gap-4">
                        {slide.buttonText && (
                          <a
                            href={slide.buttonLink || '/shop'}
                            className="inline-flex items-center justify-center px-7 py-3 bg-white text-gray-900 hover:bg-amber-100 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                          >
                            {slide.buttonText}
                          </a>
                        )}
                        {slide.secondaryButtonText && (
                          <a
                            href={slide.secondaryButtonLink || '/shop'}
                            className="inline-flex items-center justify-center px-7 py-3 border-2 border-white text-white hover:bg-white/20 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-md backdrop-blur-sm"
                          >
                            {slide.secondaryButtonText}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Navigation Arrows (Visible on Hover if multiple slides exist) */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-lg"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-lg"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Navigation Indicators (Dots) */}
          <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-2.5 pointer-events-auto">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`transition-all duration-500 rounded-full ${
                  idx === currentIdx
                    ? 'w-8 h-2.5 bg-amber-400 shadow-md'
                    : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/90'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
