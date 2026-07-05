'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package, ShoppingCart, MessageSquare, Users, ArrowRight, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useCms';
import { formatPrice, formatDate } from '@/lib/utils';

const ORDER_STATUS_COLOR: Record<string, string> = {
  pending: 'bg-amber-50 border-amber-250 text-amber-700',
  confirmed: 'bg-blue-50 border-blue-200 text-blue-700',
  processing: 'bg-purple-50 border-purple-200 text-purple-700',
  shipped: 'bg-cyan-50 border-cyan-200 text-cyan-700',
  delivered: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  cancelled: 'bg-red-50 border-red-200 text-red-700',
};

const INQUIRY_STATUS_COLOR: Record<string, string> = {
  pending: 'bg-amber-50 border-amber-250 text-amber-700',
  read: 'bg-blue-50 border-blue-200 text-blue-700',
  responded: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  closed: 'bg-slate-100 border-slate-200 text-slate-500',
};

export default function AdminDashboard() {
  const { data, isLoading } = useDashboardStats();
  const stats = data?.stats;
  const recentOrders = data?.recentOrders || [];
  const recentInquiries = data?.recentInquiries || [];

  const statCards = [
    { label: 'Total Users', value: stats?.users ?? '—', icon: Users, gradient: 'from-blue-500 to-indigo-500', href: '/admin/users' },
    { label: 'Products', value: stats?.products ?? '—', icon: Package, gradient: 'from-orange-500 to-amber-500', href: '/admin/products' },
    { label: 'Total Orders', value: stats?.orders ?? '—', icon: ShoppingCart, gradient: 'from-teal-500 to-emerald-500', href: '/admin/orders', badge: stats?.pendingOrders ? `${stats.pendingOrders} pending` : undefined },
    { label: 'Inquiries', value: stats?.inquiries ?? '—', icon: MessageSquare, gradient: 'from-emerald-500 to-primary-hover', href: '/admin/inquiries', badge: stats?.pendingInquiries ? `${stats.pendingInquiries} new` : undefined },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-800 uppercase tracking-wide">Enterprise Analytics</h1>
        <p className="text-slate-500 text-xs font-semibold">Welcome back to Dewan Traders Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ label, value, icon: Icon, gradient, href, badge }, idx) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
          >
            <Link href={href} className="group block">
              <div className="glass rounded-3xl p-5 border border-slate-200 bg-white card-hover flex flex-col justify-between h-full shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md shadow-primary/5`}>
                    <Icon size={16} />
                  </div>
                  {badge && (
                    <span className="text-[9px] bg-red-50 border border-red-100 text-red-500 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">{badge}</span>
                  )}
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-800 mb-1">
                    {isLoading ? <div className="h-7 w-12 bg-slate-100 rounded animate-pulse" /> : value}
                  </div>
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-wider">{label}</div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Tables Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Recent Orders */}
        <div className="glass rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-slate-150 bg-[#fafbf9]">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5"><ShoppingCart size={14} className="text-primary" /> Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-primary hover:text-primary-hover flex items-center gap-0.5 font-extrabold uppercase tracking-wider">
              View All &rarr;
            </Link>
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <ShoppingCart className="mx-auto text-slate-400" size={32} />
              <p className="text-xs text-slate-550 font-bold uppercase">No orders registered</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentOrders.map((order: any) => (
                <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center justify-between p-4.5 hover:bg-slate-50/50 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-slate-850">{order.orderNumber}</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-semibold">{order.user?.name} &middot; {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-800">{formatPrice(order.total, 'PKR', order.notes)}</p>
                    <span className={`inline-block text-[8px] px-2.5 py-0.5 rounded-full capitalize font-black border mt-1.5 shadow-sm ${ORDER_STATUS_COLOR[order.status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="glass rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-slate-150 bg-[#fafbf9]">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5"><MessageSquare size={14} className="text-primary" /> Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-xs text-primary hover:text-primary-hover flex items-center gap-0.5 font-extrabold uppercase tracking-wider">
              View All &rarr;
            </Link>
          </div>
          
          {recentInquiries.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <MessageSquare className="mx-auto text-slate-400" size={32} />
              <p className="text-xs text-slate-550 font-bold uppercase">No inquiries logged</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentInquiries.map((inquiry: any) => (
                <Link key={inquiry.id} href={`/admin/inquiries/${inquiry.id}`} className="flex items-center justify-between p-4.5 hover:bg-slate-50/50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-850 truncate">{inquiry.name}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-1 font-semibold">{inquiry.subject}</p>
                  </div>
                  <span className={`text-[8px] px-2.5 py-0.5 rounded-full shrink-0 ml-3 font-black uppercase border shadow-sm ${INQUIRY_STATUS_COLOR[inquiry.status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                    {inquiry.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Quick Actions */}
      <div className="glass rounded-3xl p-6 border border-slate-200 bg-white shadow-sm">
        <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3.5">
          {[
            { label: '+ Add Sourced Product', href: '/admin/products/new', style: 'bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white font-extrabold shadow-md shadow-primary/10' },
            { label: '+ Publish Journal post', href: '/admin/journal/new', style: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold' },
            { label: 'Edit Website Home', href: '/admin/pages/home', style: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold' },
            { label: 'View Website', href: '/', style: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold' },
          ].map(({ label, href, style }) => (
            <Link key={label} href={href}
              className={`px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm ${style}`}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
