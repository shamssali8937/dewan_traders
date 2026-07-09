'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ShieldCheck } from 'lucide-react';

const galleryItems = [
  { id: 1, title: 'Premium Kinnow Mandarins', category: 'fruits', imageUrl: '/images/fruits_hero.png', desc: 'Citrus harvesting and temperature packhouse grading in Sargodha.', bgStyle: 'bg-orange-50/50 border-orange-100' },
  { id: 2, title: 'Export-Grade Red Onions', category: 'vegetables', imageUrl: '/images/vegetables_hero.png', desc: 'Graded and cured red onions prepared for cold chain reefer transport.', bgStyle: 'bg-emerald-50/50 border-emerald-100' },
  { id: 3, title: 'Aged Basmati Rice Grains', category: 'rice', imageUrl: '/images/rice_hero.png', desc: 'Super Kernel Basmati grains polishing process in Punjab mills.', bgStyle: 'bg-indigo-50/50 border-indigo-100' },
  { id: 4, title: 'Precision Surgical UT Scissors', category: 'surgical', imageUrl: '/images/surgical_hero.png', desc: 'Medical-grade stainless steel instrument inspection in Sialkot.', bgStyle: 'bg-sky-50/50 border-sky-100' },
  { id: 5, title: 'English Willow Cricket Bats', category: 'sports', imageUrl: '/images/sports_hero.png', desc: 'Professional willow bats finished and balanced for export dispatch.', bgStyle: 'bg-rose-50/50 border-rose-100' },
  { id: 6, title: 'Sajjad Hussain Awan - Executive Officer', category: 'corporate', imageUrl: '/images/owner_sajjad.png', desc: 'Board governance and export operations leadership.', bgStyle: 'bg-slate-50/50 border-slate-200' },
];

const categories = [
  { label: 'All Media', value: 'all' },
  { label: 'Fresh Produce', value: 'produce' },
  { label: 'Premium Rice', value: 'rice' },
  { label: 'Surgical & Sports', value: 'industrial' },
  { label: 'Corporate', value: 'corporate' },
];

export default function GalleryPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredItems = galleryItems.filter((item) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'produce') return item.category === 'fruits' || item.category === 'vegetables';
    if (selectedFilter === 'rice') return item.category === 'rice';
    if (selectedFilter === 'industrial') return item.category === 'surgical' || item.category === 'sports';
    if (selectedFilter === 'corporate') return item.category === 'corporate';
    return false;
  });

  return (
    <div className="bg-white min-h-screen pt-24 relative overflow-hidden pattern-dots-light">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-50 w-[400px] h-[400px] top-[15%] left-[-100px]" />
      </div>

      {/* ═══ HERO SECTION ═══════════════════════════════════════════ */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 mb-2">
              <Camera size={12} /> Media Records
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
              Sourcing & <span className="gradient-text-sky">Operations Gallery</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed">
              Visual records of harvesting, grading, laboratory inspection, and container dispatch operations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ GALLERY MATRIX ════════════════════════════════════════ */}
      <section className="py-12 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">
          
          {/* Filters Bar */}
          <div className="flex flex-wrap justify-center gap-2 border-b border-slate-100 pb-6">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedFilter(cat.value)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedFilter === cat.value
                    ? 'bg-gradient-to-r from-primary to-sky-600 text-white shadow-sm'
                    : 'glass text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid Layout */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`glass rounded-3xl overflow-hidden border bg-white/80 card-hover flex flex-col justify-between ${item.bgStyle}`}
                >
                  <div className="relative aspect-video overflow-hidden border-b border-slate-100 bg-slate-50 flex items-center justify-center">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-primary font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                      <ShieldCheck size={14} className="text-emerald-500" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{item.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
