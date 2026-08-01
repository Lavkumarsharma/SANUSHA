'use client';

import React, { useState } from 'react';
import { Search, Save, CheckCircle2, Globe, Share2, FileCode } from 'lucide-react';

export default function SEOManagerPage() {
  const [seo, setSeo] = useState({
    metaTitle: 'SANUSHA | Luxury Fashion & Modern Elegance',
    metaDescription: 'Timeless fashion, crafted with purpose. Designed to empower. Made to last.',
    keywords: 'SANUSHA, luxury fashion, linen shirt, co-ord set, modern elegance',
    ogImage: '/images/hero_banner.jpg',
    canonicalUrl: 'https://sanusha.com',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SEO & Metadata Manager</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Configure global meta titles, OpenGraph social previews, Twitter cards, and sitemap.xml
          </p>
        </div>

        {saved && (
          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> SEO Metadata Saved Live!
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Controls */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm border-b pb-3">Global SEO Configuration</h3>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Meta Title</label>
            <input
              type="text"
              value={seo.metaTitle}
              onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
              className="w-full border border-slate-300 rounded p-2.5 font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Meta Description</label>
            <textarea
              rows={3}
              value={seo.metaDescription}
              onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
              className="w-full border border-slate-300 rounded p-2.5 text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Keywords</label>
            <input
              type="text"
              value={seo.keywords}
              onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
              className="w-full border border-slate-300 rounded p-2.5 text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Canonical URL</label>
            <input
              type="text"
              value={seo.canonicalUrl}
              onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
              className="w-full border border-slate-300 rounded p-2.5 text-slate-900 font-mono"
            />
          </div>

          <button
            type="submit"
            className="bg-[#6C307D] hover:bg-[#522061] text-white font-bold uppercase tracking-wider px-6 py-2.5 rounded-md flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" /> Save SEO Settings
          </button>
        </form>

        {/* Live Search Engine Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#6C307D]" /> Google Search Snippet Preview
            </h3>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="text-blue-800 font-bold text-sm hover:underline cursor-pointer block truncate">
                {seo.metaTitle}
              </span>
              <span className="text-emerald-700 text-[11px] font-mono block">
                {seo.canonicalUrl}
              </span>
              <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                {seo.metaDescription}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
