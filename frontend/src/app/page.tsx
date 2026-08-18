// SANUSHA Storefront Page - Live Deployment Sync
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
import { HeroCarousel } from '@/components/HeroCarousel';
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

  // Multi-Slide Hero State with Instant Cache Hydration
  const [heroSlides, setHeroSlides] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cachedHero = localStorage.getItem('sanusha_cms_hero_cache');
        if (cachedHero) {
          const parsed = JSON.parse(cachedHero);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const activeOnly = parsed.filter((s: any) => s.active !== false);
            if (activeOnly.length > 0) return activeOnly;
          }
        }
      } catch (e) {}
    }
    return [
      {
        id: 'slide-1',
        title: '',
        subtitle: '',
        badgeText: '',
        bannerUrl: '/images/decor_hero_banner.jpg',
        buttonText: '',
        buttonLink: '/shop',
        showOverlay: false,
        active: true,
      },
    ];
  });
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  // Instant, independent Hero Slide fetch & image pre-loader
  useEffect(() => {
    const updateSlides = (slides: any[]) => {
      const activeSlides = slides.filter((s: any) => s.active !== false);
      if (activeSlides.length > 0) {
        // Pre-load slide images into memory immediately
        activeSlides.forEach((slide: any) => {
          if (slide.bannerUrl) {
            const img = new Image();
            img.src = getImageUrl(slide.bannerUrl);
          }
          if (slide.mobileBannerUrl) {
            const img = new Image();
            img.src = getImageUrl(slide.mobileBannerUrl);
          }
        });
        setHeroSlides(activeSlides);
        if (typeof window !== 'undefined') {
          localStorage.setItem('sanusha_cms_hero_cache', JSON.stringify(activeSlides));
        }
      }
    };

    // 1. Fetch fresh hero slides immediately with no-cache query parameter
    fetchApi('/cms/hero?t=' + Date.now())
      .then((hero) => {
        if (hero && Array.isArray(hero) && hero.length > 0) {
          updateSlides(hero);
        }
      })
      .catch((e) => console.warn('Hero banner fresh fetch notice:', e));

    // 2. Multi-tab/Window live sync listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sanusha_cms_hero_cache' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setHeroSlides(parsed);
          }
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    Promise.all([
      fetchApi('/products').catch(() => PRODUCTS_DATA),
      fetchApi('/categories').catch(() => []),
      fetchApi('/cms/sections').catch(() => []),
    ])
      .then(([prods, cats, secs]) => {
        if (prods && prods.length > 0) setProducts(prods);
        if (cats && cats.length > 0) setCategories(cats);
        if (secs && secs.length > 0) setSections(secs);
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
        {/* Optimized Edge-to-Edge Hero Carousel */}
        <HeroCarousel slides={heroSlides} renderStyledTitle={renderStyledHeroTitle} />

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
              Curated Home Decor Categories
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {(categories.length > 0 ? categories : [
              { name: 'Decor Accents', image: '/images/cat_decor_accents.jpg', slug: 'decor-accents' },
              { name: 'Vases & Planters', image: '/images/prod_ceramic_vase_1.jpg', slug: 'vases-planters' },
              { name: 'Storage & Baskets', image: '/images/prod_basket_1.jpg', slug: 'storage-baskets' },
              { name: 'Wall & Art', image: '/images/cat_wall_art.jpg', slug: 'wall-art' },
            ]).map((cat, idx) => (
              <Link
                key={idx}
                href={`/category/${encodeURIComponent(cat.slug || cat.name.toLowerCase())}`}
                className="group relative aspect-[3/4] rounded-xs overflow-hidden bg-gray-100 border border-[#EBE7DF]"
              >
                <img
                  src={getImageUrl(cat.image) || '/images/cat_decor_accents.jpg'}
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
              const isWishlisted = Array.isArray(wishlist) && wishlist.includes(product.id);
              const prodImg = getProductImage(product);

              return (
                <div key={product.id} className="group relative flex flex-col justify-between bg-white border border-[#EBE7DF] rounded-xs overflow-hidden shadow-2xs hover:shadow-md transition-shadow">
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                    <Link href={`/product/${product.id}`} className="block w-full h-full">
                      <img
                        src={prodImg}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-colors z-10 ${
                        isWishlisted ? 'bg-red-50 text-red-600' : 'bg-white/80 text-gray-700 hover:bg-white'
                      }`}
                      title="Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 'M', 1);
                      }}
                      className="absolute bottom-3 left-3 right-3 bg-slate-900 hover:bg-[#6C307D] text-white text-xs font-bold uppercase py-2.5 rounded-xs opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 z-10"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </button>
                  </div>

                  <div className="p-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      {product.gender} • {product.category?.name || product.category || 'Apparel'}
                    </span>
                    <Link href={`/product/${product.id}`} className="block group/title">
                      <h3 className="text-xs font-bold text-gray-900 group-hover/title:text-[#6C307D] transition-colors truncate mt-0.5">
                        {product.name}
                      </h3>
                      <span className="text-xs font-serif font-bold text-gray-900 mt-1 block">
                        ₹{product.price?.toLocaleString()}
                      </span>
                    </Link>
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
