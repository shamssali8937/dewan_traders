'use client';

import { use, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, XCircle, ArrowRight } from 'lucide-react';

export default function VerifyEmailClient({ params }: { params: Promise<{}> }) {
  const { verifyEmail, isVerifyingEmail, isAuthenticated } = useAuth();

  useEffect(() => {
    // Extract token from search parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      verifyEmail(token);
    }
  }, [verifyEmail]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-500/10 w-[450px] h-[450px] top-[10%] left-[-100px] blur-3xl" />
        <div className="fluid-blob bg-blue-500/10 w-[450px] h-[450px] bottom-[10%] right-[-100px] blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl shadow-2xl relative z-10 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-sky-500/10 rounded-2xl border border-sky-500/20 text-sky-400">
            <ShieldCheck size={32} />
          </div>
        </div>

        <h1 className="text-xl font-black text-slate-100 mb-2">Account Verification</h1>

        {isVerifyingEmail ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-slate-400 font-semibold text-xs py-4">
              <Loader2 size={16} className="animate-spin text-primary" />
              Verifying your email token...
            </div>
            <p className="text-[11px] text-slate-500">
              Please wait while we sync your registration details with our secure database records.
            </p>
          </div>
        ) : isAuthenticated ? (
          <div className="space-y-6">
            <p className="text-slate-300 text-xs leading-relaxed">
              🎉 Congratulations! Your email has been successfully verified. You now have full access to the Dewan Traders B2B portal.
            </p>
            <Link
              href="/user"
              className="w-full py-3.5 bg-gradient-to-r from-primary to-sky-600 hover:from-primary/90 hover:to-sky-600/90 text-white font-black uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-sky-500/10 hover:shadow-sky-500/20 transition-all"
            >
              Go to Dashboard <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-1.5 text-rose-500 font-bold text-xs py-4 bg-rose-500/5 rounded-2xl border border-rose-500/10">
              <XCircle size={14} /> Email Verification Failed
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              We could not verify your email address. The link may have expired or the security token is invalid. Please sign up again or contact support if the issue persists.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/auth/register"
                className="w-full py-3.5 bg-slate-700 hover:bg-slate-650 text-slate-200 font-black uppercase tracking-wider text-xs rounded-xl transition-colors"
              >
                Create New Account
              </Link>
              <Link
                href="/auth/login"
                className="text-xs text-slate-400 hover:text-slate-300 font-bold"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
