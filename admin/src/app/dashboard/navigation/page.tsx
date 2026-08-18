'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { FolderTree, Plus, Trash2, Save, MoveUp, MoveDown, CheckCircle } from 'lucide-react';

export default function NavigationCMSPage() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  const loadNavData = () => {
    setLoading(true);
    fetchApi('/cms/navigation')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMenuItems(data);
        } else {
          setMenuItems([
            { id: 'nav-1', title: 'GIFTS', slug: 'gifts', url: '/shop?filter=gifts', sortOrder: 1, isActive: true },
            { id: 'nav-2', title: 'OCCASIONS', slug: 'occasions', url: '/shop?filter=occasions', sortOrder: 2, isActive: true },
            { id: 'nav-3', title: 'COLLECTIONS', slug: 'collections', url: '/shop?filter=collections', sortOrder: 3, isActive: true },
            { id: 'nav-4', title: 'STORIES', slug: 'stories', url: '/stories', sortOrder: 4, isActive: true },
          ]);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNavData();
  }, []);

  const handleAddMenuItem = () => {
    const newItem = {
      id: 'nav-' + Date.now(),
      title: 'NEW MENU ITEM',
      slug: 'new-item',
      url: '/shop',
      sortOrder: menuItems.length + 1,
      isActive: true,
    };
    setMenuItems([...menuItems, newItem]);
  };

  const handleUpdateMenuItem = (index: number, field: string, value: any) => {
    const updated = [...menuItems];
    updated[index] = { ...updated[index], [field]: value };
    setMenuItems(updated);
  };

  const handleDeleteMenuItem = (index: number) => {
    const updated = menuItems.filter((_, i) => i !== index);
    setMenuItems(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const updated = [...menuItems];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setMenuItems(updated);
  };

  const handleSaveNavigation = async () => {
    try {
      await fetchApi('/cms/navigation', {
        method: 'PUT',
        body: JSON.stringify(menuItems),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      loadNavData();
    } catch (err: any) {
      alert(err.message || 'Failed to save navigation menu');
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
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-purple-600" />
            Navigation & Mega Menu Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage top header menu items, mega menu hierarchy, sort orders, and active toggles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddMenuItem}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Menu Item
          </button>
          <button
            onClick={handleSaveNavigation}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-md transition-colors"
          >
            <Save className="w-4 h-4" /> Save Navigation
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Navigation hierarchy saved & synced live to storefront!
        </div>
      )}

      <div className="space-y-4">
        {menuItems.map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleUpdateMenuItem(idx, 'title', e.target.value)}
                  className="text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:border-purple-600"
                  placeholder="Menu Title (e.g. GIFTS)"
                />
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => handleUpdateMenuItem(idx, 'url', e.target.value)}
                  className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:border-purple-600 flex-1"
                  placeholder="Target URL (e.g. /shop?filter=gifts)"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.isActive !== false}
                    onChange={(e) => handleUpdateMenuItem(idx, 'isActive', e.target.checked)}
                    className="accent-purple-600 rounded"
                  />
                  Active
                </label>

                <button
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30"
                >
                  <MoveUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === menuItems.length - 1}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30"
                >
                  <MoveDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteMenuItem(idx)}
                  className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
