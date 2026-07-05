'use client';

import { use, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, ArrowRight, MapPin, Leaf, Sprout, Scissors, Trophy, Package, Wheat, Sparkles, Award } from 'lucide-react';
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

const categoryDetails: Record<string, {
  label: string;
  icon: keyof typeof iconMap;
  styleStyle: string;
  bannerImg: string;
  longDesc: string;
  origin: string;
  productionHub: string;
  exportStandards: string;
}> = {
  fruits: {
    label: 'Fresh Fruits',
    icon: 'Leaf',
    styleStyle: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    bannerImg: '/images/fruits_hero.png',
    longDesc: 'Sargodha is globally celebrated as the citrus capital. Our Kinnow Mandarins are handpicked, washed, waxed, and packed in modern processing plants. During summer, we export the world-famous sweet, fiberless Chaunsa Mangoes from Multan and Rahim Yar Khan orchards.',
    origin: 'Punjab, Pakistan',
    productionHub: 'Sargodha & Multan',
    exportStandards: 'Phytosanitary & GlobalGAP Certified'
  },
  vegetables: {
    label: 'Vegetables',
    icon: 'Sprout',
    styleStyle: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    bannerImg: '/images/vegetables_hero.png',
    longDesc: 'We supply high-grade potatoes, onions, tomatoes, and garlic bulbs sorted by size and cured properly to withstand transit times. Sourced directly from modern agricultural zones of Punjab, we ensure full traceability and freshness.',
    origin: 'Punjab & Sindh, Pakistan',
    productionHub: 'Okara & Pakpattan',
    exportStandards: 'ISO 22000 & HACCP Compliant'
  },
  rice: {
    label: 'Premium Rice',
    icon: 'Wheat',
    styleStyle: 'bg-blue-50 border-blue-100 text-blue-700',
    bannerImg: '/images/rice_hero.png',
    longDesc: "Punjab's fertile soil produces the world's finest Basmati rice. Our Super Kernel and 1121 Sella varieties are aged, refined, and sorted inside modern color sorters to ensure length and aroma matching export standards.",
    origin: 'Punjab, Pakistan',
    productionHub: 'Kamoke & Gujranwala',
    exportStandards: 'ISO 22000, HACCP, FDA Registered'
  },
  surgical: {
    label: 'Surgical Instruments',
    icon: 'Scissors',
    styleStyle: 'bg-blue-50 border-blue-100 text-blue-700',
    bannerImg: '/images/surgical_hero.png',
    longDesc: "Sialkot is the global hub for surgical instrument manufacturing, supplying over 95% of Pakistan's surgical exports. Our medical instruments are made of high-quality AISI 410/420 stainless steel, complying with CE, FDA, and ISO standards.",
    origin: 'Sialkot, Pakistan',
    productionHub: 'Sialkot Industrial Zone',
    exportStandards: 'ISO 13485, CE Mark, FDA Registered'
  },
  sports: {
    label: 'Sports Goods',
    icon: 'Trophy',
    styleStyle: 'bg-orange-50 border-orange-100 text-orange-700',
    bannerImg: '/images/sports_hero.png',
    longDesc: "From hand-stitched and thermo-bonded match footballs (which power major global tournaments) to professional English willow cricket bats and composite hockey sticks, we export world-class sports gear directly from Sialkot's expert manufacturers.",
    origin: 'Sialkot, Pakistan',
    productionHub: 'Sialkot Sports Hub',
    exportStandards: 'FIFA Quality Pro Standard & ISO 9001'
  }
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { formatProductPrice, getProductUnit, getProductMoq } = useMarketStore();

  const { data: categoryData } = useCategories();
  const { data: productData, isLoading } = useProducts({
    category: category,
    search: search || undefined,
    page,
    limit: 8,
  });

  const products = productData?.products || [];
  const pagination = productData?.pagination;

  const currentCategory = categoryData?.find((c: any) => c.slug === category);
  const details = categoryDetails[category] || {
    label: currentCategory?.name || category,
    icon: 'Package',
    styleStyle: 'bg-slate-50 border-slate-200 text-slate-700',
    bannerImg: '/images/fruits_hero.png',
    longDesc: 'Premium sourced products selected under Dewan Traders strict compliance auditing.',
    origin: 'Pakistan',
    productionHub: 'Sargodha / Sialkot Hubs',
    exportStandards: 'SGS Audited compliance'
  };

  const IconComp = iconMap[details.icon as keyof typeof iconMap] || Package;

  return (
    <div className="bg-[#fafbf9] min-h-screen pt-24 relative overflow-hidden pattern-dots-light">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-emerald-100/10 w-[550px] h-[550px] top-[15%] right-[-100px]" />
      </div>

      {/* ═══ CATEGORY BANNER SECTION ═══════════════════════════════ */}
      <section className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Info */}
          <div className="lg:col-span-7 space-y-6">
            <Link href="/catalog" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 hover:text-primary transition-colors tracking-widest">
              &larr; Back to Catalog Index
            </Link>
            
            <div className="space-y-4">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm ${details.styleStyle}`}>
                <IconComp size={12} /> {details.label}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-slate-900 leading-tight tracking-tight capitalize">
                {details.label} <span className="gradient-text-sky">Sourcing Hub</span>
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {details.longDesc}
              </p>
            </div>

            {/* Hub Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-200/60 p-4.5 rounded-3xl bg-white shadow-sm">
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Region Origin</span>
                <span className="text-xs font-bold text-slate-800">{details.origin}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Production Hub</span>
                <span className="text-xs font-bold text-slate-800">{details.productionHub}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Clearance Standard</span>
                <span className="text-xs font-bold text-slate-800">{details.exportStandards}</span>
              </div>
            </div>
          </div>

          {/* Banner Graphic */}
          <div className="lg:col-span-5 relative w-full">
            <div className="glass rounded-3xl p-3 border border-slate-200 bg-white shadow-md aspect-[4/3] overflow-hidden">
              <img src={resolveImageUrl(details.bannerImg)} alt={details.label} className="w-full h-full object-cover rounded-2xl shadow-inner" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES LISTING & SEARCH ═══════════════════════════ */}
      <section className="py-12 relative z-10 border-t border-slate-200/60 bg-white/55 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          {/* Category Search Input */}
          <div className="flex gap-3 mb-10 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={`Search inside ${details.label}...`}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-11 pr-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm font-medium"
              />
            </div>
          </div>

          {/* Dynamic Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass rounded-3xl overflow-hidden animate-pulse bg-white border border-slate-200/50 shadow-sm">
                  <div className="h-44 bg-slate-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-slate-100 rounded w-1/4" />
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200/50 rounded-3xl max-w-sm mx-auto shadow-sm space-y-2">
              <Package className="mx-auto text-slate-300" size={36} />
              <h4 className="text-xs font-black text-slate-900 uppercase">No commodities available</h4>
              <p className="text-slate-500 text-[10px] font-medium">No results found for current search keyword.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product: any, idx: number) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.03 }}
                  >
                    <Link href={`/catalog/${category}/${product.slug}`} className="group block">
                      <div className="glass rounded-3xl overflow-hidden card-hover border border-slate-200/60 bg-white shadow-sm flex flex-col h-full">
                        {/* Product Image */}
                        <div className="h-44 bg-slate-50 flex items-center justify-center border-b border-slate-100 relative overflow-hidden">
                          {product.imageUrl ? (
                            <img src={resolveImageUrl(product.imageUrl)} alt={product.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                          ) : (
                            <Package size={36} className="text-slate-400" />
                          )}
                          <div className="absolute top-3 left-3 bg-white/80 backdrop-blur px-2.5 py-1 rounded text-[9px] font-extrabold text-slate-600 border border-slate-200">
                            {product.origin || 'Pakistan'}
                          </div>
                        </div>

                        {/* Card Info */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] text-primary font-black uppercase tracking-widest">{details.label}</span>
                            <h3 className="text-xs font-black text-slate-800 group-hover:text-primary transition-colors truncate mt-1 uppercase tracking-wide">{product.name}</h3>
                            <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed font-medium">{product.description}</p>
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
                ))}
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
      </section>
    </div>
  );
}
