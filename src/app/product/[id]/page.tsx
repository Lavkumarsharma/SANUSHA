'use client';

import React, { useState } from 'react';
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
import { ValuePropsBar } from '@/components/ValuePropsBar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { QuickViewModal } from '@/components/QuickViewModal';
import { Toast } from '@/components/Toast';
import {
  useStore,
  PRODUCTS_DATA,
  COMPLETE_THE_LOOK_ITEMS,
  Product,
} from '@/store/useStore';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = (params?.id as string) || '1';

  const { wishlist, toggleWishlist, addToCart, addToast } = useStore();

  // Find product or fallback to product #1
  const product: Product =
    PRODUCTS_DATA.find((p) => p.id === productId) || PRODUCTS_DATA[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizeOptions[2] || 'M');
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

  const isWishlisted = wishlist.includes(product.id);
  const gallery = product.galleryImages || [product.image];
  const colorName =
    (product.colors && product.colors[selectedColorIndex]) || 'Sand Beige';

  const relatedProducts = PRODUCTS_DATA.filter((p) => p.id !== product.id);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header Top Bar */}
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow">
        {/* Breadcrumb Bar */}
        <div className="bg-[#FAF8F5] border-b border-[#EBE7DF] py-3 px-4 sm:px-8 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <Link href="/" className="hover:text-[#6C307D] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#6C307D] transition-colors">
              Shop
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#6C307D] transition-colors">
              {product.gender}
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
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}

              {/* Video Thumbnail sample */}
              <button
                onClick={() => setSelectedImageIndex(0)}
                className="w-16 h-20 sm:w-20 sm:h-24 rounded-xs border border-gray-200 bg-gray-900 text-white relative shrink-0 flex flex-col items-center justify-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs">
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                </div>
                <span className="text-[9px] font-bold tracking-widest uppercase">VIDEO</span>
              </button>
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
                src={gallery[selectedImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Previous / Next Image Controls */}
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
                  <span>{product.rating || 4.7}</span>
                  <a href="#reviews" className="text-gray-400 hover:underline">
                    ({product.reviewsCount || 128} reviews)
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
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-900 uppercase tracking-wider">
                  COLOR: <span className="text-gray-600 font-semibold">{colorName}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colorHexes.map((hex, idx) => (
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

            {/* SIZE Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-900 uppercase tracking-wider">
                  SIZE:
                </span>
                <button
                  onClick={() => setActiveTab('sizeGuide')}
                  className="text-[11px] font-bold text-gray-600 hover:text-[#6C307D] underline flex items-center gap-1"
                >
                  📐 Size Guide
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {product.sizeOptions.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 text-xs font-bold rounded-xs border transition-all ${
                      selectedSize === sz
                        ? 'border-[#6C307D] bg-[#6C307D] text-white shadow-xs'
                        : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 italic mt-1">
                Model is 188cm tall and wearing size M
              </p>
            </div>

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
                onClick={() => addToCart(product, selectedSize, colorName, quantity)}
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
                  <p className="text-gray-900 font-bold">Free Shipping</p>
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
                  <p className="text-gray-900 font-bold">Secure Payments</p>
                  <p className="text-gray-500">100% secure checkout</p>
                </div>
              </div>
            </div>

            {/* Collapsible Accordions matching reference screenshot */}
            <div className="border-t border-gray-200 divide-y divide-gray-200 pt-2">
              
              {/* Product Details Accordion */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('details')}
                  className="w-full flex items-center justify-between text-xs font-bold text-gray-900 uppercase tracking-wider text-left"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#6C307D]" />
                    PRODUCT DETAILS
                  </span>
                  {openAccordions.details ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>
                {openAccordions.details && (
                  <div className="mt-3 text-xs text-gray-600 space-y-2 pl-6 animate-in fade-in duration-200">
                    <p>{product.description}</p>
                    {product.detailsBulletPoints && (
                      <ul className="list-disc pl-4 space-y-1">
                        {product.detailsBulletPoints.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
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
                    <Shirt className="w-4 h-4 text-[#6C307D]" />
                    MATERIAL & CARE
                  </span>
                  {openAccordions.care ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>
                {openAccordions.care && (
                  <div className="mt-3 text-xs text-gray-600 pl-6 space-y-1.5 animate-in fade-in duration-200">
                    <p className="font-semibold text-gray-900">Material: {product.material}</p>
                    <p>{product.careInstructions || 'Machine wash cold gentle cycle. Do not bleach. Tumble dry low.'}</p>
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
                    SHIPPING & RETURNS
                  </span>
                  {openAccordions.shipping ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>
                {openAccordions.shipping && (
                  <div className="mt-3 text-xs text-gray-600 pl-6 space-y-1.5 animate-in fade-in duration-200">
                    <p>{product.shippingInfo || 'Free standard shipping on orders over ₹999. Dispatch within 24 hours. Easy 7 days return policy.'}</p>
                  </div>
                )}
              </div>

              {/* Size & Fit Accordion */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('sizeFit')}
                  className="w-full flex items-center justify-between text-xs font-bold text-gray-900 uppercase tracking-wider text-left"
                >
                  <span className="flex items-center gap-2">
                    <Feather className="w-4 h-4 text-[#6C307D]" />
                    SIZE & FIT
                  </span>
                  {openAccordions.sizeFit ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>
                {openAccordions.sizeFit && (
                  <div className="mt-3 text-xs text-gray-600 pl-6 space-y-1.5 animate-in fade-in duration-200">
                    <p>Oversized relaxed fit. Designed for comfort and effortless draping.</p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Product Highlights Strip matching reference */}
        <section className="bg-[#FAF8F5] border-y border-[#EBE7DF] py-8 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5E2DA] flex items-center justify-center text-[#6C307D] shadow-xs">
                <Rss className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Breathable</h4>
                <p className="text-[11px] text-gray-500">Keeps you fresh</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5E2DA] flex items-center justify-center text-[#6C307D] shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Premium Fabric</h4>
                <p className="text-[11px] text-gray-500">100% Linen</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5E2DA] flex items-center justify-center text-[#6C307D] shadow-xs">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Oversized Fit</h4>
                <p className="text-[11px] text-gray-500">Relaxed & Comfortable</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5E2DA] flex items-center justify-center text-[#6C307D] shadow-xs">
                <Feather className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Lightweight</h4>
                <p className="text-[11px] text-gray-500">Perfect for all-day wear</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tabbed Content & Complete The Look Section matching reference */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Tabbed Sections */}
            <div className="lg:col-span-8 space-y-6">
              {/* Tab Navigation Header */}
              <div className="flex items-center gap-8 border-b border-[#EBE7DF] text-xs font-bold tracking-wider text-gray-600 uppercase overflow-x-auto">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-3 relative hover:text-[#6C307D] transition-colors whitespace-nowrap ${
                    activeTab === 'description' ? 'text-[#6C307D]' : ''
                  }`}
                >
                  DESCRIPTION
                  {activeTab === 'description' && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6C307D]" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('sizeGuide')}
                  className={`py-3 relative hover:text-[#6C307D] transition-colors whitespace-nowrap ${
                    activeTab === 'sizeGuide' ? 'text-[#6C307D]' : ''
                  }`}
                >
                  SIZE GUIDE
                  {activeTab === 'sizeGuide' && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6C307D]" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-3 relative hover:text-[#6C307D] transition-colors whitespace-nowrap ${
                    activeTab === 'reviews' ? 'text-[#6C307D]' : ''
                  }`}
                >
                  REVIEWS ({product.reviewsCount || 128})
                  {activeTab === 'reviews' && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6C307D]" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`py-3 relative hover:text-[#6C307D] transition-colors whitespace-nowrap ${
                    activeTab === 'shipping' ? 'text-[#6C307D]' : ''
                  }`}
                >
                  SHIPPING & RETURNS
                  {activeTab === 'shipping' && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6C307D]" />
                  )}
                </button>
              </div>

              {/* Tab Body */}
              <div className="text-xs text-gray-700 leading-relaxed space-y-4 font-medium">
                {activeTab === 'description' && (
                  <div className="space-y-3 animate-in fade-in">
                    <p>
                      This oversized linen shirt is designed for those who appreciate effortless style and everyday comfort. Made from 100% premium European flax linen, it features a relaxed silhouette, drop shoulders, and a curved hem for a modern look.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>100% Premium Linen</li>
                      <li>Oversized fit</li>
                      <li>Spread collar</li>
                      <li>Button closure</li>
                      <li>Curved hem</li>
                      <li>Made in India</li>
                    </ul>
                    <p className="italic text-gray-500">
                      The natural linen fabric is breathable, lightweight and gets softer with every wash.
                    </p>
                  </div>
                )}

                {activeTab === 'sizeGuide' && (
                  <div className="space-y-4 animate-in fade-in">
                    <p className="font-semibold text-gray-900">Garment Measurement Chart (Inches):</p>
                    <table className="w-full text-left border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-[#FAF8F5] text-gray-900 font-bold border-b border-gray-200">
                          <th className="p-2 border border-gray-200">Size</th>
                          <th className="p-2 border border-gray-200">Chest</th>
                          <th className="p-2 border border-gray-200">Length</th>
                          <th className="p-2 border border-gray-200">Shoulder</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td className="p-2 border border-gray-200 font-bold">S</td><td className="p-2 border border-gray-200">42&quot;</td><td className="p-2 border border-gray-200">29&quot;</td><td className="p-2 border border-gray-200">19&quot;</td></tr>
                        <tr className="bg-purple-50/50 font-bold"><td className="p-2 border border-gray-200 text-[#6C307D]">M</td><td className="p-2 border border-gray-200">44&quot;</td><td className="p-2 border border-gray-200">30&quot;</td><td className="p-2 border border-gray-200">20&quot;</td></tr>
                        <tr><td className="p-2 border border-gray-200 font-bold">L</td><td className="p-2 border border-gray-200">46&quot;</td><td className="p-2 border border-gray-200">31&quot;</td><td className="p-2 border border-gray-200">21&quot;</td></tr>
                        <tr><td className="p-2 border border-gray-200 font-bold">XL</td><td className="p-2 border border-gray-200">48&quot;</td><td className="p-2 border border-gray-200">32&quot;</td><td className="p-2 border border-gray-200">22&quot;</td></tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4 animate-in fade-in" id="reviews">
                    <div className="flex items-center gap-4 bg-[#FAF8F5] p-4 rounded-xs border border-[#EBE7DF]">
                      <div className="text-center">
                        <span className="text-3xl font-bold text-gray-900">4.7</span>
                        <div className="flex text-amber-400 justify-center my-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-500">128 Customer Reviews</span>
                      </div>
                      <div className="flex-1 text-xs text-gray-600 space-y-1">
                        <p className="font-semibold text-gray-900">&quot;Super soft linen & perfect fit!&quot;</p>
                        <p>&quot;The sand beige shade looks ultra premium in person. Highly recommended!&quot; — Rohan M.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-2 animate-in fade-in">
                    <p className="font-bold text-gray-900">Delivery Timelines:</p>
                    <p>Standard Shipping: 3-5 business days. Express Shipping available at checkout.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: COMPLETE THE LOOK matching reference */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-xs font-bold tracking-widest text-gray-900 uppercase">
                COMPLETE THE LOOK
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {COMPLETE_THE_LOOK_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="group border border-[#F0ECE1] rounded-xs bg-white p-2 text-center flex flex-col justify-between hover:shadow-sm transition-shadow"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-xs mb-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        onClick={() => addToast('Saved', `${item.name} added to wishlist.`)}
                        className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-gray-600 hover:text-red-500"
                        aria-label="Wishlist"
                      >
                        <Heart className="w-3 h-3" />
                      </button>
                    </div>

                    <h4 className="text-[11px] font-semibold text-gray-900 line-clamp-1">
                      {item.name}
                    </h4>
                    <span className="text-xs font-bold text-gray-900 mt-0.5">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* YOU MAY ALSO LIKE Section matching reference screenshot */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 border-t border-[#EBE7DF]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-gray-900 tracking-wider uppercase">
              YOU MAY ALSO LIKE
            </h2>

            <button
              onClick={() => addToast('More Products', 'Browsing catalog...')}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:border-[#6C307D] hover:text-[#6C307D]"
              aria-label="Next Related Products"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 6).map((relProduct) => {
              const relWishlisted = wishlist.includes(relProduct.id);

              return (
                <div
                  key={relProduct.id}
                  className="group relative flex flex-col justify-between bg-white rounded-sm border border-[#F0ECE1] overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
                    {relProduct.badge && (
                      <span className="absolute top-2.5 left-2.5 z-10 text-[9px] font-bold tracking-widest uppercase bg-white/90 px-2 py-0.5 rounded-xs text-gray-800 border border-gray-200">
                        {relProduct.badge}
                      </span>
                    )}

                    <button
                      onClick={() => toggleWishlist(relProduct.id)}
                      className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-gray-600 hover:text-red-500 shadow-xs"
                      aria-label="Wishlist"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          relWishlisted ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                    </button>

                    <Link href={`/product/${relProduct.id}`}>
                      <img
                        src={relProduct.image}
                        alt={relProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  </div>

                  <div className="p-3 flex flex-col justify-between flex-grow space-y-2">
                    <div>
                      <Link href={`/product/${relProduct.id}`}>
                        <h3 className="text-xs font-semibold text-gray-900 line-clamp-1 group-hover:text-[#6C307D] transition-colors">
                          {relProduct.name}
                        </h3>
                      </Link>
                      <span className="text-xs font-bold text-gray-900 mt-1 block">
                        ₹{relProduct.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(relProduct)}
                      className="w-full bg-[#F5F3EF] hover:bg-[#6C307D] text-gray-800 hover:text-white text-[10px] font-bold tracking-wider uppercase py-1.5 rounded-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      ADD TO BAG
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
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
