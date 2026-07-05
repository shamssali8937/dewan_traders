'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateInquiry } from '@/hooks/useInquiries';
import { Send, FileText, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const rfqSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().min(2, 'Company name is required'),
  productCategory: z.string().min(1, 'Please select a product line'),
  quantity: z.string().min(1, 'Please specify required volume/quantity'),
  destinationPort: z.string().min(2, 'Please enter destination port'),
  incoterms: z.enum(['FOB', 'CIF', 'CFR']),
  message: z.string().min(15, 'Please provide detailed specifications'),
});

type RfqFormData = z.infer<typeof rfqSchema>;

export default function RequestQuotePage() {
  const { mutate: submitInquiry, isPending, isSuccess } = useCreateInquiry();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RfqFormData>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      incoterms: 'FOB',
    }
  });

  const onSubmit = (data: RfqFormData) => {
    submitInquiry({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      subject: `RFQ Bulk: ${data.productCategory} (${data.quantity} - ${data.incoterms} ${data.destinationPort})`,
      message: `Product Line: ${data.productCategory}\nTarget Quantity: ${data.quantity}\nDestination Port: ${data.destinationPort}\nIncoterms: ${data.incoterms}\n\nClient Specifications:\n${data.message}`,
    }, {
      onSuccess: () => reset()
    });
  };

  return (
    <div className="bg-[#fafbf9] min-h-screen pt-24 relative overflow-hidden pattern-dots-light pb-16">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-emerald-100/10 w-[500px] h-[500px] top-[10%] right-[-100px]" />
      </div>

      {/* ═══ HERO SECTION ═══════════════════════════════════════════ */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center space-y-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="text-primary text-[10px] uppercase font-black tracking-[0.2em] flex items-center justify-center gap-1.5 mb-2">
              <Sparkles size={12} className="text-primary" /> B2B Procurement Desk
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Request a Bulk <span className="gradient-text-sky">Quotation</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed font-medium">
              Submit your specific volume requirements, packaging choices, and destination port coordinates to retrieve an official FOB worksheets sheet.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ RFQ FORM ══════════════════════════════════════════════ */}
      <section className="py-8 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="glass rounded-3xl p-6 md:p-10 border border-slate-200/60 bg-white shadow-xl relative">
            
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100/50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 size={36} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider">RFQ Submitted Successfully</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
                    Thank you. Your sourcing request has been registered in our registry log. Our trade operations desk under Sajjad Hussain Awan will review your specifications and email a quotation within 24 hours.
                  </p>
                </div>
                <Link href="/catalog" className="inline-block px-7 py-3.5 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10">
                  Return Sourcing Catalog
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-semibold text-slate-700 text-xs">
                
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Contact Name *</label>
                    <input {...register('name')} placeholder="Johnathan Doe" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 font-medium" />
                    {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name.message}</p>}
                  </div>
                  
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Business Email *</label>
                    <input {...register('email')} type="email" placeholder="john@globalfoods.com" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 font-medium" />
                    {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">WhatsApp / Phone</label>
                    <input {...register('phone')} placeholder="+44 7911 123456" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 font-medium" />
                  </div>
                  
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Company Name *</label>
                    <input {...register('company')} placeholder="Global Food Distributors Ltd" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 font-medium" />
                    {errors.company && <p className="text-[10px] text-red-500 mt-1">{errors.company.message}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Product Category *</label>
                    <select {...register('productCategory')} className="w-full px-4 py-3 bg-slate-50 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 font-medium">
                      <option value="">Select Category...</option>
                      <option value="Fresh Fruits (Citrus / Mangoes)">Fresh Fruits (Citrus / Mangoes)</option>
                      <option value="Vegetables (Onions / Potatoes)">Vegetables (Onions / Potatoes)</option>
                      <option value="Premium Rice (Basmati)">Premium Rice (Basmati)</option>
                      <option value="Surgical Items (Stainless Instruments)">Surgical Items (Stainless Instruments)</option>
                      <option value="Sports Items (English Willow / Footballs)">Sports Items (English Willow / Footballs)</option>
                    </select>
                    {errors.productCategory && <p className="text-[10px] text-red-500 mt-1">{errors.productCategory.message}</p>}
                  </div>
                  
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Target Quantity / Volume *</label>
                    <input {...register('quantity')} placeholder="e.g. 2x 40ft Reefer Containers / 1,000 units" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 font-medium" />
                    {errors.quantity && <p className="text-[10px] text-red-500 mt-1">{errors.quantity.message}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Destination Discharge Port *</label>
                    <input {...register('destinationPort')} placeholder="e.g. Port of Rotterdam, Netherlands" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 font-medium" />
                    {errors.destinationPort && <p className="text-[10px] text-red-500 mt-1">{errors.destinationPort.message}</p>}
                  </div>
                  
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Preferred Incoterms *</label>
                    <select {...register('incoterms')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium">
                      <option value="FOB">FOB (Karachi Port)</option>
                      <option value="CIF">CIF (Discharge Port)</option>
                      <option value="CFR">CFR (Discharge Port)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 block">Detailed Sourcing Requirements *</label>
                  <textarea {...register('message')} rows={5} placeholder="Please detail size grades (e.g. 54-66-72 citrus counts), packaging configurations (e.g. 10kg telescopic cartons), certifications required, and target shipment date." className="w-full px-4 py-3 bg-slate-50 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 resize-none font-medium" />
                  {errors.message && <p className="text-[10px] text-red-500 mt-1">{errors.message.message}</p>}
                </div>

                <div className="flex gap-4 items-center border-t border-slate-100 pt-6">
                  <button type="submit" disabled={isPending} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10 transition-all disabled:opacity-60">
                    {isPending ? 'Logging Sourcing RFQ...' : <><Send size={12} /> Submit B2B Sourcing RFQ</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
