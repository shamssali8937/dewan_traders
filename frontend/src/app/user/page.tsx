'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Package, Send, Clock, CheckCircle, Truck, XCircle,
  ArrowRight, User, Building2, MapPin, Phone, Mail, Sparkles,
  FileText, ChevronRight, RefreshCw, Boxes, Star, CreditCard,
  Lock, Calendar, Check, Trash2, HelpCircle, Bell, Upload, Eye, File, ArrowLeft
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useMyOrders } from '@/hooks/useOrders';
import { formatPrice, formatDate, getInitials, resolveImageUrl } from '@/lib/utils';
import { useAuth, useUpdateProfile } from '@/hooks/useAuth';
import { toast } from 'sonner';

const STATUS_LABEL: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending Payment', color: 'bg-amber-50 border-amber-200 text-amber-600', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-50 border-blue-200 text-blue-600', icon: CheckCircle },
  processing: { label: 'Processing', color: 'bg-purple-50 border-purple-200 text-purple-600', icon: RefreshCw },
  shipped: { label: 'Shipped', color: 'bg-cyan-50 border-cyan-200 text-cyan-600', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-emerald-50 border-emerald-200 text-emerald-600', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 border-red-200 text-red-500', icon: XCircle },
};

const TRACK_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const STEP_LABELS = ['Pending Payment', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

export default function UserDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();
  const updateProfile = useUpdateProfile();
  const router = useRouter();
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

    // Check format
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      toast.error('Format not supported. Upload PDF, PNG, JPG files only.');
      return;
    }

    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const submitPaymentProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadOrderSelection) {
      toast.error('Please select an order reference.');
      return;
    }
    if (!selectedFile) {
      toast.error('Please select a payment screenshot receipt.');
      return;
    }

    setUploadingProof(true);
    const formData = new FormData();
    formData.append('receipt', selectedFile);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    try {
      const res = await fetch(`${apiUrl}/orders/${uploadOrderSelection}/payment-proof`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Payment receipt proof uploaded successfully!');
        setSelectedFile(null);
        setFilePreview(null);
        setUploadOrderSelection('');
        refetchOrders();
        setActiveTab('orders');
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploadingProof(false);
    }
  };

  const parseNotes = (notes: string) => {
    if (!notes) return [];
    if (notes.includes(' | ')) {
      return notes.split(' | ').map(part => {
        const [label, val] = part.split(': ');
        return { label: label || 'Detail', value: val || '' };
      });
    }
    return [{ label: 'Order Specs', value: notes }];
  };

  const getOrderStatusStep = (status: string) => {
    const idx = TRACK_STEPS.indexOf(status);
    return idx === -1 ? 0 : idx + 1;
  };

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen pt-24 pb-20 relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-50 w-[500px] h-[500px] top-[10%] right-[-150px] opacity-70" />
        <div className="fluid-blob bg-teal-50 w-[350px] h-[350px] bottom-[10%] left-[-100px] opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-8">

        {/* Dashboard Header */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
              <Sparkles size={11} /> Wholesale Dashboard
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Welcome, {user?.name}
            </h1>
            <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              {user?.userType === 'company' ? <Building2 size={13} /> : <User size={13} />}
              {user?.userType === 'company' ? user.companyName : 'Individual Trader'} &middot; {user?.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-sm">
              <ArrowLeft size={13} /> Back to Website
            </Link>
            <button onClick={() => logout()} className="px-4 py-2.5 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 font-bold rounded-xl text-xs uppercase tracking-wider transition-all">
              Logout
            </button>
          </div>
        </div>

        {/* Info Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Orders Placed', value: stats.total, icon: Boxes, color: 'text-sky-500', bg: 'bg-sky-50/50 border-sky-100' },
            { label: 'Pending Payment', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50/50 border-amber-100' },
            { label: 'Processing Sourcing', value: stats.processing, icon: RefreshCw, color: 'text-purple-500', bg: 'bg-purple-50/50 border-purple-100' },
            { label: 'Cargo Delivered', value: stats.delivered, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50/50 border-emerald-100' },
          ].map((stat, i) => (
            <div key={stat.label} className={`bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4`}>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} border flex items-center justify-center shrink-0`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <div>
                <p className="text-xl font-black text-slate-800 leading-none mb-1">{stat.value}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar Nav */}
          <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm space-y-1">
            {[
              { key: 'overview', label: 'Overview', icon: Boxes },
              { key: 'orders', label: 'My Orders', icon: ShoppingCart },
              { key: 'track', label: 'Track Shipment', icon: Truck },
              { key: 'upload', label: 'Upload Payment', icon: Upload },
              { key: 'notifications', label: 'Messages Logs', icon: Bell, count: notifications.filter(n => !n.isRead).length },
              { key: 'profile', label: 'Edit Profile', icon: User },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <tab.icon size={14} /> {tab.label}
                </span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-2 py-0.5 text-[9px] font-black rounded-full ${activeTab === tab.key ? 'bg-white text-primary' : 'bg-red-500 text-white'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Main Dashboard Panel */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm min-h-[400px] flex flex-col justify-between"
              >
                {/* ─── Tab: Overview ─── */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-slate-100 flex justify-between items-center">
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Dashboard Overview</h2>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Activity status</span>
                    </div>

                    {/* Notice Banner */}
                    <div className="bg-sky-50/70 border border-sky-100/50 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                      <div className="p-2 bg-sky-100 text-primary rounded-xl shrink-0 mt-0.5">
                        <Mail size={16} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-800">Trade Operations Contact Notice</p>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                          Dewan Traders trade officers will contact you through your registered <b>Email</b> or <b>WhatsApp</b> for cargo status, invoice verification, and shipping arrangements.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Recent Orders Overview */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Recent Sourcing Orders</h4>
                        {ordersList.slice(0, 3).length > 0 ? (
                          <div className="divide-y divide-slate-100">
                            {ordersList.slice(0, 3).map(order => {
                              const lbl = STATUS_LABEL[order.status] || STATUS_LABEL.pending;
                              return (
                                <div key={order.id} className="py-2.5 flex justify-between items-center text-xs">
                                  <div>
                                    <p className="font-bold text-slate-800 font-mono">{order.orderNumber}</p>
                                    <p className="text-[10px] text-slate-400 font-semibold">{formatDate(order.createdAt)}</p>
                                  </div>
                                  <span className={`text-[9px] px-2 py-0.5 rounded border ${lbl.color} font-bold`}>
                                    {lbl.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 font-semibold py-4">No orders placed yet.</p>
                        )}
                      </div>

                      {/* Recent Messages Notifications */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Latest Alerts</h4>
                        {notifications.slice(0, 3).length > 0 ? (
                          <div className="space-y-2">
                            {notifications.slice(0, 3).map(n => (
                              <div key={n.id} className={`p-3 border rounded-xl text-xs font-semibold ${n.isRead ? 'bg-slate-50/50 border-slate-100 text-slate-500' : 'bg-sky-50/20 border-sky-100/50 text-slate-700'}`}>
                                <p className="font-bold text-slate-800">{n.title}</p>
                                <p className="text-[10px] font-medium leading-relaxed mt-0.5">{n.message}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 font-semibold py-4">No recent notification alerts.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── Tab: My Orders ─── */}
                {activeTab === 'orders' && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-slate-100 flex justify-between items-center">
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Order Contracts history</h2>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{ordersList.length} orders</span>
                    </div>

                    {ordersList.length === 0 ? (
                      <div className="text-center py-12 space-y-3">
                        <ShoppingCart className="mx-auto text-slate-200" size={40} />
                        <p className="text-xs text-slate-500 font-medium">No order contracts placed yet.</p>
                        <Link href="/catalog" className="inline-block text-primary font-bold text-xs">Explore Catalog &rarr;</Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {ordersList.map(order => {
                          const lbl = STATUS_LABEL[order.status] || STATUS_LABEL.pending;
                          const Icon = lbl.icon;
                          return (
                            <div key={order.id} className="border border-slate-100 rounded-2xl p-4 space-y-3 hover:bg-slate-50/40 transition-colors">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-slate-50 gap-2">
                                <div>
                                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Reference #</span>
                                  <span className="font-bold text-slate-800 font-mono text-xs">{order.orderNumber}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`flex items-center gap-1 text-[9px] px-2.5 py-0.5 rounded-full border ${lbl.color} font-bold`}>
                                    <Icon size={10} /> {lbl.label}
                                  </span>
                                  {order.paymentProofStatus === 'pending_upload' && (
                                    <span className="text-[9px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded">Proof Needed</span>
                                  )}
                                  {order.paymentProofStatus === 'pending_verification' && (
                                    <span className="text-[9px] bg-amber-50 text-amber-600 font-bold px-2 py-0.5 rounded">Pending Verify</span>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-600">
                                <div>
                                  <span className="text-[9px] text-slate-400 block uppercase">Product</span>
                                  <span className="text-slate-800 truncate block">{order.items[0]?.product?.name || 'Commodity'}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-400 block uppercase">Total Quantity</span>
                                  <span className="text-slate-800">{order.items[0]?.quantity} {order.items[0]?.product?.unit || 'kg'}s</span>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-400 block uppercase">Contract Value</span>
                                  <span className="text-primary font-bold">{formatPrice(order.total)}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-400 block uppercase">Date Placed</span>
                                  <span className="text-slate-800">{formatDate(order.createdAt)}</span>
                                </div>
                              </div>

                              <div className="pt-3 flex justify-between items-center text-xs font-bold border-t border-slate-50">
                                <button
                                  onClick={() => { setSelectedOrder(order); setActiveTab('track'); }}
                                  className="text-primary hover:underline flex items-center gap-1"
                                >
                                  Track Stepper Progress <ChevronRight size={12} />
                                </button>
                                {order.paymentProofStatus === 'pending_upload' && (
                                  <button
                                    onClick={() => { setUploadOrderSelection(order.id); setActiveTab('upload'); }}
                                    className="px-3 py-1 bg-amber-500 text-white rounded-lg text-[10px] uppercase font-bold hover:bg-amber-600"
                                  >
                                    Upload Receipt
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* ─── Tab: Track Shipment ─── */}
                {activeTab === 'track' && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-slate-100 flex justify-between items-center">
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Cargo Logistics Stepper</h2>
                      {selectedOrder && (
                        <span className="font-mono text-[10px] text-slate-500 font-bold">Ref: {selectedOrder.orderNumber}</span>
                      )}
                    </div>

                    {!selectedOrder ? (
                      <div className="text-center py-12 space-y-4">
                        <Truck className="mx-auto text-slate-200" size={40} />
                        <p className="text-xs text-slate-500 font-medium">Select an order contract from your order history list to track cargo shipping progress.</p>
                        <button onClick={() => setActiveTab('orders')} className="px-4 py-2 bg-primary text-white text-xs font-bold uppercase rounded-xl">View Order List</button>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* Stepper Progress */}
                        <div className="relative pt-6 pb-2">
                          <div className="absolute top-9 left-4 right-4 h-0.5 bg-slate-100 z-0" />
                          <div
                            className="absolute top-9 left-4 h-0.5 bg-primary z-0 transition-all duration-500"
                            style={{ width: `${((getOrderStatusStep(selectedOrder.status) - 1) / (TRACK_STEPS.length - 1)) * 100}%` }}
                          />

                          <div className="relative z-10 flex justify-between">
                            {TRACK_STEPS.map((step, idx) => {
                              const currentStep = getOrderStatusStep(selectedOrder.status);
                              const isCompleted = currentStep > idx;
                              const isActive = currentStep === idx + 1;
                              const StepIcon = isCompleted ? Check : CircleIndicator;

                              return (
                                <div key={step} className="flex flex-col items-center gap-2">
                                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs transition-all ${isCompleted
                                      ? 'bg-primary border-primary text-white'
                                      : isActive
                                        ? 'bg-white border-primary text-primary ring-2 ring-primary/10'
                                        : 'bg-white border-slate-200 text-slate-400'
                                    }`}>
                                    {isCompleted ? <Check size={14} className="stroke-[2.5]" /> : idx + 1}
                                  </div>
                                  <span className={`text-[9px] font-bold uppercase tracking-wider text-center max-w-[80px] hidden sm:block ${isActive ? 'text-primary' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                                    }`}>
                                    {STEP_LABELS[idx]}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Stepper Details */}
                        <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-4">
                          <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cargo Contract Specifications</h4>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-semibold text-slate-600">
                            <div>
                              <span className="text-[9px] text-slate-400 block uppercase">Transit Method</span>
                              <span className="text-slate-800 uppercase">{selectedOrder.paymentMethodLabel || selectedOrder.paymentMethod?.replace('_', ' ') || 'Bank Wire'}</span>
                            </div>
                            {selectedOrder.trackingNumber && (
                              <div>
                                <span className="text-[9px] text-slate-400 block uppercase">Tracking Cargo Number</span>
                                <span className="font-mono text-slate-800">{selectedOrder.trackingNumber}</span>
                              </div>
                            )}
                            {selectedOrder.estimatedDelivery && (
                              <div>
                                <span className="text-[9px] text-slate-400 block uppercase">Target Delivery Date</span>
                                <span className="text-slate-800 font-bold text-primary">{selectedOrder.estimatedDelivery}</span>
                              </div>
                            )}
                            {parseNotes(selectedOrder.notes).map((item, idx) => (
                              <div key={idx}>
                                <span className="text-[9px] text-slate-400 block uppercase">{item.label}</span>
                                <span className="text-slate-800">{item.value}</span>
                              </div>
                            ))}
                          </div>

                          {selectedOrder.status === 'pending' && (
                            <div className="border-t border-slate-200/60 pt-4 space-y-3">
                              <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Payment Instructions</h5>
                              <p className="text-[11px] text-slate-500 font-medium">Please transfer the value to the matching company account:</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {paymentAccounts.filter(acc => {
                                  const expectedType = selectedOrder.paymentMethod === 'bank_transfer' ? 'bank' : selectedOrder.paymentMethod;
                                  return acc.type === expectedType;
                                }).map(acc => (
                                  <div key={acc.id} className="p-3 bg-white border border-slate-100 rounded-xl space-y-1 text-xs">
                                    <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                                      <span className="font-bold text-slate-800">{acc.bankName || 'Mobile Account'}</span>
                                      <span className="text-[9px] px-2 py-0.5 rounded bg-sky-100 text-sky-700 font-bold capitalize">{acc.type}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 font-semibold mt-1">
                                      <div>
                                        <span className="text-[8px] text-slate-400 block uppercase">Title</span>
                                        <span className="text-slate-800 font-bold">{acc.accountTitle}</span>
                                      </div>
                                      <div>
                                        <span className="text-[8px] text-slate-400 block uppercase">Number</span>
                                        <span className="text-slate-800 font-bold">{acc.accountNumber}</span>
                                      </div>
                                      {acc.iban && (
                                        <div className="col-span-2">
                                          <span className="text-[8px] text-slate-400 block uppercase">IBAN</span>
                                          <span className="font-mono text-slate-800 font-bold">{acc.iban}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedOrder.paymentProofNotes && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs">
                              <strong>Verification Note:</strong> {selectedOrder.paymentProofNotes}
                            </div>
                          )}
                        </div>

                        <button onClick={() => setSelectedOrder(null)} className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                          &larr; Choose another order
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ─── Tab: Upload Payment ─── */}
                {activeTab === 'upload' && (
                  <form onSubmit={submitPaymentProof} className="space-y-6">
                    <div className="pb-4 border-b border-slate-100 flex justify-between items-center">
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Upload Transaction receipt proof</h2>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Offline Bank Transfer</span>
                    </div>

                    <div className="space-y-4">
                      {/* Select Order */}
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Select Sourcing Order Contract *</label>
                        <select
                          value={uploadOrderSelection}
                          onChange={e => setUploadOrderSelection(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                          required
                        >
                          <option value="">-- Select Order Reference --</option>
                          {ordersList.filter(o => o.paymentProofStatus !== 'approved').map(o => (
                            <option key={o.id} value={o.id}>
                              {o.orderNumber} ({formatPrice(o.total)}) - {STATUS_LABEL[o.status]?.label || o.status}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Payment Account Credentials */}
                      {uploadOrderSelection && (
                        <div className="p-4 border border-slate-100 rounded-2xl bg-sky-50/20 space-y-3">
                          <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Company Payment Account Details</h4>
                          {paymentAccounts.filter(acc => {
                            const orderObj = ordersList.find(o => o.id === uploadOrderSelection);
                            if (!orderObj) return true;
                            const orderMethod = orderObj.paymentMethod;
                            const expectedType = orderMethod === 'bank_transfer' ? 'bank' : orderMethod;
                            return acc.type === expectedType;
                          }).length > 0 ? (
                            paymentAccounts.filter(acc => {
                              const orderObj = ordersList.find(o => o.id === uploadOrderSelection);
                              if (!orderObj) return true;
                              const orderMethod = orderObj.paymentMethod;
                              const expectedType = orderMethod === 'bank_transfer' ? 'bank' : orderMethod;
                              return acc.type === expectedType;
                            }).map(acc => (
                              <div key={acc.id} className="p-3.5 bg-white border border-slate-100 rounded-xl space-y-2 text-xs">
                                <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                                  <span className="font-bold text-slate-800">{acc.bankName || 'Mobile Account'}</span>
                                  <span className="text-[9px] px-2 py-0.5 rounded bg-sky-100 text-sky-700 font-bold capitalize">{acc.type}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 font-semibold">
                                  <div>
                                    <span className="text-[8px] text-slate-400 block uppercase">Title</span>
                                    <span className="text-slate-800 font-bold">{acc.accountTitle}</span>
                                  </div>
                                  <div>
                                    <span className="text-[8px] text-slate-400 block uppercase">Account Number</span>
                                    <span className="text-slate-800 font-bold">{acc.accountNumber}</span>
                                  </div>
                                  {acc.iban && (
                                    <div className="col-span-2">
                                      <span className="text-[8px] text-slate-400 block uppercase">IBAN</span>
                                      <span className="font-mono text-slate-800 font-bold">{acc.iban}</span>
                                    </div>
                                  )}
                                  {acc.branch && (
                                    <div className="col-span-2">
                                      <span className="text-[8px] text-slate-400 block uppercase">Branch</span>
                                      <span className="text-slate-700">{acc.branch}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-[11px] text-slate-500 font-medium">No active accounts match the payment method of this order contract. Please contact support.</p>
                          )}
                        </div>
                      )}

                      {!uploadOrderSelection && (
                        <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-3">
                          <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dewan Traders Active Payment Accounts</h4>
                          {paymentAccounts.length > 0 ? (
                            <div className="space-y-2">
                              {paymentAccounts.map(acc => (
                                <div key={acc.id} className="p-3 bg-white border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                                  <div>
                                    <p className="font-bold text-slate-800">{acc.bankName || (acc.type === 'easypaisa' ? 'EasyPaisa Account' : 'JazzCash Account')}</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">Title: {acc.accountTitle} &middot; No: {acc.accountNumber}</p>
                                  </div>
                                  <span className="text-[9px] px-2 py-0.5 rounded bg-sky-100 text-sky-700 font-bold capitalize shrink-0">{acc.type}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 font-medium animate-pulse">Loading active payment accounts...</p>
                          )}
                        </div>
                      )}

                      {/* Dropzone */}
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1.5 block">Screenshot Receipt or PDF file *</label>
                        <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center cursor-pointer">
                          <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.png,.jpg,.jpeg"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <Upload className="text-slate-300 mb-3" size={32} />
                          <span className="text-xs font-bold text-slate-700 block">Click to select or drag & drop</span>
                          <span className="text-[9px] text-slate-400 mt-1">Accepted formats: JPG, JPEG, PNG, PDF (Max: 5MB)</span>
                        </div>
                      </div>

                      {/* File preview */}
                      {selectedFile && (
                        <div className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between bg-slate-50">
                          <div className="flex items-center gap-3 min-w-0">
                            {selectedFile.type.startsWith('image/') && filePreview ? (
                              <img src={filePreview} alt="Receipt preview" className="w-10 h-10 object-cover rounded-lg border shrink-0" />
                            ) : (
                              <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center shrink-0">
                                <File size={20} />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">{selectedFile.name}</p>
                              <p className="text-[9px] text-slate-400 font-semibold">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setSelectedFile(null); setFilePreview(null); }}
                            className="p-1 hover:bg-red-50 text-red-500 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={uploadingProof || !selectedFile || !uploadOrderSelection}
                      className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-primary/10 disabled:opacity-50"
                    >
                      {uploadingProof ? 'Uploading Receipt...' : 'Submit Transaction Proof'}
                    </button>
                  </form>
                )}

                {/* ─── Tab: Notifications ─── */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-slate-100 flex justify-between items-center">
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Messages Log Alerts</h2>
                      {notifications.some(n => !n.isRead) && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[10px] text-primary font-bold uppercase hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    {/* Company Communication Notice */}
                    <div className="bg-sky-50/70 border border-sky-100/50 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                      <div className="p-2 bg-sky-100 text-primary rounded-xl shrink-0 mt-0.5">
                        <Mail size={16} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-800">Trade Operations Contact Notice</p>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                          Dewan Traders trade officers will contact you through your registered **Email** or **WhatsApp** for cargo status, invoice verification, and shipping arrangements. Please ensure your contact details are active.
                        </p>
                      </div>
                    </div>

                    {loadingNotifications ? (
                      <div className="space-y-3 py-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="h-14 bg-slate-50 animate-pulse rounded-xl" />
                        ))}
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="text-center py-12 space-y-3">
                        <Bell className="mx-auto text-slate-200" size={40} />
                        <p className="text-xs text-slate-500 font-medium">No alerts received yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => !n.isRead && markNotificationRead(n.id)}
                            className={`p-4 border rounded-2xl flex justify-between items-start gap-4 transition-all cursor-pointer ${n.isRead
                                ? 'bg-white border-slate-100 text-slate-500'
                                : 'bg-sky-50/20 border-sky-100/50 text-slate-800 font-semibold'
                              }`}
                          >
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-slate-800">{n.title}</p>
                              <p className="text-[11px] font-medium leading-relaxed">{n.message}</p>
                              <p className="text-[9px] text-slate-400 font-semibold">{formatDate(n.createdAt)}</p>
                            </div>
                            {!n.isRead && (
                              <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ─── Tab: Edit Profile ─── */}
                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="pb-4 border-b border-slate-100 flex justify-between items-center">
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Company & Personal Profile</h2>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Secure Settings</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                      <div>
                        <label className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 block">Full Representative Name *</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 block">Active Contact phone *</label>
                        <input
                          type="text"
                          value={profileForm.phone}
                          onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 block">Company Name</label>
                        <input
                          type="text"
                          value={profileForm.companyName}
                          onChange={e => setProfileForm({ ...profileForm, companyName: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 block">Company NTN / Tax Number</label>
                        <input
                          type="text"
                          value={profileForm.taxNumber}
                          onChange={e => setProfileForm({ ...profileForm, taxNumber: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 block">Corporate Address</label>
                        <input
                          type="text"
                          value={profileForm.address}
                          onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 block">City</label>
                        <input
                          type="text"
                          value={profileForm.city}
                          onChange={e => setProfileForm({ ...profileForm, city: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 block">Country</label>
                        <input
                          type="text"
                          value={profileForm.country}
                          onChange={e => setProfileForm({ ...profileForm, country: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={updateProfile.isPending}
                      className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-primary/10"
                    >
                      {updateProfile.isPending ? 'Saving settings...' : 'Save Profile Changes'}
                    </button>
                  </form>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}

function CircleIndicator(props: any) {
  return <div className="w-2.5 h-2.5 rounded-full bg-slate-200" {...props} />;
}
