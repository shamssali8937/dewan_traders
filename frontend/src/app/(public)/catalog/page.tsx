'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, ArrowRight, Leaf, Sprout, Scissors, Trophy, Package, MapPin, Wheat, Sparkles } from 'lucide-react';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { formatPrice } from '@/lib/utils';

const iconMap = {
  Leaf: Leaf,
  Sprout: Sprout,
  Wheat: Wheat,
  Scissors: Scissors,
  Trophy: Trophy,
  Package: Package
};

const categoryMeta: Record<string, { label: string; icon: string; style: string }> = {
  fruits: { label: 'Fresh Fruits', icon: 'Leaf', style: 'bg-orange-50/70 border-orange-100/60 text-orange-600' },
  vegetables: { label: 'Vegetables', icon: 'Sprout', style: 'bg-emerald-50/70 border-emerald-100/60 text-emerald-600' },
  rice: { label: 'Premium Rice', icon: 'Wheat', style: 'bg-indigo-50/70 border-indigo-100/60 text-indigo-600' },
  surgical: { label: 'Surgical Items', icon: 'Scissors', style: 'bg-sky-50/70 border-sky-100/60 text-sky-600' },
  sports: { label: 'Sports Items', icon: 'Trophy', style: 'bg-rose-50/70 border-rose-100/60 text-rose-600' },
};

export default function CatalogPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);

  const { data: categoryData } = useCategories();
  const { data, isLoading } = useProducts({
    search: search || undefined,
    category: selectedCategory || undefined,
    page,
    limit: 12,
  });

  const categories = categoryData || [];
  const products = data?.products || [];
  const pagination = data?.pagination;

  return (
    <div className="bg-white min-h-screen pt-24 relative overflow-hidden pattern-dots-light">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-50 w-[500px] h-[500px] top-[10%] right-[-100px]" />
      </div>

      {/* ═══ HERO HEADER ═══════════════════════════════════════════ */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 mb-2">
              <Sparkles size={12} /> Sourcing Catalog
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
              Our Sourced <span className="gradient-text-sky">Commodities</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed">
              Explore our export-ready products across agricultural, clinical, and sports sectors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ CATEGORIES PILLS BAR ══════════════════════════════════ */}
      <section className="py-6 border-y border-slate-100 bg-slate-50/40 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-2.5 items-center justify-center">
            <button
              onClick={() => { setSelectedCategory(''); setPage(1); }}
              className={`px-4.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                !selectedCategory
                  ? 'bg-gradient-to-r from-primary to-sky-600 text-white shadow-sm'
                  : 'glass text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              All Products
            </button>
            {categories.map((cat: any) => {
              const meta = categoryMeta[cat.slug] || { label: cat.name, icon: 'Package', style: 'bg-slate-50/50 border-slate-200 text-slate-600' };
              const IconComponent = iconMap[meta.icon as keyof typeof iconMap] || Package;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                  className={`flex items-center gap-2 px-4.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    selectedCategory === cat.slug
                      ? 'bg-gradient-to-r from-primary to-sky-600 text-white shadow-sm'
                      : `glass text-slate-500 hover:text-slate-900 ${meta.style}`
                  }`}
                >
                  <IconComponent size={13} />
                  {meta.label}
                  {cat._count?.products > 0 && (
                    <span className="text-[10px] opacity-75">({cat._count.products})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ PRODUCT GRID & SEARCH ═════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 relative z-10">
        {/* Search Input */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product name, grade, SKU..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-3 bg-white/80 rounded-2xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200 shadow-sm"
            />
          </div>
        </div>

        {/* Dynamic Display */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse bg-white border border-slate-100">
                <div className="h-40 bg-slate-50" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-sm font-bold text-slate-800 uppercase">No items match criteria</h3>
            <p className="text-slate-400 text-xs mt-1">Try modifying keywords or category tags.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs text-slate-400">
                Displaying {products.length} of {pagination?.total || 0} cargo items
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product: any, idx: number) => {
                const catMeta = categoryMeta[product.category?.slug] || { style: '' };
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.03 }}
                  >
                    <Link href={`/catalog/${product.category?.slug}/${product.slug}`} className="group block">
                      <div className={`glass rounded-2xl overflow-hidden card-hover border bg-white shadow-sm flex flex-col h-full ${catMeta.style}`}>
                        {/* Product Image */}
                        <div className="h-40 bg-slate-50 flex items-center justify-center border-b border-slate-100 relative overflow-hidden">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                          ) : (
                            <Package size={36} className="text-slate-200" />
                          )}
                        </div>

                        {/* Card Info */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[9px] text-primary font-bold uppercase tracking-wider">{product.category?.name}</span>
                              {product.isFeatured && (
                                <span className="text-[9px] bg-sky-50 border border-sky-100 text-primary px-2 py-0.5 rounded-full font-bold">Featured</span>
                              )}
                            </div>
                            <h3 className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors truncate">{product.name}</h3>
                            {product.origin && (
                              <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1.5">
                                <MapPin size={11} className="text-slate-400" /> Origin: {product.origin}
                              </p>
                            )}
                          </div>
                          
                          <div className="space-y-3.5 mt-4">
                            <div className="flex items-center justify-between border-t border-slate-100 pt-3.5">
                              <div>
                                <span className="text-sm font-black text-slate-800">{formatPrice(product.price)}</span>
                                <span className="text-[10px] text-slate-500 font-normal">/{product.unit}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-semibold uppercase">Min MOQ: {product.minOrderQty}</span>
                            </div>
                            
                            <div className="flex items-center justify-between border-t border-slate-50 pt-2 text-[10px] text-slate-500">
                              <span className={`px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                {product.stock > 0 ? 'In-Stock' : 'Replenishing'}
                              </span>
                              <span className="group-hover:text-primary transition-colors flex items-center gap-0.5 uppercase font-bold text-[9px] tracking-wider">
                                Order RFQ <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      page === p
                        ? 'bg-gradient-to-r from-primary to-sky-600 text-white shadow-sm'
                        : 'glass text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
