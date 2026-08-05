'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Heart,
} from 'lucide-react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toast } from '@/components/Toast';
import { useStore, PRODUCTS_DATA, getProductImage } from '@/store/useStore';
import { fetchApi, getImageUrl } from '@/lib/api';

function renderStyledHeroTitle(title: string) {
  if (!title) return null;
  const upper = title.trim().toUpperCase();

  // Preset 1: "TIMELESS ELEGANCE & MODERN PURITY"
  if (upper.includes('TIMELESS ELEGANCE') || (upper.includes('TIMELESS') && upper.includes('PURITY'))) {
    return (
      <h1 className="tracking-tight leading-[1.08] text-white drop-shadow-xl space-y-1">
        <span className="block font-sans font-extrabold uppercase tracking-[0.2em] text-white text-3xl sm:text-5xl lg:text-6xl drop-shadow-md">
          TIMELESS
        </span>
        <span className="block font-serif italic font-normal text-[#FDE68A] text-5xl sm:text-7xl lg:text-8xl -mt-1 sm:-mt-2 drop-shadow-lg">
          Elegance <span className="font-serif italic font-light text-amber-300 text-3xl sm:text-5xl px-1">&amp;</span>
        </span>
        <span className="block font-sans font-medium uppercase tracking-[0.22em] text-slate-100 text-2xl sm:text-4xl lg:text-5xl pt-1">
          MODERN <span className="font-serif italic font-normal tracking-normal text-[#F3E8FF] drop-shadow-lg underline decoration-[#6C307D]/50 underline-offset-8">PURITY</span>
        </span>
      </h1>
    );
  }

  // Preset 2: "RESORT & SUMMER LUXURY CO-ORDS"
  if (upper.includes('RESORT') || upper.includes('SUMMER')) {
    return (
      <h1 className="tracking-tight leading-[1.08] text-white drop-shadow-xl space-y-1">
        <span className="block font-serif italic font-normal text-[#FDE68A] text-5xl sm:text-7xl lg:text-8xl drop-shadow-lg">
          Resort <span className="font-serif italic font-light text-amber-300 text-3xl sm:text-5xl px-1">&amp;</span> Summer
        </span>
        <span className="block font-sans font-extrabold uppercase tracking-[0.2em] text-white text-3xl sm:text-5xl lg:text-6xl pt-1">
          LUXURY <span className="font-serif italic font-normal text-[#E9D5FF] tracking-normal">CO-ORDS</span>
        </span>
      </h1>
    );
  }

  // General Dynamic Styling Engine for any custom text:
  const words = title.trim().split(' ');
  return (
    <h1 className="tracking-tight leading-[1.1] text-white drop-shadow-xl flex flex-wrap items-baseline gap-x-3 gap-y-1">
      {words.map((word, idx) => {
        const cleanWord = word.replace(/[^a-zA-Z]/g, '').toUpperCase();
        const isAmp = word === '&' || cleanWord === 'AND';
        const isAccentWord = [
          'ELEGANCE', 'PURITY', 'LUXURY', 'COLLECTION', 'COUTURE', 'ESSENTIALS', 
          'SUMMER', 'RESORT', 'FESTIVE', 'ROYAL', 'LIMITED', 'SILK', 'LINEN', 'EDITION'
        ].includes(cleanWord) || (idx % 2 === 1 && !isAmp);

        if (isAmp) {
          return (
            <span key={idx} className="font-serif italic font-light text-amber-300 text-3xl sm:text-5xl px-1">
              &amp;
            </span>
          );
        }

        if (isAccentWord) {
          return (
            <span key={idx} className="font-serif italic font-normal text-[#FDE68A] text-4xl sm:text-6xl lg:text-7xl capitalize drop-shadow-md">
              {word.toLowerCase()}{' '}
            </span>
          );
        }

        return (
          <span key={idx} className="font-sans font-extrabold uppercase tracking-[0.18em] text-white text-3xl sm:text-5xl lg:text-6xl">
            {word}{' '}
          </span>
        );
      })}
    </h1>
  );
}

export default function StorefrontHomePage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [products, setProducts] = useState<any[]>(PRODUCTS_DATA);
  const [categories, setCategories] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Multi-Slide Hero State
  const [heroSlides, setHeroSlides] = useState<any[]>([
    {
      id: 'slide-1',
      title: 'TIMELESS ELEGANCE & MODERN PURITY',
      subtitle: 'Hand-crafted luxury linen, refined silhouettes, and conscious fashion.',
      badgeText: 'LUXURY EDIT 2026',
      bannerUrl: '/images/hero_banner.jpg',
      buttonText: 'SHOP THE COLLECTION',
      buttonLink: '/shop',
      showOverlay: true,
      active: true,
    },
    {
      id: 'slide-2',
      title: 'RESORT & SUMMER LUXURY CO-ORDS',
      subtitle: 'Breezy European flax linen sets designed for sun-soaked getaways.',
      badgeText: 'SUMMER ESSENTIALS',
      bannerUrl: '/images/summer_banner_model.jpg',
      buttonText: 'EXPLORE RESORTWEAR',
      buttonLink: '/shop?category=Resortwear',
      showOverlay: true,
      active: true,
    },
  ]);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const cachedHero = localStorage.getItem('sanusha_cms_hero_cache');
        if (cachedHero) {
          const parsed = JSON.parse(cachedHero);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const activeOnly = parsed.filter((s: any) => s.active !== false);
            if (activeOnly.length > 0) setHeroSlides(activeOnly);
          }
        }
      } catch (e) {}
    }

    Promise.all([
      fetchApi('/products').catch(() => PRODUCTS_DATA),
      fetchApi('/categories').catch(() => []),
      fetchApi('/cms/sections').catch(() => []),
      fetchApi('/cms/hero').catch(() => null),
    ])
      .then(([prods, cats, secs, hero]) => {
        if (prods && prods.length > 0) setProducts(prods);
        if (cats && cats.length > 0) setCategories(cats);
        if (secs && secs.length > 0) setSections(secs);
        if (hero && Array.isArray(hero) && hero.length > 0) {
          const activeSlides = hero.filter((s: any) => s.active !== false);
          if (activeSlides.length > 0) {
            setHeroSlides(activeSlides);
            if (typeof window !== 'undefined') {
              localStorage.setItem('sanusha_cms_hero_cache', JSON.stringify(activeSlides));
            }
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Auto-play Multi-Slide Hero Carousel every 6 seconds
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIdx((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides]);

  const activeSlide = heroSlides[currentSlideIdx] || heroSlides[0];

  const newArrivals = products.filter(
    (p) => p.badge === 'NEW ARRIVAL' || p.isNewArrival === true || p.status === 'PUBLISHED'
  ).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow">
        {/* Dynamic 100% Edge-to-Edge Full Hero Carousel Container */}
        <section className="relative w-full aspect-[16/9] min-h-[420px] max-h-[85vh] bg-slate-950 overflow-hidden">
          {heroSlides.map((slide, idx) => {
            const isCurrent = idx === currentSlideIdx;
            const hasTextContent = (slide.title?.trim() || slide.subtitle?.trim() || slide.badgeText?.trim());
            const shouldShowOverlay = slide.showOverlay !== false && hasTextContent;

            return (
              <div
                key={slide.id || idx}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* 100% Full Cover Image filling exact hero dimensions in original high quality */}
                <img
                  src={getImageUrl(slide.bannerUrl) || '/images/hero_banner.jpg'}
                  alt={slide.title || 'SANUSHA Hero Banner'}
                  className="w-full h-full object-cover object-top sm:object-center transition-transform duration-700"
                  style={{ imageRendering: 'auto' as any }}
                  loading="eager"
                  fetchPriority="high"
                />

                {/* Render Text Overlay ONLY IF showOverlay is TRUE and text exists */}
                {shouldShowOverlay && (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
                      <div className="max-w-md sm:max-w-xl text-left text-white space-y-4">
                        {slide.badgeText && (
                          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-amber-200 text-[10px] font-extrabold tracking-[0.3em] uppercase px-3.5 py-1.5 rounded-full border border-amber-300/30 shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            {slide.badgeText}
                          </span>
                        )}

                        {slide.title && renderStyledHeroTitle(slide.title)}

                        {slide.subtitle && (
                          <p className="text-base sm:text-lg text-slate-200 font-light leading-relaxed drop-shadow-md max-w-lg pt-1">
                            {slide.subtitle}
                          </p>
                        )}

                        {slide.buttonText && (
                          <div className="pt-3">
                            <Link
                              href={slide.buttonLink || '/shop'}
                              className="inline-flex items-center gap-3 bg-white hover:bg-[#6C307D] text-gray-900 hover:text-white text-xs font-extrabold uppercase tracking-[0.2em] px-8 py-4 rounded-xs shadow-2xl transition-all duration-300 hover:scale-[1.03] border border-white/40"
                            >
                              <span>{slide.buttonText}</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Slider Dots Indicator */}
          {heroSlides.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIdx(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentSlideIdx ? 'w-8 bg-white shadow-md' : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </section>

        {/* Brand Value Propositions */}
        <section className="bg-[#FAF8F5] border-y border-[#EBE7DF] py-8 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <Truck className="w-5 h-5 text-[#6C307D]" />
              <div className="text-left">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Free Express Shipping</h4>
                <p className="text-[11px] text-gray-500 font-medium">On all orders above ₹999</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 border-y md:border-y-0 md:border-x border-[#EBE7DF] py-4 md:py-0">
              <ShieldCheck className="w-5 h-5 text-[#6C307D]" />
              <div className="text-left">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">100% Authentic Quality</h4>
                <p className="text-[11px] text-gray-500 font-medium">European flax & organic dyes</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <RotateCcw className="w-5 h-5 text-[#6C307D]" />
              <div className="text-left">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Hassle-Free Returns</h4>
                <p className="text-[11px] text-gray-500 font-medium">14-day easy return policy</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Category Tiles */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold tracking-widest text-[#6C307D] uppercase">
              EXPLORE COLLECTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
              Curated Fashion Categories
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {(categories.length > 0 ? categories : [
              { name: 'Women', image: '/images/cat_women.jpg', slug: 'women' },
              { name: 'Men', image: '/images/cat_men.jpg', slug: 'men' },
              { name: 'Tops', image: '/images/cat_tops.jpg', slug: 'tops' },
              { name: 'Bottoms', image: '/images/cat_bottoms.jpg', slug: 'bottoms' },
            ]).map((cat, idx) => (
              <Link
                key={idx}
                href={`/category/${encodeURIComponent(cat.slug || cat.name.toLowerCase())}`}
                className="group relative aspect-[3/4] rounded-xs overflow-hidden bg-gray-100 border border-[#EBE7DF]"
              >
                <img
                  src={getImageUrl(cat.image) || '/images/cat_women.jpg'}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                  <h3 className="text-lg font-serif font-bold uppercase tracking-wider">{cat.name}</h3>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-gray-300 group-hover:text-white transition-colors flex items-center justify-center gap-1 mt-1">
                    Shop Now <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EBE7DF] pb-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#6C307D] uppercase block mb-1">
                HAND-PICKED FOR YOU
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
                New Arrivals Spotlight
              </h2>
            </div>

            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-widest text-gray-900 hover:text-[#6C307D] flex items-center gap-1"
            >
              View Full Storefront <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product) => {
              const isWishlisted = (wishlist || []).includes(product.id);
              const prodImg = getProductImage(product);

              return (
                <div key={product.id} className="group relative flex flex-col justify-between">
                  <div className="relative aspect-[3/4] bg-gray-100 rounded-xs overflow-hidden mb-3 border border-[#EBE7DF]">
                    <img
                      src={prodImg}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-colors ${
                        isWishlisted ? 'bg-red-50 text-red-600' : 'bg-white/80 text-gray-700 hover:bg-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => addToCart(product, 'M', 1)}
                      className="absolute bottom-3 left-3 right-3 bg-slate-900 hover:bg-[#6C307D] text-white text-xs font-bold uppercase py-2.5 rounded-xs opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      {product.gender} • {product.category?.name || product.category || 'Apparel'}
                    </span>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="text-xs font-bold text-gray-900 hover:text-[#6C307D] transition-colors truncate">
                        {product.name}
                      </h3>
                    </Link>
                    <span className="text-xs font-serif font-bold text-gray-900 mt-1 block">
                      ₹{product.price?.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
      <Toast />
    </div>
  );
}
