'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { CheckCircle2, X } from 'lucide-react';

const ToastItemComponent: React.FC<{ t: any; removeToast: (id: string) => void }> = ({
  t,
  removeToast,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(t.id);
    }, 3000); // Automatically dismiss after 3 seconds

    return () => clearTimeout(timer);
  }, [t.id, removeToast]);

  return (
    <div className="pointer-events-auto bg-slate-900/95 text-white rounded-md p-4 shadow-2xl border border-slate-800 flex items-start justify-between gap-3 animate-slide-up backdrop-blur-md transition-all">
      <div className="flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-[#6C307D] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold tracking-wider uppercase text-white">{t.title}</h4>
          <p className="text-[11px] text-slate-300 font-medium mt-0.5">{t.message}</p>
        </div>
      </div>
      <button
        onClick={() => removeToast(t.id)}
        className="text-slate-400 hover:text-white p-0.5 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  // Show at most 2 toasts simultaneously
  const visibleToasts = toasts.slice(-2);

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2.5 max-w-sm w-full pointer-events-none">
      {visibleToasts.map((t) => (
        <ToastItemComponent key={t.id} t={t} removeToast={removeToast} />
      ))}
    </div>
  );
};
