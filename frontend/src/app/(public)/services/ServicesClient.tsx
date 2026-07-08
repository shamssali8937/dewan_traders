'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, FileText, Truck, Globe, CheckCircle, Package, Shield, BarChart3, Headphones, DollarSign, Sparkles } from 'lucide-react';

const services = [
  {
    icon: Package,
    title: 'Sourcing at Origin',
    desc: 'Managing consolidation of crop harvests, grain packaging, and surgical tool production directly at certified regional sources.',
    features: ['Direct farm-to-packhouse routes', 'Lab moisture assay checks', 'Target specification checks', 'Origin audit matrices'],
    bgStyle: 'bg-emerald-50/40 border-emerald-100/50 hover:bg-emerald-50 text-emerald-700',
  },
  {
    icon: FileText,
    title: 'Document Operations & Clearance',
    desc: 'Handling of all phytosanitary documentation, certificate of origin, billing and customs clearances.',
    features: ['Phytosanitary Certificates', 'Lab Test Certifications', 'Customs Bill of Lading (B/L)', 'L/C transaction clearing'],
    bgStyle: 'bg-emerald-50/40 border-emerald-100/50 hover:bg-emerald-50 text-emerald-700',
  },
  {
    icon: Truck,
    title: 'Cold-Chain Container Logistics',
    desc: 'Sea and air freight cargo allocations via Karachi Port inside controlled-temperature reefer boxes.',
    features: ['Temperature log validation', 'Karachi customs clearing', 'FOB/CIF port logistics contracts', 'FCL/LCL dispatch schedules'],
    bgStyle: 'bg-blue-50/40 border-blue-100/50 hover:bg-blue-50 text-blue-700',
  },
  {
    icon: Shield,
    title: 'Pre-Shipment Inspections',
    desc: 'Detailed quality inspections during harvesting, sorting, washing, and packaging stages to guarantee contract compliance.',
    features: ['Pre-loading inspection audits', 'SGS quality assays coordination', 'Pesticide residual checks', 'Packaging stress analysis'],
    bgStyle: 'bg-blue-50/40 border-blue-100/50 hover:bg-blue-50 text-blue-700',
  },
  {
    icon: BarChart3,
    title: 'Market Pricing Intel',
    desc: 'Providing market forecasts, crop yield analyses, and production indexes for seasonal commodities.',
    features: ['Price index forecasts', 'Orchard yield reports', 'Freight cost indexes', 'Trade tariff briefings'],
    bgStyle: 'bg-orange-50/40 border-orange-100/50 hover:bg-orange-50 text-orange-700',
  },
  {
    icon: Headphones,
    title: 'Trade Desk Support',
    desc: 'Assigned account coordinators handling shipping manifests, container milestones, and payment processing queries.',
    features: ['24/7 direct WhatsApp chat', 'Vessel transit tracking logs', 'Unified invoicing sheets', 'Customer feedback channels'],
    bgStyle: 'bg-emerald-50/40 border-emerald-100/50 hover:bg-emerald-50 text-emerald-700',
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-[#fafbf9] min-h-screen pt-24 relative overflow-hidden pattern-dots-light">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-emerald-100/10 w-[500px] h-[500px] top-[10%] right-[-100px]" />
      </div>

      {/* ═══ HERO SECTION ═══════════════════════════════════════════ */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center space-y-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="text-primary text-[10px] uppercase font-black tracking-[0.2em] flex items-center justify-center gap-1.5 mb-2">
              <Sparkles size={12} /> B2B Sourcing Frameworks
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
              Export Sourcing <span className="gradient-text-sky">Services</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed font-medium">
              Dewan Traders manages the complete procurement, quality verification, compliance, and shipping cycle from origin to delivery port.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ SERVICES GRID ═════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc, features, bgStyle }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className={`glass rounded-3xl p-6.5 border bg-white flex flex-col justify-between shadow-sm card-hover ${bgStyle}`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center mb-5 text-primary shadow-sm">
                  <Icon size={18} />
                </div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide mb-2">{title}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-6 font-medium">{desc}</p>
              </div>
              <ul className="space-y-2 border-t border-slate-100 pt-4 mt-2">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[10px] text-slate-600 font-bold">
                    <CheckCircle size={12} className="text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Workflow timeline */}
        <div className="mt-28 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">Export Workflow Steps</h2>
          <p className="text-slate-500 text-xs max-w-sm mx-auto font-medium">Our structured cargo management steps guarantee contract specification execution.</p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            {[
              { step: '01', title: 'Submit RFQ', desc: 'Specify grade, target size, and discharge port.', icon: FileText },
              { step: '02', title: 'Get Quote', desc: 'FOB/CIF price sheets and samples.', icon: DollarSign },
              { step: '03', title: 'Consolidation', desc: 'Contract sealing, packaging, audits.', icon: CheckCircle },
              { step: '04', title: 'Customs Transit', desc: 'Plant health certificates, shipping departure.', icon: Truck },
            ].map(({ step, title, desc, icon: IconComponent }) => (
              <div
                key={step}
                className="glass rounded-3xl p-6 border border-slate-200/60 bg-white flex flex-col items-center card-hover shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-primary flex items-center justify-center mb-4">
                  <IconComponent size={18} />
                </div>
                <div className="text-[9px] text-primary font-black uppercase tracking-widest mb-1.5">Step {step}</div>
                <h3 className="text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">{title}</h3>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link href="/quote" className="inline-flex items-center gap-2 px-7 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white font-extrabold rounded-xl transition-all shadow-md shadow-primary/10 text-xs uppercase tracking-wider">
            Start Sourcing Project <ArrowRight size={14} />
          </Link>
        </div>
      </div>

    </div>
  );
}
