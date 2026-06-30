'use client';

import { use, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProduct, useUpdateProduct, useCategories } from '@/hooks/useProducts';
import { useRouter } from 'next/navigation';
import { Send, ArrowLeft, Package, Sparkles } from 'lucide-react';
import Link from 'next/link';

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  sku: z.string().min(2, 'SKU is required'),
  price: z.string().min(1, 'Price is required'),
  minOrderQty: z.number().min(1, 'Minimum order quantity must be at least 1'),
  unit: z.string().min(1, 'Unit (e.g., kg, piece) is required'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  categoryId: z.string().min(1, 'Please select a category'),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  description: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: product, isLoading: isProductLoading } = useProduct(id);
  const { data: categories } = useCategories();
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        sku: product.sku,
        price: product.price.toString(),
        minOrderQty: product.minOrderQty,
        unit: product.unit,
        stock: product.stock,
        categoryId: product.categoryId,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        description: product.description || '',
      });
    }
  }, [product, reset]);

  const onSubmit = (data: ProductFormData) => {
    updateProduct({
      id,
      data: {
        ...data,
        price: parseFloat(data.price),
      }
    }, {
      onSuccess: () => router.push('/admin/products')
    });
  };

  if (isProductLoading) {
    return (
      <div className="pt-20 space-y-6 max-w-3xl animate-pulse">
        <div className="h-6 bg-slate-100 rounded w-1/3" />
        <div className="h-96 bg-slate-50 border border-slate-100 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors border border-transparent hover:border-slate-200">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Edit Product</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-semibold">Modify properties for "{product?.name}"</p>
        </div>
      </div>

      <div className="glass rounded-3xl p-6 md:p-8 border border-slate-100 bg-white shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Product Name *</label>
              <input {...register('name')} placeholder="e.g. Sargodha Kinnow Mandarin" className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
              {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Product SKU *</label>
              <input {...register('sku')} placeholder="e.g. DT-FR-001" className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
              {errors.sku && <p className="text-[10px] text-red-500 mt-1">{errors.sku.message}</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Export Price (USD) *</label>
              <input {...register('price')} placeholder="e.g. 80.00" className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
              {errors.price && <p className="text-[10px] text-red-500 mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Export Unit *</label>
              <input {...register('unit')} placeholder="e.g. kg, piece, set" className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
              {errors.unit && <p className="text-[10px] text-red-500 mt-1">{errors.unit.message}</p>}
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Product Category *</label>
              <select {...register('categoryId')} className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200">
                <option value="">Select Category...</option>
                {categories?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-[10px] text-red-500 mt-1">{errors.categoryId.message}</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Stock Capacity *</label>
              <input {...register('stock', { valueAsNumber: true })} type="number" className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
              {errors.stock && <p className="text-[10px] text-red-500 mt-1">{errors.stock.message}</p>}
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Minimum Order Qty (MOQ) *</label>
              <input {...register('minOrderQty', { valueAsNumber: true })} type="number" className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
              {errors.minOrderQty && <p className="text-[10px] text-red-500 mt-1">{errors.minOrderQty.message}</p>}
            </div>
          </div>

          <div className="flex gap-6 border-t border-slate-100 pt-6">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input type="checkbox" {...register('isActive')} className="rounded border-slate-300 text-primary focus:ring-primary/40 w-4 h-4" />
              Publish Immediately (Active)
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input type="checkbox" {...register('isFeatured')} className="rounded border-slate-300 text-primary focus:ring-primary/40 w-4 h-4" />
              Mark as Featured Product
            </label>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Product Description</label>
            <textarea {...register('description')} rows={4} placeholder="Detailed product summary, origin characteristics, and freight options..." className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200 resize-none" />
          </div>

          <button type="submit" disabled={isPending} className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10 transition-all disabled:opacity-60">
            {isPending ? 'Updating...' : <><Send size={12} /> Save Product Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
}
