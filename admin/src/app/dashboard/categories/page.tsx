'use client';

import React, { useEffect, useState } from 'react';
import { FolderTree, Plus, Edit, Trash2, CheckCircle2, XCircle, Search } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '/images/cat_women.jpg',
    isMegaMenu: true,
  });

  const loadCategories = () => {
    setLoading(true);
    fetchApi('/categories')
      .then((data) => setCategories(data))
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

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Category Management</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Organize product categories, mega menu links, category banners, and SEO descriptions
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Category
        </button>
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

        <div className="text-xs font-semibold text-slate-500">
          Total Categories: <span className="text-slate-900 font-bold">{categories.length}</span>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
              <img
                src={cat.image || '/images/cat_women.jpg'}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {cat.products?.length || 0} Products
              </span>
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
                  placeholder="e.g. Footwear & Sneakers"
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
