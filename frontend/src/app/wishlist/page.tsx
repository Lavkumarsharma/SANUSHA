'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, Share2 } from 'lucide-react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toast } from '@/components/Toast';
import { useStore, PRODUCTS_DATA } from '@/store/useStore';
import { fetchApi } from '@/lib/api';

export default function CustomerWishlistPage() {
  const { wishlist, toggleWishlist, addToCart, addToast } = useStore();
  const [allProducts, setAllProducts] = useState<any[]>(PRODUCTS_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/products')
      .then((data) => {
        if (data && data.length > 0) {
          // Merge API products with static PRODUCTS_DATA so mock IDs '1', '2' match as well
          const combined = [...data];
          PRODUCTS_DATA.forEach((p) => {
            if (!combined.some((c) => c.id === p.id)) {
              combined.push(p);
            }
          });
          setAllProducts(combined);
        }
      })
      .catch(() => setAllProducts(PRODUCTS_DATA))
      .finally(() => setLoading(false));
  }, []);

  // Filter ONLY items that are in the user's wishlist
  const wishlistProducts = allProducts.filter((p) => wishlist.includes(p.id));

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear your wishlist?')) {
      wishlist.forEach((id) => toggleWishlist(id));
      addToast('Wishlist Cleared', 'All items have been removed from your wishlist.');
    }
  };

  const handleShareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SANUSHA Wishlist',
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
        {/* Sleek Slim Wishlist Header Banner */}
        <section className="relative w-full h-[100px] sm:h-[120px] bg-slate-950 flex items-center justify-center overflow-hidden border-b border-[#E2DDD2]">
          <img
            src="/images/hero_banner.jpg"
            alt="Wishlist Banner"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.8] contrast-105"
            style={{ imageRendering: 'auto' as any }}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
          <div className="relative z-10 text-center text-white space-y-1 px-4">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight drop-shadow-md">
              My Wishlist
            </h1>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-200 font-medium pt-0.5">
              <Link href="/" className="hover:text-amber-200 transition-colors">Home</Link>
              <span className="text-amber-300/80">/</span>
              <span className="text-amber-200 font-bold">Wishlist</span>
            </div>
          </div>
        </section>

        {/* Wishlist Grid Container */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4 mb-8">
            <h3 className="font-serif font-bold text-gray-900 text-lg sm:text-xl">
              My Wishlist ({wishlistProducts.length} {wishlistProducts.length === 1 ? 'Item' : 'Items'})
            </h3>

            {wishlistProducts.length > 0 && (
              <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
                <button
                  onClick={handleShareWishlist}
                  className="hover:text-[#6C307D] flex items-center gap-1.5 uppercase"
                >
                  <Share2 className="w-4 h-4 text-[#6C307D]" /> Share Wishlist
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={handleClearAll}
                  className="hover:text-red-600 flex items-center gap-1.5 uppercase"
                >
                  <Trash2 className="w-4 h-4 text-red-500" /> Clear All
                </button>
              </div>
            )}
          </div>

          {/* Empty State */}
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#FAF8F5] border border-[#EBE7DF] rounded-xs max-w-md mx-auto space-y-4">
              <Heart className="w-12 h-12 text-[#6C307D] mx-auto" />
              <h3 className="text-xl font-serif font-bold text-gray-900">Your Wishlist is Empty</h3>
              <p className="text-xs text-gray-500 font-medium">
                Explore our collections and tap the heart icon on styles you love.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-xs shadow-md transition-colors"
              >
                EXPLORE STYLES
              </Link>
            </div>
          ) : (
            /* Wishlist Products Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white border border-[#EBE7DF] rounded-xs overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-red-600 hover:scale-110 transition-transform"
                      title="Remove from Wishlist"
                    >
                      <Heart className="w-4 h-4 fill-red-600 text-red-600" />
                    </button>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-1">
                      {product.name}
                    </h4>

                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[#6C307D]">₹{product.price.toLocaleString('en-IN')}</span>
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through text-[11px]">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-[#6C307D] hover:bg-[#522061] text-white text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        ADD TO BAG
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <Toast />
    </div>
  );
}
