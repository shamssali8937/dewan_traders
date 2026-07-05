'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, MessageSquare, ShoppingCart,
  Settings, Globe, ChevronLeft, ChevronRight, LogOut, Users, Menu, X,
  Newspaper, Star, CreditCard
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/lib/utils';
import DewanTradersLogo from '@/components/dewan_trader_logo';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  { label: 'Journal', href: '/admin/journal', icon: Newspaper },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Market Config', href: '/admin/market-config', icon: Globe },
  { divider: true },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
  { label: 'Payment Methods', href: '/admin/payment-accounts', icon: CreditCard },
  { label: 'Contact Info', href: '/admin/contact-info', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if not admin
  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    if (user?.role !== 'admin' && user?.role !== 'manager') { router.push('/'); }
  }, [isAuthenticated, user, mounted]);

  if (!mounted || !isAuthenticated || (user?.role !== 'admin' && user?.role !== 'manager')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbf9]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="flex items-center justify-center p-5 border-b border-slate-200/60">
        {collapsed ? (
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-100 p-0.5">
            <DewanTradersLogo width={24} iconOnly={true} />
          </div>
        ) : (
          <Link href="/" className="transition-transform hover:scale-[1.02] flex justify-center w-full">
            <DewanTradersLogo width={110} />
          </Link>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item, i) => {
          if ('divider' in item) return <div key={i} className="my-3.5 border-t border-slate-200/50" />;
          const { label, href, icon: Icon } = item as any;
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                isActive
                  ? 'bg-emerald-50 border-emerald-100 text-primary font-bold shadow-sm'
                  : 'bg-white border-transparent text-slate-500 hover:text-slate-905 hover:bg-slate-50'
              }`}
              title={collapsed ? label : undefined}
            >
              <Icon size={14} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-3 border-t border-slate-200/60 space-y-1.5 bg-slate-50/50">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-extrabold shrink-0 shadow-sm">
              {getInitials(user?.name || 'A')}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-slate-800 truncate uppercase">{user?.name}</p>
              <p className="text-[9px] text-slate-500 capitalize font-bold">{user?.role}</p>
            </div>
          </div>
        )}
        <Link href="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <Globe size={14} className="shrink-0 animate-pulse" />
          {!collapsed && 'View Website'}
        </Link>
        <button
          onClick={() => logout()}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={14} className="shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#fafbf9] overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col border-r border-slate-200 relative transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute left-full top-20 -translate-x-3 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-sm transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 border-r border-slate-200 h-full flex flex-col">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-slate-900/10 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-slate-50 text-slate-500 border border-slate-200" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          <div className="text-[10px] text-slate-450 font-black hidden lg:block uppercase tracking-wider">
            {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-black shadow-sm">
              {getInitials(user?.name || 'A')}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
