'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const { login, isLoginLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="min-h-screen flex items-center justify-center pattern-dots-light px-4 py-20 bg-white relative overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-50 w-[450px] h-[450px] top-[10%] right-[-100px]" />
        <div className="fluid-blob bg-teal-50/50 w-[400px] h-[400px] bottom-[10%] left-[-100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md z-10 space-y-6"
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
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Sparkles size={16} className="text-primary" /> Welcome Back</h1>
          <p className="text-slate-500 text-xs mb-7">Sign in to your wholesale trade account to continue</p>

          <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4">
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Email Address *</label>
              <input {...register('email')} type="email" placeholder="you@company.com"
                className="w-full px-3 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
              {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase font-semibold mb-1.5 block">Password *</label>
              <div className="relative">
                <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-11 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <Link href="/auth/forgot-password" className="text-[10px] text-primary font-bold hover:underline">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={isLoginLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10 transition-all disabled:opacity-60 mt-2">
              {isLoginLoading ? 'Signing in...' : <><LogIn size={12} /> Sign In</>}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-sky-50 border border-sky-100 rounded-2xl text-[11px] text-sky-800">
            <p className="font-bold uppercase tracking-wider mb-1.5">Demo Admin Credentials</p>
            <p className="font-semibold text-slate-600">Email: <span className="font-mono text-primary select-all">admin@dewantraders.com</span></p>
            <p className="font-semibold text-slate-600 mt-0.5">Password: <span className="font-mono text-primary select-all">Admin@123</span></p>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Don't have a trade account?{' '}
            <Link href="/auth/register" className="text-primary hover:underline font-bold uppercase tracking-wide">
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
