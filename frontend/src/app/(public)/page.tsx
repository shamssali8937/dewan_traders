'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, Package, Globe, Award, Users, TrendingUp,
  ChevronRight, Star, MapPin, Leaf, Scissors, Trophy, Sprout, Wheat, ShieldCheck, Ship
} from 'lucide-react';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { useTestimonials } from '@/hooks/useCms';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';

const iconMap = {
  Leaf: Leaf,
  Sprout: Sprout,
  Wheat: Wheat,
  Scissors: Scissors,
  Trophy: Trophy,
  Package: Package
};

const categories = [
  {
    name: 'Fresh Fruits',
    slug: 'fruits',
    icon: 'Leaf',
    description: 'Sargodha Kinnow mandarins, sweet aromatic Chaunsa Mangoes, and fresh seasonal harvests.',
    bgStyle: 'bg-orange-50/50 hover:bg-orange-50 border-orange-100 text-orange-600',
    count: '20+ Varieties',
    imageUrl: '/images/fruits_hero.png',
  },
  {
    name: 'Vegetables',
    slug: 'vegetables',
    icon: 'Sprout',
    description: 'Export-grade onions, potatoes, tomatoes, and other certified organic produce.',
    bgStyle: 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-100 text-emerald-600',
    count: '15+ Varieties',
    imageUrl: '/images/vegetables_hero.png',
  },
  {
    name: 'Premium Rice',
    slug: 'rice',
    icon: 'Wheat',
    description: 'Fragrant long-grain Super Kernel Basmati and premium 1121 Sella Basmati.',
    bgStyle: 'bg-indigo-50/50 hover:bg-indigo-50 border-indigo-100 text-indigo-600',
    count: '10+ Varieties',
    imageUrl: '/images/rice_hero.png',
  },
  {
    name: 'Surgical Products',
    slug: 'surgical',
    icon: 'Scissors',
    description: 'Precision medical instruments and stainless steel hospital equipment from Sialkot.',
    bgStyle: 'bg-sky-50/50 hover:bg-sky-50 border-sky-100 text-sky-600',
    count: '50+ Items',
    imageUrl: '/images/surgical_hero.png',
  },
  {
    name: 'Sports Goods',
    slug: 'sports',
    icon: 'Trophy',
    description: 'Match-quality cricket bats, thermo-bonded footballs, and composite hockey sticks.',
    bgStyle: 'bg-rose-50/50 hover:bg-rose-50 border-rose-100 text-rose-600',
    count: '30+ Products',
    imageUrl: '/images/sports_hero.png',
  },
];

const stats = [
  { icon: Globe, label: 'Export Markets', value: '35+', suffix: 'Countries' },
  { icon: Ship, label: 'Shipping Volume', value: '15k+', suffix: 'Metric Tons' },
  { icon: Users, label: 'Trade Partners', value: '200+', suffix: 'Active Clients' },
  { icon: Award, label: 'Quality Compliance', value: '100%', suffix: 'Audit Cleared' },
];

export default function HomePage() {
  const { data: featuredData } = useFeaturedProducts();
  const { data: testimonials } = useTestimonials();
  const products = featuredData?.products || featuredData || [];
  const testimonialList = testimonials || [];

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="bg-white min-h-screen relative overflow-hidden pattern-dots-light">
      
      {/* Soft gradient backgrounds - Stripe style */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-200 w-[500px] h-[500px] top-[-100px] right-[-50px]" />
        <div className="fluid-blob bg-teal-100 w-[600px] h-[600px] bottom-[-200px] left-[-100px]" />
        <div className="fluid-blob bg-rose-100 w-[450px] h-[450px] top-[40%] right-[10%]" />
      </div>

      {/* ═══ HERO SECTION ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center w-full">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-600 text-[10px] uppercase font-bold tracking-widest"
            >
              <ShieldCheck size={12} /> Direct Sourcing From Pakistan
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight"
            >
              Global Trade, <br />
              <span className="gradient-text-sky">Refined at Source</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg"
            >
              Dewan Traders is a premium supply agency. Under CEO **Sajjad Hussain Awan**, we export elite Sargodha mandarins, aged basmati rice, medical instruments, and sports gear directly to global markets.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap items-center gap-3.5 pt-2"
            >
              <Link
                href="/catalog"
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-sky-600 text-white font-bold rounded-xl hover:from-primary-hover hover:to-sky-700 transition-all shadow-md shadow-primary/10 text-xs uppercase tracking-wider"
              >
                Explore Products
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/quote"
                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all text-xs uppercase tracking-wider"
              >
                Request Quote
              </Link>
            </motion.div>
          </div>

          {/* Hero Right World Map */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full glass rounded-3xl p-6 border border-slate-100 relative shadow-md bg-white/70 overflow-hidden"
            >
              <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-semibold z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" /> Shipping Corridors
              </div>

              {/* Clean Map SVG */}
              <svg viewBox="0 0 1000 500" className="w-full h-full text-slate-200" fill="currentColor">
                <path d="M150,150 Q180,130 220,160 T300,180 T350,220 T400,280 T380,350 T280,320 Z" fill="rgba(15, 23, 42, 0.01)" stroke="rgba(15, 23, 42, 0.03)" strokeWidth="1" />
                <path d="M450,100 Q500,80 550,120 T620,180 T680,120 T750,150 T800,220 T720,320 T650,420 Z" fill="rgba(15, 23, 42, 0.01)" stroke="rgba(15, 23, 42, 0.03)" strokeWidth="1" />
                
                {/* Shipping routes from Karachi */}
                <g className="text-primary">
                  <circle cx="520" cy="220" r="5" className="fill-primary" />
                  <circle cx="520" cy="220" r="12" className="stroke-primary/30 fill-none animate-ping" />
                  <text x="532" y="224" className="fill-slate-800 text-[10px] font-bold tracking-wider">PAKISTAN</text>

                  {/* Route 1 */}
                  <path d="M520,220 Q460,240 420,250" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4" />
                  <circle cx="420" cy="250" r="4" className="fill-sky-500" />
                  <text x="360" y="270" className="fill-slate-400 text-[8px] font-bold">MIDDLE EAST</text>

                  {/* Route 2 */}
                  <path d="M520,220 Q400,160 300,120" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4" />
                  <circle cx="300" cy="120" r="4" className="fill-sky-500" />
                  <text x="250" y="110" className="fill-slate-400 text-[8px] font-bold">EUROPE</text>

                  {/* Route 3 */}
                  <path d="M520,220 Q620,180 720,190" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4" />
                  <circle cx="720" cy="190" r="4" className="fill-sky-500" />
                  <text x="730" y="194" className="fill-slate-400 text-[8px] font-bold">EAST ASIA</text>
                </g>
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ════════════════════════════════════════════ */}
      <section className="py-12 border-t border-b border-slate-100 bg-slate-50/50 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ icon: Icon, label, value, suffix }) => (
              <div key={label} className="glass rounded-2xl p-5 border border-slate-100 card-hover text-center bg-white">
                <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-100 text-primary flex items-center justify-center mx-auto mb-3">
                  <Icon size={16} />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-800">{value}</div>
                <div className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mt-1">{label}</div>
                <div className="text-[10px] text-primary font-semibold mt-0.5">{suffix}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES SECTION ════════════════════════════════════ */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 space-y-2">
            <span className="text-primary text-[10px] uppercase font-bold tracking-widest">Product Categories</span>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
              Five Handcrafted <span className="gradient-text-sky">Export Channels</span>
            </h2>
            <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
              Dewan Traders operates audited sourcing grids ensuring structural compliance for each class of trade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {categories.map((cat, idx) => (
              <Link key={cat.slug} href={`/catalog/${cat.slug}`} className="group block">
                <div className={`glass rounded-2xl p-5 border card-hover flex flex-col h-full bg-white/80 transition-all duration-300 ${cat.bgStyle}`}>
                  {/* Category Image Box */}
                  <div className="h-28 rounded-xl bg-slate-50 mb-4 overflow-hidden relative border border-slate-100 shadow-inner">
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
                  </div>

                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center mb-4 text-primary group-hover:scale-105 transition-transform">
                    {(() => {
                      const Icon = iconMap[cat.icon as keyof typeof iconMap] || Package;
                      return <Icon size={18} />;
                    })()}
                  </div>

                  <h3 className="text-xs font-bold text-slate-800 tracking-wide uppercase mb-2">{cat.name}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-6 flex-1">{cat.description}</p>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{cat.count}</span>
                    <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PRODUCTS SECTION ══════════════════════════════ */}
      {products.length > 0 && (
        <section className="py-24 border-t border-slate-100 bg-slate-50/30 relative z-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-primary text-[10px] uppercase font-bold tracking-widest">Hot Commodities</span>
                <h2 className="text-3xl font-black text-slate-900">Featured Exports</h2>
              </div>
              <Link href="/catalog" className="text-xs text-slate-500 hover:text-primary flex items-center gap-1 transition-colors uppercase font-bold tracking-wider">
                Full Index &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((p: any) => (
                <Link key={p.id} href={`/catalog/${p.category?.slug}/${p.slug}`} className="group block">
                  <div className="glass rounded-2xl overflow-hidden card-hover border border-slate-100 flex flex-col h-full bg-white shadow-sm">
                    <div className="h-40 bg-slate-50 flex items-center justify-center border-b border-slate-100 relative overflow-hidden">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                      ) : (
                        <Package size={36} className="text-slate-300" />
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] text-primary font-bold uppercase tracking-wider">{p.category?.name}</span>
                        <h3 className="text-xs font-bold text-slate-800 mt-1 truncate group-hover:text-primary transition-colors">{p.name}</h3>
                        <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">{p.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 mt-4">
                        <span className="text-xs font-black text-slate-800">{formatPrice(p.price)}<span className="text-[10px] text-slate-400 font-normal">/{p.unit}</span></span>
                        <span className="text-[9px] text-slate-400 uppercase font-semibold">Min MOQ: {p.minOrderQty}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ TIMELINE PROCESS OVERVIEW ═════════════════════════════ */}
      <section className="py-24 relative z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-primary text-[10px] uppercase font-bold tracking-widest">Sourcing Workflow</span>
            <h2 className="text-3xl font-black text-slate-900 leading-tight">
              Verified Compliance <br />
              <span className="gradient-text-sky">From Farm to Port</span>
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Dewan Traders operates direct consolidation packhouses and warehouse storage. Each commodity is verified, packed, cleared, and sealed under international compliance standards.
            </p>
            <div className="space-y-4 pt-2">
              {[
                { step: '01', title: 'RFQ & Contract Agreement', desc: 'Custom specification sheets, LC terms setup, and CFR/CIF cargo contracts.' },
                { step: '02', title: 'Audited Harvesting & Lab Assay', desc: 'Direct sourcing audits, steel grading reviews, and moisture assessments.' },
                { step: '03', title: 'Reefer Container & Health Clearances', desc: 'Phytosanitary clearances issued by Plant Protection Dept., container sealing.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4 items-start">
                  <div className="text-[10px] font-black text-primary font-mono bg-sky-50 border border-sky-100 px-2 py-0.5 rounded shrink-0">{step}</div>
                  <div>
                    <h4 className="text-slate-800 text-xs font-bold uppercase tracking-wider">{title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <Link href="/export-process" className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:text-sky-600 transition-colors uppercase tracking-wider">
                Read Export Flow Guide <ArrowRight size={12} />
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="glass rounded-3xl p-6 border border-slate-100 bg-white/80 shadow-md">
              <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-500" /> Sourcing Certifications Matrix
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'HACCP Safety Standard', value: 'Fresh Produce Clearance' },
                  { label: 'ISO 9001:2015 Audited', value: 'Sourcing Workflows' },
                  { label: 'CE Mark Compliance', value: 'Sialkot Surgical Line' },
                  { label: 'FDA Registered Portal', value: 'US Commodity Shipments' },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">{label}</span>
                    <span className="text-primary font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS SECTION ═══════════════════════════════════ */}
      {testimonialList.length > 0 && (
        <section className="py-24 border-t border-slate-100 bg-slate-50/30 relative z-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-primary text-[10px] uppercase font-bold tracking-widest">Client Feedback</span>
              <h2 className="text-3xl font-black text-slate-900">What Our Partners Say</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonialList.map((t: any) => (
                <div key={t.id} className="glass rounded-2xl p-6 border border-slate-100 flex flex-col justify-between bg-white shadow-sm card-hover">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed mb-6 italic">"{t.message}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-sky-500 flex items-center justify-center text-white font-bold text-xs">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{t.name}</div>
                      <div className="text-[10px] text-slate-400">{t.position}{t.company ? ` · ${t.company}` : ''}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ FAQS BRIEF ACCORDION ═══════════════════════════════════ */}
      <section className="py-24 border-t border-slate-100 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-primary text-[10px] uppercase font-bold tracking-widest">FAQ Desk</span>
            <h2 className="text-3xl font-black text-slate-900">Trading Support</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: 'What is the standard container capacity for fresh mandarins?', a: 'Fresh Kinnows are packed in 10kg or 13kg telescopic cardboard cartons, palletized, and loaded inside 40ft High Cube refrigerated container boxes carrying approximately 24-25 Metric Tons.' },
              { q: 'How is Basmati rice aged and monitored?', a: 'Our basmati rice is aged inside dynamic humidity-monitored warehouse silos for a minimum of 12-18 months. This enhances length expansion, aroma density, and non-sticky cooking.' },
              { q: 'What payment terms are accepted for large shipments?', a: 'Large B2B cargo runs on 100% Irrevocable Letter of Credit (L/C) at sight, or partial Advance Bank Wire Transfer (T/T) and balance against shipping documents scans.' },
            ].map((faq, idx) => (
              <div key={idx} className="glass rounded-xl overflow-hidden border border-slate-100 bg-white">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-5 text-xs font-bold text-slate-800 flex justify-between items-center hover:bg-slate-50 transition-all"
                >
                  {faq.q}
                  <ChevronRight size={14} className={`text-primary transition-transform ${activeFaq === idx ? 'rotate-90' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/faqs" className="text-xs text-primary hover:underline font-bold uppercase tracking-wider">
              Browse Full FAQs Guide &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ B2B LOGISTICS CTA ═════════════════════════════════════ */}
      <section className="py-20 relative z-10 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="glass rounded-3xl p-10 border border-slate-100 text-center bg-gradient-to-br from-slate-50 to-sky-50/50 shadow-sm relative">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
              Establish Sourcing Contract
            </h2>
            <p className="text-slate-500 text-xs max-w-sm mx-auto mb-8 leading-relaxed">
              Work directly with Dewan Traders trade operations desk under Sajjad Hussain Awan for wholesale shipping worksheets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quote"
                className="px-6 py-3 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-primary/10"
              >
                Submit Quote RFQ
              </Link>
              <Link
                href="/partner"
                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all text-xs uppercase tracking-wider"
              >
                Become Distributor &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
