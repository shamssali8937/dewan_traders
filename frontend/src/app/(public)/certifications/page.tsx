'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Award, ShieldCheck, FileCheck, Bookmark, BookOpen } from 'lucide-react';

const certs = [
  {
    title: 'ISO 9001:2015 Certification',
    issuer: 'SGS International auditing body',
    scope: 'Quality management systems covering sourcing, warehousing, cleaning, grading, packaging, and export shipment of commodities and goods.',
    purpose: 'Assures global B2B clients that Dewan Traders operates under standardized, audited corporate workflows.',
    icon: ShieldCheck,
    bgStyle: 'bg-sky-50/50 border-sky-100',
  },
  {
    title: 'HACCP Compliance (Hazard Analysis Critical Control Point)',
    issuer: 'Food Safety Standards Authority',
    scope: 'Audit clearance for fresh citrus sorting, basmati grain polishing, potato washing, and cold storage packhouses.',
    purpose: 'Guarantees all fresh produce exports (Kinnow Mandarin, Mangoes, Onions) are free from microbiological hazards and chemical contaminants.',
    icon: Award,
    bgStyle: 'bg-emerald-50/50 border-emerald-100',
  },
  {
    title: 'Phytosanitary Certification & Health Declarations',
    issuer: 'Department of Plant Protection, Govt. of Pakistan',
    scope: 'Mandatory pre-shipment health certificate verifying plant health, fumigation parameters, and compliance with importing country quarantine rules.',
    purpose: 'Enables quick quarantine customs clearing at ports in the GCC, European Union, and ASEAN.',
    icon: FileCheck,
    bgStyle: 'bg-orange-50/50 border-orange-100',
  },
  {
    title: 'CE Mark Compliance',
    issuer: 'European Medical Device Standards Audit',
    scope: 'Conformity assessment for steel medical, dental, and veterinary instruments manufactured at Sialkot factories.',
    purpose: 'Validates that our surgical line meets European health, safety, and environmental protection guidelines.',
    icon: Bookmark,
    bgStyle: 'bg-indigo-50/50 border-indigo-100',
  },
  {
    title: 'FDA Registration',
    issuer: 'Food and Drug Administration (USA)',
    scope: 'Facility registration for packing, grading, and exporting processed food grains and steel tools.',
    purpose: 'Enables compliant imports of Basmati rice and surgical utensils directly into the United States of America.',
    icon: FileCheck,
    bgStyle: 'bg-rose-50/50 border-rose-100',
  },
];

export default function CertificationsPage() {
  return (
    <div className="bg-white min-h-screen pt-24 relative overflow-hidden pattern-dots-light">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-rose-50 w-[400px] h-[400px] top-[10%] right-[-100px]" />
      </div>

      {/* ═══ HERO SECTION ═══════════════════════════════════════════ */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 mb-2">
              <Award size={12} /> Quality Assurance
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
              Compliance & <span className="gradient-text-sky">Certifications</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed">
              Dewan Traders operates under verified international safety and metallurgical standards.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ CERTIFICATIONS GRID ═══════════════════════════════════ */}
      <section className="py-12 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {certs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={`glass rounded-3xl p-6 border bg-white/80 flex gap-5 items-start card-hover ${item.bgStyle}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 text-primary flex items-center justify-center shrink-0 shadow-sm">
                    <Icon size={16} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{item.title}</h3>
                    <div className="text-[10px] text-primary font-bold">Auditing Authority: {item.issuer}</div>
                    
                    <div className="space-y-1">
                      <div className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Scope of Inspection</div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{item.scope}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Export Purpose</div>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-semibold italic">{item.purpose}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Verification Box */}
          <div className="glass rounded-3xl p-8 border border-slate-100 bg-slate-50 max-w-4xl mx-auto grid md:grid-cols-3 gap-6 items-center shadow-sm animate-pulse">
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wide flex items-center gap-1.5">
                <BookOpen size={16} className="text-primary" /> Certificate Sighting & Copies
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Before initiating shipping contracts, B2B buyers can request attested scanned copies of our ISO certificates, CE Mark declarations, and FDA filings.
              </p>
            </div>
            <div className="text-right">
              <Link href="/contact" className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-sky-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-primary/10">
                Request Scans &rarr;
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
