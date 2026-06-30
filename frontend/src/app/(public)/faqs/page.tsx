'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronRight, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const faqCategories = [
  {
    category: 'Sourcing & Commodities Ordering',
    items: [
      { q: 'What is the Minimum Order Quantity (MOQ) for imports?', a: 'MOQs vary by product category. Fresh produce (citrus, mangoes) is typically transacted with a minimum of 10-25 Metric Tons (one refrigerated 40ft container). Surgical sets and sports goods can be dispatched in smaller LCL air-freight volumes.' },
      { q: 'Do you offer private labeling or custom brand packing?', a: 'Yes. We provide complete OEM private label printing and packaging models for Basmati rice sacks, surgical instrument boxes, and sports items matching your domestic store requirements.' },
      { q: 'Are product samples available before full order confirmation?', a: 'Yes. We dispatch sample cartons of citrus, Basmati rice packets, or sample surgical tools via DHL/FedEx to verified importers for laboratory sighting and compliance checks.' },
    ]
  },
  {
    category: 'Compliance & Quality Control',
    items: [
      { q: 'How does Dewan Traders check for quarantine standards?', a: 'Fresh produce runs through dedicated packhouse washing, anti-fungal treatment, wax coatings, and cold storage before loading. Pre-shipment checks are performed by the Department of Plant Protection, Pakistan, issuing health certs matching EU, GCC, and US entry rules.' },
      { q: 'Is there laboratory testing for chemical pesticide residues?', a: 'Yes. We utilize accredited labs (such as SGS or government inspection blocks) to run chemical assays, pesticide residue checks, and heavy metal testing, matching import regulations.' },
      { q: 'What standard of steel is used for surgical tools?', a: 'All instruments are forged using AISI 410, 420, or 316-grade medical stainless steel, assuring corrosion resistance, autoclave compatibility, and strength.' },
    ]
  },
  {
    category: 'Logistics, Port Clearance & Documents',
    items: [
      { q: 'What ports do you ship from in Pakistan?', a: 'Ocean cargo is cleared and dispatched from Karachi Port (KP) or Port Qasim (PQ) in Karachi, Pakistan. Air freight is consolidated from Islamabad, Sialkot, or Lahore airports.' },
      { q: 'What trade documents are provided with ocean shipments?', a: 'Standard document packages include: clean Shipped on Board Bill of Lading (B/L), Commercial Invoice, detailed Packing List, Certificate of Origin (COO), Phytosanitary (Health) Certificate, and laboratory test reports.' },
      { q: 'What shipping terms do you support?', a: 'We support standard Incoterms including Free On Board (FOB) Karachi, Cost and Freight (CFR), and Cost, Insurance, and Freight (CIF) to your designated destination port.' },
    ]
  },
];

export default function FaqsPage() {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  return (
    <div className="bg-white min-h-screen pt-24 relative overflow-hidden pattern-dots-light">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-50 w-[400px] h-[400px] top-[15%] left-[-100px]" />
      </div>

      {/* ═══ HERO SECTION ═══════════════════════════════════════════ */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 mb-2">
              <HelpCircle size={12} /> Help Center
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
              Frequently Asked <span className="gradient-text-sky">Questions</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed">
              Find answers regarding export compliance, minimum order weights, port logistics, and contract payments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ FAQS LISTING ═══════════════════════════════════════════ */}
      <section className="py-12 pb-24 relative z-10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-12">
          
          {faqCategories.map((cat, catIdx) => (
            <div key={cat.category} className="space-y-4">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                {cat.category}
              </h2>
              
              <div className="space-y-3">
                {cat.items.map((item, itemIdx) => {
                  const itemKey = `${catIdx}-${itemIdx}`;
                  const isOpen = activeFaq === itemKey;
                  return (
                    <div key={item.q} className="glass rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-sm">
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : itemKey)}
                        className="w-full text-left p-5 text-xs font-bold text-slate-800 flex justify-between items-center hover:bg-slate-50 transition-all font-sans"
                      >
                        {item.q}
                        <ChevronRight size={14} className={`text-primary transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                      </button>
                      
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-5 pb-5 pt-1 text-[11px] text-slate-500 leading-relaxed border-t border-slate-50">
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Contact support box */}
          <div className="glass rounded-3xl p-8 border border-slate-100 text-center bg-slate-50/70 shadow-sm">
            <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
              <MessageSquare size={16} className="text-primary" /> Still have questions?
            </h3>
            <p className="text-slate-500 text-xs mb-6 max-w-sm mx-auto leading-relaxed">
              Our trade operations officers are available 24/7 via WhatsApp and email to resolve queries.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/contact" className="px-6 py-3 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-primary/10">
                Send Direct Message <ArrowRight size={12} className="inline ml-1" />
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
