'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, Phone, Mail, Globe, Search, User, LogOut, Package, ClipboardList,
  Citrus, Carrot, Wheat, Trophy, Scissors, BookOpen, HelpCircle, Award, Image, Download,
  PackageOpen, Ship, Truck, FileSpreadsheet, Warehouse, Settings, Bell, Heart, Menu, X
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { useMarketStore } from '@/store/marketStore';
import SearchModal from './SearchModal';
import MobileMenu from './MobileMenu';
import DewanTradersLogo from '@/components/dewan_trader_logo';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'EN' | 'UR'>('EN');
  
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();
  const pathname = usePathname();
  
  const { region, setRegion, detectLocation } = useMarketStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    detectLocation();
  }, [detectLocation]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on mouse leave or route change
  useEffect(() => {
    setActiveDropdown(null);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const activeLinkClass = (href: string) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    return isActive 
      ? 'text-primary font-bold after:scale-x-100 font-sans' 
      : 'text-slate-600 hover:text-primary font-semibold after:scale-x-0 font-sans';
  };

  const productDropdownItems = [
    { label: 'Fresh Fruits', href: '/catalog/fruits', icon: Citrus, desc: 'Premium grade-1 Sargodha Kinnows, sweet Chaunsa Mangoes & citrus.' },
    { label: 'Vegetables', href: '/catalog/vegetables', icon: Carrot, desc: 'Export-grade onions, certified potatoes & organic produce.' },
    { label: 'Premium Rice', href: '/catalog/rice', icon: Wheat, desc: 'Aged long-grain Super Kernel Basmati and parboiled Sella rice.' },
    { label: 'Sports Goods', href: '/catalog/sports', icon: Trophy, desc: 'Match-quality cricket bats, thermo-bonded match footballs & gear.' },
    { label: 'Surgical Instruments', href: '/catalog/surgical', icon: Scissors, desc: 'Precision medical scissors, forceps & hospital equipment.' }
  ];

  const servicesDropdownItems = [
    { label: 'Import Services', href: '/services#import', icon: PackageOpen, desc: 'Strategic sourcing & domestic clearance pipelines.' },
    { label: 'Export Services', href: '/services#export', icon: Ship, desc: 'Cold-chain packaging consolidated packhouses & export.' },
    { label: 'Global Freight', href: '/services#logistics', icon: Truck, desc: 'Refrigerated and dry container booking.' },
    { label: 'Customs Clearance', href: '/services#customs', icon: FileSpreadsheet, desc: 'SGS quality checks, clearances & sanitary documents.' },
    { label: 'Packaging Solutions', href: '/services#packaging', icon: Warehouse, desc: 'Reinforced B2B transit packaging & moisture controls.' },
    { label: 'International Shipping', href: '/services#warehousing', icon: Ship, desc: 'Sea reefers and air freight logistics booking.' }
  ];

  const resourcesDropdownItems = [
    { label: 'Export Journal', href: '/journal', icon: BookOpen, desc: 'Agritech insights & global trade compliance updates.' },
    { label: 'FAQs Portal', href: '/faqs', icon: HelpCircle, desc: 'Answers to custom clearing, payment modes & MOQs.' },
    { label: 'Certifications', href: '/certifications', icon: Award, desc: 'ISO 22000, FDA register, and SGS laboratory grades.' },
    { label: 'Media Gallery', href: '/gallery', icon: Image, desc: 'Processing plants, active fields, and packing docks.' },
    { label: 'Download Catalog', href: '/catalog', icon: Download, desc: 'Export specifications PDF and price list overview.' }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        
        {/* 1. Header Utility Bar */}
        <div className="hidden lg:flex items-center justify-between px-10 py-2.5 bg-slate-950 text-[10px] text-slate-300 font-semibold tracking-wider border-b border-white/5 shadow-sm">
          <div className="flex items-center gap-6">
            <a href="https://wa.me/923456776075" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={10} className="text-primary" /> +92 345 6776075
            </a>
            <a href="mailto:awantransportuae@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={10} className="text-primary" /> awantransportuae@gmail.com
            </a>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400 font-sans tracking-wide">B2B Enterprise Export Portal</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/track" className="hover:text-white transition-colors flex items-center gap-1.5">
              <ClipboardList size={11} className="text-primary" /> Cargo Tracking
            </Link>
            <span className="text-slate-700">|</span>
            
            {/* Country Selector Switcher */}
            {mounted && (
              <div className="flex items-center gap-2">
                <Globe size={11} className="text-primary" />
                <span className="text-[9px] text-slate-400">Trading Region:</span>
                <div className="bg-slate-900 border border-slate-800 p-0.5 rounded-lg flex gap-0.5">
                  <button
                    onClick={() => setRegion('PK')}
                    className={`px-2 py-0.5 rounded transition-all font-bold text-[9px] uppercase ${
                      region === 'PK' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    PK (₨)
                  </button>
                  <button
                    onClick={() => setRegion('INT')}
                    className={`px-2 py-0.5 rounded transition-all font-bold text-[9px] uppercase ${
                      region === 'INT' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    INT ($)
                  </button>
                </div>
              </div>
            )}
            
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-slate-400">Language:</span>
              <button 
                onClick={() => setActiveLanguage(activeLanguage === 'EN' ? 'UR' : 'EN')}
                className="hover:text-white transition-colors font-bold text-[10px] text-slate-300 uppercase bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded"
              >
                {activeLanguage === 'EN' ? 'English' : 'اردو'}
              </button>
            </div>
          </div>
        </div>

        {/* 2. Main Redesigned Navbar */}
        <nav
          className={`flex items-center justify-between px-6 lg:px-12 transition-all duration-300 ${
            scrolled
              ? 'py-3.5 bg-white/90 backdrop-blur-xl shadow-lg border-b border-slate-200/50'
              : 'py-5 bg-white/60 backdrop-blur-md border-b border-slate-200/20'
          }`}
        >
          {/* Logo brand */}
          <Link href="/" className="flex items-center group shrink-0 transition-transform hover:scale-[1.02]">
            <DewanTradersLogo width={110} />
          </Link>

          {/* Desktop Navigation Links (UX optimized layout) */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className={`relative py-2 text-xs uppercase font-extrabold tracking-wider transition-all duration-200 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:transition-transform after:duration-200 ${activeLinkClass('/')}`}>
              Home
            </Link>

            {/* Products Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('products')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1.5 py-2 text-xs uppercase font-extrabold tracking-wider transition-all duration-200 ${
                  pathname.startsWith('/catalog') ? 'text-primary' : 'text-slate-600 hover:text-primary'
                }`}
              >
                Products
                <ChevronDown size={11} className={`transition-transform duration-200 ${activeDropdown === 'products' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'products' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[660px] z-50"
                  >
                    <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/60 grid grid-cols-2 gap-4">
                      <div className="col-span-2 pb-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Export Channels</span>
                        <Link href="/catalog" className="text-[10px] text-primary font-bold hover:underline">View All Commodities &rarr;</Link>
                      </div>
                      {productDropdownItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-all group/item border border-transparent hover:border-slate-100"
                          >
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all shrink-0">
                              <Icon size={16} />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-800 group-hover/item:text-primary transition-colors">{item.label}</h4>
                              <p className="text-[10px] text-slate-500 mt-1 leading-normal font-medium">{item.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                      <div className="col-span-2 bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex items-center justify-between text-[10px] font-bold text-slate-600">
                        <span>Quality inspection audited by global laboratories (SGS, ISO).</span>
                        <Link href="/certifications" className="text-primary hover:underline flex items-center gap-1 uppercase tracking-wider text-[9px]">
                          Compliance Matrix &rarr;
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/about" className={`relative py-2 text-xs uppercase font-extrabold tracking-wider transition-all duration-200 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:transition-transform after:duration-200 ${activeLinkClass('/about')}`}>
              About
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1.5 py-2 text-xs uppercase font-extrabold tracking-wider transition-all duration-200 ${
                  pathname.startsWith('/services') ? 'text-primary' : 'text-slate-600 hover:text-primary'
                }`}
              >
                Services
                <ChevronDown size={11} className={`transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'services' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[660px] z-50"
                  >
                    <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/60 grid grid-cols-2 gap-4">
                      <div className="col-span-2 pb-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Logistics & Trade Sourcing</span>
                        <Link href="/services" className="text-[10px] text-primary font-bold hover:underline">Explore Services &rarr;</Link>
                      </div>
                      {servicesDropdownItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-all group/item border border-transparent hover:border-slate-100"
                          >
                            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100/50 flex items-center justify-center text-secondary group-hover/item:bg-secondary group-hover/item:text-white transition-all shrink-0">
                              <Icon size={16} />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-800 group-hover/item:text-primary transition-colors">{item.label}</h4>
                              <p className="text-[10px] text-slate-500 mt-1 leading-normal font-medium">{item.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('resources')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1.5 py-2 text-xs uppercase font-extrabold tracking-wider transition-all duration-200 ${
                  pathname.startsWith('/journal') || pathname.startsWith('/faqs') || pathname.startsWith('/certifications') || pathname.startsWith('/gallery')
                    ? 'text-primary'
                    : 'text-slate-600 hover:text-primary'
                }`}
              >
                Resources
                <ChevronDown size={11} className={`transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'resources' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[660px] z-50"
                  >
                    <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/60 grid grid-cols-2 gap-4">
                      <div className="col-span-2 pb-2 border-b border-slate-100">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Resource Center</span>
                      </div>
                      {resourcesDropdownItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-all group/item border border-transparent hover:border-slate-100"
                          >
                            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100/50 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all shrink-0">
                              <Icon size={16} />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-800 group-hover/item:text-primary transition-colors">{item.label}</h4>
                              <p className="text-[10px] text-slate-500 mt-1 leading-normal font-medium">{item.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/contact" className={`relative py-2 text-xs uppercase font-extrabold tracking-wider transition-all duration-200 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:transition-transform after:duration-200 ${activeLinkClass('/contact')}`}>
              Contact
            </Link>
          </div>

          {/* Right Utilities (Primary CTA, Search, Profile) */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            {/* Elastic Search button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-all border border-slate-200/10 hover:border-slate-200"
              title="Search Sourced Products"
            >
              <Search size={15} />
            </button>

            {/* Profile Dropdown */}
            {isAuthenticated && user ? (
              <div 
                className="relative"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <button
                  className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-all text-xs font-bold text-slate-800 shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-secondary text-white font-extrabold text-[9px] flex items-center justify-center uppercase shadow-inner">
                    {user.name[0]}
                  </div>
                  <span className="max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={11} className="text-slate-500" />
                </button>
                
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 top-full pt-2 w-48 z-50"
                    >
                      <div className="bg-white rounded-2xl p-2 shadow-2xl border border-slate-200/80 flex flex-col">
                        <div className="px-3.5 py-2 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                          Account Console
                        </div>
                        <Link
                          href={user.role === 'admin' || user.role === 'manager' ? '/admin' : '/user'}
                          className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
                        >
                          <User size={13} className="text-slate-400" /> Dashboard
                        </Link>
                        <Link
                          href={user.role === 'admin' || user.role === 'manager' ? '/admin/orders' : '/user?tab=orders'}
                          className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
                        >
                          <Package size={13} className="text-slate-400" /> My Orders
                        </Link>
                        <Link
                          href={user.role === 'admin' || user.role === 'manager' ? '/admin/inquiries' : '/user?tab=overview'}
                          className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
                        >
                          <ClipboardList size={13} className="text-slate-400" /> Inquiry History
                        </Link>
                        <Link
                          href={user.role === 'admin' || user.role === 'manager' ? '/admin' : '/user?tab=notifications'}
                          className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
                        >
                          <Bell size={13} className="text-slate-400" /> Notifications
                        </Link>
                        <button
                          onClick={() => logout()}
                          className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all border-t border-slate-100 mt-1"
                        >
                          <LogOut size={13} /> Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-xs font-bold text-slate-700 hover:text-primary px-3 py-2.5 rounded-xl border border-transparent hover:border-slate-200 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="text-xs font-bold text-slate-700 hover:text-primary px-3 py-2.5 rounded-xl border border-slate-200 transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            <Link
              href="/quote"
              className="text-xs font-bold px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white transition-all shadow-md shadow-primary/10 uppercase tracking-wider shrink-0"
            >
              Submit RFQ
            </Link>
          </div>

          {/* Mobile Right layout (Menu Trigger and Search toggle) */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200"
              aria-label="Search"
            >
              <Search size={16} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Fullscreen Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Apple/Stripe-like Fullscreen Mobile Navigation Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        region={region}
        setRegion={setRegion}
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />
      
      {/* Spacer to prevent header content collision */}
      <div className="h-14 lg:h-[108px]" />
    </>
  );
}
