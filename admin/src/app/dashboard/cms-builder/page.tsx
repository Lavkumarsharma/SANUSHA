'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Layers,
  Plus,
  Save,
  CheckCircle2,
  Trash2,
  Upload,
  Sparkles,
  LayoutTemplate,
  Type,
  Link2,
  Image as ImageIcon,
  Crop,
  X,
  Check,
  Wand2,
  Grid,
  Sliders,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Maximize2,
  Tv,
  Monitor,
} from 'lucide-react';
import { fetchApi, API_BASE_URL, getImageUrl } from '@/lib/api';

// ----------------------------------------------------
// SCROLLABLE & STICKY FOOTER CROPPER MODAL
// ----------------------------------------------------
interface ImageCropModalProps {
  imageSrc: string;
  onCropComplete: (croppedBase64: string) => void;
  onClose: () => void;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({ imageSrc, onCropComplete, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [crop, setCrop] = useState({ x: 0, y: 10, width: 100, height: 80 });
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialCrop, setInitialCrop] = useState({ x: 0, y: 10, width: 100, height: 80 });
  const [selectedRatio, setSelectedRatio] = useState<string>('16:9');
  const [isLocked, setIsLocked] = useState<boolean>(true);

  // Aspect ratio preset setter
  const applyRatioPreset = (ratioStr: string) => {
    setSelectedRatio(ratioStr);
    const img = imgRef.current;
    if (!img) return;

    if (ratioStr === '100%') {
      setCrop({ x: 0, y: 0, width: 100, height: 100 });
      return;
    }

    let targetRatio = 16 / 9; // Default 16:9 Homepage Hero
    if (ratioStr === '21:9') targetRatio = 21 / 9;
    if (ratioStr === '3:1') targetRatio = 3 / 1;
    if (ratioStr === '4:3') targetRatio = 4 / 3;
    if (ratioStr === '1:1') targetRatio = 1 / 1;

    const imgAspect = img.naturalWidth / img.naturalHeight;

    let newW = 95;
    let newH = (newW / targetRatio) * imgAspect;

    if (newH > 95) {
      newH = 95;
      newW = (newH * targetRatio) / imgAspect;
    }

    const newX = (100 - newW) / 2;
    const newY = (100 - newH) / 2;

    setCrop({
      x: Math.max(0, newX),
      y: Math.max(0, newY),
      width: Math.min(100, newW),
      height: Math.min(100, newH),
    });
  };

  const handleImageLoad = () => {
    applyRatioPreset('16:9');
  };

  const handleMouseDown = (handle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialCrop({ ...crop });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!activeHandle || !containerRef.current || !imgRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    const dxPercent = ((e.clientX - dragStart.x) / rect.width) * 100;
    const dyPercent = ((e.clientY - dragStart.y) / rect.height) * 100;

    let newCrop = { ...initialCrop };

    if (activeHandle === 'move') {
      newCrop.x = Math.max(0, Math.min(100 - initialCrop.width, initialCrop.x + dxPercent));
      newCrop.y = Math.max(0, Math.min(100 - initialCrop.height, initialCrop.y + dyPercent));
    } else {
      const imgAspect = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
      let targetRatio = 16 / 9;
      if (selectedRatio === '21:9') targetRatio = 21 / 9;
      if (selectedRatio === '3:1') targetRatio = 3 / 1;
      if (selectedRatio === '4:3') targetRatio = 4 / 3;
      if (selectedRatio === '1:1') targetRatio = 1 / 1;

      if (isLocked && selectedRatio !== '100%') {
        // Locked ratio dragging
        if (activeHandle.includes('e') || activeHandle.includes('s')) {
          const proposedW = Math.max(10, Math.min(100 - initialCrop.x, initialCrop.width + dxPercent));
          const proposedH = (proposedW / targetRatio) * imgAspect;
          if (initialCrop.y + proposedH <= 100) {
            newCrop.width = proposedW;
            newCrop.height = proposedH;
          }
        } else if (activeHandle.includes('w') || activeHandle.includes('n')) {
          const proposedW = Math.max(10, initialCrop.width - dxPercent);
          const proposedH = (proposedW / targetRatio) * imgAspect;
          if (initialCrop.x + (initialCrop.width - proposedW) >= 0 && initialCrop.y + (initialCrop.height - proposedH) >= 0) {
            newCrop.x = initialCrop.x + (initialCrop.width - proposedW);
            newCrop.y = initialCrop.y + (initialCrop.height - proposedH);
            newCrop.width = proposedW;
            newCrop.height = proposedH;
          }
        }
      } else {
        // Freeform resizing
        if (activeHandle.includes('e')) {
          newCrop.width = Math.max(5, Math.min(100 - initialCrop.x, initialCrop.width + dxPercent));
        }
        if (activeHandle.includes('s')) {
          newCrop.height = Math.max(5, Math.min(100 - initialCrop.y, initialCrop.height + dyPercent));
        }
        if (activeHandle.includes('w')) {
          const proposedW = initialCrop.width - dxPercent;
          if (proposedW > 5) {
            newCrop.x = Math.max(0, initialCrop.x + dxPercent);
            newCrop.width = proposedW;
          }
        }
        if (activeHandle.includes('n')) {
          const proposedH = initialCrop.height - dyPercent;
          if (proposedH > 5) {
            newCrop.y = Math.max(0, initialCrop.y + dyPercent);
            newCrop.height = proposedH;
          }
        }
      }
    }

    setCrop(newCrop);
  };

  const handleMouseUp = () => setActiveHandle(null);

  const handleApplyCrop = () => {
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    const cropX = (crop.x / 100) * img.width * scaleX;
    const cropY = (crop.y / 100) * img.height * scaleY;
    const cropW = (crop.width / 100) * img.width * scaleX;
    const cropH = (crop.height / 100) * img.height * scaleY;

    canvas.width = Math.max(1, Math.round(cropW));
    canvas.height = Math.max(1, Math.round(cropH));

    ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);
    const croppedBase64 = canvas.toDataURL('image/png', 1.0);
    onCropComplete(croppedBase64);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs" />
      
      {/* Modal Card with Max-Height and Scrollable Flex Layout */}
      <div className="relative bg-white rounded-xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl z-10 text-xs select-none overflow-hidden">
        
        {/* Sticky Header Bar */}
        <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white shrink-0 z-20">
          <div className="flex items-center gap-2">
            <Crop className="w-5 h-5 text-[#6C307D]" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Homepage Hero Banner Precision Aspect-Ratio Cropper</h3>
              <p className="text-[10px] text-slate-500 font-medium">Default locked crop (16:9) applied for optimal homepage quality & framing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer bg-slate-100 px-3 py-1.5 rounded border border-slate-300">
              <input
                type="checkbox"
                checked={isLocked}
                onChange={(e) => setIsLocked(e.target.checked)}
                className="w-4 h-4 text-[#6C307D] rounded focus:ring-0"
              />
              <span>🔒 Lock Aspect Ratio</span>
            </label>

            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Middle Content Area */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Aspect Ratio Presets Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-2 rounded-lg font-bold text-[11px]">
            <span className="text-slate-500 uppercase text-[9px] tracking-wider px-2">Hero Presets:</span>
            {[
              { label: '16:9 Hero (Homepage Default Locked)', val: '16:9', icon: Monitor },
              { label: '21:9 Ultrawide Banner', val: '21:9', icon: Tv },
              { label: '3:1 Panorama', val: '3:1', icon: Maximize2 },
              { label: '4:3 Standard', val: '4:3', icon: Monitor },
              { label: '100% Full Original', val: '100%', icon: Check },
            ].map((preset) => {
              const Icon = preset.icon;
              const isActive = selectedRatio === preset.val;
              return (
                <button
                  key={preset.val}
                  type="button"
                  onClick={() => applyRatioPreset(preset.val)}
                  className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#6C307D] text-white shadow-sm font-extrabold'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>

          {/* Canvas Cropper Area */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="relative bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center min-h-[300px] max-h-[360px] p-4"
          >
            <img
              ref={imgRef}
              src={imageSrc}
              onLoad={handleImageLoad}
              alt="Source"
              className="max-h-[320px] w-auto object-contain pointer-events-none"
            />

            <div
              style={{
                left: `${crop.x}%`,
                top: `${crop.y}%`,
                width: `${crop.width}%`,
                height: `${crop.height}%`,
              }}
              onMouseDown={(e) => handleMouseDown('move', e)}
              className="absolute border-2 border-purple-400 bg-purple-500/20 cursor-move shadow-2xl"
            >
              <div
                onMouseDown={(e) => handleMouseDown('nw', e)}
                className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-purple-600 rounded-full cursor-nwse-resize shadow hover:scale-125 transition-transform"
              />
              <div
                onMouseDown={(e) => handleMouseDown('ne', e)}
                className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-purple-600 rounded-full cursor-nesw-resize shadow hover:scale-125 transition-transform"
              />
              <div
                onMouseDown={(e) => handleMouseDown('sw', e)}
                className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-purple-600 rounded-full cursor-nesw-resize shadow hover:scale-125 transition-transform"
              />
              <div
                onMouseDown={(e) => handleMouseDown('se', e)}
                className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-purple-600 rounded-full cursor-nwse-resize shadow hover:scale-125 transition-transform"
              />

              <div
                onMouseDown={(e) => handleMouseDown('n', e)}
                className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-white border border-purple-600 rounded-xs cursor-ns-resize shadow"
              />
              <div
                onMouseDown={(e) => handleMouseDown('s', e)}
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-white border border-purple-600 rounded-xs cursor-ns-resize shadow"
              />
              <div
                onMouseDown={(e) => handleMouseDown('w', e)}
                className="absolute top-1/2 -translate-y-1/2 -left-1.5 h-8 w-3 bg-white border border-purple-600 rounded-xs cursor-ew-resize shadow"
              />
              <div
                onMouseDown={(e) => handleMouseDown('e', e)}
                className="absolute top-1/2 -translate-y-1/2 -right-1.5 h-8 w-3 bg-white border border-purple-600 rounded-xs cursor-ew-resize shadow"
              />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-slate-900/90 text-white font-bold text-[10px] px-2.5 py-1 rounded shadow uppercase tracking-wider flex items-center gap-1">
                  🔒 {selectedRatio} HOMEPAGE HERO LOCKED CROP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Always Visible 100% Sticky Bottom Action Footer */}
        <div className="p-4 px-5 border-t bg-slate-50 flex items-center justify-end gap-3 shrink-0 z-20">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-300 rounded-md font-bold uppercase hover:bg-slate-200 text-slate-700 bg-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            className="px-7 py-2.5 bg-[#6C307D] hover:bg-[#522061] text-white rounded-md font-bold uppercase shadow-md flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Save High Quality Cropped Hero
          </button>
        </div>

      </div>
    </div>
  );
};

export default function CMSPageBuilderPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  // Multi-Slide Hero Banners State
  const [heroSlides, setHeroSlides] = useState<any[]>([
    {
      id: 'slide-1',
      title: 'TIMELESS ELEGANCE & MODERN PURITY',
      subtitle: 'Hand-crafted luxury linen, refined silhouettes, and conscious fashion.',
      badgeText: 'LUXURY EDIT 2026',
      bannerUrl: '/images/hero_banner.jpg',
      buttonText: 'SHOP THE COLLECTION',
      buttonLink: '/shop',
      showOverlay: true,
      active: true,
    },
    {
      id: 'slide-2',
      title: 'RESORT & SUMMER LUXURY CO-ORDS',
      subtitle: 'Breezy European flax linen sets designed for sun-soaked getaways.',
      badgeText: 'SUMMER ESSENTIALS',
      bannerUrl: '/images/summer_banner_model.jpg',
      buttonText: 'EXPLORE RESORTWEAR',
      buttonLink: '/shop?category=Resortwear',
      showOverlay: true,
      active: true,
    },
  ]);

  // Cropper Modal State
  const [cropModalData, setCropModalData] = useState<{
    src: string;
    targetField: 'icon' | 'logo' | 'section' | 'megaBanner' | 'heroSlide';
    sectionIndex?: number;
    slideIndex?: number;
  } | null>(null);

  // Full Header, Navigation & Mega Menu State
  const [headerConfig, setHeaderConfig] = useState({
    announcementText1: 'FREE SHIPPING ON ORDERS OVER ₹999',
    announcementText2: 'EASY RETURNS',
    announcementText3: 'COD AVAILABLE',
    brandName: 'SANUSHA',
    iconUrl: '',
    logoUrl: '',
    navItems: [
      { id: '1', label: 'SHOP', url: '/shop', hasDropdown: true },
      { id: '2', label: 'NEW ARRIVALS', url: '/shop', hasDropdown: false },
      { id: '3', label: 'COLLECTIONS', url: '/shop', hasDropdown: false },
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
  });

  // Footer Editorial State
  const [footerConfig, setFooterConfig] = useState({
    brandDescription: 'Timeless fashion, crafted with purpose. Designed to empower. Made to last.',
    col1Title: 'SHOP',
    col1Links: [
      { id: '1', label: 'All Products', url: '/shop' },
      { id: '2', label: "Women's Collection", url: '/category/women' },
      { id: '3', label: "Men's Collection", url: '/category/men' },
      { id: '4', label: 'New Arrivals', url: '/shop' },
    ],
    col2Title: 'CUSTOMER CARE',
    col2Links: [
      { id: '1', label: 'My Account', url: '/account' },
      { id: '2', label: 'Wishlist', url: '/wishlist' },
      { id: '3', label: 'Shopping Cart', url: '/cart' },
    ],
    newsletterTitle: 'NEWSLETTER',
    newsletterSubtitle: 'Subscribe & get 10% off your first order.',
    newsletterButtonText: 'JOIN',
    copyrightText: '© 2026 SANUSHA Enterprise Platform. All rights reserved.',
  });

  // New Custom Section Modal State
  const [isNewSectionModalOpen, setIsNewSectionModalOpen] = useState(false);
  const [newSectionData, setNewSectionData] = useState({
    key: 'festive_drop_' + Date.now(),
    title: 'Festive & Celebration Collection',
    subtitle: 'Hand-crafted luxury garments designed for your special occasions',
    bannerUrl: '/images/hero_banner.jpg',
    buttonText: 'EXPLORE FESTIVE COLLECTION',
    buttonLink: '/shop?category=Festive',
    layout: 'Hero Banner',
    visible: true,
  });

  const loadCMSData = () => {
    setLoading(true);
    Promise.all([
      fetchApi('/cms/sections').catch(() => []),
      fetchApi('/cms/header').catch(() => null),
      fetchApi('/cms/footer').catch(() => null),
      fetchApi('/cms/hero').catch(() => null),
    ])
      .then(([secs, hdr, ftr, hero]) => {
        if (secs && secs.length > 0) setSections(secs);
        if (hero && Array.isArray(hero) && hero.length > 0) setHeroSlides(hero);
        if (hdr && hdr.brandName) {
          setHeaderConfig((prev) => ({
            ...prev,
            ...hdr,
            announcementText1: hdr.announcementText1 || prev.announcementText1,
            announcementText2: hdr.announcementText2 || prev.announcementText2,
            announcementText3: hdr.announcementText3 || prev.announcementText3,
            brandName: hdr.brandName || prev.brandName,
            iconUrl: hdr.iconUrl || '',
            logoUrl: hdr.logoUrl || '',
            navItems: hdr.navItems || prev.navItems,
            megaMenuColumns: hdr.megaMenuColumns || prev.megaMenuColumns,
            megaMenuBanner: {
              imageUrl: hdr.megaMenuBanner?.imageUrl || prev.megaMenuBanner?.imageUrl || '/images/cat_women.jpg',
              title: hdr.megaMenuBanner?.title || prev.megaMenuBanner?.title || 'NEW SEASON',
              subtitle: hdr.megaMenuBanner?.subtitle || prev.megaMenuBanner?.subtitle || 'Modern Linen',
              linkUrl: hdr.megaMenuBanner?.linkUrl || prev.megaMenuBanner?.linkUrl || '/shop',
            },
          }));
        }
        if (ftr && ftr.brandDescription) setFooterConfig(ftr);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCMSData();
  }, []);

  const handleSaveHeroSlides = async () => {
    try {
      await fetchApi('/cms/hero', {
        method: 'PUT',
        body: JSON.stringify(heroSlides),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      loadCMSData();
    } catch (err: any) {
      alert(err.message || 'Failed to save hero slides');
    }
  };

  const handleAddHeroSlide = () => {
    const newSlide = {
      id: 'slide-' + Date.now(),
      title: '',
      subtitle: '',
      badgeText: '',
      bannerUrl: '/images/hero_banner.jpg',
      buttonText: '',
      buttonLink: '/shop',
      showOverlay: false,
      active: true,
    };
    setHeroSlides([...heroSlides, newSlide]);
  };

  const handleUpdateHeroSlide = (index: number, field: string, value: any) => {
    const updated = [...heroSlides];
    updated[index] = { ...updated[index], [field]: value };
    setHeroSlides(updated);
  };

  const handleDeleteHeroSlide = (index: number) => {
    if (heroSlides.length <= 1) {
      alert('You must keep at least 1 hero banner slide.');
      return;
    }
    const updated = heroSlides.filter((_, i) => i !== index);
    setHeroSlides(updated);
  };

  const handleMoveHeroSlide = (index: number, direction: 'up' | 'down') => {
    const updated = [...heroSlides];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setHeroSlides(updated);
  };

  const handleSaveHeaderEditorial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/cms/header', {
        method: 'PUT',
        body: JSON.stringify(headerConfig),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      loadCMSData();
    } catch (err: any) {
      alert(err.message || 'Failed to save header settings');
    }
  };

  const handleSaveFooterEditorial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/cms/footer', {
        method: 'PUT',
        body: JSON.stringify(footerConfig),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      loadCMSData();
    } catch (err: any) {
      alert(err.message || 'Failed to save footer settings');
    }
  };

  // Direct High-Res Original File Upload without Crop
  const handleUploadOriginalFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'icon' | 'logo' | 'section' | 'megaBanner' | 'heroSlide',
    sectionIndex?: number,
    slideIndex?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Immediately create a base64 data URL for cross-device compatibility
    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      if (base64Url) {
        if (field === 'heroSlide' && typeof slideIndex === 'number') {
          handleUpdateHeroSlide(slideIndex, 'bannerUrl', base64Url);
        }
        if (field === 'icon') setHeaderConfig((prev) => ({ ...prev, iconUrl: base64Url }));
        if (field === 'logo') setHeaderConfig((prev) => ({ ...prev, logoUrl: base64Url }));
        if (field === 'megaBanner') {
          setHeaderConfig((prev) => ({
            ...prev,
            megaMenuBanner: { ...(prev.megaMenuBanner || {}), imageUrl: base64Url },
          }));
        }
        if (field === 'section' && typeof sectionIndex === 'number') {
          handleUpdateSection(sectionIndex, 'bannerUrl', base64Url);
        }
      }
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText', file.name);

    try {
      setUploading(field);
      const res = await fetch(`${API_BASE_URL}/media/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('sanusha_token') || ''}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        if (field === 'heroSlide' && typeof slideIndex === 'number') {
          handleUpdateHeroSlide(slideIndex, 'bannerUrl', data.url);
        }
        if (field === 'icon') setHeaderConfig((prev) => ({ ...prev, iconUrl: data.url }));
        if (field === 'logo') setHeaderConfig((prev) => ({ ...prev, logoUrl: data.url }));
        if (field === 'megaBanner') {
          setHeaderConfig((prev) => ({
            ...prev,
            megaMenuBanner: { ...(prev.megaMenuBanner || {}), imageUrl: data.url },
          }));
        }
        if (field === 'section' && typeof sectionIndex === 'number') {
          handleUpdateSection(sectionIndex, 'bannerUrl', data.url);
        }
      }
    } catch (err: any) {
      console.warn('Backend file upload fallback to base64 data URL:', err);
    } finally {
      setUploading(null);
    }
  };

  // Upload Base64 Cropped Image
  const uploadCroppedImage = async (
    base64: string,
    field: 'icon' | 'logo' | 'section' | 'megaBanner' | 'heroSlide',
    sectionIndex?: number,
    slideIndex?: number
  ) => {
    // Immediately apply base64 image locally to ensure cross-device consistency
    if (base64) {
      if (field === 'icon') setHeaderConfig((prev) => ({ ...prev, iconUrl: base64 }));
      if (field === 'logo') setHeaderConfig((prev) => ({ ...prev, logoUrl: base64 }));
      if (field === 'megaBanner') {
        setHeaderConfig((prev) => ({
          ...prev,
          megaMenuBanner: { ...(prev.megaMenuBanner || {}), imageUrl: base64 },
        }));
      }
      if (field === 'heroSlide' && typeof slideIndex === 'number') {
        handleUpdateHeroSlide(slideIndex, 'bannerUrl', base64);
      }
      if (field === 'section' && typeof sectionIndex === 'number') {
        handleUpdateSection(sectionIndex, 'bannerUrl', base64);
      }
    }

    try {
      setUploading(field);
      const res = await fetch(`${API_BASE_URL}/media/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('sanusha_token') || ''}`,
        },
        body: JSON.stringify({
          imageBase64: base64,
          filename: `cropped-${field}-${Date.now()}.png`,
          altText: `Cropped ${field}`,
        }),
      });
      const data = await res.json();
      if (data.url) {
        if (field === 'icon') setHeaderConfig((prev) => ({ ...prev, iconUrl: data.url }));
        if (field === 'logo') setHeaderConfig((prev) => ({ ...prev, logoUrl: data.url }));
        if (field === 'megaBanner') {
          setHeaderConfig((prev) => ({
            ...prev,
            megaMenuBanner: { ...(prev.megaMenuBanner || {}), imageUrl: data.url },
          }));
        }
        if (field === 'heroSlide' && typeof slideIndex === 'number') {
          handleUpdateHeroSlide(slideIndex, 'bannerUrl', data.url);
        }
        if (field === 'section' && typeof sectionIndex === 'number') {
          handleUpdateSection(sectionIndex, 'bannerUrl', data.url);
        }
      }
    } catch (err: any) {
      console.warn('Cropped image upload fallback to base64:', err);
    } finally {
      setUploading(null);
      setCropModalData(null);
    }
  };

  const handleSelectFileForCropper = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'icon' | 'logo' | 'section' | 'megaBanner' | 'heroSlide',
    sectionIndex?: number,
    slideIndex?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropModalData({
        src: reader.result as string,
        targetField: field,
        sectionIndex,
        slideIndex,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveIcon = () => setHeaderConfig({ ...headerConfig, iconUrl: '' });
  const handleRemoveLogo = () => setHeaderConfig({ ...headerConfig, logoUrl: '' });

  // Nav Item Handlers
  const handleAddNavItem = () => {
    const newItem = {
      id: Date.now().toString(),
      label: 'NEW LINK',
      url: '/shop',
      hasDropdown: false,
    };
    setHeaderConfig({
      ...headerConfig,
      navItems: [...headerConfig.navItems, newItem],
    });
  };

  const handleUpdateNavItem = (index: number, field: string, value: any) => {
    const updated = [...headerConfig.navItems];
    updated[index] = { ...updated[index], [field]: value };
    setHeaderConfig({ ...headerConfig, navItems: updated });
  };

  const handleDeleteNavItem = (index: number) => {
    const updated = headerConfig.navItems.filter((_, i) => i !== index);
    setHeaderConfig({ ...headerConfig, navItems: updated });
  };

  // Mega Menu Column & Sub-Link Handlers
  const handleAddMegaColumn = () => {
    const newCol = {
      id: 'col-' + Date.now(),
      title: 'NEW CATEGORY',
      links: [
        { id: 'link-1', label: 'View All', url: '/shop' },
        { id: 'link-2', label: 'Featured Subcategory', url: '/shop' },
      ],
    };
    setHeaderConfig({
      ...headerConfig,
      megaMenuColumns: [...(headerConfig.megaMenuColumns || []), newCol],
    });
  };

  const handleUpdateColumnTitle = (colIndex: number, title: string) => {
    const updated = [...(headerConfig.megaMenuColumns || [])];
    updated[colIndex].title = title;
    setHeaderConfig({ ...headerConfig, megaMenuColumns: updated });
  };

  const handleDeleteColumn = (colIndex: number) => {
    const updated = (headerConfig.megaMenuColumns || []).filter((_, i) => i !== colIndex);
    setHeaderConfig({ ...headerConfig, megaMenuColumns: updated });
  };

  const handleAddSubLink = (colIndex: number) => {
    const updated = [...(headerConfig.megaMenuColumns || [])];
    const newLink = { id: 'link-' + Date.now(), label: 'New Sub Link', url: '/shop' };
    updated[colIndex].links.push(newLink);
    setHeaderConfig({ ...headerConfig, megaMenuColumns: updated });
  };

  const handleUpdateSubLink = (colIndex: number, linkIndex: number, field: string, value: string) => {
    const updated = [...(headerConfig.megaMenuColumns || [])];
    updated[colIndex].links[linkIndex] = {
      ...updated[colIndex].links[linkIndex],
      [field]: value,
    };
    setHeaderConfig({ ...headerConfig, megaMenuColumns: updated });
  };

  const handleDeleteSubLink = (colIndex: number, linkIndex: number) => {
    const updated = [...(headerConfig.megaMenuColumns || [])];
    updated[colIndex].links = updated[colIndex].links.filter((_, i) => i !== linkIndex);
    setHeaderConfig({ ...headerConfig, megaMenuColumns: updated });
  };

  // Footer Col 1 Links Handlers
  const handleAddFooterCol1Link = () => {
    const newItem = { id: Date.now().toString(), label: 'New Link', url: '/shop' };
    setFooterConfig({ ...footerConfig, col1Links: [...footerConfig.col1Links, newItem] });
  };
  const handleUpdateFooterCol1Link = (index: number, field: string, value: string) => {
    const updated = [...footerConfig.col1Links];
    updated[index] = { ...updated[index], [field]: value };
    setFooterConfig({ ...footerConfig, col1Links: updated });
  };
  const handleDeleteFooterCol1Link = (index: number) => {
    const updated = footerConfig.col1Links.filter((_, i) => i !== index);
    setFooterConfig({ ...footerConfig, col1Links: updated });
  };

  // Footer Col 2 Links Handlers
  const handleAddFooterCol2Link = () => {
    const newItem = { id: Date.now().toString(), label: 'New Link', url: '/shop' };
    setFooterConfig({ ...footerConfig, col2Links: [...footerConfig.col2Links, newItem] });
  };
  const handleUpdateFooterCol2Link = (index: number, field: string, value: string) => {
    const updated = [...footerConfig.col2Links];
    updated[index] = { ...updated[index], [field]: value };
    setFooterConfig({ ...footerConfig, col2Links: updated });
  };
  const handleDeleteFooterCol2Link = (index: number) => {
    const updated = footerConfig.col2Links.filter((_, i) => i !== index);
    setFooterConfig({ ...footerConfig, col2Links: updated });
  };

  // Section Handlers
  const handleUpdateSection = (index: number, field: string, value: any) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  };

  const handleDeleteSection = async (key: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      try {
        await fetchApi(`/cms/sections/${key}`, { method: 'DELETE' });
        loadCMSData();
      } catch (e: any) {
        alert(e.message || 'Failed to delete section');
      }
    }
  };

  const handleSaveAllSections = async () => {
    try {
      for (const sec of sections) {
        await fetchApi(`/cms/sections/${sec.key}`, {
          method: 'PUT',
          body: JSON.stringify(sec),
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      loadCMSData();
    } catch (err: any) {
      alert(err.message || 'Failed to save sections');
    }
  };

  const handleCreateNewSection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newSec = { ...newSectionData, key: 'custom_sec_' + Date.now() };
      await fetchApi(`/cms/sections/${newSec.key}`, {
        method: 'PUT',
        body: JSON.stringify(newSec),
      });
      setIsNewSectionModalOpen(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      loadCMSData();
    } catch (err: any) {
      alert(err.message || 'Failed to create section');
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hero Banners, Header & CMS Page Builder Editorial</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Full control over hero banner proportions, presets, dual logos, navigation links & footer
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saved && (
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> All Content Synced Live!
            </span>
          )}

          <button
            onClick={() => setIsNewSectionModalOpen(true)}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 text-purple-400" />
            + New Section
          </button>
        </div>
      </div>

      {/* MODULE 0: DEDICATED HOMEPAGE HERO BANNERS & MULTI-SLIDE SLIDER MANAGER */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6 text-xs font-medium">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#6C307D]" />
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Homepage Hero Banners & Multi-Slide Slider Manager</h2>
              <p className="text-[10px] text-slate-500 font-medium">Precision aspect-ratio crop presets (16:9 Hero, 21:9 Ultrawide, 3:1 Panorama) & 100% original upload.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddHeroSlide}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-md shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-purple-300" /> + Add Hero Banner
            </button>
            <button
              type="button"
              onClick={handleSaveHeroSlides}
              className="bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-md shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Hero Slider
            </button>
          </div>
        </div>

        {/* Hero Slides List */}
        <div className="space-y-4">
          {heroSlides.map((slide, sIdx) => (
            <div key={slide.id || sIdx} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#6C307D] text-white font-bold px-2.5 py-1 rounded text-[10px]">
                    SLIDE #{sIdx + 1}
                  </span>
                  <span className="font-bold text-slate-900 text-xs">
                    {slide.title || 'Full Original Hero Banner'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer bg-white px-2.5 py-1 rounded border border-slate-300">
                    <input
                      type="checkbox"
                      checked={slide.showOverlay !== false}
                      onChange={(e) => handleUpdateHeroSlide(sIdx, 'showOverlay', e.target.checked)}
                      className="w-4 h-4 text-[#6C307D] rounded focus:ring-0"
                    />
                    <span>Dark Text Overlay</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleUpdateHeroSlide(sIdx, 'active', !slide.active)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 border ${
                      slide.active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-200 text-slate-600 border-slate-300'
                    }`}
                  >
                    {slide.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{slide.active ? 'Active' : 'Hidden'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={sIdx === 0}
                    onClick={() => handleMoveHeroSlide(sIdx, 'up')}
                    className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={sIdx === heroSlides.length - 1}
                    onClick={() => handleMoveHeroSlide(sIdx, 'down')}
                    className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteHeroSlide(sIdx)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Slide Content Editors */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                
                {/* Slide Background Image Uploader */}
                <div className="md:col-span-5 space-y-2">
                  <label className="block font-bold text-slate-800">Slide Background Banner Image</label>
                  <div className="relative aspect-[16/9] bg-slate-900 rounded-lg overflow-hidden border border-slate-300 shadow-2xs group">
                    <img src={getImageUrl(slide.bannerUrl)} alt="Slide Preview" className="w-full h-full object-cover" />
                    
                    <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3 text-white">
                      <label className="cursor-pointer bg-[#6C307D] hover:bg-[#522061] text-white font-bold text-[10px] px-3 py-2 rounded uppercase tracking-wider flex items-center gap-1.5 shadow">
                        <Crop className="w-3.5 h-3.5" />
                        <span>Precision Ratio Crop</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSelectFileForCropper(e, 'heroSlide', undefined, sIdx)}
                          className="hidden"
                        />
                      </label>

                      <label className="cursor-pointer bg-slate-700 hover:bg-slate-800 text-white font-bold text-[10px] px-3 py-2 rounded uppercase tracking-wider flex items-center gap-1.5 shadow">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload 100% Original File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadOriginalFile(e, 'heroSlide', undefined, sIdx)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Recommended: Click <b>"Precision Ratio Crop"</b> to snap to exact <b>16:9 Hero</b> or <b>21:9 Ultrawide</b> proportions!
                  </p>
                </div>

                {/* Text Fields */}
                <div className="md:col-span-7 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-800 mb-1">Headline Title (Optional)</label>
                      <input
                        type="text"
                        value={slide.title || ''}
                        onChange={(e) => handleUpdateHeroSlide(sIdx, 'title', e.target.value)}
                        placeholder="Leave empty if text is built into photo"
                        className="w-full border border-slate-300 rounded p-2.5 font-bold text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Top Badge Tag (Optional)</label>
                      <input
                        type="text"
                        value={slide.badgeText || ''}
                        onChange={(e) => handleUpdateHeroSlide(sIdx, 'badgeText', e.target.value)}
                        placeholder="e.g. LUXURY EDIT 2026"
                        className="w-full border border-slate-300 rounded p-2.5 font-bold text-purple-700 bg-white uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Subtitle Description (Optional)</label>
                    <textarea
                      rows={2}
                      value={slide.subtitle || ''}
                      onChange={(e) => handleUpdateHeroSlide(sIdx, 'subtitle', e.target.value)}
                      placeholder="Leave empty if text is built into photo"
                      className="w-full border border-slate-300 rounded p-2.5 text-slate-900 bg-white font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">CTA Button Label (Optional)</label>
                      <input
                        type="text"
                        value={slide.buttonText || ''}
                        onChange={(e) => handleUpdateHeroSlide(sIdx, 'buttonText', e.target.value)}
                        placeholder="e.g. SHOP THE COLLECTION"
                        className="w-full border border-slate-300 rounded p-2 font-bold text-slate-900 bg-white uppercase"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">CTA Button Target Link</label>
                      <input
                        type="text"
                        value={slide.buttonLink || ''}
                        onChange={(e) => handleUpdateHeroSlide(sIdx, 'buttonLink', e.target.value)}
                        placeholder="e.g. /shop"
                        className="w-full border border-slate-300 rounded p-2 text-slate-900 bg-white"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODULE 1: HEADER, DUAL LOGO & MEGA DROPDOWNS EDITORIAL */}
      <form onSubmit={handleSaveHeaderEditorial} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6 text-xs font-medium">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-[#6C307D]" />
            <h2 className="font-bold text-slate-900 text-sm">Header, Brand Logo & Dynamic Navigation</h2>
          </div>
          <button
            type="submit"
            className="bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-md shadow-xs transition-colors"
          >
            Save Header Settings
          </button>
        </div>

        {/* Dual Logo Uploaders & Brand Title */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
          
          {/* 1. Icon Symbol Uploader */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800">1. Brand Icon / Symbol (Free Crop)</label>
            <div className="flex items-center gap-3 bg-white p-3 border border-slate-300 rounded-lg">
              {getImageUrl(headerConfig.iconUrl) ? (
                <div className="relative group shrink-0">
                  <img
                    src={getImageUrl(headerConfig.iconUrl)}
                    alt="Icon"
                    className="h-10 w-10 object-contain bg-slate-100 p-1 rounded border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveIcon}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 shadow hover:bg-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="h-10 w-10 bg-slate-100 border border-dashed rounded flex items-center justify-center text-slate-400 font-bold shrink-0">
                  <ImageIcon className="w-4 h-4 text-slate-400" />
                </div>
              )}

              <label className="cursor-pointer bg-slate-900 text-white text-[10px] font-bold px-3 py-2 rounded hover:bg-slate-800 transition-colors uppercase flex items-center gap-1">
                <Crop className="w-3.5 h-3.5 text-purple-300" />
                <span>{uploading === 'icon' ? 'Saving...' : 'Crop & Upload'}</span>
                <input type="file" accept="image/*" onChange={(e) => handleSelectFileForCropper(e, 'icon')} className="hidden" />
              </label>
            </div>
          </div>

          {/* 2. Logo Wordmark Image Uploader */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800">2. Brand Logo Image (Free Crop & Trim)</label>
            <div className="flex items-center gap-3 bg-white p-3 border border-slate-300 rounded-lg">
              {getImageUrl(headerConfig.logoUrl) ? (
                <div className="relative group shrink-0">
                  <img
                    src={getImageUrl(headerConfig.logoUrl)}
                    alt="Logo"
                    className="h-10 w-24 object-contain bg-slate-100 p-1 rounded border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 shadow hover:bg-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="h-10 w-24 bg-slate-100 border border-dashed rounded flex items-center justify-center text-slate-400 text-[10px] font-bold shrink-0">
                  NO LOGO
                </div>
              )}

              <label className="cursor-pointer bg-[#6C307D] text-white text-[10px] font-bold px-3 py-2 rounded hover:bg-[#522061] transition-colors uppercase flex items-center gap-1">
                <Crop className="w-3.5 h-3.5 text-white" />
                <span>{uploading === 'logo' ? 'Saving...' : 'Crop & Upload'}</span>
                <input type="file" accept="image/*" onChange={(e) => handleSelectFileForCropper(e, 'logo')} className="hidden" />
              </label>
            </div>
          </div>

          {/* 3. Brand Text Title */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800">3. Brand Text Title (Fallback)</label>
            <input
              type="text"
              value={headerConfig.brandName || ''}
              onChange={(e) => setHeaderConfig({ ...headerConfig, brandName: e.target.value })}
              placeholder="e.g. SANUSHA"
              className="w-full border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 bg-white"
            />
          </div>

        </div>

        {/* Dynamic Navigation Menu Items Manager */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Dynamic Top Navigation Bar Links
            </span>
            <button
              type="button"
              onClick={handleAddNavItem}
              className="text-[#6C307D] font-bold text-xs hover:underline flex items-center gap-1"
            >
              + Add Nav Item
            </button>
          </div>

          <div className="space-y-2">
            {headerConfig.navItems.map((item, idx) => (
              <div key={item.id || idx} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-400 w-6 text-center">#{idx + 1}</span>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={item.label || ''}
                    onChange={(e) => handleUpdateNavItem(idx, 'label', e.target.value)}
                    placeholder="Link Label (e.g. SHOP)"
                    className="border border-slate-300 rounded p-2 font-bold text-slate-900 uppercase bg-white"
                  />
                  <input
                    type="text"
                    value={item.url || ''}
                    onChange={(e) => handleUpdateNavItem(idx, 'url', e.target.value)}
                    placeholder="Target URL (e.g. /shop)"
                    className="border border-slate-300 rounded p-2 text-slate-900 bg-white"
                  />
                </div>

                <label className="flex items-center gap-1.5 text-slate-700 text-[11px] font-bold cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={item.hasDropdown || false}
                    onChange={(e) => handleUpdateNavItem(idx, 'hasDropdown', e.target.checked)}
                    className="w-4 h-4 text-[#6C307D] rounded focus:ring-0"
                  />
                  <span>Mega Dropdown</span>
                </label>

                <button
                  type="button"
                  onClick={() => handleDeleteNavItem(idx)}
                  className="text-red-500 hover:text-red-700 p-1 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* MODULE 1B: MEGA MENU DROPDOWNS & SUB-LINKS MANAGER */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-[#6C307D]" />
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Mega Dropdown Columns & Sub-Links Manager
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddMegaColumn}
              className="bg-[#6C307D] text-white font-bold text-xs px-3 py-1.5 rounded hover:bg-[#522061] transition-colors"
            >
              + Add Dropdown Column
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(headerConfig.megaMenuColumns || []).map((col, cIdx) => (
              <div key={col.id || cIdx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <input
                    type="text"
                    value={col.title || ''}
                    onChange={(e) => handleUpdateColumnTitle(cIdx, e.target.value)}
                    className="font-bold text-slate-900 uppercase bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                    placeholder="Column Title (e.g. WOMEN)"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteColumn(cIdx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Sub Links */}
                <div className="space-y-2">
                  {(col.links || []).map((link, lIdx) => (
                    <div key={link.id || lIdx} className="flex items-center gap-2 bg-white p-2 rounded border border-slate-200">
                      <input
                        type="text"
                        value={link.label || ''}
                        onChange={(e) => handleUpdateSubLink(cIdx, lIdx, 'label', e.target.value)}
                        placeholder="Link Name"
                        className="flex-1 border border-slate-300 rounded p-1 text-slate-900 font-medium text-[11px]"
                      />
                      <input
                        type="text"
                        value={link.url || ''}
                        onChange={(e) => handleUpdateSubLink(cIdx, lIdx, 'url', e.target.value)}
                        placeholder="URL"
                        className="flex-1 border border-slate-300 rounded p-1 text-slate-900 text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteSubLink(cIdx, lIdx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleAddSubLink(cIdx)}
                    className="text-[#6C307D] font-bold text-[11px] hover:underline block pt-1"
                  >
                    + Add Sub-Link
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mega Menu Promo Banner Tile */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <span className="font-bold text-slate-900 text-xs block border-b pb-2">
              Mega Menu 4th Column Promo Banner Tile
            </span>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="flex items-center gap-3">
                <img
                  src={getImageUrl(headerConfig.megaMenuBanner?.imageUrl) || '/images/cat_women.jpg'}
                  alt="Banner"
                  className="w-16 h-16 object-cover rounded border"
                />
                <label className="cursor-pointer bg-slate-900 text-white text-[10px] font-bold px-3 py-2 rounded hover:bg-slate-800 transition-colors uppercase">
                  Crop & Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSelectFileForCropper(e, 'megaBanner')}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Banner Title</label>
                <input
                  type="text"
                  value={headerConfig.megaMenuBanner?.title || ''}
                  onChange={(e) =>
                    setHeaderConfig({
                      ...headerConfig,
                      megaMenuBanner: { ...(headerConfig.megaMenuBanner || {}), title: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded p-2 text-slate-900 bg-white uppercase font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Banner Subtitle</label>
                <input
                  type="text"
                  value={headerConfig.megaMenuBanner?.subtitle || ''}
                  onChange={(e) =>
                    setHeaderConfig({
                      ...headerConfig,
                      megaMenuBanner: { ...(headerConfig.megaMenuBanner || {}), subtitle: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded p-2 text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Link URL</label>
                <input
                  type="text"
                  value={headerConfig.megaMenuBanner?.linkUrl || ''}
                  onChange={(e) =>
                    setHeaderConfig({
                      ...headerConfig,
                      megaMenuBanner: { ...(headerConfig.megaMenuBanner || {}), linkUrl: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded p-2 text-slate-900 bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* MODULE 2: DETAILED FOOTER EDITORIAL MANAGER */}
      <form onSubmit={handleSaveFooterEditorial} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6 text-xs font-medium">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-[#6C307D]" />
            <h2 className="font-bold text-slate-900 text-sm">Detailed Footer Editorial & Links Manager</h2>
          </div>
          <button
            type="submit"
            className="bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-md shadow-xs transition-colors"
          >
            Save Footer Editorial
          </button>
        </div>

        {/* Brand Tagline & Copyright */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block font-bold text-slate-800 mb-1">Brand Tagline Description</label>
            <textarea
              rows={2}
              value={footerConfig.brandDescription || ''}
              onChange={(e) => setFooterConfig({ ...footerConfig, brandDescription: e.target.value })}
              className="w-full border border-slate-300 rounded p-2.5 text-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Copyright Bottom Notice</label>
            <textarea
              rows={2}
              value={footerConfig.copyrightText || ''}
              onChange={(e) => setFooterConfig({ ...footerConfig, copyrightText: e.target.value })}
              className="w-full border border-slate-300 rounded p-2.5 text-slate-900 bg-white"
            />
          </div>
        </div>

        {/* Footer Link Columns 1 & 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1 Links */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-2">
              <input
                type="text"
                value={footerConfig.col1Title || ''}
                onChange={(e) => setFooterConfig({ ...footerConfig, col1Title: e.target.value })}
                className="font-bold text-slate-900 uppercase bg-transparent text-xs border border-slate-300 rounded px-2 py-1"
              />
              <button
                type="button"
                onClick={handleAddFooterCol1Link}
                className="text-[#6C307D] font-bold text-xs hover:underline"
              >
                + Add Link
              </button>
            </div>

            <div className="space-y-2">
              {(footerConfig.col1Links || []).map((link, idx) => (
                <div key={link.id || idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={link.label || ''}
                    onChange={(e) => handleUpdateFooterCol1Link(idx, 'label', e.target.value)}
                    placeholder="Link Name"
                    className="flex-1 border border-slate-300 rounded p-1.5 text-slate-900 bg-white"
                  />
                  <input
                    type="text"
                    value={link.url || ''}
                    onChange={(e) => handleUpdateFooterCol1Link(idx, 'url', e.target.value)}
                    placeholder="URL"
                    className="flex-1 border border-slate-300 rounded p-1.5 text-slate-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteFooterCol1Link(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 Links */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-2">
              <input
                type="text"
                value={footerConfig.col2Title || ''}
                onChange={(e) => setFooterConfig({ ...footerConfig, col2Title: e.target.value })}
                className="font-bold text-slate-900 uppercase bg-transparent text-xs border border-slate-300 rounded px-2 py-1"
              />
              <button
                type="button"
                onClick={handleAddFooterCol2Link}
                className="text-[#6C307D] font-bold text-xs hover:underline"
              >
                + Add Link
              </button>
            </div>

            <div className="space-y-2">
              {(footerConfig.col2Links || []).map((link, idx) => (
                <div key={link.id || idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={link.label || ''}
                    onChange={(e) => handleUpdateFooterCol2Link(idx, 'label', e.target.value)}
                    placeholder="Link Name"
                    className="flex-1 border border-slate-300 rounded p-1.5 text-slate-900 bg-white"
                  />
                  <input
                    type="text"
                    value={link.url || ''}
                    onChange={(e) => handleUpdateFooterCol2Link(idx, 'url', e.target.value)}
                    placeholder="URL"
                    className="flex-1 border border-slate-300 rounded p-1.5 text-slate-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteFooterCol2Link(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block font-bold text-slate-800 mb-1">Newsletter Box Heading</label>
            <input
              type="text"
              value={footerConfig.newsletterTitle || ''}
              onChange={(e) => setFooterConfig({ ...footerConfig, newsletterTitle: e.target.value })}
              className="w-full border border-slate-300 rounded p-2 font-bold text-slate-900 bg-white uppercase"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Newsletter Subtitle Text</label>
            <input
              type="text"
              value={footerConfig.newsletterSubtitle || ''}
              onChange={(e) => setFooterConfig({ ...footerConfig, newsletterSubtitle: e.target.value })}
              className="w-full border border-slate-300 rounded p-2 text-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">CTA Button Label</label>
            <input
              type="text"
              value={footerConfig.newsletterButtonText || ''}
              onChange={(e) => setFooterConfig({ ...footerConfig, newsletterButtonText: e.target.value })}
              className="w-full border border-slate-300 rounded p-2 font-bold text-slate-900 bg-white uppercase"
            />
          </div>
        </div>
      </form>

      {/* Aspect Ratio Precision Image Cropper Modal */}
      {cropModalData && (
        <ImageCropModal
          imageSrc={cropModalData.src}
          onCropComplete={(croppedBase64) =>
            uploadCroppedImage(croppedBase64, cropModalData.targetField, cropModalData.sectionIndex, cropModalData.slideIndex)
          }
          onClose={() => setCropModalData(null)}
        />
      )}

      {/* Modal for Creating New Section */}
      {isNewSectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsNewSectionModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />
          <div className="relative bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl z-10 space-y-4 text-xs font-medium">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#6C307D]" /> Add New Custom Homepage Section
            </h3>

            <form onSubmit={handleCreateNewSection} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Headline Title</label>
                <input
                  type="text"
                  required
                  value={newSectionData.title}
                  onChange={(e) => setNewSectionData({ ...newSectionData, title: e.target.value })}
                  placeholder="e.g. Resort & Holiday Collection"
                  className="w-full border border-slate-300 rounded p-2.5 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subtitle</label>
                <textarea
                  rows={2}
                  value={newSectionData.subtitle}
                  onChange={(e) => setNewSectionData({ ...newSectionData, subtitle: e.target.value })}
                  placeholder="Discover breezy linen co-ords for your summer getaway"
                  className="w-full border border-slate-300 rounded p-2 text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsNewSectionModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6C307D] text-[#ffffff] rounded font-bold uppercase shadow-sm"
                >
                  Create Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
