'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, Package, Globe, Award, Users, TrendingUp,
  ChevronRight, Star, MapPin, Leaf, Scissors, Trophy, Sprout, Wheat, ShieldCheck, Ship, Clock, CheckCircle2, ChevronDown
} from 'lucide-react';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { useTestimonials } from '@/hooks/useCms';
import { formatPrice, resolveImageUrl } from '@/lib/utils';
import { useState } from 'react';
import { useMarketStore } from '@/store/marketStore';
import WorldShippingMap from '@/components/WorldShippingMap';

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
    description: 'Sargodha Kinnow mandarins, aromatic sweet Chaunsa Mangoes, and fresh seasonal harvests.',
    bgStyle: 'bg-emerald-50/40 border-emerald-100/50 hover:bg-emerald-50 text-emerald-600',
    count: '20+ Varieties',
    imageUrl: '/images/fruits_hero.png',
  },
  {
    name: 'Vegetables',
    slug: 'vegetables',
    icon: 'Sprout',
    description: 'Export-ready potatoes, red onions, garlic bulbs, and certified seasonal produce.',
    bgStyle: 'bg-emerald-50/40 border-emerald-100/50 hover:bg-emerald-50 text-emerald-600',
    count: '15+ Varieties',
    imageUrl: '/images/vegetables_hero.png',
  },
  {
    name: 'Premium Rice',
    slug: 'rice',
    icon: 'Wheat',
    description: 'Fragrant aged Super Kernel Basmati rice and double-polished premium 1121 Sella Basmati.',
    bgStyle: 'bg-blue-50/40 border-blue-100/50 hover:bg-blue-50 text-blue-600',
    count: '10+ Varieties',
    imageUrl: '/images/rice_hero.png',
  },
  {
    name: 'Surgical Products',
    slug: 'surgical',
    icon: 'Scissors',
    description: 'Precision medical instruments and stainless steel hospital equipment from Sialkot hubs.',
    bgStyle: 'bg-blue-50/40 border-blue-100/50 hover:bg-blue-50 text-blue-600',
    count: '50+ Items',
    imageUrl: '/images/surgical_hero.png',
  },
  {
    name: 'Sports Goods',
    slug: 'sports',
    icon: 'Trophy',
    description: 'Match-quality cricket bats, thermo-bonded footballs, and composite hockey sticks.',
    bgStyle: 'bg-orange-50/40 border-orange-100/50 hover:bg-orange-50 text-orange-600',
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
  const { formatProductPrice, getProductUnit, getProductMoq } = useMarketStore();

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="bg-[#fafbf9] min-h-screen relative overflow-hidden pattern-dots-light">

      {/* Ambient background decoration */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-emerald-100/20 w-[600px] h-[600px] top-[-100px] right-[-50px]" />
        <div className="fluid-blob bg-blue-100/15 w-[700px] h-[700px] bottom-[-200px] left-[-100px]" />
        <div className="fluid-blob bg-orange-50/10 w-[500px] h-[500px] top-[40%] right-[10%]" />
      </div>

      {/* ═══ HERO SECTION ═══════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-32 pb-20 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-12 items-center w-full">

          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-7 text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-100/60 text-emerald-800 text-[10px] uppercase font-black tracking-widest"
            >
              <ShieldCheck size={13} className="text-primary" /> Direct Export Sourcing & Logistics Hub
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-slate-900 leading-[1.1] tracking-tight"
            >
              Global B2B Trade, <br />
              <span className="gradient-text-sky">Refined at Source.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium"
            >
              Dewan Traders consolidates and exports premium Sargodha mandarins, aged basmati rice, medical instruments, and sports gear directly to wholesalers, distributors, and manufacturers worldwide.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 pt-3"
            >
              <Link
                href="/catalog"
                className="group flex items-center gap-2 px-7 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white font-extrabold rounded-xl transition-all shadow-md shadow-primary/10 text-xs uppercase tracking-wider"
              >
                Browse Sourced Catalog
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/quote"
                className="px-7 py-4 bg-white border border-slate-200 text-slate-700 font-extrabold rounded-xl hover:bg-slate-50 transition-all text-xs uppercase tracking-wider shadow-sm"
              >
                Submit RFQ Inquiry
              </Link>
            </motion.div>
          </div>

          {/* Hero Right — Premium World Shipping Map */}
          <div className="lg:col-span-6 flex items-center justify-center relative w-full">
            <WorldShippingMap />
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ════════════════════════════════════════════ */}
      <section className="py-16 border-y border-slate-200/60 bg-white/60 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map(({ icon: Icon, label, value, suffix }) => (
              <div key={label} className="glass rounded-3xl p-6 border border-slate-200/50 card-hover text-center bg-white shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/50 text-primary flex items-center justify-center mx-auto mb-4">
                  <Icon size={18} />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</div>
                <div className="text-[10px] text-slate-500 font-black tracking-widest uppercase mt-1">{label}</div>
                <div className="text-[10px] text-primary font-bold mt-0.5">{suffix}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES SECTION ════════════════════════════════════ */}
      <section className="py-28 relative z-10 bg-[#fafbf9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20 space-y-3">
            <span className="text-primary text-[10px] uppercase font-black tracking-[0.2em]">Product Channels</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
              Premium <span className="gradient-text-sky">Export Channels</span>
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed font-medium">
              We operate audited sourcing grids and multi-temperature warehousing ensuring structural compliance for each class of trade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/catalog/${cat.slug}`} className="group block">
                <div className={`glass rounded-3xl p-5 border flex flex-col h-full bg-white transition-all duration-300 card-hover ${cat.bgStyle}`}>
                  {/* Category Image Box */}
                  <div className="h-32 rounded-2xl bg-slate-50 mb-5 overflow-hidden relative border border-slate-100 shadow-inner">
                    <img src={resolveImageUrl(cat.imageUrl)} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center mb-4 text-primary shadow-sm">
                    {(() => {
                      const Icon = iconMap[cat.icon as keyof typeof iconMap] || Package;
                      return <Icon size={16} />;
                    })()}
                  </div>

                  <h3 className="text-xs font-black text-slate-900 tracking-wider uppercase mb-2">{cat.name}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-6 flex-1 font-medium">{cat.description}</p>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                    <span className="text-[9px] text-slate-600 font-extrabold uppercase tracking-widest">{cat.count}</span>
                    <ChevronRight size={14} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PRODUCTS SECTION ══════════════════════════════ */}
      {products.length > 0 && (
        <section className="py-28 border-t border-slate-200/60 bg-white/50 relative z-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-end justify-between mb-16">
              <div>
                <span className="text-primary text-[10px] uppercase font-black tracking-[0.2em]">Featured Sourced Goods</span>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Export Commodities</h2>
              </div>
              <Link href="/catalog" className="text-xs text-slate-600 hover:text-primary flex items-center gap-1.5 transition-colors uppercase font-extrabold tracking-widest border border-slate-200 px-4 py-2.5 rounded-xl bg-white shadow-sm">
                Full Index &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((p: any) => (
                <Link key={p.id} href={`/catalog/${p.category?.slug}/${p.slug}`} className="group block">
                  <div className="glass rounded-3xl overflow-hidden card-hover border border-slate-200/60 flex flex-col h-full bg-white shadow-sm">
                    <div className="h-44 bg-slate-50 flex items-center justify-center border-b border-slate-100 relative overflow-hidden">
                      {p.imageUrl ? (
                        <img src={resolveImageUrl(p.imageUrl)} alt={p.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                      ) : (
                        <Package size={36} className="text-slate-400" />
                      )}
                      <div className="absolute top-3 left-3 bg-white/80 backdrop-blur px-2.5 py-1 rounded-lg text-[9px] font-black uppercase text-primary border border-slate-200">
                        {p.origin || 'Pakistan'}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] text-primary font-black uppercase tracking-widest">{p.category?.name}</span>
                        <h3 className="text-xs font-black text-slate-800 mt-1 truncate group-hover:text-primary transition-colors uppercase tracking-wide">{p.name}</h3>
                        <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed font-medium">{p.description}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-5">
                        <span className="text-xs font-extrabold text-slate-900">{formatProductPrice(p.slug, p.price)}<span className="text-[10px] text-slate-500 font-normal">/{getProductUnit(p.slug, p.unit)}</span></span>
                        <span className="text-[9px] text-slate-500 uppercase font-black">MOQ: {getProductMoq(p.slug, p.minOrderQty)} {getProductUnit(p.slug, p.unit)}</span>
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
      <section className="py-28 relative z-10 border-t border-slate-200/60 bg-[#fafbf9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 space-y-7">
            <span className="text-primary text-[10px] uppercase font-black tracking-[0.2em]">Compliance & Sourcing</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
              Sourcing & Shipping <br />
              <span className="gradient-text-sky">Process Audited</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              We manage packaging facilities and high-end temperature warehousing. Each cargo container undergoes laboratory testing and sanitary approvals before departure.
            </p>
            <div className="space-y-5 pt-2">
              {[
                { step: '01', title: 'Specification Sheets & L/C terms', desc: 'Custom export worksheets, freight bookings, and LC at sight setup.' },
                { step: '02', title: 'Audited Sourcing & Moisture Control', desc: 'Consolidation, visual sorting, sizing, and dynamic lab analysis.' },
                { step: '03', title: 'Phytosanitary Clearance & Sealing', desc: 'Plant Protection clearances, SGS checks, and refrigerated container sealing.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4 items-start">
                  <div className="text-[11px] font-black text-primary font-mono bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg shrink-0">{step}</div>
                  <div>
                    <h4 className="text-slate-900 text-xs font-black uppercase tracking-wider">{title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sourcing Certification matrix */}
          <div className="lg:col-span-6 w-full">
            <div className="glass rounded-3xl p-7 border border-slate-200/60 bg-white shadow-sm relative space-y-4">
              <h3 className="text-slate-900 font-extrabold text-xs uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Sourcing Certifications Matrix
              </h3>
              <div className="space-y-3.5">
                {[
                  { label: 'HACCP Standard', value: 'Certified Produce Handling' },
                  { label: 'ISO 9001:2015 System', value: 'Sourcing Workflows Audited' },
                  { label: 'CE Mark Compliance', value: 'Precision Surgical Instruments' },
                  { label: 'FDA Registered Facility', value: 'US Commodity Shipments' },
                ].map(({ label, value }) => (
                  <div key={label} className="p-4 bg-slate-50 border border-slate-200/55 rounded-2xl flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-semibold">{label}</span>
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
        <section className="py-28 border-t border-slate-200/60 bg-white/50 relative z-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-20">
              <span className="text-primary text-[10px] uppercase font-black tracking-[0.2em]">Client Testimonials</span>
              <h2 className="text-3xl font-extrabold text-slate-900">Partner feedback</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonialList.map((t: any) => (
                <div key={t.id} className="glass rounded-3xl p-7 border border-slate-200/60 flex flex-col justify-between bg-white shadow-sm card-hover">
                  <div>
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                        <Star key={idx} size={12} className="text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed mb-6 italic font-medium">"{t.message}"</p>
                  </div>
                  <div className="flex items-center gap-3 border-t border-slate-100 pt-4 mt-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{t.name}</div>
                      <div className="text-[10px] text-slate-500">{t.position}{t.company ? ` · ${t.company}` : ''}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ FAQS BRIEF ACCORDION ═══════════════════════════════════ */}
      <section className="py-28 border-t border-slate-200/60 bg-[#fafbf9] relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-primary text-[10px] uppercase font-black tracking-[0.2em]">FAQ Desk</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Export Support FAQs</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: 'What is the standard container capacity for fresh mandarins?', a: 'Fresh Kinnow mandarins are packed in 10kg or 13kg telescopic cardboard cartons, palletized, and loaded inside 40ft High Cube refrigerated container boxes carrying approximately 24-25 Metric Tons.' },
              { q: 'How is Basmati rice aged and monitored?', a: 'Our basmati rice is aged inside dynamic humidity-monitored warehouse silos for a minimum of 12-18 months. This enhances length expansion, aroma density, and non-sticky cooking.' },
              { q: 'What payment terms are accepted for wholesale shipments?', a: 'Large B2B cargo runs on 100% Irrevocable Letter of Credit (L/C) at sight, or partial Advance Bank Wire Transfer (T/T) and balance against shipping documents scans.' },
            ].map((faq, idx) => (
              <div key={idx} className="glass rounded-2xl overflow-hidden border border-slate-200/60 bg-white shadow-sm">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-5 text-xs font-extrabold text-slate-800 flex justify-between items-center hover:bg-slate-50 transition-all"
                >
                  {faq.q}
                  <ChevronDown size={14} className={`text-primary transition-transform duration-200 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/faqs" className="text-xs text-primary hover:underline font-extrabold uppercase tracking-wider">
              Browse Full FAQs Portal &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ B2B LOGISTICS CTA ═════════════════════════════════════ */}
      <section className="py-24 relative z-10 border-t border-slate-200/60 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="glass rounded-3xl p-10 border border-slate-200/60 text-center bg-gradient-to-br from-slate-50 to-[#fafbf9] shadow-sm relative space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Establish Sourcing Contract
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-medium">
              Submit your specific grading requirements, target volumes, and port destination coordinates to retrieve an official FOB worksheets sheet.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                href="/quote"
                className="px-7 py-3.5 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10"
              >
                Submit RFQ Request
              </Link>
              <Link
                href="/contact"
                className="px-7 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all text-xs uppercase tracking-wider shadow-sm"
              >
                Contact Trade Operations Desk
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
