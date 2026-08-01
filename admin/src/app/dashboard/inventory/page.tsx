'use client';

import React, { useEffect, useState } from 'react';
import { Boxes, Package, AlertTriangle, RefreshCw, Save, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function InventoryManagementPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);

  const loadInventory = () => {
    setLoading(true);
    fetchApi('/products')
      .then((data) => {
        setProducts(data);
        const initialStock: Record<string, number> = {};
        data.forEach((p: any) => (initialStock[p.id] = p.stock || 50));
        setStockUpdates(initialStock);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleUpdateStock = async (id: string) => {
    const newStock = stockUpdates[id];
    try {
      await fetchApi(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ stock: Number(newStock) }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      loadInventory();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory & Stock Control</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Monitor real-time warehouse stock, adjust SKU inventory, and handle low stock alerts
          </p>
        </div>

        {saved && (
          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Stock Level Updated Live!
          </span>
        )}
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-slate-500">Loading inventory data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Item Details</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Warehouse Status</th>
                  <th className="py-3.5 px-4">Stock Quantity</th>
                  <th className="py-3.5 px-4 text-right">Update Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded border border-slate-200" />
                      <div>
                        <span className="font-bold text-slate-900 block">{p.name}</span>
                        <span className="text-[10px] text-slate-400">{p.material}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-600">{p.sku}</td>

                    <td className="py-3.5 px-4">
                      {p.stock > 15 ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-emerald-200">
                          In Stock ({p.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Low Stock
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <input
                        type="number"
                        value={stockUpdates[p.id] ?? p.stock}
                        onChange={(e) =>
                          setStockUpdates({ ...stockUpdates, [p.id]: Number(e.target.value) })
                        }
                        className="w-24 border border-slate-300 rounded p-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#6C307D]"
                      />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleUpdateStock(p.id)}
                        className="bg-[#6C307D] hover:bg-[#522061] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md inline-flex items-center gap-1 transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" /> Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
