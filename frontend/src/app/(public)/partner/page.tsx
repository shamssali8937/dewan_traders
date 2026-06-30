'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateInquiry } from '@/hooks/useInquiries';
import { Send, Handshake, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const partnerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  company: z.string().min(2, 'Company/Entity name is required'),
  country: z.string().min(2, 'Country is required'),
  partnerType: z.string().min(1, 'Please select partnership alignment'),
  commodities: z.string().min(2, 'Please list interested commodities'),
  message: z.string().min(15, 'Please outline your partnership proposal'),
});

type PartnerFormData = z.infer<typeof partnerSchema>;

export default function PartnerPage() {
  const { mutate: submitInquiry, isPending, isSuccess } = useCreateInquiry();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
  });

  const onSubmit = (data: PartnerFormData) => {
    submitInquiry({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      subject: `Partnership Request: ${data.partnerType} (${data.company} - ${data.country})`,
      message: `Alignment Type: ${data.partnerType}\nEntity Country: ${data.country}\nCommodities Focus: ${data.commodities}\n\nPartnership Proposal:\n${data.message}`,
    }, {
      onSuccess: () => reset()
    });
  };

  return (
    <div className="bg-white min-h-screen pt-24 relative overflow-hidden pattern-dots-light pb-16">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-50 w-[500px] h-[500px] top-[10%] left-[-100px]" />
      </div>

      {/* ═══ HERO SECTION ═══════════════════════════════════════════ */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 mb-2">
              <Handshake size={12} /> Alliance Program
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
              Partner With <span className="gradient-text-sky">Dewan Traders</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed">
              We collaborate with regional importers, distribution brokers, and local growers to build resilient global supply chains.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ FORM SECTION ═══════════════════════════════════════════ */}
      <section className="py-8 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="glass rounded-3xl p-6 md:p-8 border border-slate-100 bg-white/80 shadow-lg relative">
            
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 size={36} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Partnership Request Logged</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Thank you. Sajjad Hussain Awan and our business development desk will evaluate your regional distribution proposal and get in touch within 2-3 business days.
                  </p>
                </div>
                <Link href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-sky-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider">
                  Back to Homepage
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Full Name *</label>
                    <input {...register('name')} placeholder="Ahmed Al-Mansoori" className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                    {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name.message}</p>}
                  </div>
                  
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Direct Business Email *</label>
                    <input {...register('email')} type="email" placeholder="ahmed@am-distributors.ae" className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                    {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Direct Phone / WhatsApp *</label>
                    <input {...register('phone')} placeholder="+971 50 123 4567" className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                    {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone.message}</p>}
                  </div>
                  
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Company Name *</label>
                    <input {...register('company')} placeholder="Al-Mansoori Foods & Trading Group" className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                    {errors.company && <p className="text-[10px] text-red-500 mt-1">{errors.company.message}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Country of Operations *</label>
                    <input {...register('country')} placeholder="e.g. United Arab Emirates" className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                    {errors.country && <p className="text-[10px] text-red-500 mt-1">{errors.country.message}</p>}
                  </div>
                  
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Partnership Category *</label>
                    <select {...register('partnerType')} className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200">
                      <option value="">Select Alignment Type...</option>
                      <option value="Regional Distributor">Regional Distributor</option>
                      <option value="Broker / Commission Agent">Broker / Commission Agent</option>
                      <option value="Domestic Farm/Factory Supplier">Domestic Farm/Factory Supplier</option>
                      <option value="Logistics Shipping Partner">Logistics Shipping Partner</option>
                    </select>
                    {errors.partnerType && <p className="text-[10px] text-red-500 mt-1">{errors.partnerType.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Target Commodities *</label>
                  <input {...register('commodities')} placeholder="e.g. Fresh Citrus (Kinnow), Basmati Rice" className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                  {errors.commodities && <p className="text-[10px] text-red-500 mt-1">{errors.commodities.message}</p>}
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Outline Partnership Proposal & Capabilites *</label>
                  <textarea {...register('message')} rows={5} placeholder="Briefly detail your regional sales volume, wholesale client base, warehousing logistics, and proposed collaboration model." className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200 resize-none" />
                  {errors.message && <p className="text-[10px] text-red-500 mt-1">{errors.message.message}</p>}
                </div>

                <div className="flex gap-4 items-center border-t border-slate-100 pt-6">
                  <button type="submit" disabled={isPending} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10 transition-all disabled:opacity-60">
                    {isPending ? 'Logging Proposal...' : <><Send size={12} /> Submit Partnership Request</>}
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
