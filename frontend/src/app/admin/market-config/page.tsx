'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, RefreshCw, Landmark, Truck, Sparkles, Check, Package, FileText, DollarSign, Shield, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useShippingConfig, useUpdateShippingConfig, ShippingConfig } from '@/hooks/usePricing';
import { useMarketStore } from '@/store/marketStore';

type ConfigForm = Omit<ShippingConfig, 'id' | 'updatedAt'>;

const DEFAULT_FORM: ConfigForm = {
  exchangeRatePkrPerUsd: 278,
  pkStandardDeliveryCost: 250,
  pkExpressDeliveryCost: 600,
  pkPremiumPackagingCost: 1500,
  intContainer20ftReefer: 1800,
  intContainer40ftReefer: 2800,
  intContainer20ftDry: 1000,
  intContainer40ftDry: 1500,
  intBulkLoose: 400,
  packMult20ftReefer: 1.15,
  packMult40ftReefer: 1.25,
  packMult20ftDry: 1.04,
  packMult40ftDry: 1.08,
  intDocumentationCost: 150,
  intCustomsClearanceCost: 250,
};

function Field({ label, name, value, onChange, prefix, suffix, step = 1, hint }: {
  label: string; name: string; value: number;
  onChange: (name: string, v: number) => void;
  prefix?: string; suffix?: string; step?: number; hint?: string;
}) {
  return (
    <div>
      <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400">{prefix}</span>}
        <input
          type="number" step={step} value={value}
          onChange={e => onChange(name, parseFloat(e.target.value) || 0)}
          className={`w-full ${prefix ? 'pl-8' : 'pl-3'} ${suffix ? 'pr-12' : 'pr-3'} py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20`}
        />
        {suffix && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400">{suffix}</span>}
      </div>
      {hint && <p className="text-[9px] text-slate-400 mt-1 leading-relaxed">{hint}</p>}
    </div>
  );
}

export default function MarketConfigPage() {
  const { data: dbConfig, isLoading } = useShippingConfig();
  const { mutate: updateConfig, isPending: saving } = useUpdateShippingConfig();
  const setShippingConfig = useMarketStore(s => s.setShippingConfig);

  const [form, setForm] = useState<ConfigForm>(DEFAULT_FORM);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (dbConfig) {
      setForm({
        exchangeRatePkrPerUsd: Number(dbConfig.exchangeRatePkrPerUsd),
        pkStandardDeliveryCost: Number(dbConfig.pkStandardDeliveryCost),
        pkExpressDeliveryCost: Number(dbConfig.pkExpressDeliveryCost),
        pkPremiumPackagingCost: Number(dbConfig.pkPremiumPackagingCost),
        intContainer20ftReefer: Number(dbConfig.intContainer20ftReefer),
        intContainer40ftReefer: Number(dbConfig.intContainer40ftReefer),
        intContainer20ftDry: Number(dbConfig.intContainer20ftDry),
        intContainer40ftDry: Number(dbConfig.intContainer40ftDry),
        intBulkLoose: Number(dbConfig.intBulkLoose),
        packMult20ftReefer: Number(dbConfig.packMult20ftReefer),
        packMult40ftReefer: Number(dbConfig.packMult40ftReefer),
        packMult20ftDry: Number(dbConfig.packMult20ftDry),
        packMult40ftDry: Number(dbConfig.packMult40ftDry),
        intDocumentationCost: Number(dbConfig.intDocumentationCost),
        intCustomsClearanceCost: Number(dbConfig.intCustomsClearanceCost),
      });
    }
  }, [dbConfig]);

  if (!mounted) return (
    <div className="flex items-center justify-center p-20">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
    </div>
  );

  const update = (name: string, value: number) => setForm(prev => ({ ...prev, [name]: value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.exchangeRatePkrPerUsd <= 0) { toast.error('Exchange rate must be > 0'); return; }
    updateConfig(form, {
      onSuccess: () => {
        // Also update the in-memory store immediately
        setShippingConfig({ ...form, id: dbConfig?.id || '', updatedAt: new Date().toISOString() });
      },
    });
  };

  return (
    <div className="space-y-8 max-w-5xl font-sans relative z-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-2">
          <Globe className="text-primary animate-pulse" size={20} />
          Pricing Configurations
        </h1>
        <p className="text-slate-500 text-xs mt-0.5 font-semibold">
          All values are stored in the database and apply immediately to all checkouts — no code deployment required.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass rounded-3xl p-5 border border-slate-200 bg-white shadow-sm flex flex-col justify-between card-hover">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-primary border border-emerald-150">
            <RefreshCw size={14} />
          </div>
          <div className="mt-4">
            <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Exchange Rate</div>
            <div className="text-xl font-black text-slate-800 mt-1">1 USD = ₨ {form.exchangeRatePkrPerUsd}</div>
            <p className="text-[10px] text-slate-500 mt-1.5 font-medium leading-relaxed">
              Used to convert USD prices to PKR for domestic customers.
            </p>
          </div>
        </div>
        <div className="glass rounded-3xl p-5 border border-slate-200 bg-white shadow-sm flex flex-col justify-between card-hover">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-150">
            <Sparkles size={14} />
          </div>
          <div className="mt-4">
            <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Premium Packaging</div>
            <div className="text-xl font-black text-slate-800 mt-1">₨ {form.pkPremiumPackagingCost.toLocaleString()}</div>
            <p className="text-[10px] text-slate-500 mt-1.5 font-medium leading-relaxed">
              Add-on fee for domestic orders with premium packaging.
            </p>
          </div>
        </div>
        <div className="glass rounded-3xl p-5 border border-slate-200 bg-white shadow-sm flex flex-col justify-between card-hover">
          <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-150">
            <Truck size={14} />
          </div>
          <div className="mt-4">
            <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Active Markets</div>
            <div className="text-xl font-black text-slate-800 mt-1">Dual-Market (PK &amp; INT)</div>
            <p className="text-[10px] text-slate-500 mt-1.5 font-medium leading-relaxed">
              Pakistan (PK) and International Export (INT) checkout flows active.
            </p>
          </div>
        </div>
      </div>

      {/* Config Form */}
      <form onSubmit={handleSave} className="space-y-6 text-xs font-semibold text-slate-700">

        {/* ── Exchange Rate ──────────────────────────────────────────────── */}
        <div className="glass rounded-3xl p-6 border border-slate-200 bg-white shadow-sm space-y-5">
          <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider border-b border-slate-100 pb-3.5 flex items-center gap-1.5">
            <RefreshCw size={13} className="text-slate-500" /> Currency Settings
          </h3>
          <Field label="USD to PKR Exchange Rate *" name="exchangeRatePkrPerUsd" value={form.exchangeRatePkrPerUsd}
            onChange={update} suffix="PKR" step={0.01}
            hint="Used to convert USD export prices to PKR for domestic customers. Update regularly." />
        </div>

        {/* ── Domestic (Pakistan) Costs ─────────────────────────────────── */}
        <div className="glass rounded-3xl p-6 border border-slate-200 bg-white shadow-sm space-y-5">
          <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider border-b border-slate-100 pb-3.5 flex items-center gap-1.5">
            <MapPin size={13} className="text-emerald-600" /> Domestic (Pakistan) Costs — PKR
          </h3>
          <div className="grid md:grid-cols-3 gap-5">
            <Field label="Standard Delivery Cost *" name="pkStandardDeliveryCost" value={form.pkStandardDeliveryCost}
              onChange={update} prefix="₨" hint="3–5 business days" />
            <Field label="Express Delivery Cost *" name="pkExpressDeliveryCost" value={form.pkExpressDeliveryCost}
              onChange={update} prefix="₨" hint="1–2 business days" />
            <Field label="Premium Packaging Fee *" name="pkPremiumPackagingCost" value={form.pkPremiumPackagingCost}
              onChange={update} prefix="₨" hint="Optional add-on for retail packaging" />
          </div>
        </div>

        {/* ── International Container Costs ────────────────────────────── */}
        <div className="glass rounded-3xl p-6 border border-slate-200 bg-white shadow-sm space-y-5">
          <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider border-b border-slate-100 pb-3.5 flex items-center gap-1.5">
            <Package size={13} className="text-blue-600" /> International Container Logistics — USD
          </h3>
          <div className="grid md:grid-cols-3 gap-5">
            <Field label="20ft Reefer Container" name="intContainer20ftReefer" value={form.intContainer20ftReefer}
              onChange={update} prefix="$" step={10} hint="Refrigerated 20ft FCL" />
            <Field label="40ft Reefer Container" name="intContainer40ftReefer" value={form.intContainer40ftReefer}
              onChange={update} prefix="$" step={10} hint="Refrigerated 40ft FCL" />
            <Field label="20ft Dry Standard" name="intContainer20ftDry" value={form.intContainer20ftDry}
              onChange={update} prefix="$" step={10} hint="Dry 20ft FCL" />
            <Field label="40ft Dry Standard" name="intContainer40ftDry" value={form.intContainer40ftDry}
              onChange={update} prefix="$" step={10} hint="Dry 40ft FCL" />
            <Field label="Bulk / LCL Cargo" name="intBulkLoose" value={form.intBulkLoose}
              onChange={update} prefix="$" step={10} hint="LCL or loose bulk cargo" />
          </div>
        </div>

        {/* ── Packing Multipliers ───────────────────────────────────────── */}
        <div className="glass rounded-3xl p-6 border border-slate-200 bg-white shadow-sm space-y-5">
          <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider border-b border-slate-100 pb-3.5 flex items-center gap-1.5">
            <Shield size={13} className="text-purple-600" /> Packing Surcharge Multipliers
          </h3>
          <p className="text-[10px] text-slate-500 -mt-2 leading-relaxed">
            Applied to the product subtotal to calculate transit packing surcharge. E.g. 1.15 = +15% surcharge.
          </p>
          <div className="grid md:grid-cols-4 gap-5">
            <Field label="20ft Reefer Multiplier" name="packMult20ftReefer" value={form.packMult20ftReefer}
              onChange={update} step={0.01} suffix="×" hint="+15% default" />
            <Field label="40ft Reefer Multiplier" name="packMult40ftReefer" value={form.packMult40ftReefer}
              onChange={update} step={0.01} suffix="×" hint="+25% default" />
            <Field label="20ft Dry Multiplier" name="packMult20ftDry" value={form.packMult20ftDry}
              onChange={update} step={0.01} suffix="×" hint="+4% default" />
            <Field label="40ft Dry Multiplier" name="packMult40ftDry" value={form.packMult40ftDry}
              onChange={update} step={0.01} suffix="×" hint="+8% default" />
          </div>
        </div>

        {/* ── Documentation Costs ──────────────────────────────────────── */}
        <div className="glass rounded-3xl p-6 border border-slate-200 bg-white shadow-sm space-y-5">
          <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider border-b border-slate-100 pb-3.5 flex items-center gap-1.5">
            <FileText size={13} className="text-orange-500" /> International Documentation &amp; Clearance — USD
          </h3>
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Documentation Work Cost" name="intDocumentationCost" value={form.intDocumentationCost}
              onChange={update} prefix="$" step={10} hint="Export documentation, B/L, Phytosanitary certificate" />
            <Field label="Customs Clearance Cost" name="intCustomsClearanceCost" value={form.intCustomsClearanceCost}
              onChange={update} prefix="$" step={10} hint="Port customs clearance and CRO charges" />
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving || isLoading}
            className="flex items-center gap-1.5 px-5 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-primary/10 disabled:opacity-50">
            <Check size={14} />
            {saving ? 'Saving...' : 'Save All Configurations'}
          </button>
        </div>
      </form>
    </div>
  );
}
