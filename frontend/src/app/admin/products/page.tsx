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
      case 'fruits': return <Leaf size={14} className="text-orange-600" />;
      case 'vegetables': return <Sprout size={14} className="text-teal-600" />;
      case 'rice': return <Wheat size={14} className="text-indigo-600" />;
      case 'surgical': return <Scissors size={14} className="text-sky-600" />;
      case 'sports': return <Trophy size={14} className="text-rose-600" />;
      default: return <Package size={14} className="text-slate-600" />;
    }
  };

  const getCategoryBg = (type: string) => {
    switch (type) {
      case 'fruits': return 'bg-orange-50 border-orange-100';
      case 'vegetables': return 'bg-emerald-50 border-emerald-100';
      case 'rice': return 'bg-indigo-50 border-indigo-100';
      case 'surgical': return 'bg-sky-50 border-sky-100';
      case 'sports': return 'bg-rose-50 border-rose-100';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Products</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-semibold">{pagination?.total || 0} cargo items index</p>
        </div>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10">
          <Plus size={14} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
          <input type="text" placeholder="Search product name or SKU..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200 shadow-sm" />
        </div>
        
        <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
          className="px-4 py-2.5 bg-white rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200 shadow-sm">
          <option value="">All Categories</option>
          {categories.map((c: any) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <div className="glass rounded-3xl border border-slate-100 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-slate-600 font-bold uppercase tracking-wider px-5 py-3.5">Product</th>
                <th className="text-slate-600 font-bold uppercase tracking-wider px-5 py-3.5">Category</th>
                <th className="text-slate-600 font-bold uppercase tracking-wider px-5 py-3.5">Export Price</th>
                <th className="text-slate-600 font-bold uppercase tracking-wider px-5 py-3.5">Available Stock</th>
                <th className="text-slate-600 font-bold uppercase tracking-wider px-5 py-3.5">Status</th>
                <th className="text-right text-slate-600 font-bold uppercase tracking-wider px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
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
                    <Package className="mx-auto text-slate-500" size={32} />
                    <p className="text-slate-600 font-bold uppercase">No products registered</p>
                    <Link href="/admin/products/new" className="text-primary hover:underline font-bold text-xs uppercase tracking-wide block">
                      Create First Cargo Item
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg border overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center relative">
                          {product.imageUrl ? (
                            <img src={resolveImageUrl(product.imageUrl)} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-slate-400">
                              <Package size={14} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-slate-800">{product.name}</p>
                            {product.isFeatured && <Star size={11} className="text-amber-400 fill-amber-400" />}
                          </div>
                          <p className="text-[10px] text-slate-600 mt-0.5 font-mono">SKU: {product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 uppercase font-bold text-[10px]">{product.category?.name}</td>
                    <td className="px-5 py-4 text-slate-800 font-black">{formatPrice(product.price)}<span className="text-slate-600 font-normal text-[10px]">/{product.unit}</span></td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                        {product.stock} {product.unit}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${product.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {product.isActive ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.id}/edit`}
                          className="p-1.5 rounded-lg hover:bg-sky-50 border border-transparent hover:border-sky-100 text-slate-600 hover:text-primary transition-all">
                          <Edit2 size={13} />
                        </Link>
                        <button onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100 text-slate-600 hover:text-red-500 transition-all">
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
          <div className="flex justify-center gap-2 p-4 border-t border-slate-100 bg-slate-50/20">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                  page === p
                    ? 'bg-gradient-to-r from-primary to-sky-600 text-white shadow-sm'
                    : 'glass text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
