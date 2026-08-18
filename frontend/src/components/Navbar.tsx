'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useStore, PRODUCTS_DATA as FALLBACK_PRODUCTS } from '@/store/useStore';
import { fetchApi, getImageUrl } from '@/lib/api';

const ROTATING_PLACEHOLDERS = [
  'Search timeless gifts...',
  'Discover something meaningful...',
  'Find handcrafted treasures...',
  'Explore curated collections...',
];

const POPULAR_SEARCHES = [
  'Luxury Gifts',
  'Home Decor',
  'Gift Boxes',
  'Personalized Gifts',
  'Artisan Collection',
];

const MEGA_MENU_DATA = {
  GIFTS: [
    { label: 'Gifts For Her', url: '/shop?filter=gifts-for-her' },
    { label: 'Gifts For Him', url: '/shop?filter=gifts-for-him' },
    { label: 'Family Gifts', url: '/shop?filter=family-gifts' },
    { label: 'Wedding Gifts', url: '/shop?filter=wedding-gifts' },
    { label: 'Anniversary Gifts', url: '/shop?filter=anniversary-gifts' },
    { label: 'Housewarming Gifts', url: '/shop?filter=housewarming-gifts' },
    { label: 'Corporate Gifts', url: '/shop?filter=corporate-gifts' },
    { label: 'Personalized Gifts', url: '/shop?filter=personalized-gifts' },
  ],
  OCCASIONS: [
    { label: 'Birthdays', url: '/shop?filter=birthdays' },
    { label: 'Weddings', url: '/shop?filter=weddings' },
    { label: 'Anniversaries', url: '/shop?filter=anniversaries' },
    { label: 'Festivals', url: '/shop?filter=festivals' },
    { label: 'New Home', url: '/shop?filter=new-home' },
    { label: 'Baby Shower', url: '/shop?filter=baby-shower' },
    { label: 'Farewell', url: '/shop?filter=farewell' },
    { label: 'Corporate Celebrations', url: '/shop?filter=corporate-celebrations' },
  ],
  COLLECTIONS: [
    { label: 'Handcrafted Decor', url: '/shop?filter=handcrafted-decor' },
    { label: 'Artisan Collection', url: '/shop?filter=artisan-collection' },
    { label: 'Signature Collection', url: '/shop?filter=signature-collection' },
    { label: 'Sustainable Collection', url: '/shop?filter=sustainable-collection' },
    { label: 'Premium Gift Boxes', url: '/shop?filter=gift-boxes' },
    { label: 'Limited Editions', url: '/shop?filter=limited-editions' },
  ],
  STORIES: [
    { label: 'Our Story', url: '/stories' },
    { label: 'Artisan Stories', url: '/stories#artisan' },
    { label: 'Craftsmanship', url: '/stories#craftsmanship' },
    { label: 'Gift Guides', url: '/stories#guides' },
    { label: 'Journal', url: '/stories#journal' },
  ],
};

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { cart, wishlist } = useStore();

  const [allProducts, setAllProducts] = useState<any[]>(FALLBACK_PRODUCTS);
  const [activeMenu, setActiveMenu] = useState<'GIFTS' | 'OCCASIONS' | 'COLLECTIONS' | 'STORIES' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [customerUser, setCustomerUser] = useState<any>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const totalCartCount = (cart || []).reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalWishlistCount = (wishlist || []).length;

  // Header Config from Cache/API
  const [headerConfig, setHeaderConfig] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('sanusha_cms_header_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.brandName) return parsed;
        }
      } catch (e) {}
    }
    return {
      brandName: 'SANUSHA',
      iconUrl: '',
      logoUrl: '',
    };
  });

  // Load products & header settings
  useEffect(() => {
    Promise.all([
      fetchApi('/products').catch(() => FALLBACK_PRODUCTS),
      fetchApi('/cms/header').catch(() => null),
    ]).then(([prods, data]) => {
      if (prods && prods.length > 0) setAllProducts(prods);
      if (data && data.brandName) {
        setHeaderConfig(data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('sanusha_cms_header_cache', JSON.stringify(data));
        }
      }
    });

    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('sanusha_customer_user');
      if (userStr) {
        try {
          setCustomerUser(JSON.parse(userStr));
        } catch (e) {}
      }
    }
  }, []);

  // Sticky header scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rotate search placeholder every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Filter live search results
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const matches = allProducts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.badge?.toLowerCase().includes(q)
    );
    setSearchResults(matches.slice(0, 6));
  }, [searchQuery, allProducts]);

  // Mega menu hover handlers with slight debounce to prevent accidental closing
  const handleMenuEnter = (menuKey: 'GIFTS' | 'OCCASIONS' | 'COLLECTIONS' | 'STORIES') => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setActiveMenu(menuKey);
  };

  const handleMenuLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const handleSearchSelect = (query: string) => {
    setSearchQuery(query);
    router.push(`/shop?search=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        isScrolled ? 'shadow-[0_4px_25px_rgba(0,0,0,0.04)] py-3' : 'py-4'
      } border-b border-[#EFE8DA]`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between relative">
        
        {/* LEFT NAVIGATION: GIFTS | OCCASIONS | COLLECTIONS */}
        <nav className="hidden lg:flex items-center space-x-8" aria-label="Primary Left Navigation">
          {(['GIFTS', 'OCCASIONS', 'COLLECTIONS'] as const).map((key) => (
            <div
              key={key}
              className="relative py-2"
              onMouseEnter={() => handleMenuEnter(key)}
              onMouseLeave={handleMenuLeave}
            >
              <Link
                href={`/shop?filter=${key.toLowerCase()}`}
                className="relative text-[11px] font-sans font-bold tracking-[0.25em] text-gray-900 uppercase transition-colors duration-200 py-1 group"
              >
                <span>{key}</span>
                {/* Thin Luxury Gold Underline Effect */}
                <span
                  className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A059] transition-transform duration-300 ease-out origin-left ${
                    activeMenu === key ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            </div>
          ))}
        </nav>

        {/* CENTER LOGO & TAGLINE */}
        <div className="flex flex-col items-center justify-center text-center">
          <Link href="/" className="group flex flex-col items-center">
            {getImageUrl(headerConfig.logoUrl) ? (
              <img
                src={getImageUrl(headerConfig.logoUrl)}
                alt={headerConfig.brandName || 'SANUSHA'}
                className="h-8 lg:h-10 w-auto object-contain"
              />
            ) : (
              <span className="font-serif text-2xl lg:text-3xl font-bold tracking-[0.28em] uppercase text-gray-900 group-hover:text-[#C5A059] transition-colors duration-300">
                {headerConfig.brandName || 'SANUSHA'}
              </span>
            )}
            <span className="hidden sm:block text-[9px] font-sans font-medium tracking-[0.3em] uppercase text-[#8C7A5A] pt-0.5">
              Thoughtful Gifting, Timeless Craft.
            </span>
          </Link>
        </div>

        {/* RIGHT NAVIGATION: STORIES | SEARCH | ACCOUNT | WISHLIST | CART */}
        <div className="flex items-center space-x-6 lg:space-x-8">
          <nav className="hidden lg:flex items-center space-x-8">
            {/* STORIES */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMenuEnter('STORIES')}
              onMouseLeave={handleMenuLeave}
            >
              <Link
                href="/stories"
                className="relative text-[11px] font-sans font-bold tracking-[0.25em] text-gray-900 uppercase transition-colors duration-200 py-1 group"
              >
                <span>STORIES</span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A059] transition-transform duration-300 ease-out origin-left ${
                    activeMenu === 'STORIES' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            </div>

            {/* SEARCH TRIGGER */}
            <button
              onClick={() => {
                setIsSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }}
              className="relative text-[11px] font-sans font-bold tracking-[0.25em] text-gray-900 uppercase transition-colors duration-200 py-1 flex items-center gap-1.5 group"
            >
              <Search className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>SEARCH</span>
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A059] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
            </button>

            {/* ACCOUNT */}
            <Link
              href={customerUser ? '/account' : '/login'}
              className="relative text-[11px] font-sans font-bold tracking-[0.25em] text-gray-900 uppercase transition-colors duration-200 py-1 flex items-center gap-1.5 group"
            >
              <User className="w-3.5 h-3.5 text-gray-700 group-hover:text-[#C5A059] transition-colors" />
              <span>{customerUser ? customerUser.name?.split(' ')[0] || 'ACCOUNT' : 'ACCOUNT'}</span>
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A059] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
            </Link>
          </nav>

          {/* FAR RIGHT ICONS: WISHLIST & CART */}
          <div className="flex items-center space-x-4 lg:space-x-5 pl-2 border-l border-gray-200">
            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="relative p-1 text-gray-800 hover:text-[#C5A059] transition-colors"
              aria-label="View Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
              {totalWishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C5A059] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-1 text-gray-800 hover:text-[#C5A059] transition-colors"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 text-amber-300 text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1 text-gray-900 hover:text-[#C5A059] transition-colors focus:outline-none"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

      </div>

      {/* FULL-WIDTH DESKTOP MEGA MENU DROPDOWN */}
      {activeMenu && (
        <div
          className="hidden lg:block absolute left-0 top-full w-full bg-white border-b border-[#EFE8DA] shadow-[0_15px_30px_rgba(0,0,0,0.06)] z-40 transition-all duration-300 animate-fadeIn"
          onMouseEnter={() => {
            if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
          }}
          onMouseLeave={handleMenuLeave}
        >
          <div className="max-w-[1440px] mx-auto px-12 py-10 grid grid-cols-4 gap-8">
            {/* Main Links List */}
            <div className="col-span-3 grid grid-cols-3 gap-8">
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900 tracking-wider uppercase border-b border-[#EFE8DA] pb-2 mb-4">
                  {activeMenu}
                </h3>
                <ul className="space-y-3">
                  {MEGA_MENU_DATA[activeMenu].slice(0, 4).map((item, idx) => (
                    <li key={idx}>
                      <Link
                        href={item.url}
                        onClick={() => setActiveMenu(null)}
                        className="text-xs font-sans font-medium text-gray-700 hover:text-[#C5A059] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-amber-400/60" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900 tracking-wider uppercase border-b border-[#EFE8DA] pb-2 mb-4">
                  Curated Highlights
                </h3>
                <ul className="space-y-3">
                  {MEGA_MENU_DATA[activeMenu].slice(4).map((item, idx) => (
                    <li key={idx}>
                      <Link
                        href={item.url}
                        onClick={() => setActiveMenu(null)}
                        className="text-xs font-sans font-medium text-gray-700 hover:text-[#C5A059] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-amber-400/60" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gifting Guarantee Highlight Box */}
              <div className="bg-[#FAF7F2] p-6 border border-[#E8DFC8] rounded-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#C5A059] block mb-1">
                    Signature House Service
                  </span>
                  <h4 className="font-serif text-base font-bold text-gray-900 mb-2">
                    Gift-Ready Packaging
                  </h4>
                  <p className="text-xs text-gray-600 font-light leading-relaxed">
                    Every SANUSHA creation arrives in our signature gold-embossed box, ready to touch hearts.
                  </p>
                </div>
                <Link
                  href="/shop?filter=signature"
                  onClick={() => setActiveMenu(null)}
                  className="pt-4 text-xs font-bold uppercase tracking-widest text-[#C5A059] hover:text-gray-900 inline-flex items-center gap-1 transition-colors"
                >
                  Explore Signature Line <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Featured Luxury Banner Image */}
            <div className="relative group overflow-hidden rounded-xs border border-[#E8DFC8]">
              <img
                src="/images/cat_decor_accents.jpg"
                alt="Luxury Gifting House"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-amber-200 mb-1">
                  Artisan House
                </span>
                <h4 className="font-serif text-lg font-bold mb-1">Timeless Indian Craftsmanship</h4>
                <p className="text-xs text-slate-200 font-light">Elevating meaningful moments.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY SEARCH MODAL WITH ROTATING PLACEHOLDERS & POPULAR SEARCHES */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center pt-20 px-4 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-xs shadow-2xl overflow-hidden border border-[#E8DFC8]">
            {/* Search Input Box */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-[#FAF8F5]">
              <Search className="w-5 h-5 text-[#C5A059]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={ROTATING_PLACEHOLDERS[placeholderIndex]}
                className="w-full bg-transparent text-sm font-sans font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
                aria-label="Close Search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Popular Searches Suggestions */}
            {!searchQuery.trim() && (
              <div className="p-6 space-y-4">
                <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-gray-400 block">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearchSelect(item)}
                      className="text-xs font-sans font-medium px-3.5 py-1.5 bg-[#FAF7F2] hover:bg-[#C5A059] hover:text-white border border-[#E8DFC8] rounded-full transition-all duration-200"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Search Results Dropdown */}
            {searchQuery.trim() && (
              <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-4 p-2 hover:bg-[#FAF7F2] rounded-xs transition-colors group"
                    >
                      <img
                        src={product.image || '/images/cat_decor_accents.jpg'}
                        alt={product.title || product.name}
                        className="w-12 h-12 object-cover rounded-xs border border-gray-200"
                      />
                      <div className="flex-grow">
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#C5A059] transition-colors">
                          {product.title || product.name}
                        </h4>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                          {product.category || 'SANUSHA Gift'}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-gray-900">
                        ₹{product.price?.toLocaleString('en-IN') || '1,499'}
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-gray-500 font-medium">
                    No handcrafted items found matching &quot;{searchQuery}&quot;.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FULL-SCREEN LUXURY MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col justify-between p-6 lg:hidden animate-fadeIn overflow-y-auto">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-4">
            <span className="font-serif text-xl font-bold tracking-[0.25em] text-gray-900">SANUSHA</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 text-gray-900 focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="py-8 space-y-6 flex-grow">
            {(['GIFTS', 'OCCASIONS', 'COLLECTIONS', 'STORIES'] as const).map((key) => (
              <div key={key} className="space-y-3 border-b border-gray-100 pb-4">
                <Link
                  href={key === 'STORIES' ? '/stories' : `/shop?filter=${key.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-serif font-bold tracking-widest text-gray-900 uppercase block hover:text-[#C5A059]"
                >
                  {key}
                </Link>
                <div className="grid grid-cols-2 gap-2 pl-2">
                  {MEGA_MENU_DATA[key].slice(0, 4).map((sub, idx) => (
                    <Link
                      key={idx}
                      href={sub.url}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-xs font-sans text-gray-600 hover:text-[#C5A059]"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-2 flex flex-col gap-4">
              <Link
                href={customerUser ? '/account' : '/login'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-sans font-bold tracking-widest text-gray-900 uppercase flex items-center gap-2"
              >
                <User className="w-4 h-4 text-[#C5A059]" />
                {customerUser ? 'MY ACCOUNT' : 'LOGIN / REGISTER'}
              </Link>
            </div>
          </div>

          {/* Footer Tagline */}
          <div className="text-center border-t border-[#E8DFC8] pt-6 space-y-1">
            <span className="text-xs font-serif italic text-[#8C7A5A]">Thoughtful Gifting, Timeless Craft.</span>
            <p className="text-[10px] text-gray-400">© 2026 SANUSHA Luxury House</p>
          </div>
        </div>
      )}

    </header>
  );
};
