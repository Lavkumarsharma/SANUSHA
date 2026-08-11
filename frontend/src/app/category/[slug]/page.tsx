'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  Grid,
  List,
  Heart,
  ShoppingBag,
  ChevronRight,
  Search,
} from 'lucide-react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toast } from '@/components/Toast';
import { useStore, PRODUCTS_DATA } from '@/store/useStore';
import { fetchApi } from '@/lib/api';

export default function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const rawSlug = resolvedParams.slug;
  const categoryName = decodeURIComponent(rawSlug);

  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [products, setProducts] = useState<any[]>(PRODUCTS_DATA);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const currentCategoryObj = categories.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase() || c.slug === categoryName.toLowerCase()
  );

  const filteredProducts = products.filter((product) => {
    const pCat = product.category?.name || product.categoryName || '';
    const pGender = product.gender || '';

    const matchesCat =
      pCat.toLowerCase() === categoryName.toLowerCase() ||
      pGender.toLowerCase() === categoryName.toLowerCase() ||
      (categoryName.toLowerCase() === 'women' && (pGender === 'Women' || pGender === 'Unisex')) ||
      (categoryName.toLowerCase() === 'men' && (pGender === 'Men' || pGender === 'Unisex'));

    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow">
        {/* Breadcrumb Navigation */}
        <div className="bg-[#FAF8F5] border-b border-[#EBE7DF] py-3.5 px-4 sm:px-8 text-xs text-gray-500 font-medium">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <Link href="/" className="hover:text-[#6C307D]">Home</Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <Link href="/shop" className="hover:text-[#6C307D]">Categories</Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-900 font-bold capitalize">{categoryName}</span>
          </div>
        </div>

        {/* Category Hero Banner */}
        <section className="relative w-full bg-[#ECE8DF] border-b border-[#E2DDD2] overflow-hidden py-14 sm:py-16 px-4 sm:px-8 text-center">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url('${currentCategoryObj?.image || '/images/hero_banner.jpg'}')` }}
          />
          <div className="relative max-w-4xl mx-auto space-y-2 z-10">
            <span className="text-xs font-bold tracking-widest text-[#6C307D] uppercase block">
              CURATED COLLECTION
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight capitalize">
              {categoryName} Collection
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-xl mx-auto">
              {currentCategoryObj?.description || `Explore our hand-crafted luxury ${categoryName} styles.`}
            </p>
          </div>
        </section>

        {/* Category Filter Pills & Search */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-4">
            
            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${categoryName}...`}
                className="w-full bg-[#FAF8F5] border border-gray-300 rounded-xs py-2 pl-9 pr-4 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#6C307D]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Sort & Grid Controls */}
            <div className="flex items-center gap-4 text-xs font-semibold w-full md:w-auto justify-between md:justify-end">
              <span className="text-gray-500">
                Showing <span className="text-gray-900 font-bold">{sortedProducts.length}</span> Styles
              </span>

              <div className="flex items-center gap-2">
                <span className="text-gray-400">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-300 rounded-xs px-3 py-1.5 text-xs font-bold text-gray-900 focus:outline-none"
                >
                  <option value="Featured">Featured</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                </select>
              </div>

              <div className="hidden sm:flex border border-gray-300 rounded-xs overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 ${viewMode === 'grid' ? 'bg-[#6C307D] text-white' : 'bg-white text-gray-500'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 ${viewMode === 'list' ? 'bg-[#6C307D] text-white' : 'bg-white text-gray-500'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Category Products Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#FAF8F5] border border-[#EBE7DF] rounded-xs max-w-md mx-auto space-y-3">
              <h3 className="text-base font-serif font-bold text-gray-900">No {categoryName} Products Found</h3>
              <p className="text-xs text-gray-500 font-medium">Explore our complete catalog for more styles</p>
              <Link
                href="/shop"
                className="inline-block bg-[#6C307D] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xs"
              >
                VIEW FULL CATALOG
              </Link>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6' : 'space-y-4'}>
              {sortedProducts.map((product) => {
                const isWishlisted = Array.isArray(wishlist) && wishlist.includes(product.id);

                return (
                  <div
                    key={product.id}
                    className="group bg-white border border-[#EBE7DF] rounded-xs overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                      <Link href={`/product/${product.id}`} className="block w-full h-full">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>
                      <span className="absolute top-2.5 left-2.5 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider pointer-events-none">
                        {product.badge || 'EXCLUSIVE'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-gray-700 hover:text-[#6C307D] z-10"
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#6C307D] text-[#6C307D]' : ''}`} />
                      </button>
                    </div>

                    <div className="p-4 space-y-2">
                      <Link href={`/product/${product.id}`} className="block group/title">
                        <h4 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-1 group-hover/title:text-[#6C307D] transition-colors">
                          {product.name}
                        </h4>

                        <div className="flex items-center justify-between text-xs font-bold mt-1">
                          <span className="text-[#6C307D]">₹{product.price.toLocaleString('en-IN')}</span>
                          {product.originalPrice && (
                            <span className="text-gray-400 line-through text-[11px]">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </Link>

                      <div className="pt-2 flex gap-2">
                        <Link
                          href={`/product/${product.id}`}
                          className="flex-1 bg-[#6C307D] text-white hover:bg-[#522061] text-[10px] font-bold uppercase tracking-wider py-2 rounded-xs text-center transition-colors flex items-center justify-center gap-1"
                        >
                          VIEW PRODUCT
                        </Link>
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-[#6C307D] text-white p-2 rounded-xs hover:bg-[#522061]"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <Toast />
    </div>
  );
}
