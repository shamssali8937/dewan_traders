'use client';

import { use, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, ArrowRight, MapPin, Leaf, Sprout, Scissors, Trophy, Package, Wheat, Sparkles, ShoppingCart } from 'lucide-react';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { formatPrice, resolveImageUrl } from '@/lib/utils';

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
    styleStyle: 'bg-orange-50/70 border-orange-100 text-orange-600',
    bannerImg: '/images/fruits_hero.png',
    longDesc: 'Sargodha is globally celebrated as the citrus capital. Our Kinnow Mandarins are handpicked, washed, waxed, and packed in modern processing plants. During summer, we export the world-famous sweet, fiberless Chaunsa Mangoes from Multan and Rahim Yar Khan orchards.',
    origin: 'Punjab, Pakistan',
    productionHub: 'Sargodha & Multan',
    exportStandards: 'Phytosanitary & GlobalGAP Certified'
  },
  vegetables: {
    label: 'Vegetables',
    icon: 'Sprout',
    styleStyle: 'bg-emerald-50/70 border-emerald-100 text-emerald-600',
    bannerImg: '/images/vegetables_hero.png',
    longDesc: 'We supply high-grade potatoes, onions, tomatoes, and garlic bulbs sorted by size and cured properly to withstand transit times. Sourced directly from modern agricultural zones of Punjab, we ensure full traceability and freshness.',
    origin: 'Punjab & Sindh, Pakistan',
    productionHub: 'Okara & Pakpattan',
    exportStandards: 'ISO 22000 & HACCP Compliant'
  },
  rice: {
    label: 'Premium Rice',
    icon: 'Wheat',
    styleStyle: 'bg-indigo-50/70 border-indigo-100 text-indigo-600',
    bannerImg: '/images/rice_hero.png',
    longDesc: 'Punjab\'s fertile soil produces the world\'s finest Basmati rice. Our Super Kernel and 1121 Sella varieties are aged, refined, and sorted inside modern color sorters to ensure length and aroma matching export standards.',
    origin: 'Punjab, Pakistan',
    productionHub: 'Kamoke & Gujranwala',
    exportStandards: 'ISO 22000, HACCP, FDA Registered'
  },
  surgical: {
    label: 'Surgical Items',
    icon: 'Scissors',
    styleStyle: 'bg-sky-50/70 border-sky-100 text-sky-600',
    bannerImg: '/images/surgical_hero.png',
    longDesc: 'Sialkot is the global hub for surgical instrument manufacturing, supplying over 95% of Pakistan\'s surgical exports. Our medical instruments are made of high-quality AISI 410/420 stainless steel, complying with CE, FDA, and ISO standards.',
    origin: 'Sialkot, Pakistan',
    productionHub: 'Sialkot Industrial Zone',
    exportStandards: 'ISO 13485, CE Mark, FDA Registered'
  },
  sports: {
    label: 'Sports Items',
    icon: 'Trophy',
    styleStyle: 'bg-rose-50/70 border-rose-100 text-rose-600',
    bannerImg: '/images/sports_hero.png',
    longDesc: 'From hand-stitched and thermo-bonded match footballs (which power major global tournaments) to professional English willow cricket bats and composite hockey sticks, we export world-class sports gear directly from Sialkot\'s expert manufacturers.',
    origin: 'Sialkot, Pakistan',
    productionHub: 'Sialkot Sports Hub',
    exportStandards: 'FIFA Quality Pro Standard & ISO 9001'
  }
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

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
    label: currentCategory?.name || 'Category',
    icon: 'Package',
    styleStyle: 'bg-slate-50/70 border-slate-200 text-slate-700',
    bannerImg: '/images/fruits_hero.png',
    longDesc: currentCategory?.description || 'Premium quality export items from Dewan Traders.',
    origin: 'Pakistan',
    productionHub: 'Regional Hubs',
    exportStandards: 'International Trade Standard'
  };

  const IconComponent = iconMap[details.icon] || Package;

  return (
    <div className="bg-white min-h-screen pt-24 relative overflow-hidden pattern-dots-light">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-50 w-[450px] h-[450px] top-[15%] right-[-100px]" />
      </div>

      {/* Category Hero Banner */}
      <section className="relative py-16 overflow-hidden border-b border-slate-100 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-3 gap-10 items-center">
          <div className="lg:col-span-2 space-y-4">
            <span className="text-primary text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 mb-2">
              <IconComponent size={14} /> Sourcing Category
            </span>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              {details.label}
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              {details.longDesc}
            </p>
            <div className="pt-2">
              <Link href="/catalog" className="text-xs text-primary hover:text-sky-600 transition-colors font-bold uppercase tracking-wider">
                &larr; Back to Full Catalog
              </Link>
            </div>
          </div>
          
          {/* Quick Specs Card */}
          <div className={`glass rounded-3xl p-6 border bg-white/80 shadow-md ${details.styleStyle}`}>
            <h3 className="text-slate-800 font-bold text-xs mb-4 tracking-wide border-b border-slate-200/50 pb-2 uppercase flex items-center gap-1.5">
              <Sparkles size={14} /> Category Details
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Export Origin</div>
                <div className="text-slate-700 font-bold mt-0.5">{details.origin}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Production Hubs</div>
                <div className="text-slate-700 font-bold mt-0.5">{details.productionHub}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Export Certifications</div>
                <div className="text-primary font-black mt-0.5">{details.exportStandards}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main List Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 relative z-10">
        <div className="flex flex-col md:flex-row gap-5 items-center justify-between mb-8 pb-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">
            Available Products <span className="text-xs font-semibold text-slate-400">({products.length})</span>
          </h2>
          <div className="w-full md:w-80 relative">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${details.label.toLowerCase()}...`}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-white/80 rounded-2xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200 shadow-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
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
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-400" size={16} />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase">No products found</h3>
            <p className="text-[10px] text-slate-400 mt-1">Try adjusting search or query parameters.</p>
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
                    <div className="glass rounded-2xl overflow-hidden card-hover border bg-white shadow-sm flex flex-col h-full">
                      {/* Product Image */}
                      <div className="h-40 bg-slate-50 flex items-center justify-center border-b border-slate-100 relative overflow-hidden">
                        {product.imageUrl ? (
                          <img src={resolveImageUrl(product.imageUrl)} alt={product.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                        ) : (
                          <IconComponent size={36} className="text-slate-200" />
                        )}
                      </div>

                      {/* Card Info */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[9px] text-primary font-bold uppercase tracking-wider">{details.label}</span>
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

                        <div className="space-y-3 mt-4">
                          <div className="flex items-center justify-between border-t border-slate-100 pt-3.5">
                            <div>
                              <span className="text-sm font-black text-slate-800">{formatPrice(product.price)}</span>
                              <span className="text-[10px] text-slate-500 font-normal">/{product.unit}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">MOQ: {product.minOrderQty}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`flex-1 text-center py-1.5 rounded-lg text-[9px] font-bold border ${
                              product.stock > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-400 border-red-100'
                            }`}>
                              {product.stock > 0 ? 'In-Stock' : 'Replenishing'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  {/* Sourcing and Direct Order Actions */}
                  <div className="flex gap-2 mt-2">
                    <Link href={`/catalog/${category}/${product.slug}?tab=quote#inquiry`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-[9px] uppercase tracking-wider transition-all">
                      RFQ Quote
                    </Link>
                    <Link href={`/catalog/${category}/${product.slug}?tab=order#inquiry`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-[9px] uppercase tracking-wider shadow-sm shadow-primary/10 transition-all">
                      Buy/Order
                    </Link>
                  </div>
                </motion.div>
              ))}
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
      </section>

    </div>
  );
}
