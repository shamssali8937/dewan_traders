'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ChevronDown, Phone, Mail, Globe, ArrowRight, User, Settings, LogOut, Package, ClipboardList, Bell, Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  region: 'PK' | 'INT';
  setRegion: (region: 'PK' | 'INT') => void;
  user: any;
  isAuthenticated: boolean;
  logout: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  onOpenSearch,
  region,
  setRegion,
  user,
  isAuthenticated,
  logout
}: MobileMenuProps) {
  const pathname = usePathname();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.25,
        ease: 'easeInOut'
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: 'easeOut',
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    }
  } as const;

  const itemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 }
  } as const;

  const productsList = [
    { label: 'Fresh Fruits', href: '/catalog/fruits', desc: 'Premium citrus, mangoes and seasonal fruits.' },
    { label: 'Vegetables', href: '/catalog/vegetables', desc: 'High dry-matter potatoes, red onions and garlic.' },
    { label: 'Premium Rice', href: '/catalog/rice', desc: 'Aged fragrant Basmati and double-polished Sella.' },
    { label: 'Sports Goods', href: '/catalog/sports', desc: 'Sialkot thermo-bonded match footballs and willow bats.' },
    { label: 'Surgical Instruments', href: '/catalog/surgical', desc: 'Medical-grade ISO certified surgical scissors and forceps.' },
  ];

  const servicesList = [
    { label: 'Import Services', href: '/services#import', desc: 'B2B sourcing pipelines into Pakistan.' },
    { label: 'Export Services', href: '/services#export', desc: 'Global compliance and packhouse consolidation.' },
    { label: 'Global Logistics', href: '/services#logistics', desc: 'FCL & LCL dry/reefer container tracking.' },
    { label: 'Customs Documentation', href: '/services#customs', desc: 'Plant Protection Phytosanitary clearances & ISO.' },
    { label: 'Packaging Solutions', href: '/services#packaging', desc: 'Transit wood packaging heat treatments.' },
    { label: 'Warehousing', href: '/services#warehousing', desc: 'Cold storage facilities in Sargodha & Sialkot.' },
  ];

  const resourcesList = [
    { label: 'Blog / Export Journal', href: '/journal' },
    { label: 'FAQs Portal', href: '/faqs' },
    { label: 'Certifications (SGS, ISO)', href: '/certifications' },
    { label: 'Media Gallery', href: '/gallery' },
    { label: 'Download catalog PDF', href: '/catalog' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          className="fixed inset-0 z-40 bg-slate-900/98 backdrop-blur-2xl text-white flex flex-col pt-24 overflow-y-auto px-6 pb-10"
        >
          {/* Mobile Search Pill */}
          <motion.div variants={itemVariants} className="mb-6">
            <button
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-semibold text-white/50"
            >
              <span className="flex items-center gap-2">
                <Search size={14} className="text-white/40" />
                Search commodities...
              </span>
              <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-white/60">Tap</span>
            </button>
          </motion.div>

          {/* Navigation Accordions */}
          <div className="space-y-4 flex-1">
            {/* Simple Home Link */}
            <motion.div variants={itemVariants} className="border-b border-white/5 pb-2.5">
              <Link
                href="/"
                onClick={onClose}
                className={`text-sm font-bold tracking-wide uppercase flex items-center justify-between ${pathname === '/' ? 'text-primary' : 'text-white'}`}
              >
                Home
                <ArrowRight size={14} className="opacity-30" />
              </Link>
            </motion.div>

            {/* Products Accordion */}
            <motion.div variants={itemVariants} className="border-b border-white/5 pb-2.5">
              <button
                onClick={() => toggleSection('products')}
                className="w-full flex items-center justify-between text-sm font-bold tracking-wide uppercase text-white"
              >
                Products
                <ChevronDown size={14} className={`transition-transform duration-200 ${expandedSection === 'products' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedSection === 'products' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-3 pl-3 space-y-3"
                  >
                    {productsList.map((p) => (
                      <Link
                        key={p.href}
                        href={p.href}
                        onClick={onClose}
                        className="block group"
                      >
                        <div className="text-xs font-black text-white/90 group-hover:text-primary transition-colors">{p.label}</div>
                        <div className="text-[10px] text-white/45 mt-0.5">{p.desc}</div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Services Accordion */}
            <motion.div variants={itemVariants} className="border-b border-white/5 pb-2.5">
              <button
                onClick={() => toggleSection('services')}
                className="w-full flex items-center justify-between text-sm font-bold tracking-wide uppercase text-white"
              >
                Services
                <ChevronDown size={14} className={`transition-transform duration-200 ${expandedSection === 'services' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedSection === 'services' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-3 pl-3 space-y-3"
                  >
                    {servicesList.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        onClick={onClose}
                        className="block group"
                      >
                        <div className="text-xs font-black text-white/90 group-hover:text-primary transition-colors">{s.label}</div>
                        <div className="text-[10px] text-white/45 mt-0.5">{s.desc}</div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Resources Accordion */}
            <motion.div variants={itemVariants} className="border-b border-white/5 pb-2.5">
              <button
                onClick={() => toggleSection('resources')}
                className="w-full flex items-center justify-between text-sm font-bold tracking-wide uppercase text-white"
              >
                Resources
                <ChevronDown size={14} className={`transition-transform duration-200 ${expandedSection === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedSection === 'resources' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-3 pl-3 space-y-3.5"
                  >
                    {resourcesList.map((r) => (
                      <Link
                        key={r.href}
                        href={r.href}
                        onClick={onClose}
                        className="block text-xs font-bold text-white/80 hover:text-primary transition-colors"
                      >
                        {r.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* About Link */}
            <motion.div variants={itemVariants} className="border-b border-white/5 pb-2.5">
              <Link
                href="/about"
                onClick={onClose}
                className={`text-sm font-bold tracking-wide uppercase flex items-center justify-between ${pathname === '/about' ? 'text-primary' : 'text-white'}`}
              >
                About Us
                <ArrowRight size={14} className="opacity-30" />
              </Link>
            </motion.div>

            {/* Track Cargo Link */}
            <motion.div variants={itemVariants} className="border-b border-white/5 pb-2.5">
              <Link
                href="/track"
                onClick={onClose}
                className={`text-sm font-bold tracking-wide uppercase flex items-center justify-between ${pathname === '/track' ? 'text-primary' : 'text-white'}`}
              >
                Track Cargo
                <ArrowRight size={14} className="opacity-30" />
              </Link>
            </motion.div>

            {/* Contact Link */}
            <motion.div variants={itemVariants} className="border-b border-white/5 pb-2.5">
              <Link
                href="/contact"
                onClick={onClose}
                className={`text-sm font-bold tracking-wide uppercase flex items-center justify-between ${pathname === '/contact' ? 'text-primary' : 'text-white'}`}
              >
                Contact
                <ArrowRight size={14} className="opacity-30" />
              </Link>
            </motion.div>
          </div>

          {/* User Account / Profile Actions */}
          {isAuthenticated && user ? (
            <motion.div variants={itemVariants} className="mt-8 border-t border-white/10 pt-6 space-y-3 bg-white/5 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-black text-sm uppercase text-white shadow-inner">
                  {user.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">{user.name}</div>
                  <div className="text-[10px] text-white/50 truncate">{user.email}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold mt-2">
                <Link
                  href={user.role === 'admin' || user.role === 'manager' ? '/admin' : '/user'}
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10"
                >
                  <User size={12} className="text-primary" /> Dashboard
                </Link>
                <Link
                  href={user.role === 'admin' || user.role === 'manager' ? '/admin/orders' : '/user/orders'}
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10"
                >
                  <Package size={12} className="text-primary" /> Orders
                </Link>
              </div>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-red-500/20 transition-all"
              >
                <LogOut size={12} /> Log Out
              </button>
            </motion.div>
          ) : (
            <motion.div variants={itemVariants} className="mt-8 grid grid-cols-2 gap-3.5 border-t border-white/10 pt-6">
              <Link
                href="/auth/login"
                onClick={onClose}
                className="py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold text-center transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/quote"
                onClick={onClose}
                className="py-3.5 bg-primary text-white hover:bg-primary-hover rounded-2xl text-xs font-black text-center shadow-lg shadow-primary/10 transition-all uppercase tracking-wide"
              >
                Get Quote
              </Link>
            </motion.div>
          )}

          {/* Bottom Region / Currency selectors */}
          <motion.div variants={itemVariants} className="mt-8 space-y-4 text-xs font-semibold text-white/70 border-t border-white/5 pt-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-white/50">
                <Globe size={14} className="text-primary" /> Market Experience
              </span>
              <div className="flex gap-1.5 bg-white/5 p-0.5 rounded-xl border border-white/10 text-[10px] font-bold">
                <button
                  onClick={() => setRegion('PK')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${region === 'PK' ? 'bg-primary text-white shadow-md' : 'text-white/60 hover:text-white'}`}
                >
                  🇵🇰 PKR (₨)
                </button>
                <button
                  onClick={() => setRegion('INT')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${region === 'INT' ? 'bg-primary text-white shadow-md' : 'text-white/60 hover:text-white'}`}
                >
                  🌍 USD ($)
                </button>
              </div>
            </div>

            {/* Corporate Contact footer */}
            <div className="space-y-2 pt-2 border-t border-white/5 text-[10px] text-white/40">
              <div className="flex items-center gap-2">
                <Phone size={11} className="text-white/30" /> +92-48-3700000
              </div>
              <div className="flex items-center gap-2">
                <Mail size={11} className="text-white/30" /> info@dewantraders.com
              </div>
              <div>Sargodha, Punjab, Pakistan — B2B Consolidation Packhouse</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
