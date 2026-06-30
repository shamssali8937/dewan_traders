'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 relative overflow-hidden pattern-dots-light">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-50 w-[450px] h-[450px] top-[20%] right-[-100px]" />
        <div className="fluid-blob bg-rose-50/50 w-[400px] h-[400px] bottom-[20%] left-[-100px]" />
      </div>

      <div className="relative text-center max-w-md z-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 bg-sky-50 border border-sky-100 rounded-3xl flex items-center justify-center text-primary mx-auto shadow-sm"
        >
          <FileQuestion size={36} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-2"
        >
          <h1 className="text-6xl font-black text-slate-900 tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">Page Not Found</h2>
          <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
            The page you are looking for might have been moved, had its name changed, or is temporarily unavailable.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3.5 justify-center pt-4"
        >
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-primary to-sky-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:from-primary-hover hover:to-sky-700 transition-all shadow-md shadow-primary/10"
          >
            Go Back Home
          </Link>
          <Link
            href="/catalog"
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5"
          >
            Browse Catalog <ArrowRight size={13} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
