'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, Package, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { useMyOrders } from '@/hooks/useOrders';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatPrice, formatDate } from '@/lib/utils';

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-amber-50 border-amber-100 text-amber-600',
  confirmed: 'bg-blue-50 border-blue-100 text-blue-600',
  processing: 'bg-purple-50 border-purple-100 text-purple-600',
  shipped: 'bg-cyan-50 border-cyan-100 text-cyan-600',
  delivered: 'bg-emerald-50 border-emerald-100 text-emerald-600',
  cancelled: 'bg-red-50 border-red-100 text-red-600',
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-24 relative overflow-hidden pattern-dots-light pb-16">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-50 w-[450px] h-[450px] top-[15%] right-[-100px]" />
      </div>

      <section className="py-12 relative z-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
            <div>
              <span className="text-primary text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 mb-1.5">
                <Sparkles size={12} /> Buying Desk
              </span>
              <h1 className="text-3xl font-black text-slate-900 leading-tight">My Orders</h1>
              <p className="text-slate-500 text-xs mt-0.5 font-semibold">Welcome back, {user?.name}</p>
            </div>
            <Link href="/catalog"
              className="flex items-center gap-1.5 px-4.5 py-2.5 bg-gradient-to-r from-primary to-sky-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10">
              <Package size={13} /> Browse Catalog
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass rounded-3xl p-5 animate-pulse bg-white border border-slate-100">
                  <div className="h-5 bg-slate-100 rounded w-40 mb-3" />
                  <div className="h-4 bg-slate-100 rounded w-64" />
                </div>
              ))}
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="glass rounded-3xl p-16 text-center border border-slate-100 bg-white/80 shadow-sm space-y-4">
              <ShoppingCart className="mx-auto text-slate-500" size={40} />
              <h2 className="text-sm font-bold text-slate-800 uppercase">No orders yet</h2>
              <p className="text-slate-600 text-xs max-w-sm mx-auto leading-relaxed">Sourcing contract requests or invoices are processed here. Browse the product list and submit an RFQ to create your first order entry.</p>
              <div className="pt-2">
                <Link href="/catalog" className="px-6 py-3 bg-gradient-to-r from-primary to-sky-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10">
                  Explore Products
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: any, i: number) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <div className="glass rounded-3xl border border-slate-100 overflow-hidden bg-white/80 shadow-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{order.orderNumber}</p>
                        <p className="text-[10px] text-slate-600 flex items-center gap-1.5 mt-1 font-semibold">
                          <Clock size={11} className="text-primary shrink-0" /> {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-slate-800">{formatPrice(order.total, 'PKR', order.notes)}</p>
                        <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full capitalize font-bold border mt-1.5 ${STATUS_COLOR[order.status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="divide-y divide-slate-100">
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4 px-5 py-3.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-primary shrink-0">
                            <Package size={14} />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-slate-800">{item.product?.name}</p>
                            <p className="text-[10px] text-slate-600 mt-0.5 font-semibold">{item.quantity} {item.product?.unit || 'units'} &times; {formatPrice(item.unitPrice, 'PKR', order.notes)}</p>
                          </div>
                          <p className="text-xs font-bold text-slate-800">{formatPrice(item.total, 'PKR', order.notes)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Tracking details */}
                    {(order.trackingNumber || order.estimatedDelivery) && (
                      <div className="px-5 py-3 bg-sky-50/50 border-t border-slate-100 text-[10px] text-slate-500 font-semibold flex flex-col sm:flex-row gap-2 justify-between">
                        {order.trackingNumber && (
                          <div>
                            Freight Tracking: <span className="text-primary font-bold font-mono">{order.trackingNumber}</span>
                          </div>
                        )}
                        {order.estimatedDelivery && (
                          <div>
                            Target Delivery Date: <span className="text-primary font-bold">{order.estimatedDelivery}</span>
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
