'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, ArrowRight, Leaf, Sprout, Scissors, Trophy, Package, MapPin, Wheat, Sparkles } from 'lucide-react';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { formatPrice, resolveImageUrl } from '@/lib/utils';
import { useMarketStore } from '@/store/marketStore';

const iconMap = {
  Leaf: Leaf,
  Sprout: Sprout,
  Wheat: Wheat,
  Scissors: Scissors,
  Trophy: Trophy,
  Package: Package
};

const categoryMeta: Record<string, { label: string; icon: string; style: string }> = {
  fruits: { label: 'Fresh Fruits', icon: 'Leaf', style: 'bg-emerald-50 border-emerald-100/60 text-emerald-700' },
  vegetables: { label: 'Vegetables', icon: 'Sprout', style: 'bg-emerald-50 border-emerald-100/60 text-emerald-700' },
  rice: { label: 'Premium Rice', icon: 'Wheat', style: 'bg-blue-50 border-blue-100/60 text-blue-700' },
  surgical: { label: 'Surgical Items', icon: 'Scissors', style: 'bg-blue-50 border-blue-100/60 text-blue-700' },
  sports: { label: 'Sports Items', icon: 'Trophy', style: 'bg-orange-50 border-orange-100/60 text-orange-700' },
};

export default function CatalogPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const { formatProductPrice, getProductUnit, getProductMoq, region } = useMarketStore();

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
    <div className="bg-[#fafbf9] min-h-screen pt-24 relative overflow-hidden pattern-dots-light">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-emerald-100/10 w-[500px] h-[500px] top-[10%] right-[-100px]" />
      </div>

      {/* ═══ HERO HEADER ═══════════════════════════════════════════ */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center space-y-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="text-primary text-[10px] uppercase font-black tracking-[0.2em] flex items-center justify-center gap-1.5 mb-2">
              <Sparkles size={12} /> B2B Sourcing Index
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Export-Ready <span className="gradient-text-sky">Commodities</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed font-medium">
              Explore our premium agricultural produce, precision clinical instruments, and match-grade sports gear. All products support direct inquiry pricing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ CATEGORIES PILLS BAR ══════════════════════════════════ */}
      <section className="py-7 border-y border-slate-200/60 bg-white/50 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap gap-2.5 items-center justify-center">
            <button
              onClick={() => { setSelectedCategory(''); setPage(1); }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                !selectedCategory
                  ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm'
              }`}
            >
              All Products
            </button>
            {categories.map((cat: any) => {
              const meta = categoryMeta[cat.slug] || { label: cat.name, icon: 'Package', style: 'bg-white border-slate-200 text-slate-600 shadow-sm' };
              const IconComponent = iconMap[meta.icon as keyof typeof iconMap] || Package;
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                    isSelected
                      ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-sm'
                      : `bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm`
                  }`}
                >
                  <IconComponent size={13} className={isSelected ? 'text-white' : 'text-primary'} />
                  {meta.label}
                  {cat._count?.products > 0 && (
                    <span className={`text-[10px] ml-1 opacity-75 font-semibold ${isSelected ? 'text-white' : 'text-slate-400'}`}>({cat._count.products})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ PRODUCT GRID & SEARCH ═════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 relative z-10">
        {/* Search Input */}
        <div className="flex gap-3 mb-10 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product name, grade, SKU..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm font-medium"
            />
          </div>
        </div>

        {/* Dynamic Display */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass rounded-3xl overflow-hidden animate-pulse bg-white border border-slate-200/50 shadow-sm">
                <div className="h-44 bg-slate-100" />
                <div className="p-5 space-y-3.5">
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 glass rounded-3xl border border-slate-200/50 bg-white shadow-sm max-w-md mx-auto space-y-3">
            <Package className="mx-auto text-slate-400" size={40} />
            <h3 className="text-xs font-black text-slate-900 uppercase">No items match criteria</h3>
            <p className="text-slate-500 text-[11px] font-medium leading-relaxed">Try modifying your search keywords or switching category filters.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Displaying {products.length} of {pagination?.total || 0} commodities
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
                      <div className="glass rounded-3xl overflow-hidden card-hover border border-slate-200/60 bg-white shadow-sm flex flex-col h-full">
                        {/* Product Image */}
                        <div className="h-44 bg-slate-50 flex items-center justify-center border-b border-slate-100 relative overflow-hidden">
                          {product.imageUrl ? (
                            <img src={resolveImageUrl(product.imageUrl)} alt={product.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                          ) : (
                            <Package size={36} className="text-slate-400" />
                          )}
                          <div className="absolute top-3 left-3 bg-white/80 backdrop-blur px-2 py-0.5 rounded text-[9px] font-extrabold text-slate-600 border border-slate-200">
                            {product.origin || 'Pakistan'}
                          </div>
                        </div>

                        {/* Card Info */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[9px] text-primary font-black uppercase tracking-widest">{product.category?.name}</span>
                              {product.isFeatured && (
                                <span className="text-[9px] bg-emerald-50 border border-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black uppercase">Featured</span>
                              )}
                            </div>
                            <h3 className="text-xs font-black text-slate-800 group-hover:text-primary transition-colors truncate uppercase tracking-wide">{product.name}</h3>
                            <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1.5 font-semibold">
                              <MapPin size={12} className="text-slate-400" /> Sourcing: {product.origin || 'Karachi/Sargodha'}
                            </p>
                          </div>
                          
                          <div className="space-y-4 mt-5">
                            <div className="flex flex-col gap-2.5 border-t border-slate-100 pt-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-xs font-extrabold text-slate-900">{formatProductPrice(product.slug, product.price)}</span>
                                  <span className="text-[10px] text-slate-500 font-normal">/{getProductUnit(product.slug, product.unit)}</span>
                                </div>
                                <span className="text-[9px] text-slate-500 font-black uppercase">
                                  MOQ: {getProductMoq(product.slug, product.minOrderQty)} {getProductUnit(product.slug, product.unit)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="w-full py-2.5 bg-slate-50 group-hover:bg-primary group-hover:text-white rounded-xl text-center text-[10px] font-bold uppercase tracking-wider text-slate-600 transition-all border border-slate-200/60 group-hover:border-transparent flex items-center justify-center gap-1 shadow-sm">
                              Request Pricing Spec &rarr;
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
              <div className="flex justify-center items-center gap-3 mt-12 pt-6 border-t border-slate-200/50">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 disabled:opacity-50 transition-all bg-white shadow-sm"
                >
                  Prev
                </button>
                <span className="text-xs font-extrabold text-slate-700">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  disabled={page >= pagination.pages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 disabled:opacity-50 transition-all bg-white shadow-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
