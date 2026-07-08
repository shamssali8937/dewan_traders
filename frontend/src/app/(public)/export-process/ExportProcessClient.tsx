'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, FileText, CheckCircle, ShieldCheck, Truck, Sparkles, Award } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'RFQ & Specification Alignment',
    desc: 'The buyer submits a formal Request for Quotation (RFQ) with exact specifications, target quantities, certification needs, packaging criteria, and delivery terms (FOB/CIF). We issue quotes, arrange sample packages, and align on payment conditions (LC/TT).',
    details: ['Contract specifications definition', 'FOB/CIF shipping lanes alignment', 'Sample analysis verification', 'Proforma Invoice confirmation'],
    icon: FileText,
    bgStyle: 'bg-orange-50/50 border-orange-100',
  },
  {
    step: '02',
    title: 'Precision Sourcing & Harvesting',
    desc: 'Our sourcing team operates directly at origin. Fresh produce is harvested at the precise color index, aged grain blocks are tested for moisture thresholds, and surgical instruments undergo stainless steel metallurgical inspections.',
    details: ['Direct farm supervision', 'Raw grain moisture checks', 'AISI steel hardness testing', 'Initial crop sorting checks'],
    icon: Sparkles,
    bgStyle: 'bg-indigo-50/50 border-indigo-100',
  },
  {
    step: '03',
    title: 'Sorting, Grading & Packhouse Packing',
    desc: 'Products are transported to temperature-controlled packhouses. Fruits are washed, treated, waxed, and size-graded. Grains are polished and sorted via laser color sorters. Instruments are hand-polished, stamped, and clinically packed.',
    details: ['Washing and anti-fungal treatments', 'Laser sort grain grading', 'Sterile packaging assembly', 'Vessel box container packaging'],
    icon: Award,
    bgStyle: 'bg-sky-50/50 border-sky-100',
  },
  {
    step: '04',
    title: 'Phytosanitary Clearance & Port Loading',
    desc: 'We compile import-export documentation, coordinate phytosanitary health inspections, clear customs at Karachi Port, and seal cargo inside refrigerated or dry containers for ocean transit.',
    details: ['Government phytosanitary clearing', 'Bill of Lading issuance', 'Reefer temperature log sealing', 'Ocean vessel departure tracking'],
    icon: Truck,
    bgStyle: 'bg-rose-50/50 border-rose-100',
  },
];

export default function ExportProcessPage() {
  return (
    <div className="bg-white min-h-screen pt-24 relative overflow-hidden pattern-dots-light">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-50 w-[400px] h-[400px] top-[15%] right-[-100px]" />
      </div>

      {/* ═══ HERO SECTION ═══════════════════════════════════════════ */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 mb-2">
              <ShieldCheck size={12} /> Sourcing Timeline
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
              The Sourcing & <span className="gradient-text-sky">Export Process</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed">
              Dewan Traders operates a transparent, secure, and compliant logistics flow from Sargodha and Sialkot factories to destination ports.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ TIMELINE COMPONENT ════════════════════════════════════ */}
      <section className="py-12 pb-24 relative z-10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-sky-300 to-transparent" />
            
            <div className="space-y-12">
              {steps.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="flex gap-6 pl-16 relative group"
                  >
                    {/* Node Icon */}
                    <div className="absolute left-4 w-9 h-9 rounded-xl bg-white border border-slate-200 text-primary flex items-center justify-center -translate-x-1/2 shadow-sm group-hover:border-primary transition-colors">
                      <Icon size={16} />
                    </div>

                    {/* Step Card */}
                    <div className={`glass rounded-2xl p-6 border bg-white/80 card-hover flex-1 ${item.bgStyle}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-primary font-black font-mono tracking-widest bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm">
                          STAGE {item.step}
                        </span>
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{item.title}</h3>
                      </div>
                      
                      <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                        {item.desc}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-100 pt-4 mt-4">
                        {item.details.map((detail) => (
                          <div key={detail} className="flex items-center gap-2 text-[10px] text-slate-600 font-semibold">
                            <CheckCircle size={12} className="text-primary shrink-0" />
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sourcing CTA Card */}
          <div className="mt-20 glass rounded-3xl p-8 border border-slate-100 text-center bg-slate-50 max-w-4xl mx-auto shadow-sm">
            <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wide mb-3">Initiate Sourcing Verification</h3>
            <p className="text-slate-500 text-xs mb-6 max-w-sm mx-auto leading-relaxed">
              Have specific compliance parameters or packaging standards for citrus, grains, or instruments? Connect directly with our clearing officers.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/quote" className="px-6 py-3 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-primary/10">
                Submit RFQ Details
              </Link>
              <Link href="/contact" className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all text-xs uppercase tracking-wider">
                Talk to Trade Desk
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
