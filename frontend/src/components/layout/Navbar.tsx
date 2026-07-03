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

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
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
    const isActive = pathname === href || pathname.startsWith(href + '/');
    return isActive 
      ? 'text-primary font-bold after:scale-x-100' 
      : 'text-slate-700 hover:text-primary font-semibold after:scale-x-0';
  };

  const productDropdownItems = [
    { label: 'Fresh Fruits', href: '/catalog/fruits', icon: Citrus, desc: 'Premium grade-1 Sargodha Kinnows, sweet Chaunsa Mangoes & sweet citrus.' },
    { label: 'Vegetables', href: '/catalog/vegetables', icon: Carrot, desc: 'Fresh export-grade onions, Mozika potatoes & garlic bulbs.' },
    { label: 'Premium Rice', href: '/catalog/rice', icon: Wheat, desc: 'Aged long-grain Super Kernel Basmati and parboiled Sella rice.' },
    { label: 'Sports Goods', href: '/catalog/sports', icon: Trophy, desc: 'FIFA-quality thermo-bonded match footballs & willow cricket bats.' },
    { label: 'Surgical Instruments', href: '/catalog/surgical', icon: Scissors, desc: 'Sialkot medical scissors, hemostatic forceps & sterile knife sets.' }
  ];

  const servicesDropdownItems = [
    { label: 'Import Services', href: '/services#import', icon: PackageOpen, desc: 'Strategic sourcing & domestic distribution pipelines.' },
    { label: 'Export Services', href: '/services#export', icon: Ship, desc: 'Cold-chain consolidated packhouses & export handling.' },
    { label: 'Global Logistics', href: '/services#logistics', icon: Truck, desc: 'Refrigerated and dry container sea/air freight booking.' },
    { label: 'Customs Documentation', href: '/services#customs', icon: FileSpreadsheet, desc: 'SGS quality checks, customs clearances & phytosanitary documents.' },
    { label: 'Packaging Solutions', href: '/services#packaging', icon: Warehouse, desc: 'Reinforced transit packing & moisture-proof treatments.' },
    { label: 'Warehousing', href: '/services#warehousing', icon: Warehouse, desc: 'Industrial multi-temperature storage depots.' }
  ];

  const resourcesDropdownItems = [
    { label: 'Export Journal (Blog)', href: '/journal', icon: BookOpen, desc: 'Agritech insights & global trade compliance updates.' },
    { label: 'FAQs Portal', href: '/faqs', icon: HelpCircle, desc: 'Answers to custom clearing, payment modes & MOQs.' },
    { label: 'Certifications', href: '/certifications', icon: Award, desc: 'ISO 22000, FDA register, and SGS laboratory grades.' },
    { label: 'Media Gallery', href: '/gallery', icon: Image, desc: 'Vitals from our processing plants, fields, and packing docks.' },
    { label: 'Download Catalog', href: '/catalog', icon: Download, desc: 'Export specifications PDF and price list overview.' }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        
        {/* 1. Header Utility Bar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-2 bg-slate-900 text-[10px] text-slate-300 font-semibold tracking-wider border-b border-white/5">
          <div className="flex items-center gap-5">
            <a href="tel:+92483700000" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone size={11} className="text-primary" /> +92-48-3700000
            </a>
            <a href="mailto:info@dewantraders.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail size={11} className="text-primary" /> info@dewantraders.com
            </a>
            <span className="text-slate-400">|</span>
            <span className="text-slate-400">Sargodha B2B Export Hub</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/track" className="hover:text-white transition-colors flex items-center gap-1">
              <ClipboardList size={11} className="text-primary" /> Track Order Cargo
            </Link>
            <span className="text-slate-500">|</span>
            
            {/* Country Selector Switcher */}
            {mounted && (
              <div className="flex items-center gap-1">
                <Globe size={11} className="text-primary" />
                <span>Experience:</span>
                <button
                  onClick={() => setRegion('PK')}
                  className={`px-1.5 py-0.5 rounded transition-all font-bold ${
                    region === 'PK' ? 'bg-primary text-white text-[9px]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  PK (₨)
                </button>
                <button
                  onClick={() => setRegion('INT')}
                  className={`px-1.5 py-0.5 rounded transition-all font-bold ${
                    region === 'INT' ? 'bg-primary text-white text-[9px]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  INT ($)
                </button>
              </div>
            )}
            
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              Language: <span className="font-bold text-white">English</span>
            </span>
          </div>
        </div>

        {/* 2. Main Redesigned Navbar */}
        <nav
          className={`flex items-center justify-between px-6 lg:px-12 transition-all duration-300 ${
            scrolled
              ? 'py-3 bg-white/90 backdrop-blur-xl shadow-lg border-b border-slate-100'
              : 'py-5 bg-white/50 backdrop-blur-sm border-b border-slate-200/20'
          }`}
        >
          {/* Logo brand */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-sky-600 flex items-center justify-center font-black text-white text-lg shadow-md shadow-primary/10 transition-transform group-hover:scale-105">
              D
            </div>
            <div className="leading-tight">
              <div className="font-bold text-slate-900 text-sm tracking-widest uppercase">DEWAN</div>
              <div className="text-[9px] text-primary font-bold tracking-[0.25em] uppercase">TRADERS</div>
            </div>
          </Link>

          {/* Desktop Navigation Links (UX optimized layout) */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/" className={`relative py-2 text-xs uppercase tracking-wider transition-all duration-200 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:transition-transform after:duration-200 ${activeLinkClass('/')}`}>
              Home
            </Link>

            {/* Products Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('products')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 py-2 text-xs uppercase tracking-wider transition-all duration-200 ${
                  pathname.startsWith('/catalog') ? 'text-primary font-bold' : 'text-slate-700 hover:text-primary font-semibold'
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
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[640px] z-50"
                  >
                    <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 grid grid-cols-2 gap-4">
                      {productDropdownItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-start gap-3 p-3.5 rounded-2xl hover:bg-slate-50 transition-all group/item"
                          >
                            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all shrink-0">
                              <Icon size={16} />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-800 group-hover/item:text-primary transition-colors">{item.label}</h4>
                              <p className="text-[10px] text-slate-500 mt-1 leading-normal font-medium">{item.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                      <div className="col-span-2 bg-slate-50 p-3 rounded-2xl flex items-center justify-between text-[10px] font-bold text-slate-600">
                        <span>Check out our global standards and certifications</span>
                        <Link href="/certifications" className="text-primary hover:underline flex items-center gap-0.5">
                          View Certifications &rarr;
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/about" className={`relative py-2 text-xs uppercase tracking-wider transition-all duration-200 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:transition-transform after:duration-200 ${activeLinkClass('/about')}`}>
              About
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center gap-1 py-2 text-xs uppercase tracking-wider transition-all duration-200 ${
                  pathname.startsWith('/services') ? 'text-primary font-bold' : 'text-slate-700 hover:text-primary font-semibold'
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
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[640px] z-50"
                  >
                    <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 grid grid-cols-2 gap-4">
                      {servicesDropdownItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-start gap-3 p-3.5 rounded-2xl hover:bg-slate-50 transition-all group/item"
                          >
                            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all shrink-0">
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
                className={`flex items-center gap-1 py-2 text-xs uppercase tracking-wider transition-all duration-200 ${
                  pathname.startsWith('/journal') || pathname.startsWith('/faqs') || pathname.startsWith('/certifications') || pathname.startsWith('/gallery')
                    ? 'text-primary font-bold'
                    : 'text-slate-700 hover:text-primary font-semibold'
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
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[640px] z-50"
                  >
                    <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 grid grid-cols-2 gap-4">
                      {resourcesDropdownItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-start gap-3 p-3.5 rounded-2xl hover:bg-slate-50 transition-all group/item"
                          >
                            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all shrink-0">
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

            <Link href="/contact" className={`relative py-2 text-xs uppercase tracking-wider transition-all duration-200 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:transition-transform after:duration-200 ${activeLinkClass('/contact')}`}>
              Contact
            </Link>
          </div>

          {/* Right Utilities (Primary CTA, Search, Profile) */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            {/* Elastic Search button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-full hover:bg-slate-100 text-slate-700 transition-all"
              title="Search imports & exports"
            >
              <Search size={16} />
            </button>

            {/* Profile Dropdown */}
            {isAuthenticated && user ? (
              <div 
                className="relative"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <button
                  className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/60 transition-all text-xs font-bold text-slate-800"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-sky-500 text-white font-black text-[10px] flex items-center justify-center uppercase shadow-inner">
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
                      <div className="bg-white rounded-2xl p-2 shadow-2xl border border-slate-100 flex flex-col">
                        <div className="px-3.5 py-2.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Account Menu
                        </div>
                        <Link
                          href={user.role === 'admin' || user.role === 'manager' ? '/admin' : '/user'}
                          className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-700 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
                        >
                          <User size={13} className="text-slate-400" /> Dashboard
                        </Link>
                        <Link
                          href={user.role === 'admin' || user.role === 'manager' ? '/admin/orders' : '/user/orders'}
                          className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-700 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
                        >
                          <Package size={13} className="text-slate-400" /> Orders History
                        </Link>
                        <Link
                          href={user.role === 'admin' || user.role === 'manager' ? '/admin' : '/user?tab=overview'}
                          className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-700 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
                        >
                          <Heart size={13} className="text-slate-400" /> Sourcing Wishlist
                        </Link>
                        <Link
                          href={user.role === 'admin' || user.role === 'manager' ? '/admin/inquiries' : '/user?tab=notifications'}
                          className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-700 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
                        >
                          <Bell size={13} className="text-slate-400" /> Notifications
                        </Link>
                        <Link
                          href={user.role === 'admin' || user.role === 'manager' ? '/admin/market-config' : '/user?tab=profile'}
                          className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-700 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
                        >
                          <Settings size={13} className="text-slate-400" /> settings
                        </Link>
                        <button
                          onClick={() => logout()}
                          className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all border-t border-slate-50 mt-1"
                        >
                          <LogOut size={13} /> Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-xs font-bold text-slate-700 hover:text-primary px-3 py-2 rounded-xl transition-all"
              >
                Sign In
              </Link>
            )}

            <Link
              href="/quote"
              className="text-xs font-black px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white transition-all shadow-md shadow-primary/10 uppercase tracking-wide shrink-0"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile Right layout (Menu Trigger and Search toggle) */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-50 text-slate-700"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-slate-50 text-slate-700"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
      <div className="h-14 lg:h-22" />
    </>
  );
}
