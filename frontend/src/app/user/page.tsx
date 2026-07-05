'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Package, Send, Clock, CheckCircle, Truck, XCircle,
  ArrowRight, User, Building2, MapPin, Phone, Mail, Sparkles,
  FileText, ChevronRight, RefreshCw, Boxes, Star, CreditCard,
  Lock, Calendar, Check, Trash2, HelpCircle, Bell, Upload, Eye, File, ArrowLeft, Globe, Settings, LogOut, ChevronLeft
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useMyOrders } from '@/hooks/useOrders';
import { formatPrice, formatDate, getInitials, resolveImageUrl } from '@/lib/utils';
import { useAuth, useUpdateProfile } from '@/hooks/useAuth';
import { toast } from 'sonner';
import DewanTradersLogo from '@/components/dewan_trader_logo';

const STATUS_LABEL: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending Payment', color: 'bg-amber-50 border-amber-200 text-amber-700', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-50 border-blue-200 text-blue-700', icon: CheckCircle },
  processing: { label: 'Processing', color: 'bg-purple-50 border-purple-200 text-purple-700', icon: RefreshCw },
  shipped: { label: 'Shipped', color: 'bg-cyan-50 border-cyan-200 text-cyan-700', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-emerald-50 border-emerald-200 text-emerald-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 border-red-200 text-red-755', icon: XCircle },
};

const TRACK_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const STEP_LABELS = ['Pending Payment', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

export default function UserDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();
  const updateProfile = useUpdateProfile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: orders, isLoading: loadingOrders, refetch: refetchOrders } = useMyOrders();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'track' | 'upload' | 'notifications' | 'profile'>('overview');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const [mounted, setMounted] = useState(false);
  const [paymentAccounts, setPaymentAccounts] = useState<any[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  // File Upload State
  const [uploadOrderSelection, setUploadOrderSelection] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');

  // In-app Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    companyName: '',
    companyReg: '',
    taxNumber: '',
    businessType: '',
    address: '',
    city: '',
    country: 'Pakistan',
    postalCode: '',
    website: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'orders', 'track', 'upload', 'notifications', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated, mounted]);

  useEffect(() => {
    if (!mounted || !isAuthenticated) return;
    setLoadingAccounts(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    fetch(`${apiUrl}/payment-accounts/active`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPaymentAccounts(data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingAccounts(false));
  }, [mounted, isAuthenticated]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        companyName: user.companyName || '',
        companyReg: user.companyReg || '',
        taxNumber: user.taxNumber || '',
        businessType: user.businessType || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || 'Pakistan',
        postalCode: user.postalCode || '',
        website: user.website || ''
      });
    }
  }, [user]);

  // Load In-app Notifications
  const loadNotifications = () => {
    setLoadingNotifications(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    fetch(`${apiUrl}/notifications`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setNotifications(data.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingNotifications(false));
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated, activeTab]);

  const markAllNotificationsRead = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    fetch(`${apiUrl}/notifications/read-all`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          toast.success('All notifications marked as read');
          loadNotifications();
        }
      });
  };

  const markNotificationRead = (id: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    fetch(`${apiUrl}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          loadNotifications();
        }
      });
  };

  const ordersList: any[] = Array.isArray(orders) ? orders : (orders as any)?.orders ?? [];

  const stats = {
    total: ordersList.length,
    pending: ordersList.filter((o: any) => o.status === 'pending').length,
    processing: ordersList.filter((o: any) => o.status === 'processing').length,
    delivered: ordersList.filter((o: any) => o.status === 'delivered').length,
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(profileForm);
  };

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadOrderSelection) {
      toast.error('Please select an order reference.');
      return;
    }
    if (!selectedFile) {
      toast.error('Please select a payment screenshot receipt file.');
      return;
    }

    setUploadingProof(true);
    const formData = new FormData();
    formData.append('receipt', selectedFile);
    if (paymentReference) {
      formData.append('referenceNumber', paymentReference);
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const res = await fetch(`${apiUrl}/orders/${uploadOrderSelection}/payment`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Payment receipt uploaded successfully. Admin notified.');
        setSelectedFile(null);
        setFilePreview(null);
        setUploadOrderSelection('');
        setPaymentReference('');
        refetchOrders();
        setActiveTab('orders');
      } else {
        toast.error(data.message || 'Upload failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Logistics error during upload.');
    } finally {
      setUploadingProof(false);
    }
  };

  const sidebarLinks = [
    { id: 'overview', label: 'Console Overview', icon: Sparkles },
    { id: 'orders', label: 'Sourcing Orders', icon: Package, badge: stats.pending > 0 ? stats.pending : undefined },
    { id: 'track', label: 'Track Cargo', icon: Truck },
    { id: 'upload', label: 'Upload Receipt', icon: Upload },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.read).length || undefined },
    { id: 'profile', label: 'Company Profile', icon: User },
  ];

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbf9]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbf9] text-slate-800 flex font-sans">
      
      {/* 1. Sidebar Panel */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0 sticky top-0 h-screen hidden md:flex">
        <div className="p-6 space-y-8 flex-1 overflow-y-auto">
          {/* Logo brand */}
          <Link href="/" className="flex items-center justify-center group shrink-0 transition-transform hover:scale-[1.02] border-b border-slate-100 pb-5">
            <DewanTradersLogo width={110} />
          </Link>

          {/* User profile brief */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-150 text-emerald-800 font-extrabold text-xs flex items-center justify-center uppercase">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black truncate">{user.name}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{user.role}</div>
            </div>
          </div>

          {/* Links */}
          <nav className="space-y-1.5">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => { setActiveTab(link.id as any); setSelectedOrder(null); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-primary text-white shadow-md shadow-primary/10' 
                      : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon size={15} className={isActive ? 'text-white' : 'text-slate-450'} />
                    {link.label}
                  </span>
                  {link.badge && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black border uppercase ${
                      isActive ? 'bg-white text-primary border-white' : 'bg-red-50 text-red-500 border-red-100'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-slate-100 space-y-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider border border-slate-200 transition-all"
          >
            <ChevronLeft size={13} /> Back to Website
          </Link>
          <button
            onClick={() => logout()}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-red-100 transition-all"
          >
            <LogOut size={13} /> Log Out
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <main className="flex-1 overflow-y-auto h-screen p-6 md:p-10 relative">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="fluid-blob bg-emerald-100/10 w-[400px] h-[400px] top-[10%] right-[-100px]" />
        </div>

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          
          {/* Header Mobile Toolbar / Title */}
          <div className="flex justify-between items-center md:items-end border-b border-slate-200/60 pb-5">
            <div>
              <span className="text-slate-400 text-[9px] font-black tracking-widest uppercase block mb-1">Customer Workspace</span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">
                {activeTab === 'overview' && 'Console Overview'}
                {activeTab === 'orders' && 'Sourcing Orders'}
                {activeTab === 'track' && 'Track Shipment'}
                {activeTab === 'upload' && 'Upload Payment Screenshot'}
                {activeTab === 'notifications' && 'In-app Notifications'}
                {activeTab === 'profile' && 'Company Registry info'}
              </h2>
            </div>

            {/* Mobile menu trigger */}
            <div className="md:hidden flex gap-2">
              <Link href="/" className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 bg-white" title="Home">
                <ChevronLeft size={16} />
              </Link>
              <button 
                onClick={() => logout()}
                className="p-2 border border-red-200 rounded-xl hover:bg-red-50 bg-white text-red-500" 
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

          {/* Mobile Tab Pills */}
          <div className="md:hidden flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            {sidebarLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => { setActiveTab(link.id as any); setSelectedOrder(null); }}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border shrink-0 transition-all ${
                  activeTab === link.id
                    ? 'bg-primary text-white border-transparent'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* ═══ TAB CONTENTS ════════════════════════════════════════ */}
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Stats cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Orders', value: stats.total, icon: ShoppingCart, color: 'from-blue-500 to-indigo-500' },
                    { label: 'Pending Payment', value: stats.pending, icon: Clock, color: 'from-amber-500 to-orange-500' },
                    { label: 'Processing Cargo', value: stats.processing, icon: RefreshCw, color: 'from-purple-500 to-violet-500' },
                    { label: 'Delivered Items', value: stats.delivered, icon: CheckCircle, color: 'from-emerald-500 to-green-500' },
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="glass rounded-3xl p-5 border border-slate-200 bg-white shadow-sm flex flex-col justify-between min-h-[110px] card-hover">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-primary">
                          <Icon size={15} />
                        </div>
                        <div>
                          <div className="text-xl font-extrabold text-slate-800 tracking-tight">{stat.value}</div>
                          <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider mt-1">{stat.label}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Main panel row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Orders List */}
                  <div className="lg:col-span-2 glass rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-[#fafbf9]">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Recent Sourcing Orders</h4>
                      <button onClick={() => setActiveTab('orders')} className="text-[10px] text-primary font-black hover:underline uppercase tracking-wider">All Orders &rarr;</button>
                    </div>
                    
                    {ordersList.length === 0 ? (
                      <div className="p-12 text-center text-slate-400 font-medium">
                        No orders registered.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {ordersList.slice(0, 3).map((order: any) => {
                          const status = STATUS_LABEL[order.status] || { label: order.status, color: 'bg-slate-100 text-slate-600 border-slate-250', icon: Clock };
                          return (
                            <div key={order.id} className="p-4.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                              <div>
                                <p className="text-xs font-bold text-slate-800">{order.orderNumber}</p>
                                <p className="text-[10px] text-slate-500 font-medium mt-1">{formatDate(order.createdAt)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-black text-slate-800">{formatPrice(order.total, 'PKR', order.notes)}</p>
                                <span className={`inline-block text-[8px] px-2 py-0.5 rounded-full capitalize font-black border mt-1 shadow-sm ${status.color}`}>
                                  {status.label}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Bank detail reminder */}
                  <div className="glass rounded-3xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700 pb-2 border-b border-slate-100">Payment Accounts</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      Select one of our active bank accounts below to complete wire payments directly.
                    </p>
                    <div className="space-y-2">
                      {paymentAccounts.slice(0, 2).map((acc) => (
                        <div key={acc.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-1 text-[11px]">
                          <div className="font-black text-slate-800 text-[10px] uppercase tracking-wide truncate">{acc.bankName}</div>
                          <div className="text-slate-500 truncate">{acc.accountTitle}</div>
                          <div className="font-mono text-slate-700 font-semibold truncate">{acc.accountNumber}</div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setActiveTab('upload')} className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all">
                      Upload Screenshot Proof
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {ordersList.length === 0 ? (
                  <div className="glass rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm space-y-3">
                    <Package className="mx-auto text-slate-350" size={32} />
                    <h4 className="text-xs font-black uppercase text-slate-900">No Orders logged</h4>
                    <p className="text-xs text-slate-500">Submit a catalog check first.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ordersList.map((order: any) => {
                      const status = STATUS_LABEL[order.status] || { label: order.status, color: 'bg-slate-100 text-slate-500 border-slate-200', icon: Clock };
                      return (
                        <div key={order.id} className="glass rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                          <div className="flex justify-between items-center p-5 bg-[#fafbf9] border-b border-slate-200/50">
                            <div>
                              <span className="text-xs font-bold text-slate-800">{order.orderNumber}</span>
                              <span className="text-[10px] text-slate-500 block mt-1 font-semibold">{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-extrabold text-slate-900 block">{formatPrice(order.total, 'PKR', order.notes)}</span>
                              <span className={`inline-block text-[8px] px-2.5 py-0.5 rounded-full capitalize font-black border mt-1 shadow-sm ${status.color}`}>
                                {status.label}
                              </span>
                            </div>
                          </div>
                          <div className="p-5 space-y-4">
                            <div className="divide-y divide-slate-100">
                              {order.items?.map((item: any) => (
                                <div key={item.id} className="flex justify-between py-2 text-xs font-semibold">
                                  <div className="flex gap-2">
                                    <span className="text-primary font-bold">{item.quantity} {item.product?.unit || 'kg'} &times;</span>
                                    <span className="text-slate-700">{item.product?.name}</span>
                                  </div>
                                  <span className="text-slate-850 font-bold">{formatPrice(item.total, 'PKR', order.notes)}</span>
                                </div>
                              ))}
                            </div>
                            
                            {order.status === 'pending' && (
                              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                  onClick={() => {
                                    setUploadOrderSelection(order.id);
                                    setActiveTab('upload');
                                  }}
                                  className="px-4 py-2 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-md transition-all"
                                >
                                  Upload Payment Screenshot
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setActiveTab('track');
                                  }}
                                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all"
                                >
                                  Track Details
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* TRACK TAB */}
            {activeTab === 'track' && (
              <motion.div
                key="track"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="glass rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-2">Select Active Order Reference</label>
                    <select
                      value={selectedOrder?.id || ''}
                      onChange={(e) => {
                        const ord = ordersList.find(o => o.id === e.target.value);
                        setSelectedOrder(ord || null);
                      }}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Choose Order...</option>
                      {ordersList.map(o => (
                        <option key={o.id} value={o.id}>{o.orderNumber} - {formatDate(o.createdAt)} ({o.status.toUpperCase()})</option>
                      ))}
                    </select>
                  </div>

                  {selectedOrder ? (
                    <div className="space-y-8 pt-4 border-t border-slate-100">
                      {/* Order status headers */}
                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <span className="text-[9px] text-slate-450 uppercase font-black tracking-wide block">Shipment Method</span>
                          <span className="font-bold text-slate-850 uppercase">{selectedOrder.paymentMethod === 'bank_transfer' ? 'Local Trucking' : 'Container Sea Freight'}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-slate-450 uppercase font-black tracking-wide block">Cargo Status</span>
                          <span className="font-bold text-primary uppercase">{selectedOrder.status}</span>
                        </div>
                      </div>

                      {/* Tracker Progress Timeline */}
                      <div className="relative pt-6 pb-6">
                        <div className="absolute left-1/2 md:left-0 md:right-0 top-10 bottom-6 md:top-1/2 md:bottom-auto h-full md:h-1 bg-slate-150 -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 z-0" />
                        
                        {/* Dynamic progress bar fill */}
                        <div 
                          className="absolute left-1/2 md:left-0 md:right-auto top-10 md:top-1/2 h-0 md:h-1 bg-primary -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 z-0 transition-all duration-500" 
                          style={{
                            width: typeof window !== 'undefined' && window.innerWidth > 768 
                              ? `${(Math.max(0, TRACK_STEPS.indexOf(selectedOrder.status)) / (TRACK_STEPS.length - 1)) * 100}%`
                              : '0px',
                            height: typeof window !== 'undefined' && window.innerWidth <= 768 
                              ? `${(Math.max(0, TRACK_STEPS.indexOf(selectedOrder.status)) / (TRACK_STEPS.length - 1)) * 100}%`
                              : 'auto'
                          }}
                        />

                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 relative z-10">
                          {TRACK_STEPS.map((step, idx) => {
                            const currentStepIdx = TRACK_STEPS.indexOf(selectedOrder.status);
                            const isCompleted = idx <= currentStepIdx;
                            const isCurrent = idx === currentStepIdx;
                            return (
                              <div key={step} className="flex flex-col items-center text-center space-y-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                                  isCompleted 
                                    ? 'bg-primary text-white border-transparent shadow-sm' 
                                    : 'bg-white text-slate-400 border-slate-200/80'
                                } ${isCurrent ? 'ring-4 ring-emerald-500/20' : ''}`}>
                                  {isCompleted ? <Check size={14} className="stroke-[3]" /> : <span className="text-[10px] font-black">{idx + 1}</span>}
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-wider text-slate-800">{STEP_LABELS[idx]}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Cargo tracking code box */}
                      {(selectedOrder.trackingNumber || selectedOrder.estimatedDelivery) && (
                        <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-2 text-xs font-semibold text-slate-650">
                          {selectedOrder.trackingNumber && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Milestone Reference:</span>
                              <span className="font-mono text-slate-800 font-bold uppercase tracking-wider">{selectedOrder.trackingNumber}</span>
                            </div>
                          )}
                          {selectedOrder.estimatedDelivery && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Estimated Port Arrival:</span>
                              <span className="text-slate-850 font-bold">{selectedOrder.estimatedDelivery}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-400 font-medium text-xs">
                      No order selected. Choose one from the dropdown above to view shipping status milestones.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* UPLOAD TAB */}
            {activeTab === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="glass rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 pb-3 border-b border-slate-100">Upload wire payment receipt</h3>
                  
                  <form onSubmit={handleUploadSubmit} className="space-y-5 text-xs font-semibold text-slate-700">
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Select Pending Order</label>
                      <select
                        value={uploadOrderSelection}
                        onChange={(e) => setUploadOrderSelection(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                        required
                      >
                        <option value="">Select Reference...</option>
                        {ordersList.filter(o => o.status === 'pending').map(o => (
                          <option key={o.id} value={o.id}>{o.orderNumber} - {formatDate(o.createdAt)} ({formatPrice(o.total, 'PKR', o.notes)})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Transaction reference number</label>
                      <input 
                        type="text"
                        placeholder="e.g. TR-9827361846"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                      />
                    </div>

                    {/* File Drop Area */}
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2 block">Upload receipt receipt / screenshot file (JPEG/PNG, Max 5MB)</label>
                      
                      <div className="border-2 border-dashed border-slate-200 hover:border-primary/50 transition-colors rounded-2xl p-6 text-center bg-slate-50/50 relative cursor-pointer group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          required={!filePreview}
                        />
                        <Upload size={32} className="mx-auto text-slate-400 group-hover:text-primary transition-colors mb-3" />
                        <span className="text-xs text-slate-700 font-bold block mb-1">Drag and drop file here</span>
                        <span className="text-[10px] text-slate-450 block font-semibold">Or tap to browse documents</span>
                      </div>
                    </div>

                    {/* File preview */}
                    {filePreview && (
                      <div className="p-4.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-white">
                            <img src={filePreview} alt="Receipt preview" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 truncate max-w-[180px]">{selectedFile?.name}</p>
                            <p className="text-[9px] text-slate-450 mt-0.5 font-bold">{(selectedFile!.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => { setSelectedFile(null); setFilePreview(null); }}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 rounded-xl transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={uploadingProof || !uploadOrderSelection || !selectedFile}
                      className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-primary/10 transition-all disabled:opacity-60"
                    >
                      {uploadingProof ? 'Uploading Screenshot...' : 'Submit Payment Proof'}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="glass rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">In-app notifications</h3>
                    {notifications.filter(n => !n.read).length > 0 && (
                      <button 
                        onClick={markAllNotificationsRead}
                        className="text-[9px] font-black text-primary hover:underline uppercase tracking-wider"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {loadingNotifications ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-16 bg-slate-50 border border-slate-100 rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 font-medium text-xs space-y-2">
                      <Bell size={24} className="mx-auto opacity-40 mb-2" />
                      No notifications logged.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {notifications.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => !n.read && markNotificationRead(n.id)}
                          className={`py-4 flex items-start gap-4 transition-colors cursor-pointer rounded-2xl px-2 hover:bg-slate-50/50 ${!n.read ? 'bg-emerald-50/20' : ''}`}
                        >
                          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                            !n.read ? 'bg-emerald-50 text-emerald-800 border-emerald-150' : 'bg-slate-50 text-slate-400 border-slate-200'
                          }`}>
                            <Bell size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs ${!n.read ? 'font-bold text-slate-900' : 'font-medium text-slate-650'}`}>{n.message}</p>
                            <span className="text-[9px] text-slate-450 block mt-1 font-bold">{formatDate(n.createdAt)}</span>
                          </div>
                          {!n.read && (
                            <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-3" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="glass rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                  <form onSubmit={handleProfileUpdate} className="space-y-6 text-xs font-semibold text-slate-700">
                    
                    <div className="pb-3 border-b border-slate-100">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Company Registry Data</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">Ensure these credentials match official billing records.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Contact Name *</label>
                        <input 
                          type="text" 
                          value={profileForm.name} 
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                          required 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Mobile Phone / WhatsApp</label>
                        <input 
                          type="text" 
                          value={profileForm.phone} 
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Company Name</label>
                        <input 
                          type="text" 
                          value={profileForm.companyName} 
                          onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Business Registry ID</label>
                        <input 
                          type="text" 
                          value={profileForm.companyReg} 
                          onChange={(e) => setProfileForm({ ...profileForm, companyReg: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                          placeholder="e.g. Reg-2873163-9"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-5">
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">NTN / Tax ID</label>
                        <input 
                          type="text" 
                          value={profileForm.taxNumber} 
                          onChange={(e) => setProfileForm({ ...profileForm, taxNumber: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                          placeholder="e.g. 1234567-8"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Business Class</label>
                        <select 
                          value={profileForm.businessType} 
                          onChange={(e) => setProfileForm({ ...profileForm, businessType: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 font-bold focus:outline-none"
                        >
                          <option value="">Select...</option>
                          <option value="importer">Importer</option>
                          <option value="distributor">Distributor</option>
                          <option value="wholesaler">Wholesaler</option>
                          <option value="manufacturer">Manufacturer</option>
                          <option value="retailer">Retailer</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Corporate Website</label>
                        <input 
                          type="text" 
                          value={profileForm.website} 
                          onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                          placeholder="e.g. www.globalfoods.com"
                        />
                      </div>
                    </div>

                    <div className="pb-3 border-b border-slate-100 pt-3">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Shipping & Billing Address</h3>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-5">
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Corporate Address *</label>
                        <input 
                          type="text" 
                          value={profileForm.address} 
                          onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                          required 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">City *</label>
                        <input 
                          type="text" 
                          value={profileForm.city} 
                          onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                          required 
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Country *</label>
                        <input 
                          type="text" 
                          value={profileForm.country} 
                          onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                          required 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Postal / ZIP Code</label>
                        <input 
                          type="text" 
                          value={profileForm.postalCode} 
                          onChange={(e) => setProfileForm({ ...profileForm, postalCode: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={updateProfile.isPending}
                      className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-primary/10 transition-all disabled:opacity-60"
                    >
                      {updateProfile.isPending ? 'Saving Settings...' : 'Update Corporate Profile'}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}
