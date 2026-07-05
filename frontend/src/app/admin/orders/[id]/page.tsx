'use client';

import { use, useState, useEffect } from 'react';
import { useOrder, useUpdateOrderStatus } from '@/hooks/useOrders';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, ShoppingCart, User, MapPin, Truck, CheckCircle2, ShieldCheck, Download, AlertTriangle, FileText, Check, X, ChevronLeft } from 'lucide-react';
import { formatPrice, formatDate, resolveImageUrl } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: order, isLoading } = useOrder(id);
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [rejectNotes, setRejectNotes] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setTrackingNumber(order.trackingNumber || '');
      setEstimatedDelivery(order.estimatedDelivery || '');
    }
  }, [order]);

  const handleUpdate = () => {
    updateStatus({
      id,
      status,
      trackingNumber: trackingNumber || undefined,
      estimatedDelivery: status === 'shipped' ? estimatedDelivery : undefined,
    });
  };

  const handleVerify = async (targetStatus: string) => {
    if (targetStatus === 'rejected' && !rejectNotes) {
      toast.error('Please specify verification notes / rejection reason.');
      return;
    }

    setVerifying(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    try {
      const res = await fetch(`${apiUrl}/orders/${id}/verify-payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
        },
        body: JSON.stringify({
          status: targetStatus,
          notes: rejectNotes || undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Payment verified status set to: ${targetStatus.toUpperCase()}`);
        setShowRejectForm(false);
        setRejectNotes('');
        window.location.reload();
      } else {
        toast.error(data.message || 'Verification update failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit verification.');
    } finally {
      setVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-20 space-y-6 max-w-4xl animate-pulse bg-[#fafbf9]">
        <div className="h-6 bg-slate-200 rounded w-1/4" />
        <div className="h-96 bg-slate-100 border border-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-20 text-center max-w-md mx-auto bg-[#fafbf9]">
        <h2 className="text-sm font-bold text-slate-800 uppercase">Order Not Found</h2>
        <Link href="/admin/orders" className="text-primary hover:underline text-xs font-bold uppercase mt-4 block">&larr; Back to Orders</Link>
      </div>
    );
  }

  const paymentMethodLabel =
    order.paymentMethod === 'bank_transfer'
      ? 'Bank Wire Transfer'
      : order.paymentMethod === 'easypaisa'
      ? 'EasyPaisa Wallet'
      : order.paymentMethod === 'jazzcash'
      ? 'JazzCash Wallet'
      : 'N/A';

  return (
    <div className="space-y-6 max-w-4xl font-sans relative z-10">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200 transition-all">
          <ChevronLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 uppercase tracking-wide">Order Specifications</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-semibold">Verification dashboard for manifest: {order.orderNumber}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Left Columns: Items list & Addresses & Payment Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Items card */}
          <div className="glass rounded-3xl p-6 border border-slate-200 bg-white shadow-sm space-y-4 animate-fade-in">
            <h3 className="text-slate-900 font-black text-xs uppercase tracking-wider flex items-center gap-1.5"><ShoppingCart size={14} className="text-primary" /> Sourced Cargo Items</h3>
            
            <div className="divide-y divide-slate-100">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between py-3.5 text-xs font-semibold">
                  <div>
                    <h4 className="font-black text-slate-800 uppercase tracking-wide">{item.product?.name || 'Cargo Item'}</h4>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {item.quantity} {item.product?.unit || 'units'} &times; {formatPrice(item.unitPrice, 'PKR', order.notes)}
                    </p>
                  </div>
                  <span className="font-extrabold text-slate-800">{formatPrice(item.total, 'PKR', order.notes)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs font-semibold">
              <div className="flex justify-between text-slate-500">
                <span>Items Subtotal</span>
                <span>{formatPrice(order.subtotal, 'PKR', order.notes)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-black text-sm border-t border-slate-200 pt-2.5">
                <span>Contract Grand Total</span>
                <span>{formatPrice(order.total, 'PKR', order.notes)}</span>
              </div>
            </div>
          </div>

          {/* Payment Verification Section */}
          <div className="glass rounded-3xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
            <h3 className="text-slate-900 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
              💰 Payment Audit & Screenshots
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-650">
              <div>
                <span className="text-[9px] text-slate-400 font-black block uppercase">Payment Method</span>
                <span className="text-slate-800 font-bold uppercase">{paymentMethodLabel}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-black block uppercase">Proof Upload Date</span>
                <span className="text-slate-800">{order.paymentProofUploadedAt ? formatDate(order.paymentProofUploadedAt) : 'No Proof Logged'}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-black block uppercase">Verification Status</span>
                <span className={`inline-block text-[9px] px-2.5 py-0.5 rounded font-black uppercase tracking-wider mt-1.5 shadow-sm ${
                  order.paymentProofStatus === 'approved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-250'
                    : order.paymentProofStatus === 'rejected'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : order.paymentProofStatus === 'pending_verification'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {order.paymentProofStatus === 'pending_upload' ? 'Pending Upload' : order.paymentProofStatus === 'pending_verification' ? 'Pending Verification' : order.paymentProofStatus}
                </span>
              </div>
            </div>

            {/* Proof Preview */}
            {order.paymentProofUrl ? (
              <div className="space-y-3.5 pt-3.5 border-t border-slate-250/60">
                <span className="text-[9px] text-slate-450 font-black uppercase tracking-wider block">Uploaded Proof Document</span>
                
                {order.paymentProofUrl.toLowerCase().endsWith('.pdf') ? (
                  <div className="p-4 border rounded-2xl bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700 border-slate-200">
                    <span className="flex items-center gap-2"><FileText size={16} className="text-red-500" /> Transaction Receipt (PDF)</span>
                    <a
                      href={resolveImageUrl(order.paymentProofUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 flex items-center gap-1 text-slate-600 transition-all font-bold"
                    >
                      <Download size={12} /> Open PDF
                    </a>
                  </div>
                ) : (
                  <div className="relative border border-slate-200 rounded-2xl overflow-hidden max-h-72 flex justify-center bg-slate-50">
                    <img src={resolveImageUrl(order.paymentProofUrl)} alt="Receipt screenshot" className="object-contain max-h-72 max-w-full" />
                    <a
                      href={resolveImageUrl(order.paymentProofUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2.5 right-2.5 p-2 bg-black/60 hover:bg-black text-white rounded-xl text-xs transition-colors"
                      title="Open full image"
                    >
                      <Download size={14} />
                    </a>
                  </div>
                )}

                {/* Verification Actions */}
                {order.paymentProofStatus === 'pending_verification' && (
                  <div className="space-y-3 pt-3">
                    <div className="flex gap-2.5">
                      <button
                        onClick={() => handleVerify('approved')}
                        disabled={verifying}
                        className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
                      >
                        <Check size={12} /> Approve Payment
                      </button>
                      <button
                        onClick={() => setShowRejectForm(!showRejectForm)}
                        disabled={verifying}
                        className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
                      >
                        <X size={12} /> Reject Proof
                      </button>
                    </div>

                    {showRejectForm && (
                      <div className="p-4 border border-red-100 rounded-2xl bg-red-50/50 space-y-2.5">
                        <textarea
                          placeholder="Rejection remarks / request details..."
                          value={rejectNotes}
                          onChange={e => setRejectNotes(e.target.value)}
                          rows={2}
                          className="w-full p-3 bg-white rounded-xl border border-red-200 text-xs focus:outline-none focus:ring-1 focus:ring-red-300 font-medium"
                        />
                        <button
                          onClick={() => handleVerify('rejected')}
                          disabled={verifying}
                          className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white text-[10px] font-black uppercase rounded-lg transition-all"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 border border-dashed border-slate-200 rounded-2xl bg-[#fafbf9] text-center text-xs text-slate-500 font-medium">
                No bank transaction screenshot submitted by importer yet.
              </div>
            )}
          </div>

          {/* Logistics Address Card */}
          <div className="glass rounded-3xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
            <h3 className="text-slate-900 font-black text-xs uppercase tracking-wider flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> Delivery Terminals</h3>
            
            <div className="grid sm:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed font-semibold">
              <div>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black mb-1.5">Transit Destination Address</p>
                <p className="font-semibold bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5">{order.shippingAddress || '—'}</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black mb-1.5">Billing Entity Address</p>
                <p className="font-semibold bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5">{order.billingAddress || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status updates & Customer info */}
        <div className="space-y-6">
          
          {/* Status worksheet card */}
          <div className="glass rounded-3xl p-6 border border-slate-200 bg-white shadow-sm space-y-5">
            <h3 className="text-slate-900 font-black text-xs uppercase tracking-wider flex items-center gap-1.5"><Truck size={14} className="text-primary" /> Transit Status</h3>
            
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-[9px] text-slate-400 uppercase tracking-widest font-black block mb-1.5">Cargo Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 shadow-sm capitalize font-bold">
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[9px] text-slate-400 uppercase tracking-widest font-black block mb-1.5">Ocean Bill of Lading (Tracking #)</label>
                <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="e.g. OBL-93821034"
                  className="w-full px-4 py-2.5 bg-white rounded-xl text-xs text-slate-805 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 shadow-sm font-mono font-bold" />
              </div>

              {(status === 'shipped' || order.estimatedDelivery) && (
                <div>
                  <label className="text-[9px] text-slate-400 uppercase tracking-widest font-black block mb-1.5">Estimated / Target Delivery Date</label>
                  <input
                    type="date"
                    value={estimatedDelivery}
                    onChange={(e) => setEstimatedDelivery(e.target.value)}
                    disabled={status !== 'shipped'}
                    className="w-full px-4 py-2.5 bg-white rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 shadow-sm font-bold disabled:bg-slate-50 disabled:text-slate-500"
                    required={status === 'shipped'}
                  />
                </div>
              )}

              <button onClick={handleUpdate} disabled={isPending}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10 transition-all disabled:opacity-60">
                {isPending ? 'Updating...' : <><CheckCircle2 size={12} /> Save Sourcing Logs</>}
              </button>
            </div>
          </div>

          {/* Customer details card */}
          <div className="glass rounded-3xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
            <h3 className="text-slate-900 font-black text-xs uppercase tracking-wider flex items-center gap-1.5"><User size={14} className="text-primary" /> Importer Profile</h3>
            
            <div className="space-y-3.5 text-xs text-slate-700 font-semibold">
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black block">Contact Officer</span>
                <p className="font-extrabold text-slate-900 mt-0.5">{order.user?.name}</p>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black block">Business Email</span>
                <p className="font-bold text-slate-500 mt-0.5">{order.user?.email}</p>
              </div>
              {order.user?.companyName && (
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black block">Company Entity</span>
                  <p className="font-extrabold text-slate-900 mt-0.5">{order.user.companyName}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
