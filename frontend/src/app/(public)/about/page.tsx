'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Users, Target, Heart, Globe, Leaf, Package, Shield, Award, Sparkles, Building2 } from 'lucide-react';

const timeline = [
  { year: '2005', title: 'Founded', desc: 'Dewan Traders established in Sargodha, Punjab, initiating premium local Kinnow consolidation.' },
  { year: '2009', title: 'GCC Export Cargo', desc: 'Began custom shipping citrus harvests directly to UAE and Saudi Arabia importing lanes.' },
  { year: '2013', title: 'Surgical Instrument Forging', desc: 'Launched medical-grade instrument engineering loops in Sialkot, Punjab.' },
  { year: '2016', title: 'Sports Division Launch', desc: 'Partnered with Sialkot manufacturers to supply sports goods internationally.' },
  { year: '2021', title: 'Basmati Rice Expansion', desc: 'Expanded into aged long-grain basmati export routes from elite Punjab rice mills.' },
  { year: '2025', title: 'Digital Sourcing Hub', desc: 'Deployed interactive procurement and RFQ engines serving global distribution channels.' },
];

const values = [
  { icon: Shield, title: 'Compliance & Safety', desc: 'All agricultural lines run under strict HACCP and phytosanitary clearance.' },
  { icon: Heart, title: 'Fiduciary Integrity', desc: 'Forging transparent B2B relationships based on exact contract execution.' },
  { icon: Globe, title: 'Global Port Reach', desc: 'Managing customs clearance, port loading, and logistics from Karachi Port.' },
  { icon: Leaf, title: 'Sustainable Harvests', desc: 'Procuring from orchards adhering to sustainable farming and fair labor.' },
];

const team = [
  { name: 'Sajjad Hussain Awan', role: 'CEO & Founder', image: '/images/owner_sajjad.png', bio: 'Over two decades of international trade operations and supply management experience.' },
  { name: 'Ahmed Dewan', role: 'Director of Trade Operations', bio: 'Specializes in Middle East and EU customs compliance and shipping lane clearance.' },
  { name: 'Fatima Malik', role: 'Lead Quality Auditor', bio: 'Coordinates phytosanitary compliance and laboratory metal checks for surgical lines.' },
  { name: 'Usman Tariq', role: 'Director of Logistics', bio: 'Handles terminal scheduling, container packing, and global freight forwarding.' },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen pt-24 relative overflow-hidden pattern-dots-light">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-100 w-[400px] h-[400px] top-[10%] left-[5%]" />
        <div className="fluid-blob bg-indigo-50 w-[500px] h-[500px] bottom-[20%] right-[-100px]" />
      </div>

      {/* ═══ HERO SECTION ═══════════════════════════════════════════ */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="text-primary text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 mb-2.5">
              <Sparkles size={12} /> Sourcing Agency Profile
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight mb-6">
              World-Class Trade, <br />
              <span className="gradient-text-sky">Founded in Pakistan</span>
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-2xl">
              Dewan Traders is a premier Pakistani import-export enterprise. Guided by **Sajjad Hussain Awan**, we coordinate sourcing, safety compliance, packaging, and shipping transit loops for commodity and industrial accounts globally.
            </p>
            
            <div className="flex gap-8 border-t border-slate-100 pt-6">
              <div>
                <div className="text-2xl font-black text-primary">35+</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Markets Served</div>
              </div>
              <div className="w-px bg-slate-100" />
              <div>
                <div className="text-2xl font-black text-primary">200+</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">B2B Clients</div>
              </div>
              <div className="w-px bg-slate-100" />
              <div>
                <div className="text-2xl font-black text-primary">20+</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Years Legacy</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ VALUES SECTION ════════════════════════════════════════ */}
      <section className="py-20 border-t border-b border-slate-100 bg-slate-50/50 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-primary text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5">
                <Target size={12} /> Strategic Principles
              </span>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">Our Sourcing Mission</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                We believe in simplifying global sourcing by managing quality verification at origin. We partner with Punjab growers and Sialkot manufacturers to ensure bulk cargos conform exactly to contract terms.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Under ISO 9001, CE Mark, and HACCP compliance auditing models, Dewan Traders coordinates complete supply security.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="glass rounded-2xl p-5 border border-slate-100 bg-white">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-100 text-primary flex items-center justify-center mb-4">
                    <Icon size={16} />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wide">{title}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CHRONOLOGICAL TIMELINE ════════════════════════════════ */}
      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary text-[10px] uppercase font-bold tracking-widest">Chronology</span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">Our Growth Journey</h2>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-sky-300 to-transparent" />
            
            <div className="space-y-8">
              {timeline.map((item, idx) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="flex gap-6 pl-16 relative"
                >
                  {/* Timeline Node */}
                  <div className="absolute left-4 w-8 h-8 rounded-xl bg-white border border-primary text-primary flex items-center justify-center -translate-x-1/2 text-[10px] font-black font-mono shadow-sm">
                    {item.year}
                  </div>
                  
                  {/* Timeline Card */}
                  <div className="glass rounded-2xl p-5 flex-1 bg-white/70 border border-slate-100 card-hover">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">{item.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ EXECUTIVE OFFICE ═════════════════════════════════════ */}
      <section className="py-24 border-t border-b border-slate-100 bg-slate-50/50 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-1.5">
              <Building2 size={12} /> Corporate Governance
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">Executive Leadership</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="glass rounded-3xl p-6 text-center card-hover border border-slate-100 bg-white flex flex-col items-center">
                {/* Profile Image Frame */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden mb-5 border border-slate-100 shadow-sm relative bg-slate-50">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-lg font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                
                <h3 className="text-xs font-bold text-slate-800 tracking-wide">{member.name}</h3>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-100 text-primary text-[9px] uppercase font-bold tracking-widest mt-2">
                  {member.role}
                </div>
                <p className="text-[10px] text-slate-400 mt-4 leading-relaxed flex-1">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══════════════════════════════════════════ */}
      <section className="py-24 relative z-10">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Initiate Export Coordination</h2>
          <p className="text-slate-500 text-xs leading-relaxed max-w-lg mx-auto">
            Ready to secure a direct contract? Submit your target specifications or inquire about regional dealership alignments.
          </p>
          <div className="flex gap-4 justify-center pt-2">
            <Link href="/partner" className="px-6 py-3 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-primary/10">
              Distributor Program
            </Link>
            <Link href="/catalog" className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all text-xs uppercase tracking-wider">
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
