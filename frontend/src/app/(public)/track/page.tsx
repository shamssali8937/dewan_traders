'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Truck, CheckCircle, Clock, RefreshCw, XCircle, MapPin,
  Package, Calendar, HelpCircle, FileText, Compass, Sparkles
} from 'lucide-react';
import { useTrackOrder } from '@/hooks/useOrders';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';

const STATUS_STEP: Record<string, number> = {
  pending: 1, confirmed: 2, processing: 3, shipped: 4, delivered: 5, cancelled: 0,
};

const STATUS_LABEL: Record<string, { label: string; color: string; icon: any }> = {
  pending:    { label: 'Pending Approval',   color: 'bg-amber-50 border-amber-200 text-amber-600',   icon: Clock },
  confirmed:  { label: 'Contract Confirmed', color: 'bg-blue-50 border-blue-200 text-blue-600',     icon: CheckCircle },
  processing: { label: 'In Processing',      color: 'bg-purple-50 border-purple-200 text-purple-600', icon: RefreshCw },
  shipped:    { label: 'Shipped (Ocean)',    color: 'bg-cyan-50 border-cyan-200 text-cyan-600',     icon: Truck },
  delivered:  { label: 'Cargo Delivered',    color: 'bg-emerald-50 border-emerald-200 text-emerald-600', icon: CheckCircle },
  cancelled:  { label: 'Cancelled',          color: 'bg-red-50 border-red-200 text-red-500',       icon: XCircle },
};

const TRACK_STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

export default function PublicTrackingPage() {
  const [query, setQuery] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  const { data: order, isLoading, error, isRefetching } = useTrackOrder(orderNumber);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOrderNumber(query.trim().toUpperCase());
    }
  };

  const st = order ? (STATUS_LABEL[order.status] || STATUS_LABEL.pending) : null;
  const StIcon = st?.icon;

  return (
    <div className="bg-white min-h-screen pt-28 pb-20 relative overflow-hidden pattern-dots-light">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-50 w-[550px] h-[550px] top-[5%] right-[-100px]" />
        <div className="fluid-blob bg-teal-50 w-[400px] h-[400px] bottom-[5%] left-[-150px]" />
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-10">
          <span className="text-primary text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 mb-1">
            <Compass size={12} className="animate-spin-slow" /> Global Logistics Tracking
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">Cargo & Order Tracker</h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Enter your unique Dewan Traders order reference number (e.g. <span className="font-mono font-bold text-primary">DT-XXXXXXXXXXXXX</span>) to view live clearing, packing, and ocean freight tracking logs.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-10">
          <div className="glass rounded-2xl p-2 border border-slate-200/80 bg-white/95 shadow-md flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Order Reference Number..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-transparent text-slate-800 text-xs sm:text-sm font-bold uppercase tracking-wider placeholder:text-slate-300 placeholder:normal-case focus:outline-none"
              />
            </div>
            <button type="submit" disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10 transition-all flex items-center gap-1.5 shrink-0">
              {isLoading ? <RefreshCw size={12} className="animate-spin" /> : <><Compass size={12} /> Track Cargo</>}
            </button>
          </div>
        </form>

        {/* Output */}
        {isLoading ? (
          <div className="glass rounded-3xl p-10 border border-slate-100 bg-white/80 shadow-md animate-pulse space-y-6">
            <div className="flex justify-between">
              <div className="h-6 bg-slate-100 rounded w-1/3" />
              <div className="h-6 bg-slate-100 rounded w-1/4" />
            </div>
            <div className="h-8 bg-slate-50 rounded w-full" />
            <div className="space-y-3">
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
          </div>
        ) : error ? (
          <div className="glass rounded-3xl p-10 border border-red-100 bg-red-50/20 shadow-sm text-center space-y-4">
            <XCircle size={40} className="text-red-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Reference Not Found</h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
              We could not find an active shipment matching <span className="font-mono font-bold text-slate-800">{orderNumber}</span>. Please verify your invoice number and try again.
            </p>
          </div>
        ) : order ? (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="glass rounded-3xl border border-slate-100 bg-white/80 shadow-lg overflow-hidden">
              
              {/* Top Banner */}
              <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest block">Reference ID</span>
                  <span className="text-sm font-black text-slate-800 font-mono">{order.orderNumber}</span>
                </div>
                {st && StIcon && (
                  <span className={`inline-flex items-center gap-1.5 text-[10px] px-3.5 py-1.5 rounded-full font-bold border ${st.color}`}>
                    <StIcon size={12} className={order.status === 'processing' ? 'animate-spin' : ''} /> {st.label}
                  </span>
                )}
              </div>

              {/* Progress Timeline */}
              <div className="px-6 py-10 border-b border-slate-50">
                {order.status === 'cancelled' ? (
                  <div className="flex items-center justify-center gap-2 py-4 text-red-500">
                    <XCircle size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">This contract order was cancelled</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 right-0 top-4 h-0.5 bg-slate-100 z-0" />
                    <div
                      className="absolute left-0 top-4 h-0.5 bg-gradient-to-r from-primary to-sky-500 z-0 transition-all duration-700"
                      style={{ width: `${Math.max(0, ((STATUS_STEP[order.status] || 1) - 1) / 4) * 100}%` }}
                    />
                    {TRACK_STEPS.map((step, idx) => {
                      const stepNum = idx + 1;
                      const current = STATUS_STEP[order.status] || 1;
                      const done = stepNum < current;
                      const active = stepNum === current;
                      return (
                        <div key={step} className="flex flex-col items-center gap-2 z-10">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${
                            done ? 'bg-primary border-primary text-white' :
                            active ? 'bg-white border-primary text-primary shadow-md shadow-primary/20' :
                            'bg-white border-slate-200 text-slate-300'
                          }`}>
                            {done ? <CheckCircle size={13} /> : stepNum}
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-wider ${
                            active ? 'text-primary' : done ? 'text-slate-600' : 'text-slate-300'
                          }`}>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Specs & Cargo Details */}
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Logistics Date</span>
                    <span className="text-slate-800 flex items-center gap-1.5"><Calendar size={13} /> {formatDate(order.createdAt)}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Freight Tracking ID</span>
                    <span className="text-primary font-bold font-mono uppercase">
                      {order.trackingNumber ? order.trackingNumber : 'Pending Assign'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500 border-t border-slate-100 pt-4">
                  {order.shippingAddress && (
                    <div className="space-y-1 col-span-2">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">Destination Address</span>
                      <span className="text-slate-800 flex items-center gap-1.5"><MapPin size={13} className="text-primary shrink-0" /> {order.shippingAddress}</span>
                    </div>
                  )}
                  {order.estimatedDelivery && (
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">Target Delivery Date</span>
                      <span className="text-slate-800 flex items-center gap-1.5"><Calendar size={13} className="text-primary shrink-0" /> {order.estimatedDelivery}</span>
                    </div>
                  )}
                  {order.paymentMethod && (
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">Payment Method</span>
                      <span className="text-slate-800 uppercase">{order.paymentMethod.replace('_', ' ')}</span>
                    </div>
                  )}
                  {parseNotes(order.notes).map((item: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">{item.label}</span>
                      <span className="text-slate-800">{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Items */}
                <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Cargo Manifest
                  </div>
                  <div className="divide-y divide-slate-50">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-4 text-xs font-bold text-slate-800">
                        <div className="flex items-center gap-3">
                          <Package size={14} className="text-primary" />
                          <div>
                            <p>{item.product?.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{item.quantity} {item.product?.unit}</p>
                          </div>
                        </div>
                        <span>{formatPrice(item.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="glass rounded-3xl p-16 text-center border border-slate-100 bg-white/80 shadow-md space-y-4">
            <Compass className="mx-auto text-slate-300 animate-spin-slow" size={44} />
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Awaiting Cargo Reference</h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
              Enter your trade invoice or logistics reference ID above to query current customs clearing and ocean route milestones.
            </p>
          </div>
        )}

        {/* Footer Support */}
        <div className="mt-12 text-center text-xs text-slate-400 font-semibold flex items-center justify-center gap-1">
          <HelpCircle size={13} /> Need assistance? <Link href="/contact" className="text-primary hover:underline font-bold">Contact Export Helpdesk</Link>
        </div>
      </div>
    </div>
  );
}

function parseNotes(notes: string) {
  if (!notes) return [];
  if (notes.includes(' | ')) {
    return notes.split(' | ').map(part => {
      const [label, val] = part.split(': ');
      return { label: label || 'Detail', value: val || '' };
    });
  }
  return [{ label: 'Order Specs', value: notes }];
}
