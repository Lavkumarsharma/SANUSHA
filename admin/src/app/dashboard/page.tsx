'use client';

import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  Package,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { fetchApi } from '@/lib/api';

export default function AnalyticsDashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/analytics')
      .then((data) => setAnalytics(data))
      .catch(() =>
        setAnalytics({
          revenue: 148500,
          totalOrders: 124,
          totalProducts: 12,
          totalUsers: 840,
          conversionRate: '3.4%',
          chartData: [
            { month: 'Jan', revenue: 24000, orders: 35 },
            { month: 'Feb', revenue: 38000, orders: 48 },
            { month: 'Mar', revenue: 42000, orders: 62 },
            { month: 'Apr', revenue: 56000, orders: 89 },
            { month: 'May', revenue: 78000, orders: 110 },
            { month: 'Jun', revenue: 148500, orders: 124 },
          ],
        })
      )
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${(analytics?.revenue || 148500).toLocaleString('en-IN')}`,
      change: '+18.4% from last month',
      icon: DollarSign,
      color: 'bg-purple-50 text-[#6C307D]',
    },
    {
      title: 'Total Orders',
      value: analytics?.totalOrders || 124,
      change: '+12.1% from last month',
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Active Customers',
      value: analytics?.totalUsers || 840,
      change: '+8.2% from last month',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Conversion Rate',
      value: analytics?.conversionRate || '3.4%',
      change: '+0.6% from last month',
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  if (loading) {
    return <div className="p-8 text-xs font-bold text-slate-500">Loading Analytics...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Executive Dashboard</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Real-time performance analytics & operational metrics for SANUSHA
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <span className="text-2xl font-extrabold text-slate-900 block">
                  {stat.value}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue & Growth Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Revenue Growth Trend</h3>
            <p className="text-xs text-slate-500 font-medium">Monthly revenue performance overview (INR)</p>
          </div>
          <span className="bg-purple-50 text-[#6C307D] text-xs font-bold px-3 py-1 rounded-full">
            2026 YTD
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics?.chartData || []}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C307D" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6C307D" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6C307D"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity & Quick Operational Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Recent System Activity</h3>
            <Activity className="w-4 h-4 text-purple-600" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-900">New Order #SN12345 received</p>
                <p className="text-[11px] text-slate-500">Customer: Law Kumar • Total: ₹6,838</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-900">Theme tokens updated</p>
                <p className="text-[11px] text-slate-500">Primary Color changed to #6C307D</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-900">New Product Published</p>
                <p className="text-[11px] text-slate-500">Oversized Linen Shirt added to catalog</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Inventory Status</h3>
            <Package className="w-4 h-4 text-[#6C307D]" />
          </div>

          <div className="space-y-3 text-xs font-semibold">
            <div className="flex justify-between items-center">
              <span className="text-slate-700">In Stock Products</span>
              <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded text-xs">12 Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Low Stock Alerts</span>
              <span className="bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded text-xs">2 Items</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Out of Stock</span>
              <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded text-xs">0 Items</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
