'use client';

import { use, useState, useEffect, useMemo, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useCreateInquiry } from '@/hooks/useInquiries';
import { usePlaceOrder } from '@/hooks/useOrders';
import { useAuthStore } from '@/store/authStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatPrice, resolveImageUrl } from '@/lib/utils';
import { useMarketStore } from '@/store/marketStore';

import { Send, CheckCircle, ShieldCheck, Award, FileText, ChevronRight, Package, MapPin, Sparkles, ShoppingCart, Info } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

const inquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Please write a detailed message'),
});

const CATEGORY_COLORS: Record<string, string> = {
  produce: 'from-emerald-500 to-green-600',
  spices: 'from-orange-500 to-red-600',
  textiles: 'from-blue-500 to-indigo-600',
};

type InquiryFormData = z.infer<typeof inquirySchema>;

const PACKING_MULTIPLIERS: Record<string, number> = {
  '20ft_reefer': 1.15,
  '40ft_reefer': 1.25,
  '20ft_dry': 1.04,
  '40ft_dry': 1.08,
  'bulk_loose': 1.00,
};

function ProductDetailPageContent({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = use(params);
  const { data: product, isLoading, error } = useProduct(slug);
  const { data: relatedData } = useProducts({ category, limit: 4 });
  const { user, isAuthenticated } = useAuthStore();
  const { mutate: placeOrder, isPending: ordering, isSuccess: ordered } = usePlaceOrder();
  const { mutate: sendInquiry, isPending: isPending, isSuccess: isSuccess } = useCreateInquiry();
  const { region, exchangeRate, premiumPackagingCost, formatPrice: marketFormatPrice, getProductPrice, getProductUnit, getProductMoq, formatProductPrice } = useMarketStore();

  const searchParams = useSearchParams();
  const router = useRouter();
  const [formTab, setFormTab] = useState<'quote' | 'order'>('quote');
  const [orderQty, setOrderQty] = useState(1);
  const [shippingAddr, setShippingAddr] = useState('');
  const [billingAddr, setBillingAddr] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // ─── Pakistan local specific configurations ───
  const [packagingOption, setPackagingOption] = useState<'simple' | 'premium'>('simple');
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express' | 'pickup'>('standard');

  // ─── International export specific configurations ───
  const [containerType, setContainerType] = useState('20ft_reefer');
  const [incoterm, setIncoterm] = useState('FOB');
  const [shippingMethod, setShippingMethod] = useState<'sea' | 'air'>('sea');
  const [exportDocumentation, setExportDocumentation] = useState(true);
  const [customsClearance, setCustomsClearance] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');

  const packingMultiplier = PACKING_MULTIPLIERS[containerType] || 1.0;

  const activePrice = product ? getProductPrice(product.slug, Number(product.price)) : 0;
  const activeUnit = product ? getProductUnit(product.slug, product.unit) : 'kg';
  const activeMoq = product ? getProductMoq(product.slug, product.minOrderQty) : 1;

  // Gallery images list calculation
  const allImages = useMemo(() => {
    if (!product) return [];
    const imgs: string[] = [];
    if (product.imageUrl) imgs.push(product.imageUrl);
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img: string) => {
        if (!imgs.includes(img)) imgs.push(img);
      });
    }
    return imgs;
  }, [product]);

  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Set the default active image when the product details load
  useEffect(() => {
    if (allImages.length > 0) {
      setActiveImage(allImages[0]);
    } else {
      setActiveImage(null);
    }
  }, [allImages]);

  // Surcharges and logistics costs based on region
  const baseProductCost = orderQty * activePrice;

  // Surcharges and logistics costs based on region
  const containerBaseCost = useMemo(() => {
    switch (containerType) {
      case '20ft_reefer': return 1800;
      case '40ft_reefer': return 2800;
      case '20ft_dry': return 1000;
      case '40ft_dry': return 1500;
      case 'bulk_loose': return 400;
      default: return 0;
    }
  }, [containerType]);

  const docClearanceCost = (exportDocumentation ? 150 : 0) + (customsClearance ? 250 : 0);
  const transitPackagingSurcharge = baseProductCost * (packingMultiplier - 1);

  // Grand totals:
  const localProductTotalPkr = baseProductCost;
  const localPackagingTotalPkr = packagingOption === 'premium' ? premiumPackagingCost : 0;
  const localDeliveryTotalPkr = deliveryOption === 'express' ? 600 : deliveryOption === 'standard' ? 250 : 0;
  const localGrandTotalPkr = localProductTotalPkr + localPackagingTotalPkr + localDeliveryTotalPkr;

  const intProductTotalUsd = baseProductCost;
  const intPackagingTotalUsd = transitPackagingSurcharge;
  const intLogisticsTotalUsd = containerBaseCost;
  const intDocsTotalUsd = docClearanceCost;
  const intGrandTotalUsd = intProductTotalUsd + intPackagingTotalUsd + intLogisticsTotalUsd + intDocsTotalUsd;

  // Value shown in the "Estimated Value" field
  const totalEstimatedValue = region === 'PK' ? localGrandTotalPkr : intGrandTotalUsd;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: `Quotation inquiry: ${slug}`,
      message: '',
    }
  });

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'order') {
      setFormTab('order');
    } else if (tabParam === 'quote') {
      setFormTab('quote');
    }
    
    // Set appropriate MOQ based on selected region
    // Set appropriate MOQ based on selected region
    if (product) {
      setOrderQty(activeMoq);
    }
  }, [searchParams, product, region, activeMoq]);

  const onSubmit = (data: InquiryFormData) => {
    sendInquiry({
      ...data,
      productName: product?.name,
    }, {
      onSuccess: () => reset()
    });
  };

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (orderQty < activeMoq) return;

    // Compile details into order notes
    const formattedNotes = region === 'PK' ? [
      `Market: Domestic (Pakistan)`,
      `Packaging: ${packagingOption === 'premium' ? 'Premium Packaging' : 'Simple Packaging'}`,
      `Delivery: ${deliveryOption.toUpperCase()}`,
      `Payment Mode: ${paymentMethod}`,
      orderNotes ? `Special Instructions: ${orderNotes}` : ''
    ].filter(Boolean).join(' | ') : [
      `Market: International`,
      `Container: ${containerType}`,
      `Incoterm: ${incoterm}`,
      `Shipping: ${shippingMethod.toUpperCase()} Freight`,
      `Docs/Customs: ${[exportDocumentation ? 'Docs' : '', customsClearance ? 'Customs' : ''].filter(Boolean).join('+') || 'None'}`,
      `Payment Mode: ${paymentMethod}`,
      orderNotes ? `Special Instructions: ${orderNotes}` : ''
    ].filter(Boolean).join(' | ');

    placeOrder({
      items: [
        {
          productId: product.id,
          quantity: orderQty,
          notes: region === 'PK' ? `Local packaging: ${packagingOption}` : `Export container: ${containerType}`,
        }
      ],
      shippingAddress: shippingAddr,
      billingAddress: billingAddr || shippingAddr,
      notes: formattedNotes,
      paymentMethod,
    }, {
      onSuccess: (res: any) => {
        const orderId = res.data?.data?.id || res.data?.id;
        if (orderId) {
          router.push(`/orders/${orderId}/confirmation`);
        }
      }
    });
  };

  const relatedProducts = relatedData?.products?.filter((p: any) => p.slug !== slug).slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="pt-32 min-h-screen max-w-7xl mx-auto px-6 space-y-10 animate-pulse bg-white">
        <div className="h-6 bg-slate-100 rounded w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 h-96 bg-slate-100 rounded-3xl" />
          <div className="lg:col-span-3 space-y-6">
            <div className="h-10 bg-slate-100 rounded w-3/4" />
            <div className="h-6 bg-slate-100 rounded w-1/2" />
            <div className="h-32 bg-slate-50 border border-slate-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-32 min-h-screen text-center space-y-4 bg-white">
        <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Product Details Not Found</p>
        <Link href="/catalog" className="inline-block text-primary font-bold hover:underline text-xs">&larr; Back to Catalog</Link>
      </div>
    );
  }

  const details = CATEGORY_COLORS[category] ? { label: category, style: CATEGORY_COLORS[category] } : { label: category, style: 'from-slate-400 to-slate-500' };

  return (
    <div className="bg-white min-h-screen pt-28 pb-20 relative overflow-hidden pattern-dots-light">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-50 w-[550px] h-[550px] top-[10%] right-[-100px]" />
        <div className="fluid-blob bg-teal-50 w-[400px] h-[400px] bottom-[15%] left-[-150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-bold uppercase tracking-widest border-b border-slate-100 pb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link href="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
          <ChevronRight size={10} />
          <Link href={`/catalog/${category}`} className="hover:text-primary transition-colors capitalize">{category}</Link>
          <ChevronRight size={10} />
          <span className="text-slate-600 truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          <div className="lg:col-span-2">
            <div className="glass rounded-3xl overflow-hidden aspect-square flex items-center justify-center relative border border-slate-100 group shadow-sm bg-white">
              {activeImage ? (
                <img src={resolveImageUrl(activeImage)} alt={product.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
              ) : (
                <div className="text-slate-500 flex flex-col items-center gap-3">
                  <Package size={60} />
                  <span className="text-[10px] font-black uppercase tracking-widest">No Image Asset</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-2.5 mt-3 overflow-x-auto pb-2 scrollbar-thin">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 bg-white transition-all shrink-0 ${
                      activeImage === img ? 'border-primary shadow-sm scale-95' : 'border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <img src={resolveImageUrl(img)} alt={`${product.name} gallery ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-3.5">
              <span className={`inline-block text-[9px] px-3.5 py-1.5 rounded-full text-white font-black uppercase tracking-widest bg-gradient-to-r ${details.style}`}>
                {details.label}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight">
                {product.name}
              </h1>
              <p className="text-xs text-slate-600 font-bold font-mono uppercase tracking-wider">SKU Code: {product.sku}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
              <div className="space-y-1">
                <span className="text-[9px] text-slate-600 uppercase font-bold tracking-widest block">
                  {region === 'PK' ? 'Unit Price (Local Wholesale)' : 'Unit Price (FOB Export)'}
                </span>
                <div className="text-slate-800 font-black text-lg">
                  {formatProductPrice(product.slug, product.price)} <span className="text-slate-600 font-normal text-xs">/{activeUnit}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-600 uppercase font-bold tracking-widest block">
                  {region === 'PK' ? 'Min. Order Qty' : 'Min. Order Qty (MOQ)'}
                </span>
                <div className="text-slate-800 font-black text-lg">
                  {activeMoq} <span className="text-slate-600 font-normal text-xs">{activeUnit}s</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed font-medium">
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest block">Product Specifications</span>
              <p>{product.description || 'Premium commodity selection curated by Dewan Traders. Freshly processed, sorted, and packed to international clearance standards.'}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 pt-6 text-[10px] font-bold text-slate-500">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> SGS Cleared Grade-A Cargo</span>
              <span className="flex items-center gap-1.5"><Award size={14} className="text-primary" /> ISO 22000 Food Safety Standards</span>
            </div>

            <div id="inquiry" className="glass rounded-3xl p-6 border border-slate-100 bg-white/80 shadow-md relative space-y-5">
              <div className="flex bg-slate-50 border border-slate-200/50 p-1 rounded-xl w-full">
                <button type="button" onClick={() => setFormTab('quote')} className={`flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${formTab === 'quote' ? 'bg-white text-primary border border-slate-100 shadow-sm' : 'text-slate-600'}`}>
                  <FileText size={11} className="inline mr-1" /> Sourcing RFQ
                </button>
                <button type="button" onClick={() => setFormTab('order')} className={`flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${formTab === 'order' ? 'bg-white text-primary border border-slate-100 shadow-sm' : 'text-slate-600'}`}>
                  <ShoppingCart size={11} className="inline mr-1" /> Place Order
                </button>
              </div>

              {formTab === 'quote' ? (
                isSuccess ? (
                  <div className="text-center py-6">
                    <CheckCircle className="mx-auto text-emerald-500 mb-2" size={30} />
                    <p className="text-xs font-bold text-slate-800">Inquiry Submitted</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input {...register('name')} placeholder="Full Name" className="w-full px-3 py-2.5 bg-white rounded-xl text-xs border border-slate-200" />
                    <input {...register('email')} placeholder="Email Address" className="w-full px-3 py-2.5 bg-white rounded-xl text-xs border border-slate-200" />
                    <textarea {...register('message')} placeholder="Project details / Requirements..." rows={3} className="w-full px-3 py-2.5 bg-white rounded-xl text-xs border border-slate-200" />
                    <button type="submit" disabled={isPending} className="w-full py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase">Submit RFQ</button>
                  </form>
                )
              ) : (
                !isAuthenticated ? (
                  <div className="text-center py-6">
                    <p className="text-xs text-slate-500 mb-4">Please login to place orders.</p>
                    <Link href="/auth/login" className="text-primary font-bold text-xs">Login Now &rarr;</Link>
                  </div>
                ) : ordered ? (
                  <div className="text-center py-6">
                    <CheckCircle className="mx-auto text-emerald-500 mb-2" size={30} />
                    <p className="text-xs font-bold text-slate-800">Order Placed Successfully</p>
                  </div>
                ) : (
                  <form onSubmit={handlePlaceOrderSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
                    {/* Quantity & Value Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-1 block">Quantity ({product.unit}) *</label>
                        <input
                          type="number"
                          min={activeMoq}
                          value={orderQty}
                          onChange={e => setOrderQty(Math.max(activeMoq, Number(e.target.value)))}
                          className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-200"
                          required
                        />
                        <p className="text-[9px] text-slate-600 mt-1">
                          Min Order: {activeMoq} {activeUnit}s
                        </p>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-1 block">Estimated Value</label>
                        <div className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-black flex justify-between items-center min-h-[42px]">
                          <span>
                            {region === 'PK' 
                              ? `₨ ${Math.round(totalEstimatedValue).toLocaleString()}` 
                              : `$${totalEstimatedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            }
                          </span>
                          {region === 'INT' && packingMultiplier > 1 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200 font-bold font-sans">
                              +{( (packingMultiplier - 1) * 100 ).toFixed(0)}% Surcharge
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* DYNAMIC FORMS BASED ON REGION */}
                    {region === 'PK' ? (
                      /* 🇵🇰 PAKISTAN LOCAL FORM */
                      <div className="space-y-4">
                        {/* Packaging Selection Cards */}
                        <div>
                          <label className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-2 block">Packaging Options</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {/* Simple Packaging */}
                            <div
                              onClick={() => setPackagingOption('simple')}
                              className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                                packagingOption === 'simple'
                                  ? 'border-primary bg-sky-50/20 shadow-sm'
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-bold text-slate-900 text-xs">Simple Packaging</span>
                                  <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-100">FREE</span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-normal leading-relaxed">
                                  Standard protective packaging suitable for domestic deliveries.
                                </p>
                              </div>
                              <div className="text-[9px] text-slate-400 font-bold mt-2">Default Selected</div>
                            </div>

                            {/* Premium Packaging */}
                            <div
                              onClick={() => setPackagingOption('premium')}
                              className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                                packagingOption === 'premium'
                                  ? 'border-primary bg-sky-50/20 shadow-sm'
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-bold text-slate-900 text-xs">Premium Packaging</span>
                                  <span className="text-[9px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold border border-amber-100">⭐ Recommended</span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-normal leading-relaxed">
                                  Reinforced moisture-proof cushioning. Highly recommended for fragile/premium items.
                                </p>
                              </div>
                              <div className="text-[10px] text-primary font-bold mt-2">
                                +{region === 'PK' ? `₨ ${premiumPackagingCost.toLocaleString()}` : `$${(premiumPackagingCost / exchangeRate).toFixed(2)}`}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Delivery Method */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-1 block">Delivery Option *</label>
                            <select value={deliveryOption} onChange={e => setDeliveryOption(e.target.value as any)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl">
                              <option value="standard">Standard Delivery (₨ 250 - 3 to 5 Days)</option>
                              <option value="express">Express Delivery (₨ 600 - 1 to 2 Days)</option>
                              <option value="pickup">Warehouse Pickup (FREE - Sargodha)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-1 block">Payment Method *</label>
                            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl">
                              <option value="bank_transfer">Local Bank Transfer (HBL, Meezan, Alfalah)</option>
                              <option value="easypaisa">EasyPaisa mobile wallet</option>
                              <option value="jazzcash">JazzCash mobile wallet</option>
                            </select>
                          </div>
                        </div>

                        {/* Order Summary PKR */}
                        <div className="rounded-2xl p-4 bg-slate-50 border border-slate-200/60 space-y-2 text-xs">
                          <h4 className="font-bold text-slate-800 uppercase text-[9px] tracking-wider mb-2 border-b border-slate-200/50 pb-1">Order Summary</h4>
                          <div className="flex justify-between text-slate-600 font-normal">
                            <span>Products Subtotal:</span>
                            <span>₨ {Math.round(localProductTotalPkr).toLocaleString()}</span>
                          </div>
                          {packagingOption === 'premium' && (
                            <div className="flex justify-between text-slate-600 font-normal">
                              <span>Premium Packaging:</span>
                              <span>₨ {localPackagingTotalPkr.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-slate-600 font-normal">
                            <span>Delivery Charges:</span>
                            <span>{localDeliveryTotalPkr > 0 ? `₨ ${localDeliveryTotalPkr.toLocaleString()}` : 'FREE'}</span>
                          </div>
                          <div className="flex justify-between text-slate-800 font-black border-t border-slate-200 pt-2 text-sm">
                            <span>Grand Total (PKR):</span>
                            <span>₨ {Math.round(localGrandTotalPkr).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* 🌍 INTERNATIONAL EXPORT FORM */
                      <div className="space-y-4">
                        {/* Transit specifications */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-1 block">Transit Packing *</label>
                            <select value={containerType} onChange={e => setContainerType(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl">
                              <option value="20ft_reefer">20ft Refrigerated Container (+15% Surcharge)</option>
                              <option value="40ft_reefer">40ft Refrigerated Container (+25% Surcharge)</option>
                              <option value="20ft_dry">20ft Standard Dry Container (+4% Surcharge)</option>
                              <option value="40ft_dry">40ft Standard Dry Container (+8% Surcharge)</option>
                              <option value="bulk_loose">Bulk Cargo / Loose Packaging (No Surcharge)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-1 block">Incoterms *</label>
                            <select value={incoterm} onChange={e => setIncoterm(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl">
                              <option value="FOB">FOB - Free On Board (Karachi Port)</option>
                              <option value="CIF">CIF - Cost, Insurance & Freight</option>
                              <option value="EXW">EXW - Ex Works (Sargodha Warehouse)</option>
                              <option value="DAP">DAP - Delivered At Place</option>
                            </select>
                          </div>
                        </div>

                        {/* Shipping & Logistics specs */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-1 block">Shipping Method *</label>
                            <select value={shippingMethod} onChange={e => setShippingMethod(e.target.value as any)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl">
                              <option value="sea">Sea Freight (Karachi Port)</option>
                              <option value="air">Air Cargo (Lahore/Islamabad Airport)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-1 block">Payment Method *</label>
                            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl">
                              <option value="bank_transfer">International Bank Wire Transfer (Telegraphic Transfer)</option>
                              <option value="letter_of_credit">L/C (Letter of Credit at Sight)</option>
                            </select>
                          </div>
                        </div>

                        {/* Logistics options checklists */}
                        <div className="flex gap-4 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                          <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input type="checkbox" checked={exportDocumentation} onChange={e => setExportDocumentation(e.target.checked)} className="rounded text-primary focus:ring-primary/20" />
                            <span className="text-[10px] font-bold text-slate-700">Export Documentation (+$150)</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input type="checkbox" checked={customsClearance} onChange={e => setCustomsClearance(e.target.checked)} className="rounded text-primary focus:ring-primary/20" />
                            <span className="text-[10px] font-bold text-slate-700">Customs Clearance (+$250)</span>
                          </label>
                        </div>

                        {/* Order Summary USD */}
                        <div className="rounded-2xl p-4 bg-slate-50 border border-slate-200/60 space-y-2 text-xs">
                          <h4 className="font-bold text-slate-800 uppercase text-[9px] tracking-wider mb-2 border-b border-slate-200/50 pb-1">Export Order Summary</h4>
                          <div className="flex justify-between text-slate-600 font-normal">
                            <span>Products:</span>
                            <span>${intProductTotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                          </div>
                          {intPackagingTotalUsd > 0 && (
                            <div className="flex justify-between text-slate-600 font-normal">
                              <span>Transit Packaging Surcharge:</span>
                              <span>${intPackagingTotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-slate-600 font-normal">
                            <span>Ocean Container Logistics Base:</span>
                            <span>${intLogisticsTotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                          </div>
                          {intDocsTotalUsd > 0 && (
                            <div className="flex justify-between text-slate-600 font-normal">
                              <span>Docs & Customs Handling:</span>
                              <span>${intDocsTotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-slate-800 font-black border-t border-slate-200 pt-2 text-sm">
                            <span>Grand Total (USD):</span>
                            <span>${intGrandTotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Common Address Field */}
                    <div>
                      <label className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-1 block">
                        {region === 'PK' ? 'Delivery Shipping Address *' : 'Transit Destination Port / Address *'}
                      </label>
                      <input
                        type="text"
                        placeholder={region === 'PK' ? "e.g. House 42, Block C, Satellite Town, Sargodha" : "e.g. 123 Gulf Trade Zone, Dubai, UAE"}
                        value={shippingAddr}
                        onChange={e => setShippingAddr(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-1 block">Special Instructions</label>
                      <textarea
                        placeholder={region === 'PK' ? "e.g. Call before delivery, wrap carefully..." : "e.g. Palletized cargo, specific target temperature..."}
                        value={orderNotes}
                        onChange={e => setOrderNotes(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-200 resize-none font-sans font-medium"
                      />
                    </div>

                    <button type="submit" disabled={ordering} className="w-full py-3 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-primary/10">
                      {ordering ? 'Submitting Contract...' : 'Place Order Contract'}
                    </button>
                  </form>
                )
              )}
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="border-t border-slate-100 pt-12">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">Related Products in Category</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((p: any) => (
                <Link key={p.id} href={`/catalog/${category}/${p.slug}`} className="group block">
                  <div className="glass rounded-2xl overflow-hidden card-hover border bg-white shadow-sm">
                    <div className="h-36 bg-slate-50 flex items-center justify-center border-b border-slate-100 relative overflow-hidden">
                      {p.imageUrl ? (
                        <img src={resolveImageUrl(p.imageUrl)} alt={p.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                      ) : (
                        <Package size={28} className="text-slate-500" />
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

export default function ProductDetailPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  return (
    <Suspense fallback={
      <div className="pt-32 min-h-screen max-w-7xl mx-auto px-6 space-y-10 animate-pulse bg-white">
        <div className="h-6 bg-slate-100 rounded w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 h-96 bg-slate-100 rounded-3xl" />
          <div className="lg:col-span-3 space-y-6">
            <div className="h-10 bg-slate-100 rounded w-3/4" />
            <div className="h-6 bg-slate-100 rounded w-1/2" />
            <div className="h-32 bg-slate-50 border border-slate-100 rounded-2xl" />
          </div>
        </div>
      </div>
    }>
      <ProductDetailPageContent params={params} />
    </Suspense>
  );
}
