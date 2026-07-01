'use client';

import { use, useState, useEffect } from 'react';
import { useOrder, useUpdateOrderStatus } from '@/hooks/useOrders';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, ShoppingCart, User, MapPin, Truck, CheckCircle2, ShieldCheck, Download, AlertTriangle, FileText, Check, X } from 'lucide-react';
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

  const paymentMethodLabel =
    order.paymentMethod === 'bank_transfer'
      ? 'Bank Transfer'
      : order.paymentMethod === 'easypaisa'
      ? 'EasyPaisa'
      : order.paymentMethod === 'jazzcash'
      ? 'JazzCash'
      : 'N/A';

  return (
    <div className="space-y-6 max-w-4xl font-sans">
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
        {/* Left Columns: Items list & Addresses & Payment Info */}
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

          {/* Payment Verification Section */}
          <div className="glass rounded-3xl p-6 border border-slate-100 bg-white shadow-sm space-y-4">
            <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              💰 Payment Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
              <div>
                <span className="text-[9px] text-slate-400 block uppercase">Payment Method</span>
                <span className="text-slate-800 font-bold uppercase">{paymentMethodLabel}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block uppercase">Upload Date</span>
                <span className="text-slate-800">{order.paymentProofUploadedAt ? formatDate(order.paymentProofUploadedAt) : 'No Proof Uploaded'}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block uppercase">Verification Status</span>
                <span className={`inline-block text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider mt-1 ${
                  order.paymentProofStatus === 'approved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : order.paymentProofStatus === 'rejected'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : order.paymentProofStatus === 'pending_verification'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {order.paymentProofStatus === 'pending_upload' ? 'Pending Upload' : order.paymentProofStatus === 'pending_verification' ? 'Pending Verification' : order.paymentProofStatus}
                </span>
              </div>
            </div>

            {/* Proof Preview */}
            {order.paymentProofUrl ? (
              <div className="space-y-3 pt-3 border-t border-slate-50">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Uploaded Receipt Screenshot</span>
                
                {order.paymentProofUrl.toLowerCase().endsWith('.pdf') ? (
                  <div className="p-4 border rounded-2xl bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-2"><FileText size={16} className="text-red-500" /> Transaction Receipt (PDF)</span>
                    <a
                      href={resolveImageUrl(order.paymentProofUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 flex items-center gap-1"
                    >
                      <Download size={12} /> Open PDF
                    </a>
                  </div>
                ) : (
                  <div className="relative border border-slate-100 rounded-2xl overflow-hidden max-h-72 flex justify-center bg-slate-50">
                    <img src={resolveImageUrl(order.paymentProofUrl)} alt="Receipt screenshot" className="object-contain max-h-72 max-w-full" />
                    <a
                      href={resolveImageUrl(order.paymentProofUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-lg text-xs"
                      title="Open full image"
                    >
                      <Download size={14} />
                    </a>
                  </div>
                )}

                {/* Verification Actions */}
                {order.paymentProofStatus === 'pending_verification' && (
                  <div className="space-y-3 pt-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerify('approved')}
                        disabled={verifying}
                        className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-1"
                      >
                        <Check size={12} /> Approve Payment
                      </button>
                      <button
                        onClick={() => setShowRejectForm(!showRejectForm)}
                        disabled={verifying}
                        className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-1"
                      >
                        <X size={12} /> Reject Payment / Request New
                      </button>
                    </div>

                    {showRejectForm && (
                      <div className="p-3 border border-red-100 rounded-2xl bg-red-50/50 space-y-2">
                        <textarea
                          placeholder="Rejection remarks / request details..."
                          value={rejectNotes}
                          onChange={e => setRejectNotes(e.target.value)}
                          rows={2}
                          className="w-full p-2 bg-white rounded-lg border border-red-200 text-xs focus:outline-none"
                        />
                        <button
                          onClick={() => handleVerify('rejected')}
                          disabled={verifying}
                          className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase rounded-lg"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 border border-dashed rounded-2xl bg-slate-50/30 text-center text-xs text-slate-400">
                No transaction payment screenshot submitted yet.
              </div>
            )}
          </div>

          {/* Logistics Address Card */}
          <div className="glass rounded-3xl p-6 border border-slate-100 bg-white/80 shadow-sm space-y-4">
            <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> Delivery Terminals</h3>
            
            <div className="grid sm:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
              <div>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-1">Transit Destination Address</p>
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

              {(status === 'shipped' || order.estimatedDelivery) && (
                <div>
                  <label className="text-[9px] text-slate-400 uppercase tracking-widest font-bold block mb-1.5">Estimated / Target Delivery Date</label>
                  <input
                    type="date"
                    value={estimatedDelivery}
                    onChange={(e) => setEstimatedDelivery(e.target.value)}
                    disabled={status !== 'shipped'}
                    className="w-full px-3 py-2 bg-white rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200 shadow-sm font-bold disabled:bg-slate-50 disabled:text-slate-500"
                    required={status === 'shipped'}
                  />
                </div>
              )}

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
