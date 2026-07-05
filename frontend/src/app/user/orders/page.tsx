'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, Package, ArrowRight, Clock, Sparkles, ChevronLeft } from 'lucide-react';
import { useMyOrders } from '@/hooks/useOrders';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatPrice, formatDate } from '@/lib/utils';

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-amber-50 border-amber-200 text-amber-700',
  confirmed: 'bg-blue-50 border-blue-200 text-blue-700',
  processing: 'bg-purple-50 border-purple-200 text-purple-700',
  shipped: 'bg-cyan-50 border-cyan-200 text-cyan-700',
  delivered: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  cancelled: 'bg-red-50 border-red-200 text-red-700',
};

export default function UserOrdersPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { data: orders, isLoading } = useMyOrders();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated, mounted]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbf9]">
        <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const ordersList = Array.isArray(orders) ? orders : (orders as any)?.orders ?? [];

  return (
    <div className="bg-[#fafbf9] min-h-screen pt-24 relative overflow-hidden pattern-dots-light pb-16">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-emerald-100/10 w-[450px] h-[450px] top-[15%] right-[-100px]" />
      </div>

      <section className="py-12 relative z-10">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 border-b border-slate-200/60 pb-6">
            <div className="space-y-1.5">
              <Link href="/user" className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-450 hover:text-primary tracking-widest mb-1 transition-all">
                <ChevronLeft size={12} /> Back to Dashboard
              </Link>
              <h1 className="text-3xl font-extrabold text-slate-900 leading-tight uppercase">My Orders</h1>
              <p className="text-slate-500 text-xs font-semibold">Track your active shipments & cargo files, {user?.name}</p>
            </div>
            <Link href="/catalog"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10 transition-all shrink-0">
              <Package size={13} /> Sourcing Index
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass rounded-3xl p-6 animate-pulse bg-white border border-slate-200/60 shadow-sm">
                  <div className="h-5 bg-slate-200 rounded w-40 mb-4" />
                  <div className="h-4 bg-slate-100 rounded w-64" />
                </div>
              ))}
            </div>
          ) : !ordersList || ordersList.length === 0 ? (
            <div className="glass rounded-3xl p-16 text-center border border-slate-200/60 bg-white shadow-sm space-y-5 max-w-lg mx-auto">
              <ShoppingBag className="mx-auto text-slate-400" size={38} />
              <h2 className="text-xs font-black text-slate-900 uppercase">No active orders found</h2>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">Sourcing contract drafts or cargo files appear here. Browse the product list and submit an RFQ to create your first entry.</p>
              <div className="pt-2">
                <Link href="/catalog" className="px-6 py-3.5 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10 transition-all">
                  Explore Commodities
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {ordersList.map((order: any, i: number) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <div className="glass rounded-3xl border border-slate-200/60 overflow-hidden bg-white shadow-sm hover:border-slate-350 transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200/50 bg-[#fafbf9]">
                      <div>
                        <p className="text-xs font-black text-slate-800">{order.orderNumber}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-1 font-semibold">
                          <Clock size={11} className="text-primary shrink-0" /> {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-extrabold text-slate-900">{formatPrice(order.total, 'PKR', order.notes)}</p>
                        <span className={`inline-block text-[8px] px-2.5 py-0.5 rounded-full capitalize font-black border mt-1.5 shadow-sm ${STATUS_COLOR[order.status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="divide-y divide-slate-100 px-6 py-2">
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4 py-3.5">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-primary shrink-0">
                            <Package size={15} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-slate-800 uppercase tracking-wide truncate">{item.product?.name}</p>
                            <p className="text-[10px] text-slate-500 mt-1 font-semibold">{item.quantity} {item.product?.unit || 'units'} &times; {formatPrice(item.unitPrice, 'PKR', order.notes)}</p>
                          </div>
                          <p className="text-xs font-black text-slate-800">{formatPrice(item.total, 'PKR', order.notes)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Tracking details */}
                    {(order.trackingNumber || order.estimatedDelivery) && (
                      <div className="px-6 py-3.5 bg-blue-50/40 border-t border-slate-200/50 text-[10px] text-slate-600 font-bold flex flex-col sm:flex-row gap-2 justify-between">
                        {order.trackingNumber && (
                          <div className="flex items-center gap-1">
                            <span>Freight Tracking:</span>
                            <span className="text-secondary font-black font-mono uppercase tracking-wider">{order.trackingNumber}</span>
                          </div>
                        )}
                        {order.estimatedDelivery && (
                          <div>
                            Target Delivery: <span className="text-secondary font-black">{order.estimatedDelivery}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
