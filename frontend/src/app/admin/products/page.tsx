'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Package, Star, Leaf, Sprout, Wheat, Scissors, Trophy } from 'lucide-react';
import { useProducts, useCategories, useDeleteProduct } from '@/hooks/useProducts';
import { formatPrice, resolveImageUrl } from '@/lib/utils';
import Link from 'next/link';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { data: catData } = useCategories();
  const { data, isLoading } = useProducts({ search: search || undefined, category: selectedCategory || undefined, page, limit: 15, isActive: undefined });
  const { mutate: deleteProduct } = useDeleteProduct();

  const products = data?.products || [];
  const pagination = data?.pagination;
  const categories = catData || [];

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteProduct(id);
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'fruits': return <Leaf size={14} className="text-emerald-600" />;
      case 'vegetables': return <Sprout size={14} className="text-teal-600" />;
      case 'rice': return <Wheat size={14} className="text-primary" />;
      case 'surgical': return <Scissors size={14} className="text-secondary" />;
      case 'sports': return <Trophy size={14} className="text-accent" />;
      default: return <Package size={14} className="text-slate-600" />;
    }
  };

  const getCategoryBg = (type: string) => {
    switch (type) {
      case 'fruits': return 'bg-emerald-50 border-emerald-100';
      case 'vegetables': return 'bg-teal-50 border-teal-100';
      case 'rice': return 'bg-sky-50 border-sky-100';
      case 'surgical': return 'bg-sky-50 border-sky-100';
      case 'sports': return 'bg-rose-50 border-rose-100';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 uppercase tracking-wide">Products Registry</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-semibold">{pagination?.total || 0} cargo items index</p>
        </div>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10 transition-all">
          <Plus size={14} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search product name or SKU..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 shadow-sm font-semibold" />
        </div>
        
        <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
          className="px-4 py-3 bg-white rounded-xl text-xs text-slate-700 font-extrabold focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 shadow-sm cursor-pointer">
          <option value="">All Categories</option>
          {categories.map((c: any) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <div className="glass rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-slate-500 font-black uppercase tracking-wider px-5 py-4">Product</th>
                <th className="text-slate-500 font-black uppercase tracking-wider px-5 py-4">Category</th>
                <th className="text-slate-500 font-black uppercase tracking-wider px-5 py-4">Export Price</th>
                <th className="text-slate-500 font-black uppercase tracking-wider px-5 py-4">Available Stock</th>
                <th className="text-slate-500 font-black uppercase tracking-wider px-5 py-4">Status</th>
                <th className="text-right text-slate-500 font-black uppercase tracking-wider px-5 py-4">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-slate-100 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center space-y-2">
                    <Package className="mx-auto text-slate-400" size={32} />
                    <p className="text-slate-600 font-black uppercase tracking-wider text-xs">No products registered</p>
                    <Link href="/admin/products/new" className="text-primary hover:underline font-extrabold text-xs uppercase tracking-wide block pt-2">
                      Create First Cargo Item
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl border border-slate-205 overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center relative">
                          {product.imageUrl ? (
                            <img src={resolveImageUrl(product.imageUrl)} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-slate-450">
                              <Package size={15} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-extrabold text-slate-850 uppercase tracking-wide">{product.name}</p>
                            {product.isFeatured && <Star size={11} className="text-amber-400 fill-amber-400" />}
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 font-mono">SKU: {product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 uppercase font-black text-[9px] tracking-wider">{product.category?.name}</td>
                    <td className="px-5 py-4 text-slate-900 font-black">{formatPrice(product.price)}<span className="text-slate-500 font-normal text-[9px]">/{product.unit}</span></td>
                    <td className="px-5 py-4">
                      <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black border uppercase shadow-sm ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-650 border-red-100'}`}>
                        {product.stock} {product.unit}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black border uppercase shadow-sm ${product.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {product.isActive ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.id}/edit`}
                          className="p-2 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-100 text-slate-500 hover:text-primary transition-all">
                          <Edit2 size={13} />
                        </Link>
                        <button onClick={() => handleDelete(product.id, product.name)}
                          className="p-2 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100 text-slate-500 hover:text-red-500 transition-all">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-slate-200 bg-slate-50/20">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all border ${
                  page === p
                    ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-sm'
                    : 'bg-white border-slate-200 text-slate-655 hover:bg-slate-50'
                }`}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
