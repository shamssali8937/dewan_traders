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

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  { label: 'Journal', href: '/admin/journal', icon: Newspaper },
  { label: 'Users', href: '/admin/users', icon: Users },
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
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className={`flex items-center gap-3 p-5 border-b border-slate-100 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-sky-600 flex items-center justify-center font-black text-white text-base shrink-0">D</div>
        {!collapsed && (
          <div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Admin Panel</div>
            <div className="text-[9px] text-primary font-black tracking-widest">DEWAN TRADERS</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item, i) => {
          if ('divider' in item) return <div key={i} className="my-3 border-t border-slate-100" />;
          const { label, href, icon: Icon } = item as any;
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-sky-50 border border-sky-100/50 text-primary font-bold shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
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
      <div className="p-3 border-t border-slate-100 space-y-1 bg-slate-50/50">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-sky-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {getInitials(user?.name || 'A')}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 capitalize font-medium">{user?.role}</p>
            </div>
          </div>
        )}
        <Link href="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <Globe size={14} className="shrink-0" />
          {!collapsed && 'View Website'}
        </Link>
        <button
          onClick={() => logout()}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={14} className="shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col border-r border-slate-200/60 relative transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute left-full top-20 -translate-x-3 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 shadow-sm transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 border-r border-slate-200/60 h-full flex flex-col">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-slate-900/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200/60 flex items-center justify-between px-5 shrink-0 shadow-sm">
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-slate-50 text-slate-500" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          <div className="text-xs text-slate-400 font-semibold hidden lg:block uppercase tracking-wider">
            {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-sky-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-primary/10">
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
