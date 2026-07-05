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
      y: -15,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
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
    { label: 'Download Catalog PDF', href: '/catalog' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          className="fixed inset-0 z-45 bg-white/95 backdrop-blur-2xl text-slate-800 flex flex-col pt-24 overflow-y-auto px-6 pb-10 border-b border-slate-200 shadow-xl"
        >
          {/* Mobile Search Pill */}
          <motion.div variants={itemVariants} className="mb-6">
            <button
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Search size={14} className="text-slate-400" />
                Search commodities...
              </span>
              <span className="text-[10px] font-bold bg-slate-200 px-2 py-0.5 rounded text-slate-600">Tap</span>
            </button>
          </motion.div>

          {/* Navigation Accordions */}
          <div className="space-y-4 flex-1">
            {/* Simple Home Link */}
            <motion.div variants={itemVariants} className="border-b border-slate-100 pb-2.5">
              <Link
                href="/"
                onClick={onClose}
                className={`text-sm font-extrabold tracking-wide uppercase flex items-center justify-between ${pathname === '/' ? 'text-primary' : 'text-slate-800'}`}
              >
                Home
                <ArrowRight size={14} className="opacity-40" />
              </Link>
            </motion.div>

            {/* Products Accordion */}
            <motion.div variants={itemVariants} className="border-b border-slate-100 pb-2.5">
              <button
                onClick={() => toggleSection('products')}
                className="w-full flex items-center justify-between text-sm font-extrabold tracking-wide uppercase text-slate-800"
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
                        <div className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors">{p.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{p.desc}</div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Services Accordion */}
            <motion.div variants={itemVariants} className="border-b border-slate-100 pb-2.5">
              <button
                onClick={() => toggleSection('services')}
                className="w-full flex items-center justify-between text-sm font-extrabold tracking-wide uppercase text-slate-800"
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
                        <div className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors">{s.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{s.desc}</div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Resources Accordion */}
            <motion.div variants={itemVariants} className="border-b border-slate-100 pb-2.5">
              <button
                onClick={() => toggleSection('resources')}
                className="w-full flex items-center justify-between text-sm font-extrabold tracking-wide uppercase text-slate-800"
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
                        className="block text-xs font-bold text-slate-700 hover:text-primary transition-colors"
                      >
                        {r.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* About Link */}
            <motion.div variants={itemVariants} className="border-b border-slate-100 pb-2.5">
              <Link
                href="/about"
                onClick={onClose}
                className={`text-sm font-extrabold tracking-wide uppercase flex items-center justify-between ${pathname === '/about' ? 'text-primary' : 'text-slate-800'}`}
              >
                About Us
                <ArrowRight size={14} className="opacity-40" />
              </Link>
            </motion.div>

            {/* Track Cargo Link */}
            <motion.div variants={itemVariants} className="border-b border-slate-100 pb-2.5">
              <Link
                href="/track"
                onClick={onClose}
                className={`text-sm font-extrabold tracking-wide uppercase flex items-center justify-between ${pathname === '/track' ? 'text-primary' : 'text-slate-800'}`}
              >
                Track Cargo
                <ArrowRight size={14} className="opacity-40" />
              </Link>
            </motion.div>

            {/* Contact Link */}
            <motion.div variants={itemVariants} className="border-b border-slate-100 pb-2.5">
              <Link
                href="/contact"
                onClick={onClose}
                className={`text-sm font-extrabold tracking-wide uppercase flex items-center justify-between ${pathname === '/contact' ? 'text-primary' : 'text-slate-800'}`}
              >
                Contact
                <ArrowRight size={14} className="opacity-40" />
              </Link>
            </motion.div>
          </div>

          {/* User Account / Profile Actions */}
          {isAuthenticated && user ? (
            <motion.div variants={itemVariants} className="mt-8 border-t border-slate-200 pt-6 space-y-3 bg-slate-50 p-4.5 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-extrabold text-sm uppercase text-white shadow-inner">
                  {user.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate">{user.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold mt-2">
                <Link
                  href={user.role === 'admin' || user.role === 'manager' ? '/admin' : '/user'}
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 transition-all"
                >
                  <User size={12} className="text-primary" /> Dashboard
                </Link>
                <Link
                  href={user.role === 'admin' || user.role === 'manager' ? '/admin/orders' : '/user?tab=orders'}
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 transition-all"
                >
                  <Package size={12} className="text-primary" /> My Orders
                </Link>
              </div>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-red-200 transition-all"
              >
                <LogOut size={12} /> Log Out
              </button>
            </motion.div>
          ) : (
            <motion.div variants={itemVariants} className="mt-8 grid grid-cols-2 gap-3.5 border-t border-slate-200 pt-6">
              <Link
                href="/auth/login"
                onClick={onClose}
                className="py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold text-center text-slate-700 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/quote"
                onClick={onClose}
                className="py-3.5 bg-primary text-white hover:bg-primary-hover rounded-2xl text-xs font-extrabold text-center shadow-lg shadow-primary/10 transition-all uppercase tracking-wider"
              >
                Get Quote
              </Link>
            </motion.div>
          )}

          {/* Bottom Region / Currency selectors */}
          <motion.div variants={itemVariants} className="mt-8 space-y-4 text-xs font-semibold text-slate-600 border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                <Globe size={13} className="text-primary" /> Sourcing Region
              </span>
              <div className="flex gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[10px] font-bold">
                <button
                  onClick={() => setRegion('PK')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${region === 'PK' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  🇵🇰 PKR (₨)
                </button>
                <button
                  onClick={() => setRegion('INT')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${region === 'INT' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  🌍 USD ($)
                </button>
              </div>
            </div>

            {/* Corporate Contact footer */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-[10px] text-slate-500">
              <div className="flex items-center gap-2">
                <Phone size={11} className="text-slate-400" /> +92-48-3700000
              </div>
              <div className="flex items-center gap-2">
                <Mail size={11} className="text-slate-400" /> info@dewantraders.com
              </div>
              <div className="font-medium text-[9px] tracking-wide">Sargodha, Punjab, Pakistan — B2B Consolidation Packhouse</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
