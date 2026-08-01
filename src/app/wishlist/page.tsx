'use client';

import React from 'react';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  Trash2,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { ValuePropsBar } from '@/components/ValuePropsBar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { QuickViewModal } from '@/components/QuickViewModal';
import { Toast } from '@/components/Toast';
import { useStore, PRODUCTS_DATA, Product } from '@/store/useStore';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, addToast } = useStore();

  // Wishlist products matching reference screenshot (8 items)
  const wishlistProducts: Product[] =
    wishlist.length > 0
      ? PRODUCTS_DATA.filter((p) => wishlist.includes(p.id))
      : PRODUCTS_DATA.slice(0, 8);

  const handleClearAll = () => {
    wishlist.forEach((id) => toggleWishlist(id));
    addToast('Wishlist Cleared', 'All items have been removed from your wishlist.');
  };

  const handleShareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My SANUSHA Wishlist',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Link Copied!', 'Wishlist link copied to clipboard.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow">
        {/* Hero Banner Section matching reference screenshot */}
        <section className="relative w-full bg-[#ECE8DF] border-b border-[#E2DDD2] overflow-hidden py-12 sm:py-16 px-4 sm:px-8">
          <div
            className="absolute inset-0 bg-cover bg-right sm:bg-center opacity-85"
            style={{ backgroundImage: `url('/images/hero_banner.jpg')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#ECE8DF] via-[#ECE8DF]/80 to-transparent" />
          </div>

          <div className="relative max-w-7xl mx-auto space-y-3">
            <span className="inline-block text-xs font-bold tracking-[0.25em] text-[#6C307D] uppercase">
              MY WISHLIST
            </span>

            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight">
              Your Favorites, <br />
              <span className="text-[#6C307D] font-normal italic">All in One Place.</span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-md leading-relaxed">
              Keep track of the styles you love.
            </p>
          </div>
        </section>

        {/* Main Wishlist Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          
          {/* Header Controls Bar matching reference screenshot */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#EBE7DF]">
            <h2 className="text-sm font-bold text-gray-900 tracking-wide">
              My Wishlist <span className="text-gray-500 font-normal">({wishlistProducts.length} Items)</span>
            </h2>

            <div className="flex items-center gap-4 text-xs font-bold text-gray-700">
              <button
                onClick={handleShareWishlist}
                className="inline-flex items-center gap-1.5 hover:text-[#6C307D] transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Wishlist</span>
              </button>

              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* Product Grid (4 Columns matching reference screenshot) */}
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#FAF8F5] rounded-xs border border-[#EBE7DF] space-y-4 max-w-xl mx-auto">
              <Heart className="w-12 h-12 text-[#6C307D] mx-auto opacity-70" />
              <h3 className="text-lg font-serif font-bold text-gray-900">Your Wishlist is Empty</h3>
              <p className="text-xs text-gray-600 font-medium max-w-xs mx-auto">
                Explore our catalog and click the heart icon on any product to save your favorite styles.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xs transition-colors shadow-xs"
              >
                EXPLORE COLLECTIONS
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between bg-white rounded-sm border border-[#F0ECE1] overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F5F0]">
                    {/* Filled Purple Heart Badge */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#6C307D] shadow-xs"
                      aria-label="Remove from Wishlist"
                    >
                      <Heart className="w-4 h-4 fill-[#6C307D] text-[#6C307D]" />
                    </button>

                    {/* Product Image Link */}
                    <Link href={`/product/${product.id}`} className="block w-full h-full">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  </div>

                  {/* Product Details & Action Buttons */}
                  <div className="p-3.5 flex flex-col justify-between flex-grow space-y-3">
                    <div>
                      <Link href={`/product/${product.id}`}>
                        <h3 className="text-xs font-semibold text-gray-900 line-clamp-1 group-hover:text-[#6C307D] transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-gray-900">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-gray-400 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] text-gray-500 mt-1 font-medium">
                        {product.sizeOptions[2] || 'M'} &nbsp;•&nbsp;{' '}
                        {(product.colors && product.colors[0]) || 'Sand Beige'}
                      </p>
                    </div>

                    {/* Action Bar (ADD TO BAG + Trash Icon Button) */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-white border border-[#6C307D] text-[#6C307D] hover:bg-[#6C307D] hover:text-white text-[10px] font-bold tracking-wider uppercase py-2 rounded-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        ADD TO BAG
                      </button>

                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="p-2 border border-gray-200 hover:border-gray-400 text-gray-500 hover:text-red-500 rounded-xs transition-colors"
                        aria-label="Remove from Wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </section>

        <ValuePropsBar />
      </main>

      <Footer />

      <CartDrawer />
      <QuickViewModal />
      <Toast />
    </div>
  );
}
