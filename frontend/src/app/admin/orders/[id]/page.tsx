'use client';

import { use, useState, useEffect } from 'react';
import { useOrder, useUpdateOrderStatus } from '@/hooks/useOrders';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, ShoppingCart, User, MapPin, Truck, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';

const STATUS_OPTIONS = ['pending','confirmed','processing','shipped','delivered','cancelled'];
const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-amber-50 border-amber-100 text-amber-600',
  confirmed: 'bg-blue-50 border-blue-100 text-blue-600',
  processing: 'bg-purple-50 border-purple-100 text-purple-600',
  shipped: 'bg-cyan-50 border-cyan-100 text-cyan-600',
  delivered: 'bg-emerald-50 border-emerald-100 text-emerald-600',
  cancelled: 'bg-red-50 border-red-100 text-red-600',
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: order, isLoading } = useOrder(id);
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setTrackingNumber(order.trackingNumber || '');
    }
  }, [order]);

  const handleUpdate = () => {
    updateStatus({
      id,
      status,
      trackingNumber: trackingNumber || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="pt-20 space-y-6 max-w-4xl animate-pulse">
        <div className="h-6 bg-slate-100 rounded w-1/4" />
        <div className="h-96 bg-slate-50 border border-slate-100 rounded-3xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-20 text-center max-w-md mx-auto">
        <h2 className="text-sm font-bold text-slate-800 uppercase">Order Not Found</h2>
        <Link href="/admin/orders" className="text-primary hover:underline text-xs font-bold uppercase mt-4 block">&larr; Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors border border-transparent hover:border-slate-200">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Order Details</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-semibold">Invoice and status management for {order.orderNumber}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Left Columns: Items list & Addresses */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Items card */}
          <div className="glass rounded-3xl p-6 border border-slate-100 bg-white shadow-sm space-y-4">
            <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><ShoppingCart size={14} className="text-primary" /> Sourced Cargo Items</h3>
            
            <div className="divide-y divide-slate-100">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between py-3.5">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{item.product?.name || 'Cargo Item'}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">
                      {item.quantity} {item.product?.unit || 'units'} &times; {formatPrice(item.unitPrice)}
                    </p>
                  </div>
                  <span className="text-xs font-black text-slate-800">{formatPrice(item.total)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500 font-semibold">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-800 font-black text-sm border-t border-slate-50 pt-2">
                <span>Grand Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Logistics Address Card */}
          <div className="glass rounded-3xl p-6 border border-slate-100 bg-white/80 shadow-sm space-y-4">
            <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> Delivery Terminals</h3>
            
            <div className="grid sm:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
              <div>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-1">Discharge Port Address</p>
                <p className="font-semibold bg-slate-50 border border-slate-100 rounded-2xl p-3.5">{order.shippingAddress || '—'}</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-1">Billing Entity Address</p>
                <p className="font-semibold bg-slate-50 border border-slate-100 rounded-2xl p-3.5">{order.billingAddress || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status updates & Customer info */}
        <div className="space-y-6">
          
          {/* Status worksheet card */}
          <div className="glass rounded-3xl p-6 border border-slate-100 bg-white shadow-sm space-y-5">
            <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><Truck size={14} className="text-primary" /> Transit Status</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[9px] text-slate-400 uppercase tracking-widest font-bold block mb-1.5">Cargo Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200 shadow-sm capitalize font-bold">
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[9px] text-slate-400 uppercase tracking-widest font-bold block mb-1.5">Ocean Bill of Lading (Tracking #)</label>
                <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="e.g. OBL-93821034"
                  className="w-full px-3 py-2 bg-white rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200 shadow-sm font-mono font-bold" />
              </div>

              <button onClick={handleUpdate} disabled={isPending}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10 transition-all disabled:opacity-60">
                {isPending ? 'Updating...' : <><CheckCircle2 size={12} /> Save Sourcing Logs</>}
              </button>
            </div>
          </div>

          {/* Customer details card */}
          <div className="glass rounded-3xl p-6 border border-slate-100 bg-white/80 shadow-sm space-y-4">
            <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><User size={14} className="text-primary" /> Importer Profile</h3>
            
            <div className="space-y-3.5 text-xs text-slate-700">
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold block">Contact Officer</span>
                <p className="font-bold text-slate-800 mt-0.5">{order.user?.name}</p>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold block">Business Email</span>
                <p className="font-semibold text-slate-500 mt-0.5">{order.user?.email}</p>
              </div>
              {order.user?.companyName && (
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold block">Company Entity</span>
                  <p className="font-bold text-slate-800 mt-0.5">{order.user.companyName}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
