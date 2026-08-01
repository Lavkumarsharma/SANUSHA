import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'SANUSHA | Enterprise CMS Admin Dashboard',
  description: 'Manage products, orders, theme, media and page builder content.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 min-h-screen">
          <Header />
          <main className="flex-1 w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
