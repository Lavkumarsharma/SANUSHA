'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, ShieldCheck, Key, Globe, Lock } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function StoreSettingsPage() {
  const [store, setStore] = useState({
    brandName: 'SANUSHA',
    tagline: 'Timeless fashion, crafted with purpose.',
    supportEmail: 'support@sanusha.com',
    supportPhone: '+91 98765 43210',
    address: '123, Green Park Extension, New Delhi 110016 India',
    freeShippingThreshold: 999,
    razorpayKey: 'rzp_live_9876543210',
    stripeKey: 'pk_live_1234567890',
    googleClientId: '623721780519-8352eo1m091a5c85am7bc6drfqf905ih.apps.googleusercontent.com',
    googleClientSecret: '',
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApi('/theme/settings')
      .then((settings) => {
        if (settings) {
          setStore((prev) => ({
            ...prev,
            brandName: settings.brand_name || prev.brandName,
            tagline: settings.tagline || prev.tagline,
            supportEmail: settings.support_email || prev.supportEmail,
            supportPhone: settings.support_phone || prev.supportPhone,
            googleClientId: settings.google_client_id || '',
            googleClientSecret: settings.google_client_secret || '',
            razorpayKey: settings.razorpay_key || prev.razorpayKey,
            stripeKey: settings.stripe_key || prev.stripeKey,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetchApi('/theme/settings', {
        method: 'PUT',
        body: JSON.stringify({
          brand_name: store.brandName,
          tagline: store.tagline,
          support_email: store.supportEmail,
          support_phone: store.supportPhone,
          google_client_id: store.googleClientId,
          google_client_secret: store.googleClientSecret,
          razorpay_key: store.razorpayKey,
          stripe_key: store.stripeKey,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System & Store Settings</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Configure brand details, Google OAuth client ID credentials, tax rules, and payment gateways
          </p>
        </div>

        {saved && (
          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Settings Saved Live!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Brand Information */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b pb-3">Brand Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Brand Name</label>
              <input
                type="text"
                value={store.brandName}
                onChange={(e) => setStore({ ...store, brandName: e.target.value })}
                className="w-full border border-slate-300 rounded p-2.5 font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={store.tagline}
                onChange={(e) => setStore({ ...store, tagline: e.target.value })}
                className="w-full border border-slate-300 rounded p-2.5 text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Support Email</label>
              <input
                type="email"
                value={store.supportEmail}
                onChange={(e) => setStore({ ...store, supportEmail: e.target.value })}
                className="w-full border border-slate-300 rounded p-2.5 text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Support Phone</label>
              <input
                type="text"
                value={store.supportPhone}
                onChange={(e) => setStore({ ...store, supportPhone: e.target.value })}
                className="w-full border border-slate-300 rounded p-2.5 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Google OAuth & Social Sign-In Configuration */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-[#6C307D]" />
              <h3 className="font-bold text-slate-900 text-sm">Google OAuth & Social Authentication Credentials</h3>
            </div>
            <span className="bg-purple-50 text-[#6C307D] font-bold text-[10px] px-2.5 py-1 rounded">
              Official GCP Integration
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Google OAuth Client ID</label>
              <input
                type="text"
                value={store.googleClientId}
                onChange={(e) => setStore({ ...store, googleClientId: e.target.value })}
                placeholder="e.g. 1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com"
                className="w-full border border-slate-300 rounded p-2.5 font-mono text-slate-900 bg-slate-50 focus:bg-white"
              />
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                Get this Client ID from Google Cloud Console &gt; APIs & Services &gt; Credentials
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Google OAuth Client Secret</label>
              <input
                type="password"
                value={store.googleClientSecret}
                onChange={(e) => setStore({ ...store, googleClientSecret: e.target.value })}
                placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full border border-slate-300 rounded p-2.5 font-mono text-slate-900 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways API Keys */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b pb-3">Payment Gateways & API Keys</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Razorpay Live Key ID</label>
              <input
                type="password"
                value={store.razorpayKey}
                onChange={(e) => setStore({ ...store, razorpayKey: e.target.value })}
                className="w-full border border-slate-300 rounded p-2.5 font-mono text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Stripe Publishable Key</label>
              <input
                type="password"
                value={store.stripeKey}
                onChange={(e) => setStore({ ...store, stripeKey: e.target.value })}
                className="w-full border border-slate-300 rounded p-2.5 font-mono text-slate-900"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#6C307D] hover:bg-[#522061] text-white font-bold uppercase tracking-wider px-6 py-3 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Store Configuration'}
        </button>

      </form>
    </div>
  );
}
