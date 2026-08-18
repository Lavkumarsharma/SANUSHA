'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Users,
  Heart,
  Briefcase,
  Gift,
  Sparkles,
  Calendar,
  Home,
  ArrowRight,
} from 'lucide-react';

const RECIPIENTS = [
  { label: 'Mother', icon: User },
  { label: 'Father', icon: User },
  { label: 'Partner', icon: Heart },
  { label: 'Friend', icon: Users },
  { label: 'Colleague', icon: Briefcase },
  { label: 'Family', icon: Users },
];

const OCCASIONS = [
  { label: 'Birthday', icon: Gift },
  { label: 'Anniversary', icon: Heart },
  { label: 'Wedding', icon: Sparkles },
  { label: 'Festival', icon: Calendar },
  { label: 'New Home', icon: Home },
  { label: 'All', icon: Sparkles },
];

const BUDGETS = ['₹500 - ₹1000', '₹1000 - ₹3000', '₹3000 - ₹5000', '₹5000+'];

export const GiftFinder: React.FC = () => {
  const router = useRouter();
  const [selectedRecipient, setSelectedRecipient] = useState<string>('Partner');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('Anniversary');
  const [selectedBudget, setSelectedBudget] = useState<string>('₹1000 - ₹3000');

  const handleStartFinder = () => {
    const params = new URLSearchParams();
    if (selectedRecipient) params.set('for', selectedRecipient.toLowerCase());
    if (selectedOccasion) params.set('occasion', selectedOccasion.toLowerCase());
    if (selectedBudget) params.set('budget', selectedBudget.replace(/[^0-9]/g, ''));
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <section className="bg-[#FAF7F2] border-b border-[#E8DFC8] py-14 px-6 sm:px-12 select-none">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: TITLE & CTA */}
        <div className="lg:col-span-3 space-y-4 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-[#E8DFC8] pb-6 lg:pb-0">
          <span className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-[#C5A059] block">
            FIND THE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold uppercase text-gray-900 leading-tight">
            PERFECT GIFT
          </h2>
          <p className="text-xs text-gray-600 font-serif italic">
            A thoughtful journey to something they&apos;ll cherish.
          </p>
          <button
            onClick={handleStartFinder}
            className="mt-2 inline-flex items-center gap-2 bg-[#18191B] hover:bg-[#C5A059] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-xs transition-colors shadow-md group"
          >
            <span>Start Gift Finder</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* RIGHT COLUMN: 4 STEPS */}
        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* STEP 01: WHO IS IT FOR? */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#C5A059] text-white text-[10px] font-bold flex items-center justify-center">
                01
              </span>
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-gray-900">
                Who Is It For?
              </h4>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {RECIPIENTS.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedRecipient === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => setSelectedRecipient(item.label)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xs border text-[10px] font-medium transition-all ${
                      isSelected
                        ? 'bg-white border-[#C5A059] text-[#C5A059] shadow-sm font-bold'
                        : 'bg-white/60 border-[#E8DFC8] text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 02: OCCASION? */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#C5A059] text-white text-[10px] font-bold flex items-center justify-center">
                02
              </span>
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-gray-900">
                Occasion?
              </h4>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {OCCASIONS.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedOccasion === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => setSelectedOccasion(item.label)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xs border text-[10px] font-medium transition-all ${
                      isSelected
                        ? 'bg-white border-[#C5A059] text-[#C5A059] shadow-sm font-bold'
                        : 'bg-white/60 border-[#E8DFC8] text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 03: BUDGET RANGE? */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#C5A059] text-white text-[10px] font-bold flex items-center justify-center">
                03
              </span>
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-gray-900">
                Budget Range?
              </h4>
            </div>
            <div className="space-y-2">
              {BUDGETS.map((range) => {
                const isSelected = selectedBudget === range;
                return (
                  <button
                    key={range}
                    onClick={() => setSelectedBudget(range)}
                    className={`w-full text-center py-2 px-3 rounded-xs border text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#18191B] text-white border-[#18191B] shadow-sm'
                        : 'bg-white border-[#E8DFC8] text-gray-800 hover:border-gray-400'
                    }`}
                  >
                    {range}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 04: DISCOVER GIFTS */}
          <div className="space-y-3 flex flex-col justify-between bg-white p-5 border border-[#E8DFC8] rounded-xs shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#C5A059] text-white text-[10px] font-bold flex items-center justify-center">
                  04
                </span>
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-gray-900">
                  Discover Gifts
                </h4>
              </div>
              <p className="text-[11px] text-gray-600 font-sans leading-relaxed pt-1">
                Handpicked recommendations curated for {selectedRecipient} on {selectedOccasion}.
              </p>
            </div>

            <button
              onClick={handleStartFinder}
              className="w-12 h-12 rounded-full bg-[#18191B] hover:bg-[#C5A059] text-white flex items-center justify-center mx-auto transition-colors shadow-md"
              aria-label="View Handpicked Recommendations"
            >
              <Gift className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
