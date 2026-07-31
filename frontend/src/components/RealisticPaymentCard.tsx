'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Edit, Trash2, CheckCircle2, XCircle, Building2, Smartphone, ShieldCheck, Wifi } from 'lucide-react';
import { toast } from 'sonner';

export interface PaymentAccount {
  id: string;
  type: 'bank' | 'easypaisa' | 'jazzcash' | string;
  bankName?: string | null;
  accountTitle: string;
  accountNumber: string;
  iban?: string | null;
  branch?: string | null;
  isActive?: boolean;
}

interface RealisticPaymentCardProps {
  account: PaymentAccount;
  isAdmin?: boolean;
  onEdit?: (account: PaymentAccount) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (account: PaymentAccount) => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (account: PaymentAccount) => void;
}

export default function RealisticPaymentCard({
  account,
  isAdmin = false,
  onEdit,
  onDelete,
  onToggleActive,
  selectable = false,
  selected = false,
  onSelect,
}: RealisticPaymentCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Card themes based on type & bank
  const getCardTheme = () => {
    const type = account.type?.toLowerCase() || '';
    const bank = (account.bankName || '').toLowerCase();

    if (type === 'easypaisa') {
      return {
        bg: 'bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950',
        border: 'border-emerald-500/30 hover:border-emerald-400/60',
        glow: 'shadow-emerald-900/20',
        chipBg: 'from-amber-300 via-yellow-400 to-amber-500',
        accentText: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
        brand: 'EasyPaisa',
        subBrand: 'Mobile Wallet',
        gradientCircle: 'from-emerald-500/20 to-teal-500/5',
      };
    }

    if (type === 'jazzcash') {
      return {
        bg: 'bg-gradient-to-br from-red-950 via-rose-900 to-amber-950',
        border: 'border-amber-500/30 hover:border-amber-400/60',
        glow: 'shadow-red-900/20',
        chipBg: 'from-amber-200 via-amber-400 to-yellow-500',
        accentText: 'text-amber-400',
        badgeBg: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
        brand: 'JazzCash',
        subBrand: 'Mobile Account',
        gradientCircle: 'from-rose-500/20 to-amber-500/5',
      };
    }

    if (bank.includes('meezan')) {
      return {
        bg: 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900',
        border: 'border-purple-500/30 hover:border-purple-400/60',
        glow: 'shadow-purple-900/20',
        chipBg: 'from-yellow-200 via-amber-300 to-amber-500',
        accentText: 'text-purple-300',
        badgeBg: 'bg-purple-500/20 border-purple-500/30 text-purple-200',
        brand: 'Meezan Bank',
        subBrand: 'Islamic Banking',
        gradientCircle: 'from-purple-500/20 to-indigo-500/5',
      };
    }

    if (bank.includes('hbl')) {
      return {
        bg: 'bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900',
        border: 'border-emerald-500/30 hover:border-emerald-400/60',
        glow: 'shadow-emerald-900/20',
        chipBg: 'from-yellow-200 via-amber-300 to-amber-500',
        accentText: 'text-emerald-300',
        badgeBg: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200',
        brand: 'HBL',
        subBrand: 'Habib Bank Ltd',
        gradientCircle: 'from-emerald-500/20 to-teal-500/5',
      };
    }

    // Default Bank / Corporate Card
    return {
      bg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
      border: 'border-slate-700/50 hover:border-slate-500/70',
      glow: 'shadow-slate-900/40',
      chipBg: 'from-amber-200 via-amber-400 to-yellow-500',
      accentText: 'text-sky-400',
      badgeBg: 'bg-sky-500/20 border-sky-500/30 text-sky-300',
      brand: account.bankName || 'Bank Transfer',
      subBrand: 'Corporate Account',
      gradientCircle: 'from-sky-500/20 to-indigo-500/5',
    };
  };

  const theme = getCardTheme();

  // Format account number into 4-digit groups for card aesthetic
  const formatCardNumber = (num: string) => {
    const cleaned = num.replace(/\s+/g, '');
    return cleaned.match(/.{1,4}/g)?.join('  ') || num;
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={() => selectable && onSelect && onSelect(account)}
      className={`relative group overflow-hidden rounded-[1.5rem] p-6 text-white border shadow-xl transition-all duration-300 flex flex-col justify-between h-full min-h-[280px] ${
        theme.bg
      } ${theme.border} ${theme.glow} ${
        selectable ? 'cursor-pointer select-none' : ''
      } ${selected ? 'ring-2 ring-primary border-primary shadow-2xl' : ''}`}
    >
      {/* Decorative Metallic Card Hologram Background */}
      <div
        className={`absolute -right-16 -top-16 w-56 h-56 rounded-full bg-gradient-to-br ${theme.gradientCircle} blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/5 pointer-events-none" />

      {/* Gloss Sheen Line on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

      <div>
        {/* Top Header: Brand Name & Icons */}
        <div className="relative z-10 flex items-start justify-between mb-5">
          <div className="flex items-center gap-2">
            {account.type === 'bank' ? (
              <Building2 size={18} className={theme.accentText} />
            ) : (
              <Smartphone size={18} className={theme.accentText} />
            )}
            <div>
              <div className="text-sm font-extrabold tracking-wider uppercase text-white drop-shadow">
                {theme.brand}
              </div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {theme.subBrand}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Active status indicator (for Admin view) */}
            {isAdmin && (
              <span
                className={`text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider border ${
                  account.isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-red-500/20 text-red-300 border-red-500/40'
                }`}
              >
                {account.isActive ? 'Active' : 'Inactive'}
              </span>
            )}

            {/* Contactless Icon */}
            <Wifi className="w-5 h-5 text-slate-400/80 rotate-90" />
          </div>
        </div>

        {/* Metallic Gold EMV Chip */}
        <div className="relative z-10 flex items-center justify-between mb-5">
          <div
            className={`w-11 h-8 rounded-md bg-gradient-to-br ${theme.chipBg} p-1 shadow-inner border border-yellow-200/50 flex flex-col justify-between overflow-hidden`}
          >
            <div className="w-full h-[1px] bg-amber-900/30" />
            <div className="flex justify-between h-full py-0.5">
              <div className="w-[1px] h-full bg-amber-900/30" />
              <div className="w-[1px] h-full bg-amber-900/30" />
            </div>
            <div className="w-full h-[1px] bg-amber-900/30" />
          </div>

          <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-400" /> Official Account
          </div>
        </div>

        {/* Account / Wallet Number */}
        <div className="relative z-10 mb-4">
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center justify-between">
            <span>Account Number</span>
            <button
              type="button"
              onClick={(e) => copyToClipboard(account.accountNumber, 'Account Number', e)}
              className="flex items-center gap-1 text-[9px] text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md"
            >
              {copiedField === 'Account Number' ? (
                <>
                  <Check size={10} className="text-emerald-400" /> Copied
                </>
              ) : (
                <>
                  <Copy size={10} /> Copy
                </>
              )}
            </button>
          </div>
          <div className="font-mono text-base md:text-lg font-black text-slate-100 tracking-widest text-shadow drop-shadow-md">
            {formatCardNumber(account.accountNumber)}
          </div>
        </div>

        {/* IBAN Section (If available) */}
        {account.iban && (
          <div className="relative z-10 mb-4 pt-2 border-t border-white/10">
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center justify-between">
              <span>IBAN Code</span>
              <button
                type="button"
                onClick={(e) => copyToClipboard(account.iban!, 'IBAN', e)}
                className="flex items-center gap-1 text-[9px] text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md"
              >
                {copiedField === 'IBAN' ? (
                  <>
                    <Check size={10} className="text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={10} /> Copy
                  </>
                )}
              </button>
            </div>
            <div className="font-mono text-xs font-bold text-slate-200 tracking-wider truncate">
              {account.iban}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Account Title & Branch / Actions (pushed to exact bottom via mt-auto) */}
      <div className="relative z-10 flex items-end justify-between pt-3 mt-auto border-t border-white/10">
        <div>
          <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
            Account Holder
          </div>
          <div className="font-mono text-xs font-black uppercase tracking-wider text-white drop-shadow">
            {account.accountTitle}
          </div>
          {account.branch && (
            <div className="text-[9px] font-bold text-slate-400 mt-0.5 truncate max-w-[200px]">
              {account.branch}
            </div>
          )}
        </div>

        {/* Admin Quick Action Controls */}
        {isAdmin && (
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/10">
            {onToggleActive && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleActive(account);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  account.isActive
                    ? 'text-emerald-400 hover:bg-emerald-500/20'
                    : 'text-slate-400 hover:bg-white/10'
                }`}
                title={account.isActive ? 'Deactivate' : 'Activate'}
              >
                {account.isActive ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(account);
                }}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/15 rounded-lg transition-colors"
                title="Edit Details"
              >
                <Edit size={15} />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(account.id);
                }}
                className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 rounded-lg transition-colors"
                title="Delete Account"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
