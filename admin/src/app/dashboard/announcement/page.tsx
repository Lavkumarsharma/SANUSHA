'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Megaphone, Plus, Trash2, Save, MoveUp, MoveDown, CheckCircle } from 'lucide-react';

export default function AnnouncementCMSPage() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [announcements, setAnnouncements] = useState<string[]>([]);

  const loadData = () => {
    setLoading(true);
    fetchApi('/cms/announcements')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAnnouncements(data);
        } else {
          setAnnouncements([
            'Handcrafted In India',
            'Thoughtfully Curated Collections',
            'Gift-Ready Luxury Packaging',
            'Delivered Across India',
          ]);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setAnnouncements([...announcements, 'New Luxury Announcement']);
  };

  const handleUpdate = (index: number, val: string) => {
    const updated = [...announcements];
    updated[index] = val;
    setAnnouncements(updated);
  };

  const handleDelete = (index: number) => {
    setAnnouncements(announcements.filter((_, i) => i !== index));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const updated = [...announcements];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setAnnouncements(updated);
  };

  const handleSave = async () => {
    try {
      await fetchApi('/cms/announcements', {
        method: 'PUT',
        body: JSON.stringify(announcements),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save announcements');
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
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-purple-600" />
            Announcement Bar Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage top announcement slides, message texts, and rotation order.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Announcement
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-md transition-colors"
          >
            <Save className="w-4 h-4" /> Save Announcements
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Announcements saved & synced live!
        </div>
      )}

      <div className="space-y-4">
        {announcements.map((text, idx) => (
          <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between gap-4">
            <input
              type="text"
              value={text}
              onChange={(e) => handleUpdate(idx, e.target.value)}
              className="text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-purple-600 flex-1"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleMove(idx, 'up')}
                disabled={idx === 0}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30"
              >
                <MoveUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleMove(idx, 'down')}
                disabled={idx === announcements.length - 1}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30"
              >
                <MoveDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(idx)}
                className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
