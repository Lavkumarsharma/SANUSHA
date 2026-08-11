'use client';

import React, { useEffect, useState } from 'react';
import { FolderTree, Plus, Edit, Trash2, CheckCircle2, Search, GripVertical, Save, ArrowUpDown } from 'lucide-react';
import { fetchApi, getImageUrl } from '@/lib/api';

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '/images/cat_decor_accents.jpg',
    isMegaMenu: true,
  });

  const loadCategories = () => {
    setLoading(true);
    fetchApi('/categories')
      .then((data) => {
        setCategories(data);
        setOrderChanged(false);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = formData.name.toLowerCase().replace(/ /g, '-');
      await fetchApi('/categories', {
        method: 'POST',
        body: JSON.stringify({ ...formData, slug }),
      });
      setIsModalOpen(false);
      loadCategories();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const updated = [...categories];
    const [draggedItem] = updated.splice(draggedIdx, 1);
    updated.splice(index, 0, draggedItem);

    setDraggedIdx(index);
    setCategories(updated);
    setOrderChanged(true);
  };

  // Save new ordering to backend API
  const saveOrderList = async (updatedList: any[], isManual = false) => {
    setSavingOrder(true);
    try {
      const itemsToUpdate = updatedList.map((cat, idx) => ({
        id: cat.id,
        order: idx + 1,
      }));

      await fetchApi('/categories/reorder', {
        method: 'PUT',
        body: JSON.stringify({ items: itemsToUpdate }),
      });

      setOrderChanged(false);
      if (isManual) {
        alert('🎉 Category display order saved successfully! Frontend is now synced.');
      }
    } catch (err: any) {
      if (isManual) alert('Failed to save order: ' + err.message);
      console.error('Category reorder error:', err);
    } finally {
      setSavingOrder(false);
    }
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    saveOrderList(categories, false);
  };

  const handleSaveOrder = async () => {
    saveOrderList(categories, true);
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title & Save Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>Category Management</span>
            <span className="text-xs bg-purple-100 text-[#6C307D] font-extrabold uppercase px-2.5 py-1 rounded-full border border-purple-200">
              Drag &amp; Drop Enabled
            </span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Drag category cards to reorder. Click "Save Display Order" to sync instantly with the live storefront.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {orderChanged && (
            <button
              onClick={handleSaveOrder}
              disabled={savingOrder}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-md transition-all animate-bounce"
            >
              <Save className="w-4 h-4" />
              {savingOrder ? 'Saving...' : 'Save Display Order'}
            </button>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Category
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-xs text-slate-800 focus:outline-none focus:border-[#6C307D]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1 text-slate-600">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#6C307D]" />
            <span>Drag any card by handle to reposition</span>
          </div>
          <div>
            Total Categories: <span className="text-slate-900 font-bold">{categories.length}</span>
          </div>
        </div>
      </div>

      {/* Categories Draggable Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCategories.map((cat, idx) => (
          <div
            key={cat.id}
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={handleDragEnd}
            className={`bg-white border rounded-xl overflow-hidden shadow-xs flex flex-col justify-between cursor-grab active:cursor-grabbing transition-all ${
              draggedIdx === idx ? 'border-[#6C307D] ring-2 ring-[#6C307D]/30 scale-95 opacity-80' : 'border-slate-200 hover:border-purple-300'
            }`}
          >
            {/* Header Handle Bar */}
            <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-bold">
              <div className="flex items-center gap-1.5">
                <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                <span className="text-[10px] uppercase font-mono text-slate-500">Position #{idx + 1}</span>
              </div>
              <span className="bg-white text-slate-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-slate-200">
                {cat.products?.length || 0} Products
              </span>
            </div>

            <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden group">
              <img
                src={getImageUrl(cat.image) || '/images/cat_decor_accents.jpg'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{cat.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{cat.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#6C307D] uppercase">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mega Menu
                </span>

                <button
                  onClick={() => alert('Editing category ' + cat.name)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />
          <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Create New Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Wall & Art"
                  className="w-full border border-slate-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category description..."
                  className="w-full border border-slate-300 rounded-md p-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6C307D] text-white rounded-md uppercase font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

