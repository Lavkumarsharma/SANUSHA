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
  ArrowRight,
} from 'lucide-react';
import { useStore, PRODUCTS_DATA as FALLBACK_PRODUCTS, getProductImage } from '@/store/useStore';
import { fetchApi, getImageUrl } from '@/lib/api';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { cart, wishlist } = useStore();

  const [allProducts, setAllProducts] = useState<any[]>(FALLBACK_PRODUCTS);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [customerUser, setCustomerUser] = useState<any>(null);
  const [logoError, setLogoError] = useState(false);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Dynamic Header & Mega Menu Settings with Instant Cache Hydration
  const [headerConfig, setHeaderConfig] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cachedHdr = localStorage.getItem('sanusha_cms_header_cache');
        if (cachedHdr) {
          const parsed = JSON.parse(cachedHdr);
          if (parsed && parsed.brandName) return parsed;
        }
      } catch (e) {}
    }
    return {
      brandName: 'SANUSHA',
      iconUrl: '',
      logoUrl: '',
      navItems: [
        { id: '1', label: 'SHOP', url: '/shop', hasDropdown: true },
        { id: '2', label: 'NEW ARRIVALS', url: '/shop?filter=new-arrivals', hasDropdown: false },
        { id: '3', label: 'COLLECTIONS', url: '/shop?collection=all', hasDropdown: false },
      ],
      megaMenuColumns: [
        {
          id: 'col-1',
          title: 'WOMEN',
          links: [
            { id: 'w-1', label: 'View All', url: '/category/women' },
            { id: 'w-2', label: 'Tops & Shirts', url: '/category/women?type=Tops' },
            { id: 'w-3', label: 'Trousers & Pants', url: '/category/women?type=Bottoms' },
            { id: 'w-4', label: 'Co-ord Sets', url: '/category/women?type=Sets' },
          ],
        },
        {
          id: 'col-2',
          title: 'MEN',
          links: [
            { id: 'm-1', label: 'View All', url: '/category/men' },
            { id: 'm-2', label: 'Button-Down Shirts', url: '/category/men?type=Shirts' },
            { id: 'm-3', label: 'Cargo & Parachute Pants', url: '/category/men?type=Pants' },
            { id: 'm-4', label: 'Footwear & Sneakers', url: '/category/men?type=Footwear' },
          ],
        },
        {
          id: 'col-3',
          title: 'COLLECTIONS',
          links: [
            { id: 'c-1', label: 'Summer Edit', url: '/shop?collection=summer' },
            { id: 'c-2', label: 'Bestsellers', url: '/shop?sort=bestsellers' },
            { id: 'c-3', label: 'Linen Essentials', url: '/shop?material=linen' },
          ],
        },
      ],
      megaMenuBanner: {
        imageUrl: '/images/cat_women.jpg',
        title: 'NEW SEASON',
        subtitle: 'Modern Linen',
        linkUrl: '/shop',
      },
    };
  });

  // Calculate live counters
  const totalCartCount = (cart || []).reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalWishlistCount = (wishlist || []).length;

  useEffect(() => {
    Promise.all([
      fetchApi('/products').catch(() => FALLBACK_PRODUCTS),
      fetchApi('/cms/header').catch(() => null),
    ])
      .then(([prods, data]) => {
        if (prods && prods.length > 0) setAllProducts(prods);
        if (data && data.brandName) {
          setHeaderConfig((prev: any) => {
            const updated = {
              ...prev,
              ...data,
              navItems: (data.navItems || prev.navItems)
                .filter((item: any) => {
                  const lbl = item.label?.toUpperCase();
                  return lbl !== 'HOME' && lbl !== 'MY ACCOUNT' && lbl !== 'ACCOUNT';
                })
                .map((item: any) => {
                  if (item.label?.toUpperCase() === 'NEW ARRIVALS') {
                    return { ...item, url: '/shop?filter=new-arrivals' };
                  }
                  return item;
                }),
              megaMenuColumns: data.megaMenuColumns || prev.megaMenuColumns,
              megaMenuBanner: data.megaMenuBanner || prev.megaMenuBanner,
            };
            if (typeof window !== 'undefined') {
              localStorage.setItem('sanusha_cms_header_cache', JSON.stringify(updated));
            }
            return updated;
          });
        }
      })
      .catch(() => {});

    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('sanusha_customer_user');
      if (userStr) {
        try {
          setCustomerUser(JSON.parse(userStr));
        } catch (e) {}
      }
    }
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-Time Search Query Filter against all live products
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }

    const q = searchQuery.toLowerCase().trim();
    const matches = (allProducts || []).filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q) ||
        (typeof p.category === 'string' && p.category.toLowerCase().includes(q)) ||
        p.gender?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q)
    );

    setSearchResults(matches.slice(0, 6));
    setIsDropdownOpen(true);
  }, [searchQuery, allProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsDropdownOpen(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  const filteredNavItems = (headerConfig.navItems || []).filter((item: any) => {
    const lbl = item.label?.toUpperCase()?.trim();
    return lbl !== 'HOME' && lbl !== 'MY ACCOUNT' && lbl !== 'ACCOUNT';
  });

  return (
    <header className="bg-white sticky top-0 z-40 border-b border-[#EBE7DF] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-4 relative">
        
        {/* 1. LEFT SIDE: NAVIGATION LINKS */}
        <div className="flex items-center justify-start min-w-0 z-10">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-gray-700 hover:text-[#6C307D]"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-[11px] font-bold tracking-[0.18em] uppercase text-gray-800">
            {filteredNavItems.map((item: any) => {
              if (item.hasDropdown) {
                return (
                  <div
                    key={item.id || item.label}
                    className="relative py-1 group"
                    ref={megaMenuRef}
                    onMouseEnter={() => setIsMegaMenuOpen(true)}
                    onMouseLeave={() => setIsMegaMenuOpen(false)}
                  >
                    <Link
                      href={item.url}
                      className="hover:text-[#6C307D] transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap py-0.5 border-b-2 border-transparent hover:border-[#6C307D]"
                    >
                      {item.label}
                      <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-[#6C307D] transition-transform group-hover:rotate-180" />
                    </Link>

                    {/* Mega Dropdown Panel */}
                    {isMegaMenuOpen && (
                      <div className="absolute top-full left-0 w-[760px] bg-white border border-[#EBE7DF] shadow-2xl rounded-xs p-6 grid grid-cols-4 gap-7 z-50 text-xs normal-case transition-all animate-fadeIn">
                        {headerConfig.megaMenuColumns.map((col: any, idx: number) => (
                          <div key={col.id || idx} className="space-y-2.5">
                            <span className="text-[10px] font-bold tracking-[0.2em] text-[#6C307D] uppercase block pb-1 border-b border-purple-100">
                              {col.title}
                            </span>
                            <ul className="space-y-1.5 text-gray-600 font-medium text-[11px]">
                              {col.links.map((subLink: any, sIdx: number) => (
                                <li key={subLink.id || sIdx}>
                                  <Link
                                    href={subLink.url}
                                    onClick={() => setIsMegaMenuOpen(false)}
                                    className="hover:text-[#6C307D] hover:translate-x-1 transition-all block"
                                  >
                                    {subLink.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}

                        <div className="space-y-2">
                          <Link
                            href={headerConfig.megaMenuBanner?.linkUrl || '/shop'}
                            onClick={() => setIsMegaMenuOpen(false)}
                            className="relative group/card block overflow-hidden rounded-xs aspect-[4/5] bg-gray-100 shadow-xs"
                          >
                            <img
                              src={getImageUrl(headerConfig.megaMenuBanner?.imageUrl) || '/images/cat_women.jpg'}
                              alt={headerConfig.megaMenuBanner?.title || 'New Season'}
                              className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3 text-white">
                              <span className="text-[9px] font-bold tracking-widest uppercase text-purple-200">
                                {headerConfig.megaMenuBanner?.title || 'NEW SEASON'}
                              </span>
                              <span className="font-serif font-bold text-xs leading-tight text-white mt-0.5">
                                {headerConfig.megaMenuBanner?.subtitle || 'Modern Linen'}
                              </span>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id || item.label}
                  href={item.url}
                  className="hover:text-[#6C307D] transition-colors whitespace-nowrap py-0.5 border-b-2 border-transparent hover:border-[#6C307D]"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 2. CENTER SECTION: ABSOLUTELY CENTERED BRAND LOGO & NAME */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex justify-center items-center pointer-events-auto z-10">
          <Link href="/" className="flex items-center justify-center gap-2 group py-0.5">
            {getImageUrl(headerConfig.iconUrl) ? (
              <img
                src={getImageUrl(headerConfig.iconUrl)}
                alt="Brand Icon"
                className="h-7 sm:h-8 w-auto object-contain"
                onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
              />
            ) : null}

            {!logoError && getImageUrl(headerConfig.logoUrl) ? (
              <img
                src={getImageUrl(headerConfig.logoUrl)}
                alt={headerConfig.brandName || 'SANUSHA'}
                className="h-7 sm:h-8 w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.22em] text-gray-900 group-hover:text-[#6C307D] transition-colors">
                {headerConfig.brandName || 'SANUSHA'}
              </span>
            )}
          </Link>
        </div>

        {/* 3. RIGHT SIDE: SEARCH BAR & USER ACTIONS */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0 z-10">
          {/* Predictive Search Input */}
          <div className="relative hidden md:block" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setIsDropdownOpen(true)}
                placeholder="What are you looking for?"
                className="bg-[#FAF8F5] border border-[#EBE7DF] rounded-full py-1.5 pl-3.5 pr-8 text-[11px] w-44 lg:w-56 xl:w-64 focus:outline-none focus:border-[#6C307D] focus:bg-white text-gray-800 font-medium transition-all shadow-2xs"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6C307D] transition-colors p-1"
                title="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Instant Product Card Matches Dropdown Overlay */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-84 sm:w-96 bg-white border border-[#EBE7DF] shadow-2xl rounded-xl p-3.5 z-50 space-y-3 animate-fadeIn">
                
                <div className="flex items-center justify-between px-1 pb-2 border-b border-gray-100">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    {searchResults.length > 0
                      ? `Matching Products for "${searchQuery}" (${searchResults.length})`
                      : `No products matching "${searchQuery}"`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(false)}
                    className="text-gray-400 hover:text-gray-700 text-[10px] font-bold"
                  >
                    Close [X]
                  </button>
                </div>

                {searchResults.length > 0 ? (
                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                    {searchResults.map((prod) => {
                      const prodImg = getProductImage(prod);
                      return (
                        <Link
                          key={prod.id}
                          href={`/product/${prod.id}`}
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-[#FAF8F5] rounded-xl transition-colors group border border-transparent hover:border-[#EBE7DF]"
                        >
                          <img
                            src={prodImg}
                            alt={prod.name}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200 shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                              {prod.gender || 'UNISEX'} • {prod.category?.name || (typeof prod.category === 'string' ? prod.category : 'Apparel')}
                            </span>
                            <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#6C307D] truncate">
                              {prod.name}
                            </h4>
                            <span className="text-xs font-serif font-bold text-[#6C307D] mt-0.5 block">
                              ₹{prod.price?.toLocaleString()}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#6C307D] transition-transform group-hover:translate-x-1 shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 text-center space-y-2">
                    <p className="text-xs text-gray-500 font-medium">
                      No matching products available for "{searchQuery}".
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push('/shop');
                      }}
                      className="text-xs font-bold text-[#6C307D] hover:underline"
                    >
                      Browse Full Store Catalog →
                    </button>
                  </div>
                )}

                {searchResults.length > 0 && (
                  <Link
                    href={`/shop?search=${encodeURIComponent(searchQuery.trim())}`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="block text-center text-xs font-bold bg-[#6C307D] text-white py-2 rounded-lg hover:bg-[#522061] transition-colors shadow-2xs uppercase tracking-wider"
                  >
                    View All {searchResults.length} Products in Catalog →
                  </Link>
                )}

              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2.5 text-gray-700">
            <Link
              href={customerUser ? '/account' : '/login'}
              className="hover:text-[#6C307D] transition-colors p-0.5 hover:bg-slate-100 rounded-full flex items-center justify-center shrink-0"
              title={customerUser ? `Account (${customerUser.name || customerUser.email})` : 'Sign In / Register'}
            >
              {customerUser?.picture ? (
                <img
                  src={customerUser.picture}
                  alt={customerUser.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 min-w-[28px] min-h-[28px] rounded-full object-cover object-center aspect-square shrink-0 border-2 border-[#6C307D] shadow-2xs"
                />
              ) : customerUser?.name ? (
                <div className="w-7 h-7 min-w-[28px] min-h-[28px] rounded-full bg-[#6C307D] text-white text-[11px] font-bold flex items-center justify-center aspect-square shrink-0 shadow-2xs">
                  {customerUser.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <User className="w-4.5 h-4.5" />
              )}
            </Link>

            <Link
              href="/wishlist"
              className="hover:text-[#6C307D] transition-colors p-1.5 hover:bg-slate-100 rounded-full relative"
              title="Wishlist"
            >
              <Heart className="w-4.5 h-4.5" />
              {totalWishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#6C307D] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow-2xs">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="hover:text-[#6C307D] transition-colors p-1.5 hover:bg-slate-100 rounded-full relative"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {totalCartCount > 0 && (
                <span className="absolute top-0 right-0 bg-slate-900 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow-2xs">
                  {totalCartCount}
                </span>
              )}
            </Link>
          </div>

        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EBE7DF] bg-white p-4 space-y-3 text-xs font-bold uppercase tracking-wider">
          {headerConfig.navItems.map((item: any) => (
            <Link
              key={item.id || item.label}
              href={item.url}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-gray-800 hover:text-[#6C307D]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={customerUser ? '/account' : '/login'}
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-1.5 text-gray-800 hover:text-[#6C307D]"
          >
            {customerUser ? 'MY ACCOUNT' : 'SIGN IN / REGISTER'}
          </Link>
        </div>
      )}
    </header>
  );
};
