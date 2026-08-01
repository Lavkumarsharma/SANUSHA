'use client';

import React, { useEffect, useState } from 'react';
import {
  Upload,
  Search,
  Trash2,
  Copy,
  CheckCircle2,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function MediaManagerPage() {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadMedia = () => {
    setLoading(true);
    fetchApi('/media')
      .then((data) => setMediaItems(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      try {
        await fetch('http://localhost:5000/api/media/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('sanusha_token') || ''}`,
          },
          body: formData,
        });
      } catch (err: any) {
        alert('Failed to upload ' + files[i].name);
      }
    }
    setUploading(false);
    loadMedia();
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;
    try {
      await fetchApi(`/media/${id}`, { method: 'DELETE' });
      loadMedia();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = mediaItems.filter((item) =>
    item.filename.toLowerCase().includes(search.toLowerCase()) ||
    (item.altText && item.altText.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Media Library & Asset Manager</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Store, upload, manage, search, copy URLs, and replace website photos and banners
          </p>
        </div>

        <label className="bg-[#6C307D] hover:bg-[#522061] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2">
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload New Banners'}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media files by name..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-xs text-slate-800 focus:outline-none focus:border-[#6C307D]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Total Stored Assets: <span className="text-slate-900 font-bold">{mediaItems.length}</span>
        </div>
      </div>

      {/* Media Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-slate-500">Loading Media Library...</div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600">No media assets uploaded yet.</p>
            <label className="text-xs text-[#6C307D] font-bold cursor-pointer hover:underline">
              Click here to upload your first banner or photo
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className="group relative bg-slate-50 rounded-lg border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div className="relative aspect-[4/3] w-full bg-slate-200 overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.altText || item.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-2.5 space-y-2">
                  <p className="text-[11px] font-bold text-slate-900 truncate" title={item.filename}>
                    {item.filename}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-slate-500">
                    <button
                      onClick={() => handleCopyUrl(item.url, item.id)}
                      className="p-1 hover:text-[#6C307D] hover:bg-purple-50 rounded flex items-center gap-1 text-[10px] font-bold"
                      title="Copy Direct Image URL"
                    >
                      {copiedId === item.id ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedId === item.id ? 'Copied!' : 'Copy URL'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteMedia(item.id)}
                      className="p-1 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete Media Asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
