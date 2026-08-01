'use client';

import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useStore } from '@/store/useStore';

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white border border-[#E0DCD2] rounded-sm p-4 shadow-xl flex items-start justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#6C307D] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-gray-900">{toast.title}</h4>
              <p className="text-[11px] text-gray-600 mt-0.5 font-medium">
                {toast.message}
              </p>
            </div>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-700 p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
