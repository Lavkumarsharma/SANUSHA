'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  Truck,
  RefreshCw,
  ShieldCheck,
  Star,
  ChevronRight,
  Minus,
  Plus,
  Share2,
  ChevronLeft,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toast } from '@/components/Toast';
import { useStore, PRODUCTS_DATA } from '@/store/useStore';
import { fetchApi } from '@/lib/api';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const { wishlist, toggleWishlist, addToCart, addToast } = useStore();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Sand Beige');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchApi(`/products/${productId}`)
      .then((data) => {
        if (data && data.name) {
          setProduct(data);
        } else {
          const found = PRODUCTS_DATA.find((p) => p.id === productId) || PRODUCTS_DATA[0];
          setProduct(found);
        }
      })
      .catch(() => {
        const found = PRODUCTS_DATA.find((p) => p.id === productId) || PRODUCTS_DATA[0];
        setProduct(found);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <AnnouncementBar />
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-12 text-xs font-bold text-gray-500">
          Loading Product Gallery & Details...
        </div>
        <Footer />
      </div>
    );
  }

  const isWishlisted = product ? wishlist.includes(product.id) : false;
  let gallery: string[] = ['/images/pdp_linen_main.jpg', '/images/prod_textured_shirt.jpg', '/images/hero_banner.jpg'];

  if (product?.galleryImages) {
    try {
      gallery = typeof product.galleryImages === 'string' ? JSON.parse(product.galleryImages) : product.galleryImages;
    } catch (e) {
      if (product.image) gallery = [product.image];
    }
  } else if (product?.image) {
    gallery = [product.image];
  }

  const sizes = product?.sizes || ['S', 'M', 'L', 'XL', 'XXL'];

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

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
            <Link href="/shop" className="hover:text-[#6C307D]">Shop</Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-900 font-bold">{product?.name}</span>
          </div>
        </div>

        {/* Product Details & Gallery Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Slide Image Gallery (Left 7 cols) */}
            <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
              {/* Vertical Thumbnail Strip */}
              <div className="flex sm:flex-col gap-3 shrink-0 overflow-x-auto sm:overflow-y-auto max-h-[550px]">
                {gallery.map((imgUrl: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-20 rounded-xs overflow-hidden border-2 transition-all shrink-0 relative ${
                      selectedImageIndex === idx ? 'border-[#6C307D] shadow-sm' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main Interactive Slide Viewer */}
              <div className="relative aspect-[3/4] w-full bg-[#FAF8F5] rounded-xs border border-[#EBE7DF] overflow-hidden group">
                <img
                  src={gallery[selectedImageIndex] || product?.image}
                  alt={product?.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />

                {/* Slider Navigation Arrows */}
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-800 hover:bg-[#6C307D] hover:text-white transition-colors"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-800 hover:bg-[#6C307D] hover:text-white transition-colors"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    
                    <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                      {selectedImageIndex + 1} / {gallery.length} Photos
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Product Metadata & Specifications (Right 5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold tracking-widest text-[#6C307D] uppercase">
                  {product?.badge || 'SANUSHA ESSENTIALS'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
                  {product?.name}
                </h1>
                
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{product?.price?.toLocaleString('en-IN')}
                  </span>
                  {product?.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product?.originalPrice?.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2 text-xs text-amber-500 font-semibold">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-gray-500">(128 Reviews)</span>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Size Swatches */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-900 uppercase">Select Size:</span>
                  <span className="text-[#6C307D] hover:underline cursor-pointer font-bold">Size Guide</span>
                </div>
                <div className="flex gap-2">
                  {sizes.map((sz: string) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`w-10 h-10 border rounded-xs text-xs font-bold transition-all ${
                        selectedSize === sz
                          ? 'border-[#6C307D] bg-[#6C307D] text-white shadow-xs'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400 bg-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-gray-900 uppercase">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-xs w-32 justify-between px-3 py-2 text-xs font-bold">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => addToCart(product, selectedSize, quantity, selectedColor)}
                  className="flex-1 bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  ADD TO BAG
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 border rounded-xs transition-colors ${
                    isWishlisted ? 'border-[#6C307D] text-[#6C307D] bg-purple-50' : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#6C307D]' : ''}`} />
                </button>
              </div>

              {/* Clothing Specifications & Features */}
              <div className="border border-[#EBE7DF] rounded-xs p-4 bg-[#FAF8F5] space-y-3 text-xs">
                <h3 className="font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">
                  Clothing Specifications & Details
                </h3>

                <div className="grid grid-cols-2 gap-2 text-gray-700 font-medium">
                  <div>
                    <span className="text-gray-400 font-bold block">Fabric Material</span>
                    <span className="font-semibold">{product?.material || '100% European Flax Linen'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block">Fit & Cut</span>
                    <span className="font-semibold">{product?.fit || 'Oversized Fit'}</span>
                  </div>
                </div>

                {product?.detailsBullets && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-900 font-bold block mb-1">Key Features:</span>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line text-[11px]">
                      {product.detailsBullets}
                    </p>
                  </div>
                )}
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
