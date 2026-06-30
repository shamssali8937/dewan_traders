'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Package, Send, Clock, CheckCircle, Truck, XCircle,
  ArrowRight, User, Building2, MapPin, Phone, Mail, Sparkles,
  FileText, ChevronRight, RefreshCw, Boxes, TrendingUp,
  Globe, Star
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useMyOrders } from '@/hooks/useOrders';
import { useCreateInquiry } from '@/hooks/useInquiries';
import { formatPrice, formatDate, getInitials } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const STATUS_STEP: Record<string, number> = {
  pending: 1, confirmed: 2, processing: 3, shipped: 4, delivered: 5, cancelled: 0,
};
const STATUS_LABEL: Record<string, { label: string; color: string; icon: any }> = {
  pending:    { label: 'Pending',    color: 'bg-amber-50 border-amber-200 text-amber-600',   icon: Clock },
  confirmed:  { label: 'Confirmed',  color: 'bg-blue-50 border-blue-200 text-blue-600',     icon: CheckCircle },
  processing: { label: 'Processing', color: 'bg-purple-50 border-purple-200 text-purple-600', icon: RefreshCw },
  shipped:    { label: 'Shipped',    color: 'bg-cyan-50 border-cyan-200 text-cyan-600',     icon: Truck },
  delivered:  { label: 'Delivered',  color: 'bg-emerald-50 border-emerald-200 text-emerald-600', icon: CheckCircle },
  cancelled:  { label: 'Cancelled',  color: 'bg-red-50 border-red-200 text-red-500',       icon: XCircle },
};

const TRACK_STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

const CATEGORIES = [
  { slug: 'fruits', label: 'Fresh Fruits', icon: '🍊', bg: 'bg-orange-50 border-orange-100', href: '/catalog/fruits' },
  { slug: 'vegetables', label: 'Vegetables', icon: '🥦', bg: 'bg-emerald-50 border-emerald-100', href: '/catalog/vegetables' },
  { slug: 'rice', label: 'Premium Rice', icon: '🌾', bg: 'bg-indigo-50 border-indigo-100', href: '/catalog/rice' },
  { slug: 'surgical', label: 'Surgical', icon: '🔬', bg: 'bg-sky-50 border-sky-100', href: '/catalog/surgical' },
  { slug: 'sports', label: 'Sports Goods', icon: '⚽', bg: 'bg-rose-50 border-rose-100', href: '/catalog/sports' },
];

export default function UserDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();
  const router = useRouter();
  const { data: orders, isLoading } = useMyOrders();
  const { mutate: sendInquiry, isPending: sending, isSuccess: sent } = useCreateInquiry();

  const [activeTab, setActiveTab] = useState<'orders' | 'track' | 'inquiry'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [inquiryForm, setInquiryForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', message: '', subject: 'General Product Inquiry' });

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated]);

  useEffect(() => {
    setInquiryForm(f => ({ ...f, name: user?.name || '', email: user?.email || '', phone: user?.phone || '' }));
  }, [user]);

  const ordersList: any[] = Array.isArray(orders) ? orders : (orders as any)?.orders ?? [];

  const stats = {
    total: ordersList.length,
    pending: ordersList.filter((o: any) => o.status === 'pending').length,
    shipped: ordersList.filter((o: any) => o.status === 'shipped').length,
    delivered: ordersList.filter((o: any) => o.status === 'delivered').length,
  };

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    sendInquiry(inquiryForm);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 relative overflow-hidden pattern-dots-light">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-50 w-[500px] h-[500px] top-[10%] right-[-150px]" />
        <div className="fluid-blob bg-teal-50 w-[350px] h-[350px] bottom-[10%] left-[-100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
          <div>
            <span className="text-primary text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 mb-1.5">
              <Sparkles size={11} /> Buyer Portal
            </span>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-slate-400 text-xs mt-0.5 font-semibold flex items-center gap-1.5">
              {user?.role === 'company' ? <Building2 size={11} /> : <User size={11} />}
              {user?.role === 'company' ? 'Company Account' : 'Individual Buyer'} &middot; {user?.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/catalog"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-primary to-sky-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10">
              <Package size={13} /> Browse Products
            </Link>
            <button onClick={() => logout()} className="px-4 py-2.5 border border-slate-200 text-slate-500 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all">
              Logout
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: stats.total, icon: Boxes, color: 'text-primary', bg: 'bg-sky-50 border-sky-100' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' },
            { label: 'In Transit', value: stats.shipped, icon: Truck, color: 'text-cyan-500', bg: 'bg-cyan-50 border-cyan-100' },
            { label: 'Delivered', value: stats.delivered, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <div className={`glass rounded-2xl p-4 border ${stat.bg} bg-white/80 shadow-sm`}>
                <div className={`w-8 h-8 rounded-lg ${stat.bg} border flex items-center justify-center mb-3`}>
                  <stat.icon size={15} className={stat.color} />
                </div>
                <p className="text-2xl font-black text-slate-800">{stat.value}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tab Nav */}
        <div className="flex gap-1 bg-slate-50 border border-slate-100 rounded-2xl p-1 mb-8 w-fit">
          {[
            { key: 'orders', label: 'My Orders', icon: ShoppingCart },
            { key: 'track', label: 'Track Order', icon: Truck },
            { key: 'inquiry', label: 'New Inquiry', icon: Send },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.key
                  ? 'bg-white border border-slate-100 text-primary shadow-sm'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <tab.icon size={12} /> {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Tab: My Orders ─── */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass rounded-3xl p-5 animate-pulse bg-white border border-slate-100 h-24" />
              ))
            ) : ordersList.length === 0 ? (
              <div className="glass rounded-3xl p-16 text-center border border-slate-100 bg-white/80 shadow-sm space-y-4">
                <ShoppingCart className="mx-auto text-slate-200" size={48} />
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">No Orders Yet</h2>
                <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
                  Browse our product catalog and submit a sourcing request or bulk quotation to get started.
                </p>
                <Link href="/catalog" className="inline-flex items-center gap-1.5 px-6 py-3 bg-gradient-to-r from-primary to-sky-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10">
                  <Package size={12} /> Explore Catalog
                </Link>
              </div>
            ) : (
              ordersList.map((order: any, i: number) => {
                const st = STATUS_LABEL[order.status] || STATUS_LABEL.pending;
                const StIcon = st.icon;
                return (
                  <motion.div key={order.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="glass rounded-3xl border border-slate-100 overflow-hidden bg-white/80 shadow-sm">
                      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50 bg-slate-50/40">
                        <div>
                          <p className="text-xs font-black text-slate-800 font-mono">{order.orderNumber}</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
                            <Clock size={10} /> {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-bold border ${st.color}`}>
                            <StIcon size={10} /> {st.label}
                          </span>
                          <button
                            onClick={() => { setSelectedOrder(order); setActiveTab('track'); }}
                            className="text-[10px] text-primary font-bold flex items-center gap-0.5 hover:underline"
                          >
                            Track <ChevronRight size={11} />
                          </button>
                        </div>
                      </div>

                      <div className="divide-y divide-slate-50">
                        {order.items?.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-3 px-5 py-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                              <Package size={13} className="text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">{item.product?.name}</p>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                {item.quantity} {item.product?.unit} &times; {formatPrice(item.unitPrice)}
                              </p>
                            </div>
                            <p className="text-xs font-black text-slate-800 shrink-0">{formatPrice(item.total)}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between px-5 py-3 bg-slate-50/30 border-t border-slate-50">
                        <div className="text-[10px] text-slate-400 font-semibold">
                          {order.trackingNumber && (
                            <span className="flex items-center gap-1 text-primary font-bold">
                              <Truck size={10} /> TRK: <span className="font-mono">{order.trackingNumber}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-black text-slate-800">{formatPrice(order.total)}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* ─── Tab: Track Order ─── */}
        {activeTab === 'track' && (
          <div className="space-y-6">
            {/* Order selector */}
            <div className="glass rounded-2xl p-4 border border-slate-100 bg-white/80 shadow-sm">
              <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2 block">Select Order to Track</label>
              <select
                value={selectedOrder?.id || ''}
                onChange={e => setSelectedOrder(ordersList.find((o: any) => o.id === e.target.value) || null)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-primary/40"
              >
                <option value="">— Choose an Order —</option>
                {ordersList.map((o: any) => (
                  <option key={o.id} value={o.id}>{o.orderNumber} &middot; {formatDate(o.createdAt)}</option>
                ))}
              </select>
            </div>

            {selectedOrder ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="glass rounded-3xl border border-slate-100 bg-white/80 shadow-sm overflow-hidden">
                  {/* Order Summary */}
                  <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/40">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black text-slate-800 font-mono">{selectedOrder.orderNumber}</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{formatDate(selectedOrder.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-800">{formatPrice(selectedOrder.total)}</p>
                        <p className="text-[10px] text-slate-400 font-semibold capitalize mt-0.5">{selectedOrder.paymentStatus} payment</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Stepper */}
                  <div className="px-6 py-8">
                    {selectedOrder.status === 'cancelled' ? (
                      <div className="flex items-center justify-center gap-2 py-6 text-red-500">
                        <XCircle size={20} />
                        <span className="text-sm font-bold">This order was cancelled</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between relative mb-6">
                          {/* Progress Line */}
                          <div className="absolute left-0 right-0 top-4 h-0.5 bg-slate-100 z-0" />
                          <div
                            className="absolute left-0 top-4 h-0.5 bg-gradient-to-r from-primary to-sky-500 z-0 transition-all duration-700"
                            style={{ width: `${Math.max(0, ((STATUS_STEP[selectedOrder.status] || 1) - 1) / 4) * 100}%` }}
                          />
                          {TRACK_STEPS.map((step, idx) => {
                            const stepNum = idx + 1;
                            const current = STATUS_STEP[selectedOrder.status] || 1;
                            const done = stepNum < current;
                            const active = stepNum === current;
                            return (
                              <div key={step} className="flex flex-col items-center gap-2 z-10">
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${
                                  done ? 'bg-primary border-primary text-white' :
                                  active ? 'bg-white border-primary text-primary shadow-md shadow-primary/20' :
                                  'bg-white border-slate-200 text-slate-300'
                                }`}>
                                  {done ? <CheckCircle size={14} /> : stepNum}
                                </div>
                                <span className={`text-[9px] font-bold uppercase tracking-wider ${
                                  active ? 'text-primary' : done ? 'text-slate-600' : 'text-slate-300'
                                }`}>{step}</span>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-center text-[10px] text-slate-400 font-semibold">
                          Status: <span className="text-primary font-bold capitalize">{selectedOrder.status}</span>
                          {selectedOrder.trackingNumber && (
                            <> &middot; Tracking No: <span className="font-mono text-slate-700">{selectedOrder.trackingNumber}</span></>
                          )}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Items */}
                  <div className="border-t border-slate-100 divide-y divide-slate-50">
                    {selectedOrder.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 px-6 py-3.5">
                        <Package size={13} className="text-primary shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-800">{item.product?.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{item.quantity} {item.product?.unit} &times; {formatPrice(item.unitPrice)}</p>
                        </div>
                        <p className="text-xs font-black text-slate-800">{formatPrice(item.total)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Address */}
                  {selectedOrder.shippingAddress && (
                    <div className="px-6 py-4 bg-slate-50/40 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
                      <MapPin size={12} className="text-primary mt-0.5 shrink-0" />
                      <span className="font-semibold">{selectedOrder.shippingAddress}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="glass rounded-3xl p-16 text-center border border-slate-100 bg-white/80 shadow-sm space-y-3">
                <Truck className="mx-auto text-slate-200" size={48} />
                <p className="text-slate-400 text-xs font-semibold">Select an order above to see its tracking timeline</p>
              </div>
            )}
          </div>
        )}

        {/* ─── Tab: New Inquiry ─── */}
        {activeTab === 'inquiry' && (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="glass rounded-3xl p-6 border border-slate-100 bg-white/80 shadow-sm">
                <h2 className="text-slate-800 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <FileText size={13} className="text-primary" /> Submit a Sourcing Inquiry
                </h2>
                <p className="text-[11px] text-slate-400 mb-5 font-semibold">
                  Tell us your product requirements and our team will respond within 24 hours.
                </p>

                {sent ? (
                  <div className="text-center py-10 space-y-3">
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-500 rounded-xl flex items-center justify-center mx-auto">
                      <CheckCircle size={24} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase">Inquiry Submitted!</h4>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                      Sajjad Hussain Awan and our team will review your request and respond via email.
                    </p>
                    <button onClick={() => window.location.reload()} className="text-primary text-xs font-bold flex items-center gap-1 mx-auto hover:underline">
                      <RefreshCw size={11} /> Submit Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquiry} className="space-y-4 text-xs font-semibold text-slate-700">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 block">Your Name *</label>
                        <input value={inquiryForm.name} onChange={e => setInquiryForm(f => ({ ...f, name: e.target.value }))} required
                          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 block">Email *</label>
                        <input type="email" value={inquiryForm.email} onChange={e => setInquiryForm(f => ({ ...f, email: e.target.value }))} required
                          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 block">Phone / WhatsApp</label>
                        <input value={inquiryForm.phone} onChange={e => setInquiryForm(f => ({ ...f, phone: e.target.value }))}
                          placeholder="+92 300 0000000"
                          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 block">Subject *</label>
                        <input value={inquiryForm.subject} onChange={e => setInquiryForm(f => ({ ...f, subject: e.target.value }))} required
                          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 block">Message / Requirements *</label>
                      <textarea value={inquiryForm.message} onChange={e => setInquiryForm(f => ({ ...f, message: e.target.value }))} required rows={5}
                        placeholder="Describe your product requirements, target quantity, destination port, and packaging preferences..."
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800 resize-none font-sans" />
                    </div>
                    <button type="submit" disabled={sending}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10 transition-all disabled:opacity-60">
                      <Send size={12} /> {sending ? 'Submitting...' : 'Send Inquiry'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar: Quick Browse */}
            <div className="lg:col-span-2 space-y-5">
              {/* Account Info */}
              <div className="glass rounded-3xl p-5 border border-slate-100 bg-white/80 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-sky-600 flex items-center justify-center text-white text-sm font-black shadow-sm">
                    {getInitials(user?.name || 'U')}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 capitalize">
                      {user?.role === 'company' ? <Building2 size={10} /> : <User size={10} />}
                      {user?.role} account
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="flex items-center gap-2 text-slate-500 font-semibold">
                    <Mail size={11} className="text-primary" /> {user?.email}
                  </div>
                  {user?.phone && (
                    <div className="flex items-center gap-2 text-slate-500 font-semibold">
                      <Phone size={11} className="text-primary" /> {user?.phone}
                    </div>
                  )}
                  {user?.city && (
                    <div className="flex items-center gap-2 text-slate-500 font-semibold">
                      <MapPin size={11} className="text-primary" /> {user?.city}
                    </div>
                  )}
                </div>
              </div>

              {/* Browse Categories */}
              <div className="glass rounded-3xl p-5 border border-slate-100 bg-white/80 shadow-sm">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Browse by Category</h3>
                <div className="space-y-2">
                  {CATEGORIES.map(cat => (
                    <Link key={cat.slug} href={cat.href}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${cat.bg} hover:shadow-sm transition-all group`}>
                      <span className="text-base">{cat.icon}</span>
                      <span className="text-[11px] font-bold text-slate-700 group-hover:text-primary transition-colors">{cat.label}</span>
                      <ArrowRight size={11} className="ml-auto text-slate-300 group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trust Card */}
              <div className="glass rounded-3xl p-5 border border-sky-100 bg-sky-50/60 shadow-sm space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={14} className="text-primary" />
                  <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Why Dewan Traders</h3>
                </div>
                {['Direct farm to port sourcing', 'Phytosanitary & ISO certified', 'Karachi port FOB/CIF support', 'Dedicated export team'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-[11px] text-slate-600 font-semibold">
                    <Star size={10} className="text-primary shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
