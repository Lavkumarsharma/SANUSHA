'use client';

import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  X,
  FileText,
  AlertCircle,
  Package,
  Check,
  XCircle,
  ArrowRight,
  Filter,
  DollarSign,
  User,
  MapPin,
  CreditCard,
  ExternalLink,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [shippingModalOrder, setShippingModalOrder] = useState<any>(null);
  const [courierName, setCourierName] = useState<string>('BlueDart Express');
  const [trackingNoInput, setTrackingNoInput] = useState<string>('');
  const [updating, setUpdating] = useState<boolean>(false);

  const loadOrders = () => {
    setLoading(true);
    fetchApi('/orders')
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string, trackingNo?: string) => {
    setUpdating(true);
    try {
      await fetchApi(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: trackingNo || 'AWB' + Math.floor(1000000000 + Math.random() * 9000000000),
        }),
      });
      setShippingModalOrder(null);
      loadOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  // Metrics Calculations
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  const pendingCount = orders.filter((o) => (o.status || 'PENDING').toUpperCase() === 'PENDING').length;
  const processingCount = orders.filter((o) => (o.status || '').toUpperCase() === 'PROCESSING').length;
  const shippedCount = orders.filter((o) => (o.status || '').toUpperCase() === 'SHIPPED').length;
  const deliveredCount = orders.filter((o) => (o.status || '').toUpperCase() === 'DELIVERED').length;

  // Filtered Orders
  const filteredOrders = orders.filter((ord) => {
    const statusUpper = (ord.status || 'PENDING').toUpperCase();
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'PENDING' && statusUpper === 'PENDING') ||
      (activeTab === 'PROCESSING' && statusUpper === 'PROCESSING') ||
      (activeTab === 'SHIPPED' && statusUpper === 'SHIPPED') ||
      (activeTab === 'DELIVERED' && statusUpper === 'DELIVERED') ||
      (activeTab === 'CANCELLED' && statusUpper === 'CANCELLED');

    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      (ord.orderNumber || '').toLowerCase().includes(searchLower) ||
      (ord.customerName || '').toLowerCase().includes(searchLower) ||
      (ord.phone || '').toLowerCase().includes(searchLower) ||
      (ord.email || '').toLowerCase().includes(searchLower) ||
      (ord.shippingAddress || '').toLowerCase().includes(searchLower);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Title & Refresh Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order Fulfillment Operations</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Approve incoming storefront orders, manage warehouse packaging, ship packages &amp; print invoices
          </p>
        </div>
        <button
          onClick={loadOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg shadow-2xs transition-colors shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#6C307D]' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* METRICS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Orders Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-[#6C307D] flex items-center justify-center font-bold shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Orders</span>
            <span className="text-xl font-bold text-slate-900">{totalOrdersCount}</span>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Sales</span>
            <span className="text-xl font-bold text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Pending Approvals Card */}
        <div
          onClick={() => setActiveTab('PENDING')}
          className={`bg-white border rounded-xl p-4 shadow-2xs flex items-center gap-3 cursor-pointer transition-all ${
            pendingCount > 0 ? 'border-amber-300 bg-amber-50/40 hover:border-amber-400' : 'border-slate-200'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Needs Approval</span>
            <span className="text-xl font-bold text-amber-900">{pendingCount} New</span>
          </div>
        </div>

        {/* In-Transit Card */}
        <div
          onClick={() => setActiveTab('SHIPPED')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center gap-3 cursor-pointer hover:border-purple-300"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">In Transit</span>
            <span className="text-xl font-bold text-slate-900">{shippedCount}</span>
          </div>
        </div>

        {/* Delivered Card */}
        <div
          onClick={() => setActiveTab('DELIVERED')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center gap-3 cursor-pointer hover:border-emerald-300"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Delivered</span>
            <span className="text-xl font-bold text-slate-900">{deliveredCount}</span>
          </div>
        </div>

      </div>

      {/* FILTER TABS & SEARCH TOOLBAR */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {[
            { id: 'ALL', label: 'All Orders', count: totalOrdersCount },
            { id: 'PENDING', label: '🟡 New Approvals', count: pendingCount },
            { id: 'PROCESSING', label: '⚙️ Processing', count: processingCount },
            { id: 'SHIPPED', label: '🚚 In Transit', count: shippedCount },
            { id: 'DELIVERED', label: '✅ Delivered', count: deliveredCount },
            { id: 'CANCELLED', label: '🔴 Cancelled', count: orders.filter((o) => (o.status || '').toUpperCase() === 'CANCELLED').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-[#6C307D] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <input
            type="text"
            placeholder="Search by Order #, Customer, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#6C307D] focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* ORDERS OPERATIONS TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-16 text-center text-xs font-bold text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#6C307D]" />
            <span>Fetching storefront orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-xs space-y-2">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700">No Orders Found</p>
            <p className="text-slate-400">There are no orders matching your current status filter or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-4">Order Reference</th>
                  <th className="py-4 px-4">Customer Info</th>
                  <th className="py-4 px-4">Items &amp; Quantity</th>
                  <th className="py-4 px-4">Payment</th>
                  <th className="py-4 px-4">Total Amount</th>
                  <th className="py-4 px-4">Current Workflow Status</th>
                  <th className="py-4 px-4 text-right">Workflow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredOrders.map((ord) => {
                  const statusUpper = (ord.status || 'PENDING').toUpperCase();
                  const dateStr = new Date(ord.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={ord.id} className="hover:bg-purple-50/20 transition-colors">
                      
                      {/* Order Reference */}
                      <td className="py-4 px-4 align-top">
                        <span className="font-bold text-[#6C307D] font-mono text-sm block">#{ord.orderNumber}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{dateStr}</span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-4 align-top">
                        <span className="font-bold text-slate-900 block">{ord.customerName}</span>
                        <span className="text-[11px] text-slate-600 block">{ord.phone}</span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-xs">{ord.shippingAddress}</span>
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-1">
                          {(ord.items || []).map((it: any, idx: number) => (
                            <div key={idx} className="text-[11px] text-slate-700">
                              <span className="font-bold text-slate-900">{it.productName}</span>
                              <span className="text-slate-400 font-normal"> (Size: {it.size || 'M'}, Qty: {it.quantity || 1})</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-4 align-top">
                        <span className="font-bold text-slate-800 uppercase text-[11px] block">{ord.paymentMethod || 'COD'}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded inline-block mt-1 ${
                          (ord.paymentStatus || '').toUpperCase() === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.paymentStatus || 'PENDING'}
                        </span>
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4 align-top">
                        <span className="font-serif font-bold text-[#6C307D] text-sm block">
                          ₹{(ord.total || 0).toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Current Status Badge */}
                      <td className="py-4 px-4 align-top">
                        {statusUpper === 'PENDING' && (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[10px] px-2.5 py-1 rounded-full inline-flex items-center gap-1 shadow-2xs">
                            🟡 NEW ORDER (PENDING)
                          </span>
                        )}
                        {statusUpper === 'PROCESSING' && (
                          <span className="bg-blue-100 text-blue-900 border border-blue-300 font-extrabold text-[10px] px-2.5 py-1 rounded-full inline-flex items-center gap-1 shadow-2xs">
                            ⚙️ IN WAREHOUSE (PACKING)
                          </span>
                        )}
                        {statusUpper === 'SHIPPED' && (
                          <span className="bg-purple-100 text-purple-900 border border-purple-300 font-extrabold text-[10px] px-2.5 py-1 rounded-full inline-flex items-center gap-1 shadow-2xs">
                            🚚 IN TRANSIT ({ord.trackingNumber || 'AWB-PENDING'})
                          </span>
                        )}
                        {statusUpper === 'DELIVERED' && (
                          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-[10px] px-2.5 py-1 rounded-full inline-flex items-center gap-1 shadow-2xs">
                            ✅ DELIVERED &amp; CLOSED
                          </span>
                        )}
                        {statusUpper === 'CANCELLED' && (
                          <span className="bg-red-100 text-red-900 border border-red-300 font-extrabold text-[10px] px-2.5 py-1 rounded-full inline-flex items-center gap-1 shadow-2xs">
                            🔴 CANCELLED
                          </span>
                        )}
                      </td>

                      {/* Workflow Action Buttons */}
                      <td className="py-4 px-4 align-top text-right space-y-1.5">
                        
                        {/* Step 1: Approve Order if PENDING */}
                        {statusUpper === 'PENDING' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'PROCESSING')}
                            disabled={updating}
                            className="w-full bg-[#6C307D] hover:bg-[#522061] text-white text-[11px] font-bold uppercase tracking-wider py-1.5 px-3 rounded shadow-xs transition-colors flex items-center justify-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve &amp; Pack
                          </button>
                        )}

                        {/* Step 2: Ship Order if PROCESSING or PENDING */}
                        {(statusUpper === 'PROCESSING' || statusUpper === 'PENDING') && (
                          <button
                            onClick={() => {
                              setShippingModalOrder(ord);
                              setTrackingNoInput('AWB' + Math.floor(1000000000 + Math.random() * 9000000000));
                            }}
                            disabled={updating}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold uppercase tracking-wider py-1.5 px-3 rounded shadow-xs transition-colors flex items-center justify-center gap-1"
                          >
                            <Truck className="w-3.5 h-3.5" /> Dispatch &amp; Ship
                          </button>
                        )}

                        {/* Step 3: Mark Delivered if SHIPPED */}
                        {statusUpper === 'SHIPPED' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'DELIVERED')}
                            disabled={updating}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-wider py-1.5 px-3 rounded shadow-xs transition-colors flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Delivered
                          </button>
                        )}

                        {/* Invoice & Cancel Buttons */}
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="text-[#6C307D] hover:underline font-bold text-[11px] inline-flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" /> Invoice
                          </button>

                          {statusUpper !== 'DELIVERED' && statusUpper !== 'CANCELLED' && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to cancel Order #${ord.orderNumber}?`)) {
                                  handleUpdateStatus(ord.id, 'CANCELLED');
                                }
                              }}
                              className="text-red-600 hover:underline font-bold text-[11px] inline-flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Cancel
                            </button>
                          )}
                        </div>

                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: DISPATCH & COURIER AWB ASSIGNMENT MODAL */}
      {shippingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShippingModalOrder(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-base">
                <Truck className="w-5 h-5" />
                <span>Dispatch &amp; Ship Order</span>
              </div>
              <button
                onClick={() => setShippingModalOrder(null)}
                className="text-slate-400 hover:text-slate-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3">
              <p className="text-slate-600 font-medium">
                Assign courier tracking details for Order <span className="font-bold text-slate-900 font-mono">#{shippingModalOrder.orderNumber}</span>.
              </p>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Select Logistics / Courier Partner
                </label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-bold focus:border-blue-600 outline-none"
                >
                  <option value="BlueDart Express">BlueDart Express</option>
                  <option value="Delhivery Surface">Delhivery Surface</option>
                  <option value="XpressBees Courier">XpressBees Courier</option>
                  <option value="DTDC Express">DTDC Express</option>
                  <option value="Shadowfax Logistics">Shadowfax Logistics</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Tracking AWB Number
                </label>
                <input
                  type="text"
                  value={trackingNoInput}
                  onChange={(e) => setTrackingNoInput(e.target.value)}
                  placeholder="e.g. AWB9841029482"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-mono font-bold focus:border-blue-600 outline-none"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-[11px] text-blue-800 font-medium">
                Customer will receive an automated tracking update in their store profile.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setShippingModalOrder(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updating || !trackingNoInput.trim()}
                onClick={() => handleUpdateStatus(shippingModalOrder.id, 'SHIPPED', `${courierName}: ${trackingNoInput}`)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md disabled:opacity-50"
              >
                {updating ? 'Shipping...' : 'Confirm Dispatch & Ship'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: TAX INVOICE & PACKING SLIP PRINT MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          <div className="relative bg-white rounded-xl max-w-2xl w-full p-8 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="font-bold tracking-widest text-[#6C307D] text-lg uppercase block font-serif">
                  SANUSHA TAX INVOICE
                </span>
                <span className="text-xs text-slate-500 font-mono">Order Reference: #{selectedOrder.orderNumber}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-4 text-slate-700">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 uppercase text-[10px] block text-slate-400">Shipping Address</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedOrder.customerName}</p>
                  <p className="text-slate-600 mt-1">{selectedOrder.shippingAddress}</p>
                  <p className="text-slate-600 mt-1">Phone: {selectedOrder.phone}</p>
                  <p className="text-slate-600">Email: {selectedOrder.email}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-900 uppercase text-[10px] block text-slate-400">Payment &amp; Status</span>
                  <p className="font-bold text-slate-900 mt-0.5">Method: {selectedOrder.paymentMethod || 'COD'}</p>
                  <p className="text-slate-600">Status: {selectedOrder.paymentStatus || 'PENDING'}</p>
                  <p className="text-slate-600 mt-2 font-mono text-[11px]">
                    Date: {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-bold uppercase text-slate-600 border-b">
                    <tr>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Qty</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {(selectedOrder.items || []).map((it: any, i: number) => (
                      <tr key={i}>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{it.productName}</td>
                        <td className="py-2.5 px-3">{it.size || 'M'}</td>
                        <td className="py-2.5 px-3">{it.quantity || 1}</td>
                        <td className="py-2.5 px-3 text-right font-serif font-bold text-slate-900">
                          ₹{(it.price * (it.quantity || 1)).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Price Calculation Summary */}
              <div className="space-y-1.5 text-xs text-right border-t pt-3 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{(selectedOrder.subtotal || selectedOrder.total).toLocaleString('en-IN')}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount Savings</span>
                    <span>- ₹{(selectedOrder.discount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping &amp; Handling</span>
                  <span className="font-bold text-emerald-700 uppercase text-[10px]">FREE</span>
                </div>
                <div className="flex justify-between items-center text-base font-serif font-bold text-slate-900 border-t pt-2 mt-2">
                  <span>Grand Total</span>
                  <span className="text-[#6C307D]">₹{(selectedOrder.total || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded-md text-xs font-bold uppercase"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="bg-[#6C307D] text-white px-5 py-2 rounded-md text-xs font-bold uppercase inline-flex items-center gap-1.5 shadow-md hover:bg-[#522061]"
              >
                <Printer className="w-4 h-4" /> Print Tax Invoice
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
