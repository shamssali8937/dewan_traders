'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useOrder } from '@/hooks/useOrders';
import { formatPrice } from '@/lib/utils';
import { CheckCircle, ArrowRight, ShoppingBag, CreditCard, ChevronRight, HelpCircle } from 'lucide-react';

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
      <div className="pt-32 pb-20 min-h-screen max-w-3xl mx-auto px-6 space-y-6 animate-pulse">
        <div className="h-12 bg-slate-100 rounded-2xl w-3/4 mx-auto" />
        <div className="h-40 bg-slate-50 rounded-2xl" />
        <div className="h-40 bg-slate-50 rounded-2xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="pt-32 pb-20 min-h-screen text-center space-y-4 bg-white">
        <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Order details not found.</p>
        <Link href="/catalog" className="inline-block text-primary font-bold hover:underline text-xs">&larr; Back to Catalog</Link>
      </div>
    );
  }

  const paymentMethodLabel =
    order.paymentMethod === 'bank_transfer'
      ? 'Bank Transfer'
      : order.paymentMethod === 'easypaisa'
      ? 'EasyPaisa'
      : 'JazzCash';

  const relevantAccounts = accounts.filter(
    (acc) => acc.type === (order.paymentMethod === 'bank_transfer' ? 'bank' : order.paymentMethod)
  );

  return (
    <div className="bg-slate-50/50 min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-3xl mx-auto px-6 space-y-8">
        {/* Banner */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center space-y-4 shadow-sm">
          <div className="inline-flex p-3 bg-emerald-50 text-emerald-500 rounded-full">
            <CheckCircle size={40} className="stroke-[2.5]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Order Successfully Placed</h1>
            <p className="text-xs text-slate-500 font-medium">Your order contract has been received successfully.</p>
            <div className="mt-4 p-3 bg-sky-50 border border-sky-100 rounded-2xl text-xs text-slate-600 font-semibold text-center leading-relaxed">
              Our trade operations team will contact you shortly through **Email** or **WhatsApp** to finalize your shipment and payment details.
            </div>
          </div>
        </div>

        {/* Order Details Summary */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pb-3 border-b border-slate-100">Order Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
            <div className="space-y-3">
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block mb-0.5">Order Number</span>
                <span className="font-mono text-slate-800 font-bold">{order.orderNumber}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block mb-0.5">Commodity / Product</span>
                <span className="text-slate-800 font-bold">{order.items[0]?.product?.name || 'Wholesale Commodity'}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block mb-0.5">Quantity</span>
                <span className="text-slate-800 font-bold">{order.items[0]?.quantity} {order.items[0]?.product?.unit || 'kg'}s</span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block mb-0.5">Total Amount</span>
                <span className="text-primary font-black text-sm">{formatPrice(order.total)}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block mb-0.5">Payment Option</span>
                <span className="text-slate-800 font-bold uppercase">{paymentMethodLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Account Credentials */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pb-3 border-b border-slate-100">Payment Accounts Instructions</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Please transfer the amount of <strong className="text-slate-800">{formatPrice(order.total)}</strong> to one of the following accounts:
          </p>
          
          <div className="space-y-3">
            {relevantAccounts.length > 0 ? (
              relevantAccounts.map((acc) => (
                <div key={acc.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">{acc.bankName || 'Mobile Account'}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-sky-100 text-sky-700 font-bold capitalize">{acc.type}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 font-semibold">
                    <div>
                      <span className="text-[9px] text-slate-400 block">Account Title</span>
                      <span className="text-slate-800">{acc.accountTitle}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block">Account Number</span>
                      <span className="text-slate-800">{acc.accountNumber}</span>
                    </div>
                    {acc.iban && (
                      <div className="sm:col-span-2">
                        <span className="text-[9px] text-slate-400 block">IBAN Code</span>
                        <span className="font-mono text-slate-800">{acc.iban}</span>
                      </div>
                    )}
                    {acc.branch && (
                      <div className="sm:col-span-2">
                        <span className="text-[9px] text-slate-400 block">Branch Details</span>
                        <span className="text-slate-700">{acc.branch}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 border border-dashed border-slate-200 rounded-2xl">
                <span className="text-xs text-slate-400">No specific accounts setup for this method. Please contact support.</span>
              </div>
            )}
          </div>
        </div>

        {/* Steps Guide */}
        <div className="bg-sky-50/60 border border-sky-100/50 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-sky-800">
            <CreditCard size={18} />
            <h4 className="text-xs font-bold uppercase tracking-wider">How to Complete Your Order</h4>
          </div>
          <ol className="text-xs text-slate-600 font-medium space-y-3 list-decimal list-inside leading-relaxed">
            <li>Complete the payment transaction using the selected payment method details above.</li>
            <li>Take a screenshot of the transaction receipt or download it as a PDF.</li>
            <li>Upload your payment receipt/screenshot from your customer dashboard.</li>
            <li>Our team will verify your payment and contact you through Email or WhatsApp for shipment confirmation.</li>
          </ol>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/user" className="flex-1 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl text-center shadow-md shadow-primary/10 transition-all flex items-center justify-center gap-1.5">
            Go to Dashboard <ArrowRight size={14} />
          </Link>
          <Link href="/catalog" className="flex-1 py-3.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl text-center border border-slate-200 transition-all flex items-center justify-center gap-1.5">
            <ShoppingBag size={14} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
