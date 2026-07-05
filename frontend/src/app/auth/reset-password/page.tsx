'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/services/endpoints';
import { toast } from 'sonner';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error('Password must be at least 8 characters.');
    if (password !== confirm) return toast.error('Passwords do not match.');
    if (!token) return toast.error('Invalid reset link. Please request a new one.');

    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push('/auth/login'), 3000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4 py-4">
        <p className="text-red-500 text-sm font-semibold">Invalid or missing reset token.</p>
        <Link href="/auth/forgot-password" className="text-primary text-xs font-bold hover:underline">
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <>
      {done ? (
        <div className="text-center space-y-4 py-4">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle size={28} className="text-emerald-500" />
          </div>
          <h1 className="text-lg font-black text-slate-800 uppercase tracking-wide">Password Reset!</h1>
          <p className="text-slate-500 text-xs leading-relaxed">Your password has been updated. Redirecting you to login...</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-wide">Set New Password</h1>
            <p className="text-slate-500 text-xs mt-1.5 font-semibold">Choose a strong password with at least 8 characters.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1.5 block font-bold">New Password</label>
              <div className="relative">
                <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required minLength={8}
                  placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-800 placeholder:text-slate-400"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-700">
                  {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1.5 block font-bold">Confirm Password</label>
              <div className="relative">
                <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl transition-all shadow-md shadow-primary/10 text-xs uppercase tracking-wider disabled:opacity-60">
              <Lock size={13} /> {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-600 mt-5">
            <Link href="/auth/login" className="text-primary font-bold hover:underline">Back to Login</Link>
          </p>
        </>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white pattern-dots-light flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="fluid-blob bg-sky-50 w-[500px] h-[500px] top-[-100px] right-[-100px]" />
        <div className="fluid-blob bg-teal-50 w-[400px] h-[400px] bottom-[-100px] left-[-100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-sky-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-primary/20">D</div>
            <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Dewan Traders</span>
          </div>
        </div>
        <div className="glass rounded-3xl p-8 border border-slate-100 bg-white/80 shadow-xl shadow-slate-200/50">
          <Suspense fallback={<div className="animate-pulse h-40 bg-slate-50 rounded-xl" />}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
