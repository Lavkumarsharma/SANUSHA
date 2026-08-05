'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Eye,
  CheckCircle2,
  Upload,
  Layers,
  X,
  Sparkles,
  FolderTree,
  FolderPlus,
} from 'lucide-react';
import { fetchApi, API_BASE_URL, getImageUrl } from '@/lib/api';

function safeParseGallery(val: any, fallback: string[] = ['/images/pdp_linen_main.jpg']): string[] {
  if (!val) return fallback;
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return fallback;
  } catch (e) {
    return fallback;
  }
}

export default function ProductManagementPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Comprehensive Product Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    stock: 50,
    categoryName: 'Tops',
    gender: 'Men',
    badge: 'NEW ARRIVAL',
    isNewArrival: true,
    isBestseller: false,
    isFeatured: true,
    material: '100% European Flax Linen',
    pattern: 'Solid',
    fit: 'Oversized Fit',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Sand Beige', 'Classic Black'],
    description: '',
    detailsBullets: '• Cuban Collar Design\n• Premium Breathable Weave\n• Side Pocket Utility',
    careInstructions: 'Machine wash cold with like colors.',
    image: '/images/pdp_linen_main.jpg',
    galleryImages: [
      '/images/pdp_linen_main.jpg',
      '/images/prod_textured_shirt.jpg',
    ],
    status: 'PUBLISHED',
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchApi('/products'), fetchApi('/categories')])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCategoryOnFly = async () => {
    if (!newCatName.trim()) return;
    try {
      const created = await fetchApi('/categories', {
        method: 'POST',
        body: JSON.stringify({
          name: newCatName,
          slug: newCatName.toLowerCase().replace(/ /g, '-'),
          description: `Shop the finest ${newCatName} collection`,
          image: '/images/cat_women.jpg',
        }),
      });
      setCategories((prev) => [...prev, created]);
      setFormData((prev) => ({ ...prev, categoryName: created.name }));
      setNewCatName('');
      setShowNewCatInput(false);
      setSuccessMessage(`New Category "${created.name}" created!`);
    } catch (err: any) {
      alert(err.message || 'Failed to create category');
    }
  };

  const openCreateModal = () => {
    setEditingProductId(null);
    setShowNewCatInput(false);
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      stock: 50,
      categoryName: categories[0]?.name || 'Tops',
      gender: 'Men',
      badge: 'NEW ARRIVAL',
      isNewArrival: true,
      isBestseller: false,
      isFeatured: true,
      material: '100% European Flax Linen',
      pattern: 'Solid',
      fit: 'Oversized Fit',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Sand Beige', 'Classic Black'],
      description: '',
      detailsBullets: '• Cuban Collar Design\n• Premium Breathable Weave\n• Side Pocket Utility',
      careInstructions: 'Machine wash cold with like colors.',
      image: '/images/pdp_linen_main.jpg',
      galleryImages: [
        '/images/pdp_linen_main.jpg',
        '/images/prod_textured_shirt.jpg',
      ],
      status: 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProductId(p.id);
    setShowNewCatInput(false);
    const fallbackImg = p.image || '/images/pdp_linen_main.jpg';
    const parsedGallery = safeParseGallery(p.galleryImages, [fallbackImg]);

    setFormData({
      name: p.name || '',
      price: p.price ? String(p.price) : '',
      originalPrice: p.originalPrice ? String(p.originalPrice) : '',
      stock: p.stock ?? 50,
      categoryName: p.category?.name || p.categoryName || 'Tops',
      gender: p.gender || 'Men',
      badge: p.badge || 'NEW ARRIVAL',
      isNewArrival: p.badge === 'NEW ARRIVAL' || p.isNewArrival === true,
      isBestseller: p.badge === 'BESTSELLER' || p.isBestseller === true,
      isFeatured: p.isFeatured ?? true,
      material: p.material || '100% European Flax Linen',
      pattern: p.pattern || 'Solid',
      fit: p.fit || 'Oversized Fit',
      sizes: p.sizes || ['S', 'M', 'L', 'XL'],
      colors: p.colors || ['Sand Beige', 'Classic Black'],
      description: p.description || '',
      detailsBullets: p.detailsBullets || '• Cuban Collar Design\n• Premium Breathable Weave',
      careInstructions: p.careInstructions || 'Machine wash cold.',
      image: fallbackImg,
      galleryImages: parsedGallery,
      status: p.status || 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const handleGalleryPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const bodyData = new FormData();
      bodyData.append('file', files[i]);

      try {
        const res = await fetch(`${API_BASE_URL}/media/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('sanusha_token') || ''}`,
          },
          body: bodyData,
        });
        const mediaData = await res.json();
        if (mediaData.url) {
          newUrls.push(mediaData.url);
        }
      } catch (err: any) {
        console.error(err);
      }
    }

    setFormData((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, ...newUrls],
      image: newUrls[0] || prev.image,
    }));
    setUploadingGallery(false);
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const toggleSizeOption = (sz: string) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(sz);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((s) => s !== sz) : [...prev.sizes, sz],
      };
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let badgeTag = formData.badge;
      if (formData.isNewArrival) badgeTag = 'NEW ARRIVAL';
      if (formData.isBestseller) badgeTag = 'BESTSELLER';

      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stock: Number(formData.stock),
        gender: formData.gender,
        categoryName: formData.categoryName,
        badge: badgeTag,
        isNewArrival: formData.isNewArrival,
        isBestseller: formData.isBestseller,
        isFeatured: formData.isFeatured,
        material: formData.material,
        pattern: formData.pattern,
        fit: formData.fit,
        sizes: formData.sizes,
        colors: formData.colors,
        description: formData.description || 'Luxury fashion item by SANUSHA.',
        detailsBullets: formData.detailsBullets,
        careInstructions: formData.careInstructions,
        image: formData.galleryImages[0] || formData.image,
        galleryImages: JSON.stringify(formData.galleryImages),
        status: formData.status,
      };

      if (editingProductId) {
        await fetchApi(`/products/${editingProductId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setSuccessMessage('Product & Category synced live!');
      } else {
        await fetchApi('/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setSuccessMessage('New Product published to Category & New Arrivals!');
      }

      setIsModalOpen(false);
      setTimeout(() => setSuccessMessage(''), 3000);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetchApi(`/products/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Product & Category Catalog</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Assign products to categories, feature in New Arrivals / Bestsellers, and manage multi-photo galleries
          </p>
        </div>

        <div className="flex items-center gap-3">
          {successMessage && (
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {successMessage}
            </span>
          )}

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Product
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
            placeholder="Search products..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-xs text-slate-800 focus:outline-none focus:border-[#6C307D]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="text-slate-500">Total Products: <span className="text-slate-900 font-bold">{filteredProducts.length}</span></span>
          <span className="text-slate-300">|</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Product DataTable */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-slate-500">Loading Product Catalog...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category & Gender</th>
                  <th className="py-3.5 px-4">Placement / Tag</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(p.image)}
                          alt={p.name}
                          className="w-12 h-14 object-cover rounded border border-slate-200 bg-slate-100 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 text-sm block">{p.name}</span>
                          <span className="text-[10px] text-slate-500">{p.material}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      <span className="block text-slate-900">{p.category?.name || p.categoryName || 'Tops'}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{p.gender}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 bg-purple-50 text-[#6C307D] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                        <Sparkles className="w-3 h-3" /> {p.badge || 'NEW ARRIVAL'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 text-sm">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-slate-500">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 hover:text-[#6C307D] hover:bg-purple-50 rounded"
                          title="Edit Product, Category & New Arrivals Tag"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <a
                          href={`http://localhost:3000/product/${p.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:text-[#6C307D] hover:bg-purple-50 rounded"
                          title="View Live on Storefront"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enterprise Product Modal with On-the-Fly Category Creation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          <div className="relative bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl z-10 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingProductId ? 'Edit Product & Category Placement' : 'Create New Product'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Assign product to category, tag for New Arrivals, and upload gallery photos
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-medium">
              
              {/* Product Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Oversized Linen Shirt & Relaxed Trousers"
                  className="w-full border border-slate-300 rounded-md p-2.5 text-slate-900 font-semibold focus:outline-none focus:border-[#6C307D]"
                />
              </div>

              {/* Dynamic Category Creation & Selection */}
              <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5">
                    <FolderTree className="w-4 h-4 text-[#6C307D]" /> Select or Create Category
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewCatInput(!showNewCatInput)}
                    className="text-[#6C307D] font-bold text-[11px] hover:underline flex items-center gap-1 uppercase"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    {showNewCatInput ? 'Cancel New Category' : '+ Create New Category'}
                  </button>
                </div>

                {showNewCatInput ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="e.g. Winter Jackets, Ethnic Wear"
                      className="flex-1 border border-slate-300 rounded-md p-2 text-slate-900 font-bold bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleCreateCategoryOnFly}
                      className="bg-[#6C307D] text-white px-4 py-2 rounded-md font-bold uppercase"
                    >
                      Save Category
                    </button>
                  </div>
                ) : (
                  <select
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    className="w-full border border-slate-300 rounded-md p-2.5 text-slate-900 bg-white font-bold"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value="Tops">Tops & Shirts</option>
                    <option value="Bottoms">Bottoms & Trousers</option>
                    <option value="Co-ord Sets">Co-ord Sets</option>
                    <option value="Accessories">Accessories & Shoes</option>
                  </select>
                )}
              </div>

              {/* Showcase Placement Checkboxes */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-xs block mb-1">
                  Showcase Placement on Customer Storefront
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-md border border-slate-200">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="w-4 h-4 text-[#6C307D] rounded focus:ring-0"
                    />
                    <span className="font-bold text-slate-800">✨ New Arrivals</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-md border border-slate-200">
                    <input
                      type="checkbox"
                      checked={formData.isBestseller}
                      onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                      className="w-4 h-4 text-[#6C307D] rounded focus:ring-0"
                    />
                    <span className="font-bold text-slate-800">🔥 Bestseller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-md border border-slate-200">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-[#6C307D] rounded focus:ring-0"
                    />
                    <span className="font-bold text-slate-800">☀️ Summer Collection</span>
                  </label>
                </div>
              </div>

              {/* Price & Stock Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2499"
                    className="w-full border border-slate-300 rounded-md p-2 text-slate-900 focus:outline-none focus:border-[#6C307D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="3299"
                    className="w-full border border-slate-300 rounded-md p-2 text-slate-900 focus:outline-none focus:border-[#6C307D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-md p-2 text-slate-900 focus:outline-none focus:border-[#6C307D]"
                  />
                </div>
              </div>

              {/* Multi-Photo Slide Gallery Uploader */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">
                      Multi-Photo Slide Gallery ({formData.galleryImages.length} Photos)
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      Upload multiple high-res photos for storefront slider
                    </span>
                  </div>

                  <label className="bg-[#6C307D] hover:bg-[#522061] text-white px-3.5 py-1.5 rounded-md text-[11px] font-bold cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingGallery ? 'Uploading Gallery...' : '+ Add Gallery Photos'}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryPhotosUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Gallery Thumbnail Strip */}
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
                  {formData.galleryImages.map((imgUrl, idx) => (
                    <div key={idx} className="relative group aspect-[3/4] bg-slate-200 rounded-md overflow-hidden border border-slate-300">
                      <img src={getImageUrl(imgUrl)} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity"
                        title="Remove photo from gallery"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Crafted from premium flax linen..."
                  className="w-full border border-slate-300 rounded-md p-2 text-slate-900"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#6C307D] text-white rounded-md font-bold uppercase shadow-sm"
                >
                  {editingProductId ? 'Save Product & Placement' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
