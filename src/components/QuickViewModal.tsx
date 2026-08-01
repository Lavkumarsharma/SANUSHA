'use client';

import React, { useState } from 'react';
import { X, Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '@/store/useStore';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, wishlist, toggleWishlist } = useStore();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');

  if (!quickViewProduct) return null;

  const isWishlisted = wishlist.includes(quickViewProduct.id);
  const colorsList = quickViewProduct.colors || ['Default'];
  const color = selectedColor || colorsList[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-sm max-w-2xl w-full overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-xs transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Image */}
        <div className="aspect-[3/4] bg-gray-100 relative">
          <img
            src={quickViewProduct.image}
            alt={quickViewProduct.name}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Product Details */}
        <div className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#6C307D] uppercase">
              {quickViewProduct.category}
            </span>
            <h3 className="text-xl font-serif font-bold text-gray-900 mt-1">
              {quickViewProduct.name}
            </h3>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-bold text-gray-900">
                ₹{quickViewProduct.price.toLocaleString('en-IN')}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600 mt-3 leading-relaxed">
              {quickViewProduct.description}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            {/* Sizes */}
            <div>
              <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">
                SELECT SIZE
              </label>
              <div className="flex items-center gap-2">
                {quickViewProduct.sizeOptions.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-8 h-8 rounded-xs text-xs font-bold transition-all ${
                      selectedSize === sz
                        ? 'bg-[#6C307D] text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">
                COLOR: <span className="font-semibold text-gray-900">{color}</span>
              </label>
              <div className="flex items-center gap-2">
                {colorsList.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1 text-xs rounded-xs font-medium border transition-all ${
                      color === c
                        ? 'border-[#6C307D] bg-[#F7F2F8] text-[#6C307D] font-bold'
                        : 'border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  addToCart(quickViewProduct, selectedSize, color);
                  setQuickViewProduct(null);
                }}
                className="flex-1 bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold tracking-widest uppercase py-3 rounded-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                ADD TO BAG
              </button>

              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={`p-3 rounded-xs border transition-colors ${
                  isWishlisted
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
