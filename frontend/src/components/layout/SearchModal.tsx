'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, History, TrendingUp, ArrowRight, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';
import { useMarketStore } from '@/store/marketStore';
import { resolveImageUrl } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  'Chaunsa Mango',
  'Super Kernel Basmati Rice',
  'Thermo Bonded Football',
  'Surgical Scissors Set',
  'Potatoes'
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { data } = useProducts();
  const productsList = data?.products || data || [];
  const { formatProductPrice, getProductUnit } = useMarketStore();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
      // Load recent searches
      const stored = localStorage.getItem('dewan_recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSearchSubmit = (searchWord: string) => {
    if (!searchWord.trim()) return;
    const updated = [searchWord, ...recentSearches.filter(s => s !== searchWord)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('dewan_recent_searches', JSON.stringify(updated));
    setQuery(searchWord);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('dewan_recent_searches');
  };

  const filteredProducts = query.trim() === '' 
    ? [] 
    : productsList.filter((p: any) => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-xl text-white"
        >
          {/* Close Header */}
          <div className="flex items-center justify-between px-6 lg:px-12 py-5 border-b border-white/10">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white/50">Dewan B2B Global Trade Search</span>
            <button 
              onClick={onClose} 
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Input Body */}
          <div className="flex-1 overflow-y-auto px-6 lg:px-12 py-8 max-w-5xl mx-auto w-full space-y-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={24} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(query)}
                placeholder="Search premium fruits, rice, sports gear, surgical sets..."
                className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-lg lg:text-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder-white/30"
              />
            </div>

            {/* Results or Suggestions */}
            {query.trim() === '' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Popular Searches */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                    <TrendingUp size={12} className="text-primary" /> Popular Exports
                  </h3>
                  <div className="flex flex-col gap-2">
                    {POPULAR_SEARCHES.map((search) => (
                      <button
                        key={search}
                        onClick={() => handleSearchSubmit(search)}
                        className="flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-left text-white/80 hover:text-white transition-all group"
                      >
                        {search}
                        <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                      <History size={12} /> Recent Inquiries
                    </h3>
                    {recentSearches.length > 0 && (
                      <button 
                        onClick={clearRecentSearches} 
                        className="text-[9px] font-bold text-white/40 hover:text-red-400 transition-colors uppercase tracking-wider"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  {recentSearches.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {recentSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => setQuery(search)}
                          className="flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-left text-white/80 hover:text-white transition-all group"
                        >
                          <span className="flex items-center gap-2">
                            <History size={12} className="text-white/40" />
                            {search}
                          </span>
                          <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-2xl border border-white/5 text-white/30 text-xs">
                      <History size={20} className="mb-2 opacity-50" />
                      No recent searches.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    Search Results ({filteredProducts.length})
                  </span>
                  <button 
                    onClick={() => setQuery('')} 
                    className="text-[9px] font-bold text-primary hover:underline uppercase tracking-wider"
                  >
                    Clear Search
                  </button>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProducts.map((p: any) => (
                      <Link
                        key={p.id}
                        href={`/catalog/${p.category?.slug || 'products'}/${p.slug}`}
                        onClick={onClose}
                        className="flex gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-primary/50 transition-all group"
                      >
                        <div className="w-16 h-16 rounded-xl bg-white/10 overflow-hidden shrink-0 flex items-center justify-center relative border border-white/5">
                          {p.imageUrl ? (
                            <img src={resolveImageUrl(p.imageUrl)} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={20} className="text-white/40" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] text-primary uppercase font-bold tracking-widest">{p.category?.name}</span>
                            <h4 className="text-xs font-bold truncate group-hover:text-primary transition-colors text-white/95 mt-0.5">{p.name}</h4>
                          </div>
                          <div className="flex items-center justify-between text-[11px] font-bold mt-1">
                            <span className="text-white">
                              {formatProductPrice(p.slug, p.price)}
                              <span className="text-white/40 font-normal">/{getProductUnit(p.slug, p.unit)}</span>
                            </span>
                            <span className="text-[9px] text-white/50 uppercase font-medium">RFQ Enabled</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-white/30 text-center space-y-3">
                    <Search size={40} className="opacity-30" />
                    <div>
                      <p className="text-sm font-bold text-white/80">No B2B commodities found</p>
                      <p className="text-[11px] text-white/40 mt-1">Try searching for generic terms like "mango", "rice", "scissors" or "bat".</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
