'use client';

import React from 'react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { HeroSlider } from '@/components/HeroSlider';
import { ValuePropsBar } from '@/components/ValuePropsBar';
import { ShopByCategory } from '@/components/ShopByCategory';
import { NewArrivals } from '@/components/NewArrivals';
import { SummerBanner } from '@/components/SummerBanner';
import { BrandHighlights } from '@/components/BrandHighlights';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { QuickViewModal } from '@/components/QuickViewModal';
import { Toast } from '@/components/Toast';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Bar */}
      <AnnouncementBar />

      {/* Main Header Nav */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Banner Carousel */}
        <HeroSlider />

        {/* Primary Value Propositions */}
        <ValuePropsBar />

        {/* Shop By Category */}
        <ShopByCategory />

        {/* New Arrivals Product Showcase */}
        <NewArrivals />

        {/* Summer '24 Featured Banner */}
        <SummerBanner />

        {/* Secondary Brand Highlights */}
        <BrandHighlights />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Overlays */}
      <CartDrawer />
      <QuickViewModal />
      <Toast />
    </div>
  );
}
