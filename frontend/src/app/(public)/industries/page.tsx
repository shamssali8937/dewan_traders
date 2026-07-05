'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, Utensils, Activity, Trophy, Ship, Building, Globe, Sparkles } from 'lucide-react';

const industries = [
  {
    icon: ShoppingCart,
    name: 'Retail Chains & Hypermarkets',
    desc: 'Contract packaging, private labeling, and direct-to-warehouse shipping loops for fresh citrus, onions, and pre-packaged premium Basmati rice.',
    products: ['Kinnow Mandarin', 'Super Kernel Basmati', 'Red Onions', 'Garlic Bulbs'],
    clients: 'Lulu Hypermarkets, Carrefour ME, European Cooperative Chains',
    bgStyle: 'bg-orange-50/50 border-orange-100/60',
  },
  {
    icon: Utensils,
    name: 'HORECA & Food Processing',
    desc: 'High-volume supply contracts of staple grains (1121 Sella Basmati) and table produce for commercial kitchens, catering networks, and packaging entities.',
    products: ['Basmati Rice', 'Potatoes', 'Onions', 'Tomatoes'],
    clients: 'Hotel Chains, Catering Networks, Milling Partners',
    bgStyle: 'bg-indigo-50/50 border-indigo-100/60',
  },
  {
    icon: Activity,
    name: 'Clinical & Hospital Distribution',
    desc: 'Sourcing surgical operating instruments, scissors, clamps, and diagnostic trays directly from precision Sialkot manufacturing blocks.',
    products: ['Scissors Set', 'Mosquito Forceps', 'Scalpels', 'Custom Surgical Kits'],
    clients: 'Public Hospital Tenders, Medical Device Distributorships',
    bgStyle: 'bg-sky-50/50 border-sky-100/60',
  },
  {
    icon: Trophy,
    name: 'Sports Clubs & Retailers',
    desc: 'Wholesale manufacturing of field sports equipment, match-grade English willow cricket bats, and thermo-bonded football panels.',
    products: ['Willow Bats', 'Bonded Footballs', 'Hockey Sticks', 'Sports Protective Gear'],
    clients: 'Regional Sports Retailers, Schools, Athletics Federations',
    bgStyle: 'bg-rose-50/50 border-rose-100/60',
  },
  {
    icon: Ship,
    name: 'International Importers & Brokers',
    desc: 'Close trading partnerships with commodity brokers and terminal distributors who require custom packing, flexible payment terms, and origin certification.',
    products: ['Complete Product Lines', 'OEM Brand Printing'],
    clients: 'Sourcing Houses, Commodities Brokers, Port Distributors',
    bgStyle: 'bg-emerald-50/50 border-emerald-100/60',
  },
  {
    icon: Building,
    name: 'Government Tenders & Humanitarian Aid',
    desc: 'Large-scale bulk grain supply and medical utility shipments for government food security reserves, army bases, and NGO distribution drives.',
    products: ['Bulk Produce Bags', 'Aged Basmati Rice', 'Surgical Scissors'],
    clients: 'Government Sourcing Committees, Relief Networks, Public Health Tenders',
    bgStyle: 'bg-teal-50/50 border-teal-100/60',
  },
];

export default function IndustriesPage() {
  return (
    <div className="bg-white min-h-screen pt-24 relative overflow-hidden pattern-dots-light">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-50 w-[450px] h-[450px] top-[20%] left-[-100px]" />
      </div>

      {/* ═══ HERO SECTION ═══════════════════════════════════════════ */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 mb-2">
              <Sparkles size={12} /> Target Sectors
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
              Sectors We <span className="gradient-text-sky">Support</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed">
              Dewan Traders distributes premium produce, rice, medical utensils, and sports gear across diverse market channels in 35+ countries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ INDUSTRIES GRID ═══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map(({ icon: IconComponent, name, desc, products, clients, bgStyle }, idx) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className={`glass rounded-2xl p-6 border bg-white/80 card-hover flex flex-col justify-between ${bgStyle}`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-primary flex items-center justify-center mb-5 shadow-sm">
                  <IconComponent size={18} />
                </div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">{name}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-6">{desc}</p>
              </div>
              <div className="space-y-4 border-t border-slate-100 pt-4 mt-2">
                <div>
                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-2">Key Items Supplied</p>
                  <div className="flex flex-wrap gap-1.5">
                    {products.map((p) => (
                      <span key={p} className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-full font-medium shadow-sm">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="text-[10px] text-slate-600 font-semibold italic border-t border-slate-50 pt-2">
                  Client Profile: {clients}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info panel */}
        <div className="mt-16 glass rounded-3xl p-10 text-center border border-slate-100 bg-white/85 max-w-4xl mx-auto shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-primary flex items-center justify-center mb-4 mx-auto">
            <Globe size={18} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-wide">Custom Import Arrangements</h2>
          <p className="text-slate-500 text-xs mb-8 max-w-md mx-auto leading-relaxed">
            Need custom packaging, special shipping timelines, or specific certifications for your domestic market? Let our sourcing team outline a custom arrangement.
          </p>
          <Link href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-sky-600 text-white font-bold rounded-xl hover:from-primary-hover hover:to-sky-700 transition-all shadow-lg shadow-primary/10 text-xs uppercase tracking-wider">
            Consult Trade Operations
          </Link>
        </div>
      </div>

    </div>
  );
}
