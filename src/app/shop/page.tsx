'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  Heart,
  ShoppingBag,
  Eye,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { ValuePropsBar } from '@/components/ValuePropsBar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { QuickViewModal } from '@/components/QuickViewModal';
import { Toast } from '@/components/Toast';
import { useStore, PRODUCTS_DATA, Product } from '@/store/useStore';

export default function ShopPage() {
  const {
    wishlist,
    toggleWishlist,
    addToCart,
    setQuickViewProduct,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedGenders,
    toggleGender,
    selectedSizes,
    toggleSize,
    selectedColors,
    toggleColor,
    priceRange,
    setPriceRange,
    selectedMaterials,
    toggleMaterial,
    selectedPatterns,
    togglePattern,
    sortBy,
    setSortBy,
    resetFilters,
  } = useStore();

  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter Categories list matching Home Decor catalog
  const categoriesList = [
    { name: 'All Categories', count: 140 },
    { name: 'Decor Accents', count: 45 },
    { name: 'Vases & Planters', count: 32 },
    { name: 'Storage & Baskets', count: 28 },
    { name: 'Wall & Art', count: 20 },
    { name: 'Textiles & Cushions', count: 15 },
  ];

  const genderList = [
    { name: 'Women', count: 68 },
    { name: 'Men', count: 62 },
    { name: 'Unisex', count: 56 },
  ];

  const sizeList = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const colorSwatches = [
    { name: 'Beige', hex: '#D6C5B3' },
    { name: 'Khaki', hex: '#C5B99F' },
    { name: 'Brown', hex: '#7A4B29' },
    { name: 'Dark Brown', hex: '#3B2416' },
    { name: 'Black', hex: '#1F1F1F' },
    { name: 'White', hex: '#EFECE6' },
    { name: 'Slate', hex: '#4A5844' },
    { name: 'Olive', hex: '#4E5340' },
  ];

  const materialList = [
    { name: 'Cotton', count: 64 },
    { name: 'Linen', count: 32 },
    { name: 'Polyester', count: 26 },
    { name: 'Wool', count: 18 },
    { name: 'Blend', count: 14 },
  ];

  const patternList = [
    { name: 'Solid', count: 82 },
    { name: 'Striped', count: 24 },
    { name: 'Checked', count: 18 },
    { name: 'Printed', count: 20 },
    { name: 'Textured', count: 22 },
  ];

  // Filtering Logic
  let filteredProducts = PRODUCTS_DATA.filter((product) => {
    // Search Query
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !product.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Category
    if (selectedCategory && selectedCategory !== 'All Categories') {
      if (
        selectedCategory === 'New Arrivals' &&
        product.badge !== 'NEW'
      ) {
        return false;
      } else if (
        selectedCategory !== 'New Arrivals' &&
        product.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }
    }

    // Gender
    if (
      selectedGenders.length > 0 &&
      !selectedGenders.includes(product.gender)
    ) {
      return false;
    }

    // Size
    if (
      selectedSizes.length > 0 &&
      !product.sizeOptions.some((s) => selectedSizes.includes(s))
    ) {
      return false;
    }

    // Price
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    // Material
    if (
      selectedMaterials.length > 0 &&
      !selectedMaterials.includes(product.material)
    ) {
      return false;
    }

    // Pattern
    if (
      selectedPatterns.length > 0 &&
      !selectedPatterns.includes(product.pattern)
    ) {
      return false;
    }

    return true;
  });

  // Sorting
  if (sortBy === 'Price: Low to High') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'Price: High to Low') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'Newest') {
    filteredProducts.sort((a, b) => (b.badge === 'NEW' ? 1 : -1));
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Announcement Bar & Navigation */}
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow">
        {/* Banner Section matching reference */}
        <section className="relative w-full bg-[#ECE8DF] border-b border-[#E2DDD2] overflow-hidden py-12 sm:py-16 px-4 sm:px-8">
          <div
            className="absolute inset-0 bg-cover bg-right sm:bg-center opacity-85"
            style={{ backgroundImage: `url('/images/shop_banner.jpg')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#ECE8DF] via-[#ECE8DF]/80 to-transparent" />
          </div>

          <div className="relative max-w-7xl mx-auto space-y-3">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">
              <Link href="/" className="hover:text-[#6C307D] transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-bold">Shop</span>
            </div>

            {/* Title & Description */}
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight">
              SHOP
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md font-medium leading-relaxed">
              Elevate your wardrobe with timeless designs crafted for the modern you.
            </p>
          </div>
        </section>

        {/* Shop Main Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          {/* Top Control Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#EBE7DF]">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
                className="inline-flex items-center gap-2 bg-[#F5F3EF] hover:bg-[#EBE7DF] border border-[#E0DCD2] text-xs font-bold tracking-widest text-gray-800 uppercase px-4 py-2 rounded-xs transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#6C307D]" />
                FILTER
              </button>

              <span className="text-xs font-medium text-gray-500">
                Showing 1-{filteredProducts.length} of 186 products
              </span>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 font-medium hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-[#E0DCD2] rounded-xs px-3 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#6C307D]"
                >
                  <option value="Featured">Featured</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Newest">Newest Arrivals</option>
                </select>
              </div>

              {/* Grid / List View Switcher */}
              <div className="flex items-center border border-[#E0DCD2] rounded-xs overflow-hidden bg-white">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-[#6C307D] text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  aria-label="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-[#6C307D] text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  aria-label="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Grid Layout: Sidebar + Catalog */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Sidebar Filters matching reference */}
            <aside
              className={`lg:col-span-3 space-y-6 ${
                isSidebarOpenMobile ? 'block' : 'hidden lg:block'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <h3 className="text-xs font-bold tracking-widest text-gray-900 uppercase">
                  FILTERS
                </h3>
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#6C307D] hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset All
                </button>
              </div>

              {/* CATEGORIES Accordion */}
              <div className="space-y-3 pb-5 border-b border-gray-200">
                <div className="flex items-center justify-between text-xs font-bold text-gray-900 uppercase">
                  <span>CATEGORIES</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <ul className="space-y-2 text-xs font-medium">
                  {categoriesList.map((cat, idx) => {
                    const isSelected = selectedCategory === cat.name;
                    return (
                      <li key={idx}>
                        <button
                          onClick={() => setSelectedCategory(cat.name)}
                          className={`w-full flex items-center justify-between text-left py-0.5 transition-colors ${
                            isSelected
                              ? 'text-[#6C307D] font-bold pl-2 border-l-2 border-[#6C307D]'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <span>{cat.name}</span>
                          <span className="text-[10px] text-gray-400">({cat.count})</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* GENDER Accordion */}
              <div className="space-y-3 pb-5 border-b border-gray-200">
                <div className="flex items-center justify-between text-xs font-bold text-gray-900 uppercase">
                  <span>GENDER</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div className="space-y-2 text-xs font-medium text-gray-700">
                  {genderList.map((g, idx) => (
                    <label key={idx} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedGenders.includes(g.name)}
                          onChange={() => toggleGender(g.name)}
                          className="rounded-xs text-[#6C307D] focus:ring-[#6C307D] accent-[#6C307D]"
                        />
                        <span className="group-hover:text-gray-900">{g.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">({g.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SIZE Swatches */}
              <div className="space-y-3 pb-5 border-b border-gray-200">
                <div className="flex items-center justify-between text-xs font-bold text-gray-900 uppercase">
                  <span>SIZE</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {sizeList.map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        onClick={() => toggleSize(sz)}
                        className={`py-1.5 text-xs font-bold rounded-xs border transition-all ${
                          isSelected
                            ? 'border-[#6C307D] bg-[#6C307D] text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* COLOR Swatches */}
              <div className="space-y-3 pb-5 border-b border-gray-200">
                <div className="flex items-center justify-between text-xs font-bold text-gray-900 uppercase">
                  <span>COLOR</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {colorSwatches.map((color, idx) => {
                    const isSelected = selectedColors.includes(color.name);
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleColor(color.name)}
                        className={`w-6 h-6 rounded-full border border-gray-300 relative transition-transform ${
                          isSelected ? 'scale-110 ring-2 ring-[#6C307D] ring-offset-1' : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    );
                  })}
                  <span className="text-[10px] font-bold text-gray-400 self-center">+8</span>
                  <span className="text-[10px] font-bold text-gray-400 self-center">+6</span>
                </div>
              </div>

              {/* PRICE Range */}
              <div className="space-y-3 pb-5 border-b border-gray-200">
                <div className="flex items-center justify-between text-xs font-bold text-gray-900 uppercase">
                  <span>PRICE</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-900">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="899"
                    max="4999"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-[#6C307D] cursor-pointer"
                  />
                </div>
              </div>

              {/* MATERIAL Accordion */}
              <div className="space-y-3 pb-5 border-b border-gray-200">
                <div className="flex items-center justify-between text-xs font-bold text-gray-900 uppercase">
                  <span>MATERIAL</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div className="space-y-2 text-xs font-medium text-gray-700">
                  {materialList.map((m, idx) => (
                    <label key={idx} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedMaterials.includes(m.name)}
                          onChange={() => toggleMaterial(m.name)}
                          className="rounded-xs text-[#6C307D] accent-[#6C307D]"
                        />
                        <span>{m.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">({m.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* PATTERN Accordion */}
              <div className="space-y-3 pb-5">
                <div className="flex items-center justify-between text-xs font-bold text-gray-900 uppercase">
                  <span>PATTERN</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div className="space-y-2 text-xs font-medium text-gray-700">
                  {patternList.map((p, idx) => (
                    <label key={idx} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedPatterns.includes(p.name)}
                          onChange={() => togglePattern(p.name)}
                          className="rounded-xs text-[#6C307D] accent-[#6C307D]"
                        />
                        <span>{p.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">({p.count})</span>
                    </label>
                  ))}
                </div>
              </div>

            </aside>

            {/* Right Main Product Catalog Grid */}
            <main className="lg:col-span-9">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-[#FAF8F5] rounded-sm border border-[#EBE7DF] space-y-3">
                  <p className="text-sm font-semibold text-gray-700">
                    No products match your selected filters.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-[#6C307D] text-white text-xs font-bold tracking-widest uppercase px-6 py-2.5 rounded-xs"
                  >
                    RESET ALL FILTERS
                  </button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'
                      : 'space-y-4'
                  }
                >
                  {filteredProducts.map((product) => {
                    const isWishlisted = wishlist.includes(product.id);

                    if (viewMode === 'list') {
                      return (
                        <div
                          key={product.id}
                          className="flex flex-col sm:flex-row bg-white border border-[#F0ECE1] rounded-sm overflow-hidden p-4 gap-4 hover:shadow-md transition-shadow"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full sm:w-40 h-48 object-cover rounded-xs"
                          />
                          <div className="flex-1 flex flex-col justify-between space-y-2">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-[#6C307D] uppercase tracking-widest">
                                  {product.category}
                                </span>
                                {product.badge && (
                                  <span className="text-[9px] font-bold tracking-widest bg-gray-100 px-2 py-0.5 rounded-xs text-gray-800">
                                    {product.badge}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-base font-bold text-gray-900 mt-1">
                                {product.name}
                              </h3>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {product.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-900">
                                  ₹{product.price.toLocaleString('en-IN')}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-xs text-gray-400 line-through">
                                    ₹{product.originalPrice.toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleWishlist(product.id)}
                                  className="p-2 border border-gray-200 rounded-xs hover:border-red-500 hover:text-red-500 text-gray-600"
                                >
                                  <Heart
                                    className={`w-4 h-4 ${
                                      isWishlisted ? 'fill-red-500 text-red-500' : ''
                                    }`}
                                  />
                                </button>
                                <button
                                  onClick={() => addToCart(product)}
                                  className="bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xs flex items-center gap-1.5"
                                >
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  ADD TO BAG
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={product.id}
                        className="group relative flex flex-col justify-between bg-white rounded-sm border border-[#F0ECE1] overflow-hidden hover:shadow-md transition-all duration-300"
                      >
                        {/* Image Container */}
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F5F0]">
                          {/* Badge */}
                          {(product.badge || product.discountBadge) && (
                            <span className={`absolute top-2.5 left-2.5 z-10 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-xs border backdrop-blur-xs ${
                              product.discountBadge
                                ? 'bg-red-50 text-red-600 border-red-200'
                                : 'bg-white/90 text-gray-800 border-gray-200'
                            }`}>
                              {product.badge || product.discountBadge}
                            </span>
                          )}

                          {/* Wishlist Button */}
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors shadow-xs"
                            aria-label="Add to Wishlist"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                isWishlisted ? 'fill-red-500 text-red-500' : ''
                              }`}
                            />
                          </button>

                          {/* Product Image */}
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Quick View Button */}
                          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => setQuickViewProduct(product)}
                              className="bg-white/90 hover:bg-white text-gray-900 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-xs flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              Quick View
                            </button>
                          </div>
                        </div>

                        {/* Product Info & Color Dots */}
                        <div className="p-3 flex flex-col justify-between flex-grow space-y-2">
                          <div>
                            {/* Color Swatch Dots */}
                            <div className="flex items-center gap-1 mb-1.5">
                              {product.colorHexes.map((hex, i) => (
                                <span
                                  key={i}
                                  className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block"
                                  style={{ backgroundColor: hex }}
                                />
                              ))}
                              <span className="text-[9px] text-gray-400 font-bold ml-1">+2</span>
                            </div>

                            <h3 className="text-xs font-semibold text-gray-900 line-clamp-1 group-hover:text-[#6C307D] transition-colors">
                              {product.name}
                            </h3>

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

              {/* Pagination Bar matching reference screenshot */}
              <div className="flex items-center justify-center gap-2 pt-12 pb-4">
                <button
                  onClick={() => setCurrentPage(1)}
                  className={`w-8 h-8 rounded-xs text-xs font-bold transition-all ${
                    currentPage === 1
                      ? 'bg-[#6C307D] text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  1
                </button>
                <button
                  onClick={() => setCurrentPage(2)}
                  className={`w-8 h-8 rounded-xs text-xs font-bold transition-all ${
                    currentPage === 2
                      ? 'bg-[#6C307D] text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  2
                </button>
                <button
                  onClick={() => setCurrentPage(3)}
                  className={`w-8 h-8 rounded-xs text-xs font-bold transition-all ${
                    currentPage === 3
                      ? 'bg-[#6C307D] text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  3
                </button>
                <span className="text-xs text-gray-400 px-1 font-bold">...</span>
                <button
                  onClick={() => setCurrentPage(16)}
                  className={`w-8 h-8 rounded-xs text-xs font-bold transition-all ${
                    currentPage === 16
                      ? 'bg-[#6C307D] text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  16
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, 16))}
                  className="w-8 h-8 rounded-xs bg-white border border-gray-200 text-gray-700 hover:border-[#6C307D] hover:text-[#6C307D] flex items-center justify-center transition-colors"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </main>
          </div>
        </div>

        {/* Value Propositions & Footer */}
        <ValuePropsBar />
      </main>

      <Footer />

      {/* Interactive Overlays */}
      <CartDrawer />
      <QuickViewModal />
      <Toast />
    </div>
  );
}
