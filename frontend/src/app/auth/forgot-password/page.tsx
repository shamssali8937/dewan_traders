'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle, Send } from 'lucide-react';
import { authApi } from '@/services/endpoints';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pattern-dots-light flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="fluid-blob bg-sky-50 w-[500px] h-[500px] top-[-100px] right-[-100px]" />
        <div className="fluid-blob bg-teal-50 w-[400px] h-[400px] bottom-[-100px] left-[-100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-sky-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-primary/20">D</div>
            <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Dewan Traders</span>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 border border-slate-100 bg-white/80 shadow-xl shadow-slate-200/50">
          {sent ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle size={28} className="text-emerald-500" />
              </div>
              <h1 className="text-lg font-black text-slate-800 uppercase tracking-wide">Check Your Email</h1>
              <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
                If <span className="font-bold text-slate-700">{email}</span> is registered, a password reset link has been sent. Check your inbox and spam folder.
              </p>
              <p className="text-[10px] text-slate-400 font-semibold">The link expires in 1 hour.</p>
              <Link href="/auth/login"
                className="inline-flex items-center gap-1.5 text-primary text-xs font-bold hover:underline mt-2">
                <ArrowLeft size={12} /> Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-black text-slate-800 uppercase tracking-wide">Forgot Password?</h1>
                <p className="text-slate-500 text-xs mt-1.5 font-semibold leading-relaxed">
                  Enter your account email and we'll send you a secure reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 block font-bold">Email Address</label>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-800 placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl transition-all shadow-md shadow-primary/10 text-xs uppercase tracking-wider disabled:opacity-60">
                  <Send size={13} /> {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="text-center text-[11px] text-slate-400 mt-5">
                Remember your password?{' '}
                <Link href="/auth/login" className="text-primary font-bold hover:underline">Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
