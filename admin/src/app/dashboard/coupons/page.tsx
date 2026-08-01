'use client';

import React, { useEffect, useState } from 'react';
import {
  Ticket,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Percent,
  DollarSign,
  Tag,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number | null;
  description?: string;
  usageCount: number;
  usageLimit: number;
  active: boolean;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    discountValue: '',
    minOrderAmount: '0',
    maxDiscount: '',
    description: '',
    active: true,
  });

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/coupons');
      if (Array.isArray(data)) setCoupons(data);
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minOrderAmount: '0',
      maxDiscount: '',
      description: '',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minOrderAmount: String(coupon.minOrderAmount || 0),
      maxDiscount: coupon.maxDiscount ? String(coupon.maxDiscount) : '',
      description: coupon.description || '',
      active: coupon.active,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      await fetchApi(`/coupons/${coupon.id}`, {
        method: 'PUT',
        body: JSON.stringify({ active: !coupon.active }),
      });
      loadCoupons();
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await fetchApi(`/coupons/${id}`, { method: 'DELETE' });
      loadCoupons();
    } catch (err: any) {
      alert('Failed to delete coupon: ' + err.message);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue) {
      alert('Please fill in required fields (Coupon Code & Value)');
      return;
    }

    try {
      const payload = {
        code: formData.code,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: parseFloat(formData.minOrderAmount || '0'),
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        description: formData.description,
        active: formData.active,
      };

      if (editingCoupon) {
        await fetchApi(`/coupons/${editingCoupon.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi('/coupons', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      setIsModalOpen(false);
      loadCoupons();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  };

  const activeCount = coupons.filter((c) => c.active).length;

  return (
    <div className="space-y-6">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#6C307D] flex items-center justify-center border border-purple-100 shadow-2xs">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-serif">Discount Coupons & Promo Manager</h1>
            <p className="text-xs text-slate-500 font-medium">Create and manage promo codes applicable live at checkout</p>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-[#6C307D] hover:bg-[#522061] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg shadow-md flex items-center gap-2 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Coupon
        </button>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Active Coupons</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{activeCount}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Coupon Database</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{coupons.length}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-[#6C307D] flex items-center justify-center font-bold">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Checkout Status</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded inline-block mt-2">
              ✓ 100% Applicable at Checkout
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Coupons List Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <span>Available Promotional Coupons</span>
            <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
              {coupons.length}
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium text-xs">Loading coupons from server...</div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Ticket className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-bold text-sm text-slate-700">No discount coupons created yet.</p>
            <p className="text-xs text-slate-400">Click "Create New Coupon" to set up your first promo code.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Coupon Code</th>
                  <th className="p-4">Discount Type & Value</th>
                  <th className="p-4">Min. Order Amount</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Code Cell */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-purple-50 text-[#6C307D] border border-purple-200 px-3 py-1 rounded-md tracking-wider flex items-center gap-1.5 shadow-2xs">
                          <Tag className="w-3 h-3 text-[#6C307D]" />
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => handleCopyCode(coupon.code)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          title="Copy Code"
                        >
                          {copiedCode === coupon.code ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Value Cell */}
                    <td className="p-4">
                      <span className="font-bold text-slate-900 text-sm">
                        {coupon.discountType === 'PERCENTAGE'
                          ? `${coupon.discountValue}% OFF`
                          : `₹${coupon.discountValue} OFF`}
                      </span>
                      {coupon.maxDiscount && (
                        <span className="text-[10px] text-slate-400 block font-normal">
                          Max Cap: ₹{coupon.maxDiscount}
                        </span>
                      )}
                    </td>

                    {/* Min Order Cell */}
                    <td className="p-4">
                      {coupon.minOrderAmount > 0 ? (
                        <span className="font-bold text-slate-800">₹{coupon.minOrderAmount}</span>
                      ) : (
                        <span className="text-slate-400 italic">No Minimum</span>
                      )}
                    </td>

                    {/* Description Cell */}
                    <td className="p-4 text-slate-600 max-w-xs truncate">
                      {coupon.description || 'General Discount Coupon'}
                    </td>

                    {/* Status Toggle Cell */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(coupon)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition-all ${
                          coupon.active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {coupon.active ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-500" /> Disabled
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions Cell */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(coupon)}
                          className="p-1.5 text-slate-600 hover:text-[#6C307D] hover:bg-purple-50 rounded-md transition-colors"
                          title="Edit Coupon"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Coupon"
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

      {/* CREATE / EDIT COUPON MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />
          
          <div className="relative bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl z-10 text-xs text-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#6C307D]" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingCoupon ? 'Edit Discount Coupon' : 'Create New Discount Coupon'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1 uppercase tracking-wider text-[10px]">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SANUSHA10"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 font-mono font-bold text-slate-900 uppercase bg-slate-50 focus:bg-white focus:border-[#6C307D] outline-none text-sm tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1 uppercase tracking-wider text-[10px]">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e: any) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 bg-white"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1 uppercase tracking-wider text-[10px]">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder={formData.discountType === 'PERCENTAGE' ? 'e.g. 15 (%)' : 'e.g. 200 (₹)'}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1 uppercase tracking-wider text-[10px]">
                    Min. Order Requirement (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 999"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1 uppercase tracking-wider text-[10px]">
                    Max Discount Cap (₹) (Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1 uppercase tracking-wider text-[10px]">
                  Description / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15% Instant Discount on orders above ₹999"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-[#6C307D] rounded focus:ring-0"
                />
                <label htmlFor="activeCheck" className="font-bold text-slate-800 text-xs cursor-pointer">
                  Set Coupon Active Immediately
                </label>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-bold hover:bg-slate-100 text-slate-700 bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#6C307D] hover:bg-[#522061] text-white font-bold rounded-lg shadow-md uppercase text-xs"
                >
                  {editingCoupon ? 'Save Coupon Changes' : 'Create & Activate Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
