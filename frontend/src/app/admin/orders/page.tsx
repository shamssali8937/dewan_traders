'use client';

import { useState } from 'react';
import { Search, ShoppingCart, ArrowRight } from 'lucide-react';
import { useAllOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';

const STATUS_OPTIONS = ['pending','confirmed','processing','shipped','delivered','cancelled'];
const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-amber-50 border-amber-250 text-amber-700',
  confirmed: 'bg-blue-50 border-blue-200 text-blue-700',
  processing: 'bg-purple-50 border-purple-200 text-purple-700',
  shipped: 'bg-cyan-50 border-cyan-200 text-cyan-700',
  delivered: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  cancelled: 'bg-red-50 border-red-200 text-red-700',
};

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAllOrders({ status: statusFilter || undefined, page, limit: 15 });
  const { mutate: updateStatus } = useUpdateOrderStatus();

  const orders = data?.orders || [];
  const pagination = data?.pagination;
  const filtered = search
    ? orders.filter((o: any) =>
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.name.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  return (
    <div className="space-y-6">
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-slate-800 uppercase tracking-wide">Orders Registry</h1>
        <p className="text-slate-500 text-xs mt-0.5 font-semibold">{pagination?.total || 0} wholesale order manifests found</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Search by order number or customer name..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 shadow-sm" />
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setStatusFilter('')} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
            !statusFilter
              ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-sm'
              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-850 hover:bg-slate-50'
          }`}>All</button>
          {STATUS_OPTIONS.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all capitalize border ${
                statusFilter === s
                  ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-850 hover:bg-slate-50'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-3xl border border-slate-200/80 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto animate-fade-in">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                {['Order #','Customer','Items Count','Grand Total','Payment Status','Cargo Status','Actions'].map((h) => (
                  <th key={h} className="text-slate-500 font-black uppercase tracking-wider px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-slate-100 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center space-y-2">
                    <ShoppingCart className="mx-auto text-slate-400" size={32} />
                    <p className="text-slate-550 font-black uppercase tracking-wider text-xs">No orders registered</p>
                  </td>
                </tr>
              ) : filtered.map((order: any) => (
                <tr key={order.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-extrabold text-slate-900">{order.orderNumber}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{formatDate(order.createdAt)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-800">{order.user?.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold">{order.user?.email}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-500 font-semibold">{order.items?.length} items</td>
                  <td className="px-5 py-4 font-black text-slate-800">{formatPrice(order.total, 'PKR', order.notes)}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-block text-[9px] px-2.5 py-0.5 rounded-full font-black border capitalize shadow-sm ${
                      order.paymentStatus === 'paid' ? 'bg-emerald-50 border-emerald-250 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <select value={order.status}
                      onChange={(e) => updateStatus({ id: order.id, status: e.target.value })}
                      className={`text-[9px] px-3 py-1 rounded-xl capitalize font-black border focus:outline-none cursor-pointer shadow-sm ${STATUS_COLOR[order.status] || 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="bg-white text-slate-850 capitalize font-semibold">{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="p-2.5 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-100 text-slate-500 hover:text-primary inline-flex transition-all">
                      <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-slate-200 bg-slate-50/20">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all border ${
                  page === p
                    ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
