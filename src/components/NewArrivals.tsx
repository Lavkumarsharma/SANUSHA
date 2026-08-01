'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, ArrowRight } from 'lucide-react';
import { useStore, PRODUCTS_DATA } from '@/store/useStore';

export const NewArrivals: React.FC = () => {
  const {
    wishlist,
    toggleWishlist,
    addToCart,
    setQuickViewProduct,
    searchQuery,
    selectedCategory,
  } = useStore();

  const filteredProducts = PRODUCTS_DATA.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      selectedCategory === 'All Categories' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="new-arrivals" className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#EBE7DF]">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-wider uppercase">
            NEW ARRIVALS
          </h2>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#6C307D] hover:text-[#522061] uppercase transition-colors"
        >
          VIEW ALL
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-sm">
          <p className="text-sm text-gray-500 font-medium">
            No products match your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {filteredProducts.slice(0, 6).map((product) => {
            const isWishlisted = wishlist.includes(product.id);

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between bg-white rounded-sm border border-[#F0ECE1] overflow-hidden hover:shadow-md transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F5F0]">
                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-2.5 left-2.5 z-10 bg-white/90 backdrop-blur-xs text-[9px] font-bold tracking-widest uppercase text-gray-800 px-2 py-0.5 rounded-xs border border-gray-200">
                      {product.badge}
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors shadow-xs"
                    aria-label="Add to Wishlist"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isWishlisted ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </button>

                  {/* Product Image Clickable Link */}
                  <Link href={`/product/${product.id}`} className="block w-full h-full">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="bg-white/90 hover:bg-white text-gray-900 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1.5 rounded-xs flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-3 flex flex-col justify-between flex-grow space-y-2">
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
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-2 bg-[#F5F3EF] hover:bg-[#6C307D] text-gray-800 hover:text-white text-[10px] font-bold tracking-wider uppercase py-1.5 rounded-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    ADD TO BAG
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
