'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import {
  Globe, MapPin, Package, RotateCcw, Save, ArrowLeft,
  DollarSign, Info, ChevronRight
} from 'lucide-react';
import { useProductPricing, useUpsertProductPricing, ProductPricing } from '@/hooks/usePricing';
import { DEFAULT_PRICING_MAP } from '@/lib/pricing';
import { useProducts } from '@/hooks/useProducts';
import Link from 'next/link';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────
type FormData = Omit<ProductPricing, 'id' | 'productId' | 'product' | 'updatedAt'>;

const UNIT_OPTIONS = ['kg', 'piece', 'set', 'carton (4kg)', 'carton (5kg)', 'carton (10kg)', 'Metric Ton (MT)', 'litre'];
const UNIT_LABEL_OPTIONS = ['kg', 'pieces', 'sets', 'cartons', 'MT', 'litres', 'bags'];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProductPricingPage() {
  const { id: productId } = useParams<{ id: string }>();
  const router = useRouter();

  // Fetch current pricing from DB
  const { data: dbPricing, isLoading } = useProductPricing(productId);
  // Fetch product info for the header
  const { data: productsData } = useProducts({ limit: 100 });
  const product = productsData?.products?.find((p: any) => p.id === productId);

  const { mutate: upsert, isPending: saving } = useUpsertProductPricing();

  // Form state
  const emptyForm: FormData = {
    pkPrice: 0, pkUnit: 'kg', pkUnitLabel: 'kg', pkMoq: 10,
    intPrice: 0, intUnit: 'kg', intUnitLabel: 'kg', intMoq: 100,
    cartonSize: null, cartonPriceUsd: null, containerEst20ft: null, containerEst40ft: null,
  };
  const [form, setForm] = useState<FormData>(emptyForm);
  const [isDirty, setIsDirty] = useState(false);

  // Populate form when DB pricing loads
  useEffect(() => {
    if (dbPricing) {
      setForm({
        pkPrice: Number(dbPricing.pkPrice),
        pkUnit: dbPricing.pkUnit,
        pkUnitLabel: dbPricing.pkUnitLabel,
        pkMoq: dbPricing.pkMoq,
        intPrice: Number(dbPricing.intPrice),
        intUnit: dbPricing.intUnit,
        intUnitLabel: dbPricing.intUnitLabel,
        intMoq: dbPricing.intMoq,
        cartonSize: dbPricing.cartonSize ?? null,
        cartonPriceUsd: dbPricing.cartonPriceUsd ? Number(dbPricing.cartonPriceUsd) : null,
        containerEst20ft: dbPricing.containerEst20ft ?? null,
        containerEst40ft: dbPricing.containerEst40ft ?? null,
      });
    }
  }, [dbPricing]);

  const update = (field: keyof FormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleReset = () => {
    // Find defaults from the static map using the product slug
    if (!product?.slug) { toast.error('Product slug not found'); return; }
    const defaults = DEFAULT_PRICING_MAP[product.slug];
    if (!defaults) { toast.error(`No default pricing found for slug: ${product.slug}`); return; }
    setForm({
      pkPrice: defaults.pkPrice,
      pkUnit: defaults.pkUnit,
      pkUnitLabel: defaults.pkUnitLabel,
      pkMoq: defaults.pkMoq,
      intPrice: defaults.intPrice,
      intUnit: defaults.intUnit,
      intUnitLabel: defaults.intUnitLabel,
      intMoq: defaults.intMoq,
      cartonSize: defaults.cartonSize ?? null,
      cartonPriceUsd: defaults.cartonPriceUsd ?? null,
      containerEst20ft: defaults.containerEstimate20ft ?? null,
      containerEst40ft: defaults.containerEstimate40ft ?? null,
    });
    setIsDirty(true);
    toast.info('Form reset to original defaults — click Save to apply');
  };

  const handleSave = () => {
    if (!productId) return;
    if (form.pkPrice <= 0) { toast.error('Domestic price must be greater than 0'); return; }
    if (form.intPrice <= 0) { toast.error('International price must be greater than 0'); return; }
    if (form.pkMoq < 1) { toast.error('Domestic MOQ must be at least 1'); return; }
    if (form.intMoq < 1) { toast.error('International MOQ must be at least 1'); return; }
    upsert({ productId, data: form });
    setIsDirty(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin/products" className="hover:text-primary font-semibold transition-colors">Products</Link>
            <ChevronRight size={12} />
            <span className="font-semibold">{product?.name || 'Loading...'}</span>
            <ChevronRight size={12} />
            <span className="text-slate-800 font-black">Pricing</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-2">
            <DollarSign className="text-primary" size={20} />
            B2B Pricing Editor
          </h1>
          <p className="text-slate-500 text-xs mt-0.5 font-semibold">
            Manage domestic (PKR) and international export (USD) prices separately.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/products/${productId}/edit`}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-extrabold text-slate-600 uppercase tracking-wider hover:bg-slate-50 transition-all">
            <ArrowLeft size={13} /> Product Edit
          </Link>
          <button onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-extrabold text-slate-600 uppercase tracking-wider hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all">
            <RotateCcw size={13} /> Reset Defaults
          </button>
          <button onClick={handleSave} disabled={saving || !isDirty}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-primary-hover hover:to-secondary-hover">
            <Save size={13} /> {saving ? 'Saving...' : 'Save Pricing'}
          </button>
        </div>
      </div>

      {/* Unsaved changes banner */}
      {isDirty && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-700">
          <Info size={13} /> You have unsaved changes. Click &ldquo;Save Pricing&rdquo; to apply.
        </motion.div>
      )}

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[0, 1].map(i => (
            <div key={i} className="glass rounded-3xl p-6 border border-slate-200 bg-white shadow-sm animate-pulse space-y-4">
              <div className="h-5 bg-slate-100 rounded w-1/3" />
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-10 bg-slate-100 rounded-xl" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* ── Domestic Panel ───────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="glass rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-base">🇵🇰</div>
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Domestic Market</h3>
                <p className="text-[10px] text-slate-500 font-semibold">Pakistan — PKR (₨) prices</p>
              </div>
              <span className="ml-auto text-[9px] font-black uppercase bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">PK</span>
            </div>
            <div className="p-6 space-y-4 text-xs font-semibold text-slate-700">

              {/* PK Price */}
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Unit Price (PKR) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">₨</span>
                  <input type="number" min={0} step={0.01} value={form.pkPrice}
                    onChange={e => update('pkPrice', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <p className="text-[9px] text-slate-400 mt-1">Price customers pay per domestic unit</p>
              </div>

              {/* PK Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Unit Type *</label>
                  <select value={form.pkUnit} onChange={e => update('pkUnit', e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20">
                    {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Unit Label</label>
                  <input type="text" value={form.pkUnitLabel}
                    onChange={e => update('pkUnitLabel', e.target.value)}
                    placeholder="e.g. kg, pieces"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              {/* PK MOQ */}
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Minimum Order Qty (MOQ) *</label>
                <input type="number" min={1} value={form.pkMoq}
                  onChange={e => update('pkMoq', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20" />
                <p className="text-[9px] text-slate-400 mt-1">Minimum quantity a domestic customer must order</p>
              </div>

              {/* Live preview */}
              <div className="mt-2 p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Preview</p>
                <p className="text-slate-800 font-black text-sm">
                  ₨ {Math.round(form.pkPrice).toLocaleString()} <span className="text-slate-500 font-normal text-xs">/ {form.pkUnit}</span>
                </p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  MOQ: {form.pkMoq} {form.pkUnitLabel}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── International Panel ──────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="w-7 h-7 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 text-base">🌍</div>
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">International Export</h3>
                <p className="text-[10px] text-slate-500 font-semibold">Global B2B — USD ($) prices</p>
              </div>
              <span className="ml-auto text-[9px] font-black uppercase bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">INT</span>
            </div>
            <div className="p-6 space-y-4 text-xs font-semibold text-slate-700">

              {/* INT Price */}
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Unit Price (USD) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">$</span>
                  <input type="number" min={0} step={0.01} value={form.intPrice}
                    onChange={e => update('intPrice', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <p className="text-[9px] text-slate-400 mt-1">Price per export unit in USD (FOB Karachi basis)</p>
              </div>

              {/* INT Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Export Unit Type *</label>
                  <select value={form.intUnit} onChange={e => update('intUnit', e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20">
                    {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Unit Label</label>
                  <input type="text" value={form.intUnitLabel}
                    onChange={e => update('intUnitLabel', e.target.value)}
                    placeholder="e.g. cartons, MT"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              {/* INT MOQ */}
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Minimum Order Qty (MOQ) *</label>
                <input type="number" min={1} value={form.intMoq}
                  onChange={e => update('intMoq', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20" />
                <p className="text-[9px] text-slate-400 mt-1">Minimum qty for export orders (enforced on checkout)</p>
              </div>

              {/* Live preview */}
              <div className="mt-2 p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Preview</p>
                <p className="text-slate-800 font-black text-sm">
                  ${form.intPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-slate-500 font-normal text-xs">/ {form.intUnit}</span>
                </p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  MOQ: {form.intMoq} {form.intUnitLabel}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Container / Carton Metadata */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3.5 mb-5 flex items-center gap-1.5">
          <Package size={14} className="text-slate-500" /> Container &amp; Carton Metadata <span className="text-slate-400 font-semibold normal-case">(optional)</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-5 text-xs font-semibold text-slate-700">
          <div>
            <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Carton Size (units per carton)</label>
            <input type="number" min={0} value={form.cartonSize ?? ''}
              onChange={e => update('cartonSize', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="e.g. 10"
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Carton Price (USD)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">$</span>
              <input type="number" min={0} step={0.01} value={form.cartonPriceUsd ?? ''}
                onChange={e => update('cartonPriceUsd', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="e.g. 450.00"
                className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">20ft Container Estimate</label>
            <input type="text" value={form.containerEst20ft ?? ''}
              onChange={e => update('containerEst20ft', e.target.value || null)}
              placeholder="e.g. 2,200 Cartons (approx. 22 Metric Tons)"
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">40ft Container Estimate</label>
            <input type="text" value={form.containerEst40ft ?? ''}
              onChange={e => update('containerEst40ft', e.target.value || null)}
              placeholder="e.g. 2,800 Cartons (approx. 28 Metric Tons)"
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
      </motion.div>

      {/* Info note */}
      <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 font-semibold">
        <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p><strong className="text-slate-700">How this works:</strong> These prices are stored in the database and take effect immediately after saving. The backend recalculates all order totals using the latest prices from the DB.</p>
          <p><strong className="text-slate-700">Fallback:</strong> If no pricing is saved here, the system falls back to the product&apos;s base price from the Products table.</p>
          <p><strong className="text-slate-700">Reset to Defaults:</strong> Clicking &ldquo;Reset Defaults&rdquo; restores the original preset values from the Dewan Traders pricing configuration.</p>
        </div>
      </div>
    </div>
  );
}
