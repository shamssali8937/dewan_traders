'use client';

import { use, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useCreateInquiry } from '@/hooks/useInquiries';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatPrice } from '@/lib/utils';
import { Send, CheckCircle, ShieldCheck, Award, FileText, ChevronRight, Package, MapPin, Sparkles } from 'lucide-react';

const inquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Please write a detailed message'),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

export default function ProductDetailPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = use(params);
  const { data: product, isLoading, error } = useProduct(slug);
  const { data: relatedData } = useProducts({ category, limit: 4 });
  const { mutate: sendInquiry, isPending, isSuccess } = useCreateInquiry();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      subject: `Quotation inquiry: ${product?.name || slug}`,
      message: '',
    }
  });

  const onSubmit = (data: InquiryFormData) => {
    sendInquiry({
      ...data,
      productName: product?.name,
    }, {
      onSuccess: () => reset()
    });
  };

  const relatedProducts = relatedData?.products?.filter((p: any) => p.slug !== slug).slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="pt-32 min-h-screen max-w-7xl mx-auto px-6 lg:px-8 space-y-10 animate-pulse bg-white">
        <div className="h-4 bg-slate-100 rounded w-1/4" />
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="h-96 bg-slate-50 rounded-2xl border border-slate-100" />
          <div className="space-y-6">
            <div className="h-10 bg-slate-100 rounded w-3/4" />
            <div className="h-6 bg-slate-100 rounded w-1/2" />
            <div className="h-24 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-32 min-h-screen text-center max-w-lg mx-auto px-6 bg-white">
        <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
          <Package size={24} />
        </div>
        <h2 className="text-sm font-bold text-slate-800 uppercase">Product Not Found</h2>
        <p className="text-slate-500 text-xs mt-1 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link href="/catalog" className="px-6 py-3 bg-gradient-to-r from-primary to-sky-600 text-white font-bold rounded-xl inline-block text-xs uppercase tracking-wider shadow-sm">
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-28 pb-20 relative overflow-hidden pattern-dots-light">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-50 w-[400px] h-[400px] top-[15%] right-[-100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-8 border-b border-slate-100 pb-4">
          <Link href="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
          <ChevronRight size={12} className="text-slate-300" />
          <Link href={`/catalog/${category}`} className="hover:text-primary transition-colors capitalize">{category}</Link>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-slate-700">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          
          {/* Left Column: Product Image & Cert Badge */}
          <div className="lg:col-span-2">
            <div className="glass rounded-3xl overflow-hidden aspect-square flex items-center justify-center relative border border-slate-100 group shadow-sm bg-white">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
              ) : (
                <div className="text-slate-300 flex flex-col items-center gap-3">
                  <Package size={60} />
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">No Image</span>
                </div>
              )}
            </div>
            
            {/* Certifications Badge Box */}
            <div className="glass rounded-2xl p-4.5 mt-6 border border-slate-100 flex items-center gap-4 bg-white/70 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-100 text-primary flex items-center justify-center shrink-0">
                <Award size={18} />
              </div>
              <div>
                <h4 className="text-slate-800 text-[10px] font-bold tracking-wider uppercase">Dewan Quality Certified</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Fully compliant with international import-export clearance audits.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Spec Sheet & Inquiry Form */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <span className="text-primary text-[10px] font-bold uppercase tracking-widest">{product.category?.name}</span>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mt-2 mb-4 leading-tight">{product.name}</h1>
              {product.origin && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-semibold">
                  <MapPin size={11} className="text-primary" /> Origin: {product.origin}
                </div>
              )}
            </div>

            {/* Pricing Dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-b border-slate-100 py-5">
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Export Price Range</span>
                <div className="text-xl font-black text-slate-800 mt-1">{formatPrice(product.price)}<span className="text-[10px] text-slate-400 font-normal">/{product.unit}</span></div>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Minimum Order (MOQ)</span>
                <div className="text-xl font-black text-primary mt-1">{product.minOrderQty} <span className="text-[10px] text-slate-400 font-normal uppercase">{product.unit}</span></div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Supply Capacity</span>
                <div className="text-xs font-bold text-slate-700 mt-2">
                  <span className={`px-2.5 py-1 rounded-full ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                    {product.stock > 0 ? `${product.stock} ${product.unit} In-Stock` : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-slate-400 font-bold text-[10px] tracking-widest uppercase">Description</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{product.description || 'Premium quality export item sourced directly from certified orchards or manufacturing zones in Pakistan.'}</p>
            </div>

            {/* Specs Table */}
            <div className="space-y-3">
              <h3 className="text-slate-400 font-bold text-[10px] tracking-widest uppercase">Technical Specifications</h3>
              <div className="glass rounded-2xl overflow-hidden border border-slate-100 bg-white/70 shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-50">
                      <td className="p-3 text-slate-400 uppercase font-bold tracking-wider w-1/3">Stock keeping unit (SKU)</td>
                      <td className="p-3 text-slate-700 font-mono font-semibold">{product.sku}</td>
                    </tr>
                    <tr className="border-b border-slate-50">
                      <td className="p-3 text-slate-400 uppercase font-bold tracking-wider">Product Category</td>
                      <td className="p-3 text-slate-700 capitalize font-semibold">{product.category?.name}</td>
                    </tr>
                    <tr className="border-b border-slate-50">
                      <td className="p-3 text-slate-400 uppercase font-bold tracking-wider">Export Packing</td>
                      <td className="p-3 text-slate-700 font-medium">Export-grade corrugated boxes / crates</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-400 uppercase font-bold tracking-wider">Loading Port</td>
                      <td className="p-3 text-slate-700 font-medium">Karachi Port (FOB / CIF supported)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quotation inquiry form */}
            <div className="glass rounded-3xl p-6 border border-slate-100 bg-white/80 shadow-md relative">
              <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5"><FileText size={14} className="text-primary" /> Request a Bulk Quotation</h3>
              <p className="text-[11px] text-slate-500 mb-6">Interested in importing this product? Submit a quote request directly to our export clearing registry.</p>
              
              {isSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-500 rounded-xl flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle size={24} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase">RFQ Logged</h4>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Thank you. Sajjad Hussain Awan and our freight officers will verify the packaging/transit fees and email a quote within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] text-slate-500 uppercase font-semibold mb-1 block">Your Name *</label>
                      <input {...register('name')} placeholder="Ahmed Al-Rashidi" className="w-full px-3 py-2 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                      {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-500 uppercase font-semibold mb-1 block">Your Email *</label>
                      <input {...register('email')} type="email" placeholder="ahmed@gulfproduce.com" className="w-full px-3 py-2 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                      {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] text-slate-500 uppercase font-semibold mb-1 block">Phone / WhatsApp</label>
                      <input {...register('phone')} placeholder="+971 50 123 4567" className="w-full px-3 py-2 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-500 uppercase font-semibold mb-1 block">Company Name</label>
                      <input {...register('company')} placeholder="Gulf Produce Distributors" className="w-full px-3 py-2 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase font-semibold mb-1 block">Message Details *</label>
                    <textarea {...register('message')} rows={4} placeholder="Please detail your target quantity, packaging preferences, and destination port." className="w-full px-3 py-2 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200 resize-none" />
                    {errors.message && <p className="text-[10px] text-red-500 mt-1">{errors.message.message}</p>}
                  </div>
                  <button type="submit" disabled={isPending} className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl transition-all shadow-md shadow-primary/10 text-xs uppercase tracking-wider">
                    {isPending ? 'Logging Inquiry...' : <><Send size={12} /> Submit Sourcing Inquiry</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-slate-100 pt-16">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">Related Products in Category</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((p: any) => (
                <Link key={p.id} href={`/catalog/${category}/${p.slug}`} className="group block">
                  <div className="glass rounded-2xl overflow-hidden card-hover border bg-white shadow-sm">
                    <div className="h-36 bg-slate-50 flex items-center justify-center border-b border-slate-100 relative overflow-hidden">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                      ) : (
                        <Package size={28} className="text-slate-200" />
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors truncate">{p.name}</h4>
                      <p className="text-slate-500 text-[11px] mt-1">{formatPrice(p.price)}/{p.unit}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
