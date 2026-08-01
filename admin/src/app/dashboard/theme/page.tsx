'use client';

import React, { useEffect, useState } from 'react';
import { Palette, CheckCircle2, Save, Type, Layout, ShieldCheck } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function ThemeCustomizerPage() {
  const [theme, setTheme] = useState({
    primaryColor: '#6C307D',
    primaryHoverColor: '#522061',
    backgroundColor: '#FFFFFF',
    fontTitle: 'Cormorant Garamond',
    fontBody: 'Plus Jakarta Sans',
    headerLayout: 'CENTER_LOGO',
    borderRadius: '4px',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchApi('/theme/settings')
      .then((data) => {
        if (data.primaryColor) {
          setTheme((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSaveTheme = async () => {
    setSaving(true);
    setMessage('');
    try {
      await fetchApi('/theme/settings', {
        method: 'PUT',
        body: JSON.stringify(theme),
      });
      setMessage('Theme tokens saved & broadcast live to storefront!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Theme Management System</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Configure brand colors, luxury typography, layout styles, and border radiuses without code edits
          </p>
        </div>

        <button
          onClick={handleSaveTheme}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Publishing...' : 'Publish Theme Tokens'}
        </button>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3.5 rounded-lg font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {message}
        </div>
      )}

      {/* Theme Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Brand Colors */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Palette className="w-5 h-5 text-[#6C307D]" />
            <h3 className="text-sm font-bold text-slate-900">Brand Color Palette</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Primary Brand Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border border-slate-300"
                />
                <input
                  type="text"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="border border-slate-300 rounded p-2 text-slate-900 font-mono text-xs w-32"
                />
                <div
                  className="w-8 h-8 rounded border border-slate-200"
                  style={{ backgroundColor: theme.primaryColor }}
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Primary Button Hover Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme.primaryHoverColor}
                  onChange={(e) => setTheme({ ...theme, primaryHoverColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border border-slate-300"
                />
                <input
                  type="text"
                  value={theme.primaryHoverColor}
                  onChange={(e) => setTheme({ ...theme, primaryHoverColor: e.target.value })}
                  className="border border-slate-300 rounded p-2 text-slate-900 font-mono text-xs w-32"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Typography Settings */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Type className="w-5 h-5 text-[#6C307D]" />
            <h3 className="text-sm font-bold text-slate-900">Typography System</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Title & Serif Headlines Font</label>
              <select
                value={theme.fontTitle}
                onChange={(e) => setTheme({ ...theme, fontTitle: e.target.value })}
                className="w-full border border-slate-300 rounded p-2.5 text-slate-900 font-medium"
              >
                <option value="Cormorant Garamond">Cormorant Garamond (Editorial Luxury)</option>
                <option value="Playfair Display">Playfair Display (Classic Serif)</option>
                <option value="Cinzel">Cinzel (High Fashion)</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Clean)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Header Layout Style</label>
              <select
                value={theme.headerLayout}
                onChange={(e) => setTheme({ ...theme, headerLayout: e.target.value })}
                className="w-full border border-slate-300 rounded p-2.5 text-slate-900 font-medium"
              >
                <option value="CENTER_LOGO">Centered Logo with Top Announcement Bar</option>
                <option value="LEFT_LOGO">Left Logo with Inline Navigation</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* Live Storefront Preview Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Token Preview</h3>
        <div className="p-6 bg-[#FAF8F5] rounded-lg border border-[#EBE7DF] space-y-3">
          <h2
            className="text-2xl font-serif font-bold"
            style={{ color: theme.primaryColor, fontFamily: theme.fontTitle }}
          >
            EFFORTLESSLY ELEGANT — SANUSHA
          </h2>
          <p className="text-xs text-slate-600">
            This live preview demonstrates how the storefront will instantly update.
          </p>
          <button
            className="text-xs font-bold text-white uppercase tracking-widest px-5 py-2.5 rounded shadow-sm"
            style={{ backgroundColor: theme.primaryColor }}
          >
            Sample Primary CTA Button
          </button>
        </div>
      </div>

    </div>
  );
}
