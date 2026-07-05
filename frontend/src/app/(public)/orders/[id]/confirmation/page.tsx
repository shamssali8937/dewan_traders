'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useOrder } from '@/hooks/useOrders';
import { formatPrice } from '@/lib/utils';
import { CheckCircle, ArrowRight, ShoppingBag, CreditCard, ChevronRight, HelpCircle, Sparkles } from 'lucide-react';

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: order, isLoading, error } = useOrder(id);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    fetch(`${apiUrl}/payment-accounts/active`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAccounts(data.data);
        }
      })
      .catch((err) => console.error('Failed to load accounts', err))
      .finally(() => setLoadingAccounts(false));
  }, []);

  if (isLoading || loadingAccounts) {
    return (
      <div className="pt-32 pb-20 min-h-screen max-w-3xl mx-auto px-6 space-y-6 animate-pulse bg-[#fafbf9]">
        <div className="h-12 bg-slate-200 rounded-3xl w-3/4 mx-auto" />
        <div className="h-40 bg-slate-100 rounded-3xl" />
        <div className="h-40 bg-slate-100 rounded-3xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="pt-32 pb-20 min-h-screen text-center space-y-4 bg-[#fafbf9]">
        <p className="text-slate-500 font-extrabold uppercase tracking-widest text-xs">Draft order details not found.</p>
        <Link href="/catalog" className="inline-block text-primary font-bold hover:underline text-xs">&larr; Back to Catalog</Link>
      </div>
    );
  }

  const paymentMethodLabel =
    order.paymentMethod === 'bank_transfer'
      ? 'Bank Wire Transfer'
      : order.paymentMethod === 'easypaisa'
      ? 'EasyPaisa Mobile Wallet'
      : 'JazzCash Mobile Wallet';

  const relevantAccounts = accounts.filter(
    (acc) => acc.type === (order.paymentMethod === 'bank_transfer' ? 'bank' : order.paymentMethod)
  );

  return (
    <div className="bg-[#fafbf9] min-h-screen pt-28 pb-20 font-sans relative overflow-hidden pattern-dots-light">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-emerald-100/10 w-[500px] h-[500px] top-[10%] right-[-100px]" />
      </div>

      <div className="max-w-3xl mx-auto px-6 space-y-8 relative z-10">
        {/* Banner */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-8 text-center space-y-5 shadow-sm">
          <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <CheckCircle size={38} className="stroke-[2.5]" />
          </div>
          <div className="space-y-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight uppercase">Wholesale Draft Successfully Created</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Order Contract reference: {order.orderNumber}</p>
            <div className="mt-4 p-4.5 bg-emerald-50/50 border border-emerald-100/60 rounded-2xl text-xs text-emerald-800 font-bold text-center leading-relaxed">
              Our trade operations desk under Sajjad Hussain Awan will contact you via **Email** or **WhatsApp** to finalize shipping worksheets.
            </div>
          </div>
        </div>

        {/* Order Details Summary */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <h3 className="text-[10px] text-slate-400 font-black uppercase tracking-widest pb-3.5 border-b border-slate-100">Contract Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-650">
            <div className="space-y-3.5">
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block mb-0.5">Order Number</span>
                <span className="font-mono text-slate-800 font-bold">{order.orderNumber}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block mb-0.5">Commodity / Product</span>
                <span className="text-slate-800 font-bold">{order.items[0]?.product?.name || 'Wholesale Sourced Commodity'}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block mb-0.5">Quantity</span>
                <span className="text-slate-800 font-bold">{order.items[0]?.quantity} {order.items[0]?.product?.unit || 'kg'}s</span>
              </div>
            </div>
            <div className="space-y-3.5">
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block mb-0.5">Estimated Total Value</span>
                <span className="text-primary font-black text-sm">{formatPrice(order.total, 'PKR', order.notes)}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block mb-0.5">Payment Method</span>
                <span className="text-slate-800 font-bold uppercase">{paymentMethodLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Account Credentials */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <h3 className="text-[10px] text-slate-400 font-black uppercase tracking-widest pb-3.5 border-b border-slate-100">Wholesale Payment Account</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Please transfer the amount of <strong className="text-slate-800">{formatPrice(order.total, 'PKR', order.notes)}</strong> to one of our active corporate accounts:
          </p>
          
          <div className="space-y-3">
            {relevantAccounts.length > 0 ? (
              relevantAccounts.map((acc) => (
                <div key={acc.id} className="p-4.5 border border-slate-200/60 rounded-2xl bg-[#fafbf9] hover:bg-slate-50 transition-colors space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wide">{acc.bankName || 'Mobile Wallet Account'}</span>
                    <span className="text-[8px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-black uppercase border border-emerald-100/50">{acc.type}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] text-slate-600 font-bold">
                    <div>
                      <span className="text-[9px] text-slate-400 font-black uppercase block">Account Title</span>
                      <span className="text-slate-800">{acc.accountTitle}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-black uppercase block">Account Number</span>
                      <span className="text-slate-800">{acc.accountNumber}</span>
                    </div>
                    {acc.iban && (
                      <div className="sm:col-span-2">
                        <span className="text-[9px] text-slate-400 font-black uppercase block">IBAN Code</span>
                        <span className="font-mono text-slate-800">{acc.iban}</span>
                      </div>
                    )}
                    {acc.branch && (
                      <div className="sm:col-span-2">
                        <span className="text-[9px] text-slate-400 font-black uppercase block">Branch Details</span>
                        <span className="text-slate-700">{acc.branch}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5 border border-dashed border-slate-200 rounded-2xl text-xs text-slate-500 font-medium">
                No active mobile or bank accounts configured. Our operations desk will supply details.
              </div>
            )}
          </div>
        </div>

        {/* Steps Guide */}
        <div className="bg-blue-50/60 border border-blue-100/55 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-wider">
            <CreditCard size={16} />
            <h4>Payment Proof Upload Steps</h4>
          </div>
          <ol className="text-xs text-slate-650 font-medium space-y-3 list-decimal list-inside leading-relaxed">
            <li>Submit the wire transfer using our corporate accounts detailed above.</li>
            <li>Take a screenshot of the successful transaction receipt or save the receipt PDF.</li>
            <li>Go to your customer portal and click the **Upload Receipt** section.</li>
            <li>Our finance team will verify the reference code and dispatch shipping milestones.</li>
          </ol>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <Link href="/user" className="flex-1 py-3.5 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl text-center shadow-md shadow-primary/10 transition-all flex items-center justify-center gap-1.5">
            Go to Dashboard <ArrowRight size={14} />
          </Link>
          <Link href="/catalog" className="flex-1 py-3.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl text-center border border-slate-200 transition-all flex items-center justify-center gap-1.5 shadow-sm">
            <ShoppingBag size={14} /> Sourcing Index
          </Link>
        </div>
      </div>
    </div>
  );
}
