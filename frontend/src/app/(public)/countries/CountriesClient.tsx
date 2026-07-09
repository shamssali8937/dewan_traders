'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Globe, Anchor, Clock, Ship, ShieldCheck } from 'lucide-react';

const destinations = [
  {
    region: 'GCC & Middle East',
    countries: ['Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain', 'Oman'],
    ports: ['Jeddah Islamic Port', 'Port Rashid (Dubai)', 'Hamad Port (Doha)', 'Shuwaikh Port (Kuwait)'],
    transit: '4 - 7 Days (Direct Ocean Cargo)',
    share: 45,
    commodities: ['Fresh Kinnow Mandarin', 'Super Kernel Basmati Rice', 'Potatoes & Onions'],
    bgStyle: 'bg-orange-50/50 border-orange-100',
  },
  {
    region: 'European Union & United Kingdom',
    countries: ['United Kingdom', 'Netherlands', 'Germany', 'Italy', 'France', 'Poland'],
    ports: ['London Gateway (UK)', 'Port of Rotterdam (NL)', 'Port of Hamburg (DE)', 'Port of Genoa (IT)'],
    transit: '20 - 24 Days (Controlled Atmosphere Reefer)',
    share: 25,
    commodities: ['Surgical Instruments', 'Thermo Bonded Footballs', 'Chaunsa Mangoes'],
    bgStyle: 'bg-sky-50/50 border-sky-100',
  },
  {
    region: 'Southeast Asia & ASEAN',
    countries: ['Singapore', 'Malaysia', 'Indonesia', 'Vietnam', 'Philippines'],
    ports: ['Port of Singapore', 'Port Klang (MY)', 'Tanjung Priok (ID)', 'Haiphong Port (VN)'],
    transit: '10 - 14 Days (Reefer & Dry Freight)',
    share: 18,
    commodities: ['Super Kernel Basmati Rice', 'Citrus, Potatoes', 'Sports Gear'],
    bgStyle: 'bg-indigo-50/50 border-indigo-100',
  },
  {
    region: 'Central Asia & Russian Federation',
    countries: ['Russian Federation', 'Kazakhstan', 'Uzbekistan', 'Azerbaijan'],
    ports: ['Port of Novorossiysk', 'St. Petersburg Port', 'Land-route custom gates'],
    transit: '15 - 20 Days (Land & Sea multimodal)',
    share: 12,
    commodities: ['Fresh Fruits (Kinnow)', 'Sports Goods', 'Surgical Utensils'],
    bgStyle: 'bg-rose-50/50 border-rose-100',
  },
];

export default function CountriesPage() {
  return (
    <div className="bg-white min-h-screen pt-24 relative overflow-hidden pattern-dots-light">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-teal-50 w-[400px] h-[400px] top-[20%] left-[-100px]" />
      </div>

      {/* ═══ HERO SECTION ═══════════════════════════════════════════ */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 mb-2">
              <Globe size={12} /> Global Trade Network
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
              Countries We <span className="gradient-text-sky">Export To</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed">
              Dewan Traders operates reliable cold-chain and dry cargo logistics reaching terminal hubs across five continents.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ DESTINATIONS SECTION ═══════════════════════════════════ */}
      <section className="py-12 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {destinations.map((item, idx) => (
              <motion.div
                key={item.region}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`glass rounded-3xl p-6 border bg-white/80 flex flex-col justify-between card-hover ${item.bgStyle}`}
              >
                {/* Content */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{item.region}</h3>
                    <span className="text-[9px] font-black text-primary font-mono bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm">
                      SHARE: {item.share}%
                    </span>
                  </div>

                  <p className="text-slate-600 text-[9px] uppercase tracking-widest font-bold mb-2">Covered Territories</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {item.countries.map((country) => (
                      <span key={country} className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-full font-semibold shadow-sm">
                        {country}
                      </span>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="space-y-4 border-t border-slate-100 pt-4">
                    <div className="flex gap-3.5 items-start">
                      <Anchor size={14} className="text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Standard Discharge Ports</div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{item.ports.join(', ')}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3.5 items-start">
                      <Clock size={14} className="text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Average Transit Lead-Time</div>
                        <p className="text-[11px] text-slate-700 mt-1 font-bold">{item.transit}</p>
                      </div>
                    </div>

                    <div className="flex gap-3.5 items-start">
                      <Ship size={14} className="text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Key Sourced Lines</div>
                        <p className="text-[11px] text-slate-600 mt-1 font-semibold italic">{item.commodities.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-6">
                  <div className="h-full bg-gradient-to-r from-primary to-sky-600 rounded-full" style={{ width: `${item.share}%` }} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sourcing CTA Card */}
          <div className="mt-20 glass rounded-3xl p-8 border border-slate-100 text-center bg-slate-50 max-w-4xl mx-auto shadow-sm">
            <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wide mb-3">Freight & Shipping Lanes Consultation</h3>
            <p className="text-slate-500 text-xs mb-6 max-w-sm mx-auto leading-relaxed">
              We offer both Free On Board (FOB) Karachi and Cost, Insurance, and Freight (CIF) port clearance programs.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/quote" className="px-6 py-3 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-primary/10">
                Check Custom Transit Rates
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
