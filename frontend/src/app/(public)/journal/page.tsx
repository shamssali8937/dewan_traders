'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import { useJournalPosts } from '@/hooks/useCms';
import { formatDate, resolveImageUrl } from '@/lib/utils';

export default function JournalPage() {
  const { data, isLoading } = useJournalPosts();
  const posts = data?.posts || [];

  return (
    <div className="bg-white min-h-screen pt-24 relative overflow-hidden pattern-dots-light">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-50 w-[450px] h-[450px] top-[15%] right-[-100px]" />
      </div>

      {/* ═══ HERO SECTION ═══════════════════════════════════════════ */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 mb-2">
              <Sparkles size={12} /> News & Insights
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
              Dewan <span className="gradient-text-sky">Journal</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed">
              Trade insights, product updates, export tips, and news from Pakistan's agriculture and manufacturing sectors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ POSTS LISTING ══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 relative z-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse bg-white border border-slate-100">
                <div className="h-48 bg-slate-50" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                  <div className="h-5 bg-slate-100 rounded" />
                  <div className="h-3 bg-slate-100 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">📰</div>
            <h3 className="text-xs font-bold text-slate-800 uppercase">No articles published</h3>
            <p className="text-slate-600 text-xs mt-1">Check back soon for custom trade market reports.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any, i: number) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/journal/${post.slug}`} className="group block">
                  <div className="glass rounded-2xl overflow-hidden card-hover border border-slate-100 bg-white/80 shadow-sm flex flex-col h-full">
                    {/* Feature Image */}
                    <div className="h-48 bg-slate-50 flex items-center justify-center border-b border-slate-100 relative overflow-hidden shrink-0">
                      {post.imageUrl ? (
                        <img src={resolveImageUrl(post.imageUrl)} alt={post.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                      ) : (
                        <div className="text-slate-500 text-3xl font-bold">📰</div>
                      )}
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {post.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {post.tags.slice(0, 2).map((tag: string) => (
                              <span key={tag} className="text-[9px] px-2.5 py-0.5 bg-sky-50 border border-sky-100 text-primary rounded-full font-bold uppercase tracking-wider">{tag}</span>
                            ))}
                          </div>
                        )}
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-relaxed">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-[11px] text-slate-500 line-clamp-3 mb-4 leading-relaxed">{post.excerpt}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-semibold uppercase">
                          <Clock size={11} className="text-primary shrink-0" />
                          {post.readTime ? `${post.readTime} min read` : formatDate(post.publishedAt || new Date())}
                        </div>
                        <span className="text-slate-600 group-hover:text-primary transition-colors flex items-center gap-0.5 uppercase font-bold text-[9px] tracking-wider">
                          Read Article <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
