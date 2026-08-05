'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  ChevronDown,
  Heart,
  ShoppingBag,
  Eye,
  X,
  Search,
} from 'lucide-react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toast } from '@/components/Toast';
import { useStore, PRODUCTS_DATA, getProductImage } from '@/store/useStore';
import { fetchApi } from '@/lib/api';

function ShopCatalogContent() {
  const searchParams = useSearchParams();
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [products, setProducts] = useState<any[]>(PRODUCTS_DATA);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State initialized from URL Search Params
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isNewArrivalsOnly, setIsNewArrivalsOnly] = useState<boolean>(false);

  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCat = searchParams.get('category') || '';
    const urlGender = searchParams.get('gender') || '';
    const urlFilter = searchParams.get('filter') || '';
    const urlSort = searchParams.get('sort') || '';

    if (urlSearch) setSearchQuery(urlSearch);
    if (urlCat) setSelectedCategory(urlCat);
    if (urlGender) setSelectedGender(urlGender);

    if (urlFilter === 'new-arrivals' || urlSort === 'newest' || searchParams.get('new') === 'true') {
      setIsNewArrivalsOnly(true);
      setSortBy('Newest');
    } else {
      setIsNewArrivalsOnly(false);
    }
  }, [searchParams]);

  useEffect(() => {
    Promise.all([
      fetchApi('/products').catch(() => PRODUCTS_DATA),
      fetchApi('/categories').catch(() => []),
    ])
      .then(([prods, cats]) => {
        if (prods && prods.length > 0) setProducts(prods);
        if (cats && cats.length > 0) setCategories(cats);
      })
      .finally(() => setLoading(false));
  }, []);

  const categoryOptions = ['All Categories', ...categories.map((c) => c.name)];

  const filteredProducts = products.filter((product) => {
    const isNewItem =
      product.isNewArrival === true ||
      product.badge?.toUpperCase().includes('NEW') ||
      product.status === 'NEW' ||
      product.category?.name?.toLowerCase().includes('new');

    const matchesNewFilter = !isNewArrivalsOnly || isNewItem;

    const matchesCategory =
      selectedCategory === 'All Categories' ||
      product.category?.name?.toLowerCase() === selectedCategory.toLowerCase() ||
      product.categoryName?.toLowerCase() === selectedCategory.toLowerCase() ||
      product.gender?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesGender =
      selectedGender === 'All' ||
      product.gender?.toLowerCase() === selectedGender.toLowerCase() ||
      product.gender === 'Unisex';

    const matchesSearch =
      !searchQuery.trim() ||
      product.name?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      product.category?.name?.toLowerCase().includes(searchQuery.toLowerCase().trim());

    return matchesNewFilter && matchesCategory && matchesGender && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full space-y-6">
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBE7DF] pb-6">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              <Link href="/" className="hover:text-[#6C307D]">Home</Link> /{' '}
              <span className="text-gray-900">
                {isNewArrivalsOnly ? 'New Arrivals' : 'Shop Catalog'}
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              {isNewArrivalsOnly
                ? 'New Arrivals'
                : searchQuery
                ? `Search Results for "${searchQuery}"`
                : 'All Apparel & Luxury Styles'}
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Showing {sortedProducts.length} {isNewArrivalsOnly ? 'newly launched' : 'premium crafted'} items
            </p>
          </div>

          {isNewArrivalsOnly ? (
            <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#6C307D]">
              <span>✨ Filter: New Arrivals</span>
              <Link href="/shop" className="hover:text-red-600 p-0.5">
                <X className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : searchQuery ? (
            <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#EBE7DF] px-3 py-1.5 rounded-full text-xs font-bold text-[#6C307D]">
              <span>Search: "{searchQuery}"</span>
              <button
                onClick={() => setSearchQuery('')}
                className="hover:text-red-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : null}
        </div>

        {/* Filter Controls & Search Toolbar */}
        <div className="bg-[#FAF8F5] border border-[#EBE7DF] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 bg-white border border-[#EBE7DF] rounded-lg px-3 py-2 shadow-2xs">
              <SlidersHorizontal className="w-4 h-4 text-[#6C307D]" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent font-bold text-gray-800 focus:outline-none cursor-pointer"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-white border border-[#EBE7DF] rounded-lg p-1 shadow-2xs font-bold text-[11px] uppercase">
              {['All', 'Women', 'Men'].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    selectedGender === g ? 'bg-[#6C307D] text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search styles in catalog..."
                className="w-full bg-white border border-[#EBE7DF] rounded-lg py-2 pl-3 pr-8 text-xs font-medium focus:outline-none focus:border-[#6C307D]"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-1.5 bg-white border border-[#EBE7DF] rounded-lg px-3 py-2 shadow-2xs font-bold text-gray-800">
              <span className="text-gray-400 font-normal">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="Featured">Featured</option>
                <option value="Newest">Newest</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Catalog Grid with Distinct Product Photos */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#FAF8F5] rounded-2xl border border-dashed border-[#EBE7DF] space-y-3">
            <Search className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-lg font-serif font-bold text-gray-900">No matching products found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              We couldn't find any items matching "{searchQuery}". Try searching for "linen", "shirt", or "pants".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
                setSelectedGender('All');
              }}
              className="mt-2 bg-[#6C307D] text-white text-xs font-bold uppercase px-5 py-2.5 rounded-lg shadow-sm hover:bg-[#522061]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sortedProducts.map((product) => {
              const isWishlisted = (wishlist || []).includes(product.id);
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
        )}
      </main>

      <Footer />
      <Toast />
    </div>
  );
}

export default function ShopCatalogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-gray-400">Loading catalog...</div>}>
      <ShopCatalogContent />
    </Suspense>
  );
}
