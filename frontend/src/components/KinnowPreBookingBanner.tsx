'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ArrowRight, ShieldCheck, Calendar, Ship, Package,
  MessageSquare, CheckCircle2, Leaf, Trophy, Zap
} from 'lucide-react';

const NEVER_SHOW_KEY = 'kinnow_2027_never_show';

const specs = [
  { icon: Leaf,     label: 'Grade',    value: 'Export Grade-A',   color: '#0E6B45' },
  { icon: Package,  label: 'Pack',     value: '10kg / 13kg Box',  color: '#0E6B45' },
  { icon: Ship,     label: 'Shipping', value: '40ft Reefer Slot', color: '#F47A16' },
  { icon: Calendar, label: 'Harvest',  value: "Dec '26–Feb '27",  color: '#F47A16' },
];

export default function KinnowPreBookingBanner() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show on every visit UNLESS user explicitly clicked "Don't show again"
    const suppressed = localStorage.getItem(NEVER_SHOW_KEY) === 'true';
    if (!suppressed) {
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Just close — popup will reappear on next visit
  const close = () => setIsOpen(false);

  // Permanently suppress via localStorage
  const closeForever = () => {
    localStorage.setItem(NEVER_SHOW_KEY, 'true');
    setIsOpen(false);
  };

  const rfqUrl = `/quote?subject=${encodeURIComponent(
    'Kinnow 2027 Pre-Booking Inquiry'
  )}&productCategory=${encodeURIComponent(
    'fruits'
  )}&quantity=${encodeURIComponent(
    '1 Reefer Container (40ft)'
  )}&message=${encodeURIComponent(
    'We would like to reserve refrigerated container slots for Sargodha Kinnow 2027 export season. Please provide FOB/CIF pricing worksheet and quota confirmation.'
  )}`;

  const whatsappUrl = `https://wa.me/923456776075?text=${encodeURIComponent(
    'Hello Dewan Traders, I would like to inquire about Pre-Booking container slots for Sargodha Kinnow 2027 harvest.'
  )}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ────────────────────────────────────────── */}
          <motion.div
            key="kinnow-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[200]"
            onClick={close}
            aria-hidden="true"
          />

          {/* ── Modal ───────────────────────────────────────────── */}
          <motion.div
            key="kinnow-modal"
            initial={{ opacity: 0, scale: 0.93, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Kinnow 2027 Pre-Booking"
            /* Full-screen centering, safe padding so nothing touches screen edges */
            className="fixed inset-0 z-[201] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 pointer-events-none"
          >
            <div className="relative w-full sm:max-w-2xl md:max-w-3xl pointer-events-auto rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/30">

              {/* Top accent strip */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0E6B45] via-[#F47A16] to-[#0E6B45]" />

              {/* Close ✕ */}
              <button
                onClick={close}
                aria-label="Close pre-booking popup"
                className="absolute top-3 right-3 z-20 w-8 h-8 min-w-[2rem] min-h-[2rem] flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
              >
                <X size={15} />
              </button>

              {/* ── Body: image top on mobile, side-by-side on sm+ ── */}
              <div className="flex flex-col sm:grid sm:grid-cols-5 bg-white">

                {/* Image panel */}
                <div className="sm:col-span-2 relative h-44 sm:h-auto sm:min-h-[340px] overflow-hidden">
                  <Image
                    src="/images/orange1.jpg"
                    alt="Sargodha Kinnow Mandarins 2027 Pre-Booking"
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-cover"
                    priority
                  />
                  {/* Subtle bottom gradient only — keeps image visible, text legible */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />

                  {/* Origin badge — white text on dark glass */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-900/70 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-md">
                    <Trophy size={10} className="text-white" /> Sargodha Origin
                  </div>

                  {/* SGS badge – only on sm+ */}
                  <div className="hidden sm:block absolute bottom-4 left-4 right-4">
                    <div className="text-[10px] font-black tracking-wide uppercase text-white flex items-center gap-1 mb-0.5">
                      <CheckCircle2 size={11} className="text-white" /> SGS Tested &amp; Lab Cleared
                    </div>
                    <div className="text-[9px] text-white/70 font-medium leading-snug">
                      Guaranteed brix ratio, uniform sizing &amp; high juice content.
                    </div>
                  </div>
                </div>

                {/* Content panel */}
                <div className="sm:col-span-3 flex flex-col gap-4 p-5 sm:p-7 justify-center">

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[11px] font-black uppercase tracking-wider shadow-sm"
                      style={{ background: 'linear-gradient(135deg,#0E6B45 0%,#0B5537 100%)' }}
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                      </span>
                      Pre-Booking Now Open
                    </span>
                    <span
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider border"
                      style={{ background: 'rgba(244,122,22,0.08)', borderColor: 'rgba(244,122,22,0.25)', color: '#D96A10' }}
                    >
                      <ShieldCheck size={11} /> Priority Slot
                    </span>
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 leading-tight tracking-tight">
                      Sargodha Kinnow{' '}
                      <span style={{ color: '#0E6B45' }}>2027 Season</span>
                      <br />
                      <span style={{ color: '#F47A16' }}>Early Quota Allocation</span>
                    </h2>
                    <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed font-medium">
                      Lock in early-bird FOB/CIF pricing and reserve cold-chain 40ft Reefer slots directly from Sargodha's flagship orchards — ahead of peak demand.
                    </p>
                  </div>

                  {/* Specs grid – 2 cols on mobile, 4 on sm */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {specs.map(({ icon: Icon, label, value, color }) => (
                      <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                        <Icon size={13} style={{ color }} className="mb-1" />
                        <div className="text-[9px] uppercase font-black text-slate-400 tracking-wider leading-none">{label}</div>
                        <div className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-0.5 leading-snug">{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* CTAs – stacked on mobile, side-by-side on sm */}
                  <div className="flex flex-col xs:flex-row sm:flex-row gap-2 pt-0.5">
                    <Link
                      href={rfqUrl}
                      onClick={close}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-white font-extrabold rounded-xl transition-all text-[11px] uppercase tracking-wider shadow-md group min-h-[44px]"
                      style={{ background: 'linear-gradient(135deg,#0E6B45 0%,#0B5537 100%)' }}
                    >
                      <Zap size={12} className="fill-white shrink-0" />
                      Pre-Book Kinnow 2027
                      <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </Link>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={close}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 font-extrabold rounded-xl transition-all text-[11px] uppercase tracking-wider shadow-sm border text-white min-h-[44px]"
                      style={{ background: 'linear-gradient(135deg,#F47A16 0%,#D96A10 100%)', borderColor: 'rgba(244,122,22,0.3)' }}
                    >
                      <MessageSquare size={12} className="shrink-0" />
                      WhatsApp
                    </a>
                  </div>

                  {/* Dismiss row */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={close}
                      className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors font-semibold min-h-[44px] px-2"
                    >
                      Maybe later
                    </button>
                    <span className="text-slate-200 select-none">·</span>
                    <button
                      onClick={closeForever}
                      className="text-[10px] text-slate-400 hover:text-red-500 transition-colors font-semibold min-h-[44px] px-2"
                    >
                      Don&apos;t show again
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
