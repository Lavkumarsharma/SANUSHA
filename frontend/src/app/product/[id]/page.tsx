'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
  Truck,
  RotateCcw,
  ShieldCheck,
  Rss,
  Sparkles,
  Shirt,
  Feather,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  CheckCircle2,
} from 'lucide-react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toast } from '@/components/Toast';
import {
  useStore,
  PRODUCTS_DATA,
  Product,
} from '@/store/useStore';
import { fetchApi } from '@/lib/api';

export default function ProductDetailPage() {
  const params = useParams();
  const rawId = (params?.id as string) || '1';

  const { wishlist, toggleWishlist, addToCart, addToast } = useStore();

  const [fetchedProduct, setFetchedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!rawId) return;
    fetchApi(`/products/${rawId}`)
      .then((data) => {
        if (data && data.id) setFetchedProduct(data);
      })
      .catch(() => {
        fetchApi('/products')
          .then((all) => {
            if (Array.isArray(all)) {
              const found = all.find((p: any) => p.id === rawId || p.slug === rawId);
              if (found) setFetchedProduct(found);
            }
          })
          .catch(() => {});
      });
  }, [rawId]);

  // Find product by id or slug, or fallback safely to product #1
  const product: Product =
    fetchedProduct ||
    PRODUCTS_DATA.find((p) => p.id === rawId || (p as any).slug === rawId) ||
    PRODUCTS_DATA[0];

  const sizeOpts: string[] =
    (Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes
      : (product as any).sizeOptions) || ['Standard (9")', 'Tall (12")'];

  const colorHexList: string[] = (product as any).colorHexes || ['#5A3E2B', '#8C6D53', '#1F1F1F'];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(sizeOpts[0] || 'Standard');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'sizeGuide' | 'reviews' | 'shipping'>('description');

  // Accordion state
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    details: true,
    care: false,
    shipping: false,
    sizeFit: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isWishlisted = Array.isArray(wishlist) && wishlist.includes(product.id);
  const parseFrontendGallery = (p: any): string[] => {
    if (!p) return ['/images/prod_lantern_1.jpg'];
    let list: string[] = [];

    if (Array.isArray(p.galleryImages) && p.galleryImages.length > 0) {
      list = p.galleryImages;
    } else if (typeof p.galleryImages === 'string') {
      try {
        const parsed = JSON.parse(p.galleryImages);
        if (Array.isArray(parsed) && parsed.length > 0) list = parsed;
      } catch (e) {}
    }

    if (list.length === 0) {
      if (Array.isArray(p.images) && p.images.length > 0) {
        list = p.images;
      } else if (typeof p.images === 'string') {
        try {
          const parsed = JSON.parse(p.images);
          if (Array.isArray(parsed) && parsed.length > 0) list = parsed;
        } catch (e) {}
      }
    }

    if (list.length === 0 && p.image) {
      list = [p.image];
    }

    if (list.length === 0) {
      list = ['/images/prod_lantern_1.jpg'];
    }

    return list;
  };

  const gallery = parseFrontendGallery(product);
  const getImageUrl = (url: string) => (url?.startsWith('http') ? url : url);

  const colorName =
    ((product as any).colors && (product as any).colors[selectedColorIndex]) || 'Warm Teak';

  const categoryName =
    typeof product.category === 'object' && product.category !== null
      ? (product.category as any).name || 'Decor'
      : (product.category as string) || 'Decor';

  const relatedProducts = PRODUCTS_DATA.filter((p) => p.id !== product.id);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header Top Bar */}
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow">
        {/* Breadcrumb Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-2 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#6C307D] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#6C307D] transition-colors">
              Shop
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#6C307D] transition-colors">
              {categoryName}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">{product.name}</span>
          </div>
        </div>

        {/* Top Product Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Gallery (Vertical Strip + Main Viewer) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Vertical Thumbnail Strip */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[580px] shrink-0">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded-xs border-2 overflow-hidden relative shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#6C307D]'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={getImageUrl(imgUrl)}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Hero Product Image Viewer */}
            <div className="relative flex-1 aspect-[3/4] bg-[#FAF8F5] rounded-sm overflow-hidden border border-[#EBE7DF]">
              {/* Expand Icon */}
              <button
                onClick={() => addToast('Image Zoom', 'Full screen gallery opened.')}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-800 hover:bg-white shadow-xs transition-colors"
                aria-label="Expand Image"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Main Image */}
              <img
                src={getImageUrl(gallery[selectedImageIndex] || product.image)}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Previous / Next Image Controls */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? gallery.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-xs transition-all"
                    aria-label="Previous Image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) => (prev + 1) % gallery.length)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-xs transition-all"
                    aria-label="Next Image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

          </div>

          {/* Right Column: Product Purchase Details Panel */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Badge & Title */}
            <div>
              {product.badge && (
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#6C307D] uppercase block mb-1">
                  {product.badge}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight">
                {product.name}
              </h1>

              {/* Price & Rating */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span>{(product as any).rating || 4.8}</span>
                  <a href="#reviews" className="text-gray-400 hover:underline">
                    ({(product as any).reviewsCount || 128} reviews)
                  </a>
                </div>
              </div>

              {/* Short Description */}
              <p className="text-xs text-gray-600 font-medium leading-relaxed mt-3">
                {product.description}
              </p>
            </div>

            <div className="w-full h-[1px] bg-gray-200" />

            {/* COLOR Selection */}
            {colorHexList.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-900 uppercase tracking-wider">
                    FINISH / COLOR: <span className="text-gray-600 font-semibold">{colorName}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {colorHexList.map((hex: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`w-7 h-7 rounded-full border border-gray-300 relative transition-transform ${
                        selectedColorIndex === idx
                          ? 'ring-2 ring-[#6C307D] ring-offset-2 scale-110'
                          : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Dimension / Size Selection */}
            {sizeOpts.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-900 uppercase tracking-wider">
                    SELECT DIMENSIONS / SIZE:
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {sizeOpts.map((sz: string) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 px-2 text-xs font-bold rounded-xs border transition-all text-center ${
                        selectedSize === sz
                          ? 'border-[#6C307D] bg-[#6C307D] text-white shadow-xs'
                          : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTITY Stepper */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                QUANTITY:
              </span>
              <div className="inline-flex items-center border border-gray-300 rounded-xs bg-[#FAF8F5]">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-xs font-bold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CTA Buttons (ADD TO BAG + WISHLIST) */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => addToCart(product, selectedSize, quantity, colorName)}
                className="flex-1 bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold tracking-widest uppercase py-3.5 rounded-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                ADD TO BAG
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-xs border transition-colors ${
                  isWishlisted
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-gray-300 text-gray-700 hover:border-gray-500'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {/* Service Badges */}
            <div className="grid grid-cols-3 gap-2 pt-3 text-[10px] text-gray-600 font-semibold border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#6C307D] shrink-0" />
                <div>
                  <p className="text-gray-900 font-bold">Free Express Shipping</p>
                  <p className="text-gray-500">On orders over ₹999</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#6C307D] shrink-0" />
                <div>
                  <p className="text-gray-900 font-bold">Easy Returns</p>
                  <p className="text-gray-500">Within 7 days</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6C307D] shrink-0" />
                <div>
                  <p className="text-gray-900 font-bold">Secure Checkout</p>
                  <p className="text-gray-500">100% safe payments</p>
                </div>
              </div>
            </div>

            {/* Collapsible Accordions */}
            <div className="border-t border-gray-200 divide-y divide-gray-200 pt-2">
              
              {/* Product Details Accordion */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('details')}
                  className="w-full flex items-center justify-between text-xs font-bold text-gray-900 uppercase tracking-wider text-left"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#6C307D]" />
                    PRODUCT DETAILS &amp; CRAFTSMANSHIP
                  </span>
                  {openAccordions.details ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>
                {openAccordions.details && (
                  <div className="mt-3 text-xs text-gray-600 space-y-2 pl-6 animate-in fade-in duration-200">
                    <p>{product.description}</p>
                    {((product as any).detailsBulletPoints || (product as any).detailsBullets) && (
                      <ul className="list-disc pl-4 space-y-1">
                        {Array.isArray((product as any).detailsBulletPoints)
                          ? (product as any).detailsBulletPoints.map((item: string, idx: number) => (
                              <li key={idx}>{item}</li>
                            ))
                          : typeof ((product as any).detailsBulletPoints || (product as any).detailsBullets) === 'string'
                          ? ((product as any).detailsBulletPoints || (product as any).detailsBullets)
                              .split('\n')
                              .filter((line: string) => line.trim().length > 0)
                              .map((item: string, idx: number) => <li key={idx}>{item.replace(/^[•\-\*]\s*/, '')}</li>)
                          : null}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Material & Care Accordion */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('care')}
                  className="w-full flex items-center justify-between text-xs font-bold text-gray-900 uppercase tracking-wider text-left"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#6C307D]" />
                    MATERIAL &amp; CARE
                  </span>
                  {openAccordions.care ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>
                {openAccordions.care && (
                  <div className="mt-3 text-xs text-gray-600 pl-6 space-y-1.5 animate-in fade-in duration-200">
                    <p className="font-semibold text-gray-900">Material: {product.material}</p>
                    <p>{product.careInstructions || 'Wipe clean with a soft dry cloth. Keep away from harsh moisture.'}</p>
                  </div>
                )}
              </div>

              {/* Shipping & Returns Accordion */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between text-xs font-bold text-gray-900 uppercase tracking-wider text-left"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#6C307D]" />
                    SHIPPING &amp; RETURNS
                  </span>
                  {openAccordions.shipping ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>
                {openAccordions.shipping && (
                  <div className="mt-3 text-xs text-gray-600 pl-6 space-y-1.5 animate-in fade-in duration-200">
                    <p>{(product as any).shippingInfo || 'Free standard shipping on orders over ₹999. Dispatch within 24 hours in shatter-proof eco packaging.'}</p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Product Highlights Strip */}
        <section className="bg-[#FAF8F5] border-y border-[#EBE7DF] py-8 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5E2DA] flex items-center justify-center text-[#6C307D] shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Handcrafted Artistry</h4>
                <p className="text-[11px] text-gray-500">Made by master artisans</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5E2DA] flex items-center justify-center text-[#6C307D] shadow-xs">
                <Feather className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Sustainable Material</h4>
                <p className="text-[11px] text-gray-500">{product.material || 'Natural Clay & Wood'}</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5E2DA] flex items-center justify-center text-[#6C307D] shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Durable Quality</h4>
                <p className="text-[11px] text-gray-500">Built to last in any space</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5E2DA] flex items-center justify-center text-[#6C307D] shadow-xs">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Shatter-Proof Packaging</h4>
                <p className="text-[11px] text-gray-500">Safe doorstep delivery</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Toast />
    </div>
  );
}

