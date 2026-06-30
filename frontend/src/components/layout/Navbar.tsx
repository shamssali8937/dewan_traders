'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Phone, Globe } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Catalog',
    href: '/catalog',
    children: [
      { label: 'Fresh Fruits', href: '/catalog/fruits' },
      { label: 'Vegetables', href: '/catalog/vegetables' },
      { label: 'Premium Rice', href: '/catalog/rice' },
      { label: 'Surgical Items', href: '/catalog/surgical' },
      { label: 'Sports Items', href: '/catalog/sports' },
    ],
  },
  {
    label: 'Global Trade',
    href: '#',
    children: [
      { label: 'Export Process', href: '/export-process' },
      { label: 'Countries We Export', href: '/countries' },
      { label: 'Certifications', href: '/certifications' },
      { label: 'Media Gallery', href: '/gallery' },
      { label: 'FAQs', href: '/faqs' },
    ],
  },
  { label: 'Services', href: '/services' },
  { label: 'Industries', href: '/industries' },
  { label: 'Journal', href: '/journal' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/85 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-transparent'
      }`}
    >
      {/* Top corporate bar */}
      <div className="hidden lg:flex items-center justify-between px-8 py-2 border-b border-slate-100 text-[11px] text-slate-500 font-medium tracking-wide">
        <span className="flex items-center gap-1.5">
          <Globe size={12} className="text-primary" />
          Sargodha, Punjab, Pakistan — International Import & Export Experts
        </span>
        <div className="flex items-center gap-5">
          <a href="tel:+92483700000" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Phone size={11} className="text-primary" /> +92-48-3700000
          </a>
          <a href="mailto:info@dewantraders.com" className="hover:text-primary transition-colors">
            info@dewantraders.com
          </a>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="flex items-center justify-between px-6 lg:px-8 py-3.5">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-white text-lg shadow-md shadow-primary/10 transition-transform group-hover:scale-105">
            D
          </div>
          <div className="leading-tight">
            <div className="font-bold text-slate-900 text-sm tracking-widest uppercase">DEWAN</div>
            <div className="text-[9px] text-primary font-bold tracking-[0.25em] uppercase">TRADERS</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.label}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-all">
                  {link.label}
                  <ChevronDown size={12} className="transition-transform group-hover:rotate-180 text-slate-400" />
                </button>
                <div
                  className={`absolute top-full left-0 pt-2 transition-all duration-200 ${
                    activeDropdown === link.label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}
                >
                  <div className="glass rounded-xl p-2 min-w-[210px] shadow-lg border border-slate-100 bg-white">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-center px-3.5 py-2 text-xs font-medium text-slate-500 hover:text-primary hover:bg-slate-50 rounded-lg transition-all"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-all"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Auth & CTA buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <Link
                href={user.role === 'admin' || user.role === 'manager' ? '/admin' : '/user'}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-50 transition-all"
              >
                {user.role === 'admin' || user.role === 'manager' ? 'Admin Panel' : 'My Account'}
              </Link>
              <button
                onClick={() => logout()}
                className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors px-3 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/quote"
                className="text-xs font-bold px-4.5 py-2 rounded-lg bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white transition-all shadow-md shadow-primary/10"
              >
                Request Quote
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-slate-50 text-slate-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile navigation panel */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-2 shadow-inner">
          {navLinks.map((link) => (
            <div key={link.label} className="space-y-1">
              {link.children ? (
                <>
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">{link.label}</div>
                  <div className="pl-3 space-y-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-50"
                        onClick={() => setIsOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={link.href}
                  className="block px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); setIsOpen(false); }}
                className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg text-center"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/auth/login" className="px-4 py-2 text-center text-xs font-semibold text-slate-600 bg-slate-50 rounded-lg border border-slate-200" onClick={() => setIsOpen(false)}>Sign In</Link>
                <Link href="/quote" className="px-4 py-2 text-center text-xs font-bold text-white bg-gradient-to-r from-primary to-sky-600 rounded-lg" onClick={() => setIsOpen(false)}>Request Quote</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
