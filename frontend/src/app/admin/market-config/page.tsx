'use client';

import { useState, useEffect, useMemo } from 'react';
import { useMarketStore } from '@/store/marketStore';
import { motion } from 'framer-motion';
import { Globe, RefreshCw, Landmark, Truck, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function MarketConfigPage() {
  const {
    exchangeRate,
    setExchangeRate,
    premiumPackagingCost,
    setPremiumPackagingCost,
  } = useMarketStore();

  const [mounted, setMounted] = useState(false);
  const [rateInput, setRateInput] = useState('278');
  const [packagingInput, setPackagingInput] = useState('1500');

  useEffect(() => {
    setMounted(true);
    setRateInput(exchangeRate.toString());
    setPackagingInput(premiumPackagingCost.toString());
  }, [exchangeRate, premiumPackagingCost]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(rateInput);
    const packaging = parseFloat(packagingInput);

    if (isNaN(rate) || rate <= 0) {
      toast.error('Please enter a valid exchange rate');
      return;
    }
    if (isNaN(packaging) || packaging < 0) {
      toast.error('Please enter a valid packaging fee');
      return;
    }

    setExchangeRate(rate);
    setPremiumPackagingCost(packaging);
    toast.success('Market settings updated successfully!');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
          <Globe className="text-primary animate-pulse" size={20} />
          Global Market & Pricing Configurations
        </h1>
        <p className="text-slate-500 text-xs mt-0.5 font-semibold">
          Manage currency conversion rates, local packaging costs, and B2B export logistics policies.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Dynamic Rate Preview */}
        <div className="glass rounded-3xl p-5 border border-slate-100 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center text-primary border border-sky-100">
              <RefreshCw size={14} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Exchange Rate</div>
            <div className="text-xl font-black text-slate-800 mt-1">1 USD = ₨ {exchangeRate}</div>
            <p className="text-[10px] text-slate-600 mt-1.5 font-medium leading-relaxed">
              Base catalog pricing is in USD. Local purchases are converted using this rate.
            </p>
          </div>
        </div>

        {/* Premium Packaging Preview */}
        <div className="glass rounded-3xl p-5 border border-slate-100 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
              <Sparkles size={14} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Premium Packaging Fee</div>
            <div className="text-xl font-black text-slate-800 mt-1">₨ {premiumPackagingCost.toLocaleString()}</div>
            <p className="text-[10px] text-slate-600 mt-1.5 font-medium leading-relaxed">
              Charged as a premium add-on option for domestic orders requiring extra cushioning.
            </p>
          </div>
        </div>

        {/* Logistics Model Indicator */}
        <div className="glass rounded-3xl p-5 border border-slate-100 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100">
              <Truck size={14} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Active Markets</div>
            <div className="text-xl font-black text-slate-800 mt-1">Dual-Market (PK & INT)</div>
            <p className="text-[10px] text-slate-600 mt-1.5 font-medium leading-relaxed">
              Pakistan (PK) and International Export (INT) checkout flows active.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="glass rounded-3xl p-6 border border-slate-100 bg-white shadow-sm space-y-6">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">Update Market Multipliers</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-1.5 block">USD to PKR Exchange Rate *</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={rateInput}
                onChange={e => setRateInput(e.target.value)}
                className="w-full pl-3 pr-12 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary/45"
                required
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">PKR</span>
            </div>
            <p className="text-[9px] text-slate-600 mt-1 leading-relaxed">
              Updates pricing calculations on both product cards and checkout forms globally.
            </p>
          </div>

          <div>
            <label className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-1.5 block">Premium Packaging Cost (PKR) *</label>
            <div className="relative">
              <input
                type="number"
                value={packagingInput}
                onChange={e => setPackagingInput(e.target.value)}
                className="w-full pl-3 pr-12 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary/45"
                required
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">PKR</span>
            </div>
            <p className="text-[9px] text-slate-600 mt-1 leading-relaxed">
              Specifies the premium retail packing cost for local domestic deliveries.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-primary/10"
          >
            <Check size={14} />
            Save Configurations
          </button>
        </div>
      </form>

      {/* Shipping and Checkout rules display */}
      <div className="glass rounded-3xl p-6 border border-slate-100 bg-white shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
          <Landmark size={14} className="text-slate-600" /> Active Checkout Settings & Rules
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-600">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 uppercase text-[9px] tracking-wider">Domestic Rules (Pakistan)</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li>Retail Order Mode Active (Minimum order: 1 unit)</li>
              <li>Local Shipping options: Standard Delivery (₨ 250), Express Delivery (₨ 600), Pickup (Free)</li>
              <li>Payment gateways: local Bank Wire (Telegraphic Transfer), EasyPaisa, JazzCash</li>
              <li>Standard packaging default: Free</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 uppercase text-[9px] tracking-wider">International Export Rules (B2B Global)</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li>Wholesale Order Mode Active (Minimum order quantity enforced)</li>
              <li>Container Options: 20ft & 40ft Reefer/Dry, LCL / Bulk Loose cargo</li>
              <li>Incoterms: FOB (Karachi Port), CIF, EXW, DAP</li>
              <li>Logistics handling: Customs Clearance ($250), Export Docs ($150), Insurance ($100)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
