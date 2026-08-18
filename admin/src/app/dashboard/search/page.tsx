'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Search, Plus, Trash2, Save, CheckCircle } from 'lucide-react';

export default function SearchCMSPage() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);

  const loadData = () => {
    setLoading(true);
    fetchApi('/cms/search')
      .then((data) => {
        if (data) {
          setPlaceholders(data.placeholders || [
            'Search timeless gifts...',
            'Discover something meaningful...',
            'Find handcrafted treasures...',
            'Explore curated collections...',
          ]);
          setPopularSearches(data.popularSearches || [
            'Luxury Gifts',
            'Home Decor',
            'Gift Boxes',
            'Personalized Gifts',
            'Artisan Collection',
          ]);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddPlaceholder = () => setPlaceholders([...placeholders, 'Search...']);
  const handleUpdatePlaceholder = (i: number, val: string) => {
    const updated = [...placeholders];
    updated[i] = val;
    setPlaceholders(updated);
  };
  const handleDeletePlaceholder = (i: number) => setPlaceholders(placeholders.filter((_, idx) => idx !== i));

  const handleAddPopular = () => setPopularSearches([...popularSearches, 'Custom Keyword']);
  const handleUpdatePopular = (i: number, val: string) => {
    const updated = [...popularSearches];
    updated[i] = val;
    setPopularSearches(updated);
  };
  const handleDeletePopular = (i: number) => setPopularSearches(popularSearches.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    try {
      await fetchApi('/cms/search', {
        method: 'PUT',
        body: JSON.stringify({ placeholders, popularSearches }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save search settings');
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-6 h-6 text-purple-600" />
            Search Experience Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage rotating search input placeholders and popular search button suggestions.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-md transition-colors"
        >
          <Save className="w-4 h-4" /> Save Search Settings
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Search settings saved & synced live!
        </div>
      )}

      {/* Rotating Placeholders Section */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Rotating Search Input Placeholders</h3>
          <button
            onClick={handleAddPlaceholder}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-md flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Placeholder
          </button>
        </div>

        <div className="space-y-3">
          {placeholders.map((text, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <input
                type="text"
                value={text}
                onChange={(e) => handleUpdatePlaceholder(idx, e.target.value)}
                className="text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-purple-600 flex-1"
              />
              <button
                onClick={() => handleDeletePlaceholder(idx)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Searches Buttons */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Popular Searches Pill Suggestions</h3>
          <button
            onClick={handleAddPopular}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-md flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Suggestion
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {popularSearches.map((keyword, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={keyword}
                onChange={(e) => handleUpdatePopular(idx, e.target.value)}
                className="text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-purple-600 flex-1"
              />
              <button
                onClick={() => handleDeletePopular(idx)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
