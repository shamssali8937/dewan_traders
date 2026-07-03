import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, Linkedin, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-100 pt-20 pb-8 text-xs text-slate-500 relative overflow-hidden">
      {/* Background Decorator */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-10 mb-16 relative z-10">
        {/* Brand column */}
        <div className="col-span-2 space-y-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-white text-lg shadow-md shadow-primary/10">
              D
            </div>
            <div className="leading-tight">
              <div className="font-bold text-slate-900 text-sm tracking-widest uppercase">DEWAN</div>
              <div className="text-[9px] text-primary font-bold tracking-[0.25em] uppercase">TRADERS</div>
            </div>
          </Link>
          <p className="text-slate-500 leading-relaxed text-[11px] max-w-sm">
            Bridging Pakistan's finest resources with global markets. Sourcing directly from certified orchards and Sialkot manufacturing hubs under strict international quality guidelines.
          </p>
          <div className="space-y-2.5 text-[11px]">
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-primary shrink-0" />
              <span>Satellite Town, Sargodha, Punjab, Pakistan</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={13} className="text-primary shrink-0" />
              <a href="tel:+92483700000" className="hover:text-primary transition-colors">+92-48-3700000</a>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={13} className="text-primary shrink-0" />
              <a href="mailto:info@dewantraders.com" className="hover:text-primary transition-colors">info@dewantraders.com</a>
            </div>
          </div>
        </div>

        {/* Links Column 1: Products */}
        <div className="space-y-4">
          <h4 className="text-slate-800 font-bold tracking-wider uppercase text-[10px]">Product Range</h4>
          <ul className="space-y-2.5 text-slate-500">
            <li><Link href="/catalog/fruits" className="hover:text-primary transition-colors">Fresh Fruits</Link></li>
            <li><Link href="/catalog/vegetables" className="hover:text-primary transition-colors">Vegetables</Link></li>
            <li><Link href="/catalog/rice" className="hover:text-primary transition-colors">Premium Rice</Link></li>
            <li><Link href="/catalog/surgical" className="hover:text-primary transition-colors">Surgical Items</Link></li>
            <li><Link href="/catalog/sports" className="hover:text-primary transition-colors">Sports Equipment</Link></li>
          </ul>
        </div>

        {/* Links Column 2: Trade Hub */}
        <div className="space-y-4">
          <h4 className="text-slate-800 font-bold tracking-wider uppercase text-[10px]">Global Trade</h4>
          <ul className="space-y-2.5 text-slate-500">
            <li><Link href="/export-process" className="hover:text-primary transition-colors">Export Process</Link></li>
            <li><Link href="/countries" className="hover:text-primary transition-colors">Countries Served</Link></li>
            <li><Link href="/certifications" className="hover:text-primary transition-colors">Certifications</Link></li>
            <li><Link href="/gallery" className="hover:text-primary transition-colors">Media Gallery</Link></li>
            <li><Link href="/faqs" className="hover:text-primary transition-colors">Help & FAQs</Link></li>
          </ul>
        </div>

        {/* Links Column 3: Corporate */}
        <div className="space-y-4">
          <h4 className="text-slate-800 font-bold tracking-wider uppercase text-[10px]">Partnerships</h4>
          <ul className="space-y-2.5 text-slate-500">
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/services" className="hover:text-primary transition-colors">Sourcing Services</Link></li>
            <li><Link href="/industries" className="hover:text-primary transition-colors">Industries Served</Link></li>
            <li><Link href="/quote" className="hover:text-primary transition-colors flex items-center gap-0.5 text-primary font-semibold">Request a Quote <ArrowUpRight size={11} /></Link></li>
            <li><Link href="/partner" className="hover:text-primary transition-colors flex items-center gap-0.5 text-primary font-semibold">Partner With Us <ArrowUpRight size={11} /></Link></li>
          </ul>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 border-t border-slate-200/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-600 font-medium">
        <div>
          &copy; {currentYear} Dewan Traders. All rights reserved.
        </div>
        <div className="flex gap-4">
          <span>Owner: Sajjad Hussain Awan</span>
          <span>&middot;</span>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-0.5"><Linkedin size={10} /> LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
