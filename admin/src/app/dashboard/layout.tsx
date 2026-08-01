import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 min-h-screen flex-1 w-full p-6 sm:p-8 max-w-7xl mx-auto text-slate-900">
      {children}
    </div>
  );
}
