'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCreateInquiry } from '@/hooks/useInquiries';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, Mail, Clock, Send, Sparkles } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(3, 'Subject required'),
  message: z.string().min(10, 'Please provide more details'),
  productName: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const { mutate: createInquiry, isPending, isSuccess } = useCreateInquiry();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    createInquiry(data, { onSuccess: () => reset() });
  };

  return (
    <div className="bg-white min-h-screen pt-24 relative overflow-hidden pattern-dots-light">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-50 w-[450px] h-[450px] top-[15%] right-[-100px]" />
      </div>

      {/* ═══ HERO SECTION ═══════════════════════════════════════════ */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 mb-2">
              <Sparkles size={12} /> Sourcing Support
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
              Contact <span className="gradient-text-sky">Dewan Traders</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed">
              Have a trade inquiry or want to discuss packaging arrangements? We respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ CONTACT CONTENT ═══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 relative z-10">
        <div className="grid lg:grid-cols-5 gap-10">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-2 space-y-5">
            {[
              { icon: MapPin, title: 'Office Address', lines: ['Satellite Town, Sargodha', 'Punjab, Pakistan'], color: 'text-orange-500 bg-orange-50 border-orange-100' },
              { icon: Phone, title: 'Phone / WhatsApp', lines: ['+92-48-3700000', '+92-300-1234567'], color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
              { icon: Mail, title: 'Email Address', lines: ['info@dewantraders.com', 'export@dewantraders.com'], color: 'text-sky-500 bg-sky-50 border-sky-100' },
              { icon: Clock, title: 'Trading Hours', lines: ['Mon–Sat: 9:00 AM – 6:00 PM', 'Sunday: Closed (PKT)'], color: 'text-indigo-500 bg-indigo-50 border-indigo-100' },
            ].map(({ icon: Icon, title, lines, color }) => (
              <div key={title} className="glass rounded-2xl p-5 flex gap-4 bg-white/70 border border-slate-100 shadow-sm">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${color}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">{title}</h3>
                  {lines.map((l) => <p key={l} className="text-xs text-slate-500 leading-relaxed font-semibold">{l}</p>)}
                </div>
              </div>
            ))}

            {/* Maps Iframe Block */}
            <div className="glass rounded-2xl overflow-hidden h-52 border border-slate-100 relative shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108848.47290074213!2d72.60742232986427!3d32.07399890698188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x392177ab5e1f0e47%3A0xc3cfd6199341496!2sSargodha%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1719688402422!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-3">
            <div className="glass rounded-3xl p-6 md:p-8 border border-slate-100 bg-white/80 shadow-md">
              <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wider mb-2">Send Sourcing Inquiry</h2>
              <p className="text-slate-500 text-xs mb-7">We review and respond to all logged forms within 24 hours on business days.</p>

              {isSuccess ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-500 rounded-xl flex items-center justify-center mx-auto shadow-sm">
                    <Send size={20} className="rotate-45" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase">Inquiry Received</h4>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Thank you. Your message has been sent to our trade desk under Sajjad Hussain Awan.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] text-slate-500 uppercase font-semibold mb-1 block">Full Name *</label>
                      <input {...register('name')} placeholder="Ahmed Al-Rashidi"
                        className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                      {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name.message}</p>}
                    </div>
                    
                    <div>
                      <label className="text-[9px] text-slate-500 uppercase font-semibold mb-1 block">Email Address *</label>
                      <input {...register('email')} type="email" placeholder="ahmed@company.com"
                        className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                      {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] text-slate-500 uppercase font-semibold mb-1 block">Phone / WhatsApp</label>
                      <input {...register('phone')} placeholder="+971 50 123 4567"
                        className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-500 uppercase font-semibold mb-1 block">Company Name</label>
                      <input {...register('company')} placeholder="Your Company Ltd."
                        className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase font-semibold mb-1 block">Product Sourcing Interest</label>
                    <input {...register('productName')} placeholder="e.g. Kinnow Mandarin, Basmati Rice, Footballs..."
                      className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                  </div>
                  
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase font-semibold mb-1 block">Subject *</label>
                    <input {...register('subject')} placeholder="Product inquiry / Quote request"
                      className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                    {errors.subject && <p className="text-[10px] text-red-500 mt-1">{errors.subject.message}</p>}
                  </div>
                  
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase font-semibold mb-1 block">Message *</label>
                    <textarea {...register('message')} rows={4}
                      placeholder="Tell us about your requirements — commodity grade, target weight, port transits..."
                      className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200 resize-none" />
                    {errors.message && <p className="text-[10px] text-red-500 mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl shadow-lg shadow-primary/10 disabled:opacity-60 text-xs uppercase tracking-wider"
                  >
                    {isPending ? 'Sending...' : <><Send size={12} /> Send Sourcing Inquiry</>}
                  </button>
                </form>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
