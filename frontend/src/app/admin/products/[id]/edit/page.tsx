'use client';

import { use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProduct, useUpdateProduct, useCategories } from '@/hooks/useProducts';
import { useProductPricing, useUpsertProductPricing } from '@/hooks/usePricing';
import { useRouter } from 'next/navigation';
import { Send, ArrowLeft, Package, Sparkles, DollarSign, Globe, MapPin, ExternalLink, ShieldCheck, Box, Container } from 'lucide-react';
import Link from 'next/link';
import { resolveImageUrl } from '@/lib/utils';
import { productApi } from '@/services/endpoints';
import { toast } from 'sonner';
import { Image as ImageIcon, Loader } from 'lucide-react';

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
  origin: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: product, isLoading: isProductLoading } = useProduct(id);
  const { data: dbPricing, isLoading: isPricingLoading } = useProductPricing(id);
  const { data: categories } = useCategories();
  const { mutate: updateProduct, isPending: isUpdatingProduct } = useUpdateProduct();
  const { mutate: upsertPricing, isPending: isSavingPricing } = useUpsertProductPricing();

  const [activeTab, setActiveTab] = useState<'details' | 'pricing'>('details');

  const [imagesList, setImagesList] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // ── Domestic Pricing State ──
  const [pkPrice, setPkPrice] = useState<string>('150');
  const [pkUnit, setPkUnit] = useState<string>('kg');
  const [pkUnitLabel, setPkUnitLabel] = useState<string>('per kg');
  const [pkMoq, setPkMoq] = useState<number>(1);

  // ── International Export Pricing State ──
  const [intPrice, setIntPrice] = useState<string>('0.85');
  const [intUnit, setIntUnit] = useState<string>('kg');
  const [intUnitLabel, setIntUnitLabel] = useState<string>('per kg');
  const [intMoq, setIntMoq] = useState<number>(100);

  // ── Container Metadata State ──
  const [cartonSize, setCartonSize] = useState<string>('10');
  const [cartonPriceUsd, setCartonPriceUsd] = useState<string>('8.50');
  const [containerEst20ft, setContainerEst20ft] = useState<string>('');
  const [containerEst40ft, setContainerEst40ft] = useState<string>('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  // Load product data
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
        origin: product.origin || 'Pakistan',
      });

      if (product.images && product.images.length > 0) {
        setImagesList(product.images);
      } else if (product.imageUrl) {
        setImagesList([product.imageUrl]);
      } else {
        setImagesList([]);
      }
    }
  }, [product, reset]);

  // Load pricing DB data or fallback defaults
  useEffect(() => {
    if (dbPricing) {
      setPkPrice(String(dbPricing.pkPrice));
      setPkUnit(dbPricing.pkUnit || 'kg');
      setPkUnitLabel(dbPricing.pkUnitLabel || 'per kg');
      setPkMoq(dbPricing.pkMoq ?? 1);

      setIntPrice(String(dbPricing.intPrice));
      setIntUnit(dbPricing.intUnit || 'kg');
      setIntUnitLabel(dbPricing.intUnitLabel || 'per kg');
      setIntMoq(dbPricing.intMoq ?? 100);

      setCartonSize(dbPricing.cartonSize ? String(dbPricing.cartonSize) : '10');
      setCartonPriceUsd(dbPricing.cartonPriceUsd ? String(dbPricing.cartonPriceUsd) : '8.50');
      setContainerEst20ft(dbPricing.containerEst20ft || '');
      setContainerEst40ft(dbPricing.containerEst40ft || '');
    } else if (product) {
      // Fallback defaults from product
      setIntPrice(String(product.price));
      setIntUnit(product.unit || 'kg');
      setIntMoq(product.minOrderQty || 100);
    }
  }, [dbPricing, product]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('image', files[i]);
        const res = await productApi.uploadImage(formData);
        uploadedUrls.push(res.data.data.imageUrl);
      }
      setImagesList(prev => [...prev, ...uploadedUrls]);
      toast.success('Images uploaded successfully!');
    } catch {
      toast.error('Failed to upload some images.');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: ProductFormData) => {
    // 1. Submit Core Product
    updateProduct(
      {
        id,
        data: {
          ...data,
          price: parseFloat(data.price),
          imageUrl: imagesList[0] || undefined,
          images: imagesList,
        },
      },
      {
        onSuccess: () => {
          // 2. Submit Product Pricing (Domestic + International)
          upsertPricing(
            {
              productId: id,
              data: {
                pkPrice: parseFloat(pkPrice) || 0,
                pkUnit: pkUnit || 'kg',
                pkUnitLabel: pkUnitLabel || `per ${pkUnit}`,
                pkMoq: Number(pkMoq) || 1,

                intPrice: parseFloat(intPrice) || parseFloat(data.price),
                intUnit: intUnit || data.unit,
                intUnitLabel: intUnitLabel || `per ${intUnit}`,
                intMoq: Number(intMoq) || data.minOrderQty,

                cartonSize: cartonSize ? parseInt(cartonSize) : null,
                cartonPriceUsd: cartonPriceUsd ? parseFloat(cartonPriceUsd) : null,
                containerEst20ft: containerEst20ft || null,
                containerEst40ft: containerEst40ft || null,
              },
            },
            {
              onSuccess: () => {
                toast.success('Product details and dual-region pricing updated!');
                router.push('/admin/products');
              },
            }
          );
        },
      }
    );
  };

  const isPending = isUpdatingProduct || isSavingPricing;

  if (isProductLoading || isPricingLoading) {
    return (
      <div className="pt-20 space-y-6 max-w-4xl animate-pulse">
        <div className="h-6 bg-slate-100 rounded w-1/3" />
        <div className="h-96 bg-slate-50 border border-slate-100 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors border border-transparent hover:border-slate-200">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800 uppercase tracking-wide">Edit Product & Pricing</h1>
            <p className="text-slate-500 text-xs mt-0.5 font-semibold">Modify core details, PKR domestic & USD international pricing for "{product?.name}"</p>
          </div>
        </div>

        <Link
          href={`/admin/products/${id}/pricing`}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold rounded-xl text-xs uppercase tracking-wider border border-blue-200 transition-all self-start sm:self-auto"
        >
          <DollarSign size={14} /> Full Pricing Matrix <ExternalLink size={12} />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 px-5 py-3 font-extrabold text-xs uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'details'
              ? 'border-primary text-primary bg-primary/5 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-xl'
          }`}
        >
          <Package size={15} /> 1. Product Specification & Media
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pricing')}
          className={`flex items-center gap-2 px-5 py-3 font-extrabold text-xs uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'pricing'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/60 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-xl'
          }`}
        >
          <Globe size={15} /> 2. Domestic & International Pricing Units
        </button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* TAB 1: PRODUCT SPECIFICATION */}
        {activeTab === 'details' && (
          <div className="glass rounded-3xl p-6 md:p-8 border border-slate-200 bg-white shadow-sm space-y-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-extrabold mb-1.5 block">Product Name *</label>
                <input {...register('name')} placeholder="e.g. Sargodha Kinnow Mandarin" className="w-full px-3.5 py-2.5 bg-white rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 shadow-sm" />
                {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase font-extrabold mb-1.5 block">Product SKU *</label>
                <input {...register('sku')} placeholder="e.g. DT-FR-001" className="w-full px-3.5 py-2.5 bg-white rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 shadow-sm" />
                {errors.sku && <p className="text-[10px] text-red-500 mt-1">{errors.sku.message}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-extrabold mb-1.5 block">Default Base Price (USD) *</label>
                <input {...register('price')} placeholder="e.g. 0.85" className="w-full px-3.5 py-2.5 bg-white rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 shadow-sm" />
                {errors.price && <p className="text-[10px] text-red-500 mt-1">{errors.price.message}</p>}
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase font-extrabold mb-1.5 block">Default Unit *</label>
                <input {...register('unit')} placeholder="e.g. kg, piece, carton" className="w-full px-3.5 py-2.5 bg-white rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 shadow-sm" />
                {errors.unit && <p className="text-[10px] text-red-500 mt-1">{errors.unit.message}</p>}
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase font-extrabold mb-1.5 block">Product Category *</label>
                <select {...register('categoryId')} className="w-full px-3.5 py-2.5 bg-white rounded-xl text-xs text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 shadow-sm">
                  <option value="">Select Category...</option>
                  {categories?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-[10px] text-red-500 mt-1">{errors.categoryId.message}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-extrabold mb-1.5 block">Available Stock Capacity *</label>
                <input {...register('stock', { valueAsNumber: true })} type="number" className="w-full px-3.5 py-2.5 bg-white rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 shadow-sm" />
                {errors.stock && <p className="text-[10px] text-red-500 mt-1">{errors.stock.message}</p>}
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase font-extrabold mb-1.5 block">Minimum Order Quantity (MOQ) *</label>
                <input {...register('minOrderQty', { valueAsNumber: true })} type="number" className="w-full px-3.5 py-2.5 bg-white rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 shadow-sm" />
                {errors.minOrderQty && <p className="text-[10px] text-red-500 mt-1">{errors.minOrderQty.message}</p>}
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase font-extrabold mb-1.5 block">Origin Location</label>
                <input {...register('origin')} placeholder="e.g. Sargodha, Pakistan" className="w-full px-3.5 py-2.5 bg-white rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 shadow-sm" />
                {errors.origin && <p className="text-[10px] text-red-500 mt-1">{errors.origin.message}</p>}
              </div>
            </div>

            <div className="flex gap-6 border-t border-slate-100 pt-5">
              <label className="flex items-center gap-2 text-xs font-extrabold text-slate-700 cursor-pointer">
                <input type="checkbox" {...register('isActive')} className="rounded border-slate-300 text-primary focus:ring-primary/40 w-4 h-4" />
                Publish Immediately (Active)
              </label>

              <label className="flex items-center gap-2 text-xs font-extrabold text-slate-700 cursor-pointer">
                <input type="checkbox" {...register('isFeatured')} className="rounded border-slate-300 text-primary focus:ring-primary/40 w-4 h-4" />
                Mark as Featured Product
              </label>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase font-extrabold mb-1.5 block">Product Media Files</label>
              <div className="flex flex-wrap gap-3 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                  id="edit-product-image-file"
                  multiple
                />
                <label
                  htmlFor="edit-product-image-file"
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-all disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader size={13} className="animate-spin text-primary" /> Uploading...
                    </>
                  ) : (
                    <>
                      <ImageIcon size={13} /> Upload Images
                    </>
                  )}
                </label>

                {imagesList.map((url, idx) => (
                  <div key={idx} className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 relative shrink-0 group">
                    <img
                      src={resolveImageUrl(url)}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagesList(prev => prev.filter((_, i) => i !== idx));
                      }}
                      className="absolute inset-0 bg-red-650/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold"
                    >
                      Remove
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-primary/95 text-white text-[8px] font-black uppercase text-center py-0.5 tracking-wider">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase font-extrabold mb-1.5 block">Product Description</label>
              <textarea {...register('description')} rows={4} placeholder="Detailed product summary, specifications, grading standards, and freight options..." className="w-full px-3.5 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 resize-none font-medium" />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('pricing')}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                Next: Pricing & Units &rarr;
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: DOMESTIC & INTERNATIONAL PRICING UNITS */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            {/* Banner */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-5 rounded-3xl text-white shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <Globe className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h2 className="font-extrabold text-sm uppercase tracking-wide text-white">Dual-Region Pricing Control</h2>
                  <p className="text-emerald-200 text-xs mt-0.5">Define distinct pricing, sales units (kg, maund, carton, ton) and MOQs for Pakistan vs International buyers.</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* DOMESTIC (PAKISTAN) PANEL */}
              <div className="glass rounded-3xl p-6 border border-emerald-200 bg-emerald-50/30 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-100">
                  <MapPin className="text-emerald-700" size={16} />
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-emerald-950">Domestic (Pakistan / PKR)</h3>
                </div>

                <div>
                  <label className="text-[10px] text-slate-600 uppercase font-extrabold mb-1 block">Price in PKR (Rs.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={pkPrice}
                    onChange={(e) => setPkPrice(e.target.value)}
                    placeholder="e.g. 150"
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl text-xs font-bold text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-600 uppercase font-extrabold mb-1 block">Unit Code *</label>
                    <select
                      value={pkUnit}
                      onChange={(e) => {
                        setPkUnit(e.target.value);
                        setPkUnitLabel(`per ${e.target.value}`);
                      }}
                      className="w-full px-3 py-2.5 bg-white rounded-xl text-xs font-extrabold text-slate-800 border border-slate-200 focus:outline-none"
                    >
                      <option value="kg">kg (Kilogram)</option>
                      <option value="maund">maund (40 kg)</option>
                      <option value="crate">crate (10 kg)</option>
                      <option value="box">box (5 kg)</option>
                      <option value="carton">carton (10 kg)</option>
                      <option value="piece">piece</option>
                      <option value="bag">bag (50 kg)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-600 uppercase font-extrabold mb-1 block">Display Label *</label>
                    <input
                      type="text"
                      value={pkUnitLabel}
                      onChange={(e) => setPkUnitLabel(e.target.value)}
                      placeholder="e.g. per kg"
                      className="w-full px-3 py-2.5 bg-white rounded-xl text-xs font-semibold text-slate-800 border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-600 uppercase font-extrabold mb-1 block">Domestic Minimum Order Qty (MOQ)</label>
                  <input
                    type="number"
                    value={pkMoq}
                    onChange={(e) => setPkMoq(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl text-xs font-bold text-slate-800 border border-slate-200"
                  />
                </div>
              </div>

              {/* INTERNATIONAL (EXPORT) PANEL */}
              <div className="glass rounded-3xl p-6 border border-blue-200 bg-blue-50/30 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-blue-100">
                  <Globe className="text-blue-700" size={16} />
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-blue-950">International Export (USD $)</h3>
                </div>

                <div>
                  <label className="text-[10px] text-slate-600 uppercase font-extrabold mb-1 block">Export Price in USD ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={intPrice}
                    onChange={(e) => {
                      setIntPrice(e.target.value);
                      setValue('price', e.target.value);
                    }}
                    placeholder="e.g. 0.85"
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl text-xs font-bold text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-600 uppercase font-extrabold mb-1 block">Export Unit Code *</label>
                    <select
                      value={intUnit}
                      onChange={(e) => {
                        setIntUnit(e.target.value);
                        setIntUnitLabel(`per ${e.target.value}`);
                        setValue('unit', e.target.value);
                      }}
                      className="w-full px-3 py-2.5 bg-white rounded-xl text-xs font-extrabold text-slate-800 border border-slate-200 focus:outline-none"
                    >
                      <option value="kg">kg (Kilogram)</option>
                      <option value="metric ton">metric ton (1000 kg)</option>
                      <option value="carton">carton (10 kg)</option>
                      <option value="carton (14kg)">carton (14 kg)</option>
                      <option value="20ft container">20ft container</option>
                      <option value="40ft container">40ft container</option>
                      <option value="piece">piece</option>
                      <option value="set">set</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-600 uppercase font-extrabold mb-1 block">Display Label *</label>
                    <input
                      type="text"
                      value={intUnitLabel}
                      onChange={(e) => setIntUnitLabel(e.target.value)}
                      placeholder="e.g. per kg"
                      className="w-full px-3 py-2.5 bg-white rounded-xl text-xs font-semibold text-slate-800 border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-600 uppercase font-extrabold mb-1 block">Export Minimum Order Qty (MOQ)</label>
                  <input
                    type="number"
                    value={intMoq}
                    onChange={(e) => {
                      setIntMoq(Number(e.target.value));
                      setValue('minOrderQty', Number(e.target.value));
                    }}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl text-xs font-bold text-slate-800 border border-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* CONTAINER & PACKAGING METADATA */}
            <div className="glass rounded-3xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Box className="text-slate-700" size={16} />
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">Export Packaging & Container Specs</h3>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Carton Size (kg)</label>
                  <input
                    type="number"
                    value={cartonSize}
                    onChange={(e) => setCartonSize(e.target.value)}
                    placeholder="e.g. 10"
                    className="w-full px-3 py-2 bg-white rounded-xl text-xs font-bold text-slate-800 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Carton Price (USD $)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={cartonPriceUsd}
                    onChange={(e) => setCartonPriceUsd(e.target.value)}
                    placeholder="e.g. 8.50"
                    className="w-full px-3 py-2 bg-white rounded-xl text-xs font-bold text-slate-800 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">20ft Reefer Load Est.</label>
                  <input
                    type="text"
                    value={containerEst20ft}
                    onChange={(e) => setContainerEst20ft(e.target.value)}
                    placeholder="e.g. 2,400 cartons (~24 MT)"
                    className="w-full px-3 py-2 bg-white rounded-xl text-xs font-semibold text-slate-800 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">40ft Reefer Load Est.</label>
                  <input
                    type="text"
                    value={containerEst40ft}
                    onChange={(e) => setContainerEst40ft(e.target.value)}
                    placeholder="e.g. 4,800 cartons (~48 MT)"
                    className="w-full px-3 py-2 bg-white rounded-xl text-xs font-semibold text-slate-800 border border-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary via-teal-600 to-emerald-700 hover:from-primary-hover hover:to-emerald-800 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-primary/10 transition-all disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader size={15} className="animate-spin" /> Saving Changes & Dual Pricing...
              </>
            ) : (
              <>
                <ShieldCheck size={16} /> Save Product Details & Regional Pricing
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
