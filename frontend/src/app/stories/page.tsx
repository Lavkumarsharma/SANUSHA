'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Heart, ShieldCheck } from 'lucide-react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function StoriesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-gray-900 font-sans">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow">
        {/* HERO STORY BANNER */}
        <section className="relative py-24 px-6 sm:px-12 text-center bg-white border-b border-[#E8DFC8]">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-[#C5A059] block">
              The House of SANUSHA
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
              Thoughtful Gifting, Timeless Craft.
            </h1>
            <p className="font-serif italic text-lg text-gray-600 max-w-2xl mx-auto">
              Every creation carries a story of Indian heritage, master craftsmanship, and emotional connection.
            </p>
          </div>
        </section>

        {/* OUR STORY SECTION */}
        <section id="story" className="py-20 px-6 sm:px-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-[#C5A059]">
              Our Story
            </span>
            <h2 className="font-serif text-3xl font-bold text-gray-900 leading-snug">
              Born from a passion for meaningful celebrations.
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              SANUSHA was envisioned as a modern luxury gifting house that honors India’s centuries-old artisanal traditions. We believe gifting is an art form—an expression of love, respect, and enduring memory.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              Each piece is meticulously curated and handcrafted by master artisans using sustainable, high-grade natural materials designed to be cherished across generations.
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-xs overflow-hidden border border-[#E8DFC8] shadow-lg">
            <img
              src="/images/cat_decor_accents.jpg"
              alt="Artisan Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* ARTISAN CRAFTSMANSHIP HIGHLIGHTS */}
        <section id="artisan" className="py-20 px-6 sm:px-12 bg-white border-y border-[#E8DFC8]">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div className="space-y-3">
              <span className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-[#C5A059]">
                Pillars of Excellence
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
                The SANUSHA Promise
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xs space-y-3 text-left">
                <Sparkles className="w-6 h-6 text-[#C5A059]" />
                <h3 className="font-serif text-xl font-bold text-gray-900">Artisan Heritage</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-light">
                  Directly empowering master weavers, ceramicists, and metalworkers across India.
                </p>
              </div>

              <div className="p-8 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xs space-y-3 text-left">
                <Heart className="w-6 h-6 text-[#C5A059]" />
                <h3 className="font-serif text-xl font-bold text-gray-900">Gift-Ready Packaging</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-light">
                  Hand-packed in signature gold-embossed presentation boxes with bespoke gift cards.
                </p>
              </div>

              <div className="p-8 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xs space-y-3 text-left">
                <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
                <h3 className="font-serif text-xl font-bold text-gray-900">Timeless Durability</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-light">
                  Heirloom-quality materials designed to maintain beauty and meaning for decades.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO EXPLORE */}
        <section className="py-20 px-6 sm:px-12 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="font-serif text-3xl font-bold text-gray-900">
              Discover Something Meaningful
            </h2>
            <p className="text-xs text-gray-600 font-light">
              Explore our curated gift boxes, handcrafted decor, and signature lifestyle collections.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#C5A059] hover:bg-[#B38D48] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-xs shadow-md transition-colors"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
