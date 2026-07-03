'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Building2, User, UserPlus, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({
  name: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  userType: z.enum(['individual', 'company']),
  companyName: z.string().optional(),
  companyReg: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
}).refine((data) => {
  if (data.userType === 'company' && !data.companyName) {
    return false;
  }
  return true;
}, { message: 'Company name required', path: ['companyName'] });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const { register: registerUser, isRegisterLoading } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { userType: 'individual' },
  });

  const userType = watch('userType');

  return (
    <div className="min-h-screen flex items-center justify-center pattern-dots-light px-4 py-16 bg-white relative overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-50 w-[450px] h-[450px] top-[10%] right-[-100px]" />
        <div className="fluid-blob bg-teal-50/50 w-[400px] h-[400px] bottom-[10%] left-[-100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-lg z-10 space-y-6"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-sky-600 flex items-center justify-center font-black text-white text-xl shadow-md shadow-primary/10">D</div>
            <div className="text-left leading-tight">
              <div className="font-bold text-slate-800 text-sm tracking-widest uppercase">DEWAN TRADERS</div>
              <div className="text-[10px] text-primary font-bold tracking-widest uppercase">Import & Export</div>
            </div>
          </Link>
        </div>

        <div className="glass rounded-3xl p-8 border border-slate-100 bg-white/80 shadow-lg relative">
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Sparkles size={16} className="text-primary" /> Create Account</h1>
          <p className="text-slate-500 text-xs mb-6">Join our wholesale portal to secure direct sourcing agreements</p>

          {/* User Type Toggle */}
          <div className="flex gap-2 p-1 bg-slate-100/60 border border-slate-200/50 rounded-xl mb-6">
            <label className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${userType === 'individual' ? 'bg-gradient-to-r from-primary to-sky-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              <input {...register('userType')} type="radio" value="individual" className="hidden" />
              <User size={13} />
              Individual
            </label>
            <label className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${userType === 'company' ? 'bg-gradient-to-r from-primary to-sky-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              <input {...register('userType')} type="radio" value="company" className="hidden" />
              <Building2 size={13} />
              Company
            </label>
          </div>

          <form onSubmit={handleSubmit((data) => registerUser(data))} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Full Name *</label>
                <input {...register('name')} placeholder="Your full name"
                  className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Phone / WhatsApp</label>
                <input {...register('phone')} placeholder="+971 50 000 0000"
                  className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Email Address *</label>
              <input {...register('email')} type="email" placeholder="you@company.com"
                className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
              {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Password *</label>
              <div className="relative">
                <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters"
                  className="w-full px-3 py-2.5 pr-11 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-700 transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            {/* Company Fields */}
            {userType === 'company' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Company Name *</label>
                  <input {...register('companyName')} placeholder="Your Company Ltd."
                    className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                  {errors.companyName && <p className="text-[10px] text-red-500 mt-1">{errors.companyName.message}</p>}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Company Registration No.</label>
                    <input {...register('companyReg')} placeholder="CR-12345"
                      className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">City</label>
                    <input {...register('city')} placeholder="Dubai"
                      className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                  </div>
                </div>
              </motion.div>
            )}

            <button type="submit" disabled={isRegisterLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10 transition-all disabled:opacity-60 mt-2">
              {isRegisterLoading ? 'Creating account...' : <><UserPlus size={12} /> Create Account</>}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline font-bold uppercase tracking-wide">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
