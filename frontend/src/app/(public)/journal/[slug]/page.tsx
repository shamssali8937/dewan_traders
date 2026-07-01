'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useJournalPost, useJournalPosts } from '@/hooks/useCms';
import { formatDate, resolveImageUrl } from '@/lib/utils';
import { Clock, Calendar, User, Tag, ChevronRight, Globe, ArrowRight } from 'lucide-react';

export default function JournalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: post, isLoading, error } = useJournalPost(slug);
  const { data: recentData } = useJournalPosts({ limit: 4 });

  const recentPosts = recentData?.posts?.filter((p: any) => p.slug !== slug).slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="pt-32 min-h-screen max-w-4xl mx-auto px-6 space-y-10 animate-pulse bg-white">
        <div className="h-4 bg-slate-100 rounded w-1/4" />
        <div className="h-10 bg-slate-100 rounded w-3/4" />
        <div className="h-64 bg-slate-100 rounded-2xl border border-slate-100" />
        <div className="space-y-4">
          <div className="h-4 bg-slate-100 rounded" />
          <div className="h-4 bg-slate-100 rounded" />
          <div className="h-4 bg-slate-100 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-32 min-h-screen text-center max-w-lg mx-auto px-6 bg-white">
        <h2 className="text-sm font-bold text-slate-800 uppercase">Article Not Found</h2>
        <p className="text-slate-500 text-xs mt-1 mb-6">The article you are trying to view does not exist or has been removed.</p>
        <Link href="/journal" className="px-6 py-3 bg-gradient-to-r from-primary to-sky-600 text-white font-bold rounded-xl inline-block text-xs uppercase tracking-wider shadow-sm">
          Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-28 pb-20 relative overflow-hidden pattern-dots-light">
      
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="fluid-blob bg-sky-50 w-[400px] h-[400px] top-[15%] right-[-100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Back Button & Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-8 border-b border-slate-100 pb-4">
          <Link href="/journal" className="hover:text-primary transition-colors">Journal</Link>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-slate-700 truncate max-w-xs">{post.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* Main Article Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">{post.title}</h1>
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 font-semibold uppercase pt-2 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-1.5"><Calendar size={13} className="text-primary shrink-0" /> {formatDate(post.publishedAt || new Date())}</div>
                <div className="flex items-center gap-1.5"><Clock size={13} className="text-primary shrink-0" /> {post.readTime || 5} min read</div>
                <div className="flex items-center gap-1.5"><User size={13} className="text-primary shrink-0" /> {post.author || 'Dewan Traders'}</div>
              </div>
            </motion.div>

            {/* Article Feature Image */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass rounded-2xl overflow-hidden aspect-video border border-slate-100 shadow-sm bg-slate-50 flex items-center justify-center">
              {post.imageUrl ? (
                <img src={resolveImageUrl(post.imageUrl)} alt={post.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-300 text-4xl">📰</div>
              )}
            </motion.div>

            {/* Article Text Content */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-5 pt-4">
              {post.content.split('\n\n').map((paragraph: string, idx: number) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </motion.div>

            {/* Tags Footer */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2 pt-6 border-t border-slate-100">
                <Tag size={13} className="text-slate-400" />
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="text-[9px] px-2.5 py-0.5 bg-sky-50 border border-sky-100 text-primary rounded-full font-bold uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar CTA & Recent Posts */}
          <div className="space-y-8">
            
            {/* Lead Sourcing CTA Card */}
            <div className="glass rounded-3xl p-6 border border-slate-100 relative overflow-hidden bg-gradient-to-br from-slate-50 to-sky-50/50 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-sky-100 border border-sky-200 text-primary flex items-center justify-center mb-4">
                <Globe size={18} />
              </div>
              <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wide mb-2">Importing from Pakistan?</h3>
              <p className="text-[11px] text-slate-500 mb-6 leading-relaxed">
                Dewan Traders manages direct sourcing, phytosanitary checks, packing standards, and shipping customs clearance for global clients.
              </p>
              <div className="space-y-3">
                <Link href="/catalog" className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-sm">
                  Browse Catalog
                </Link>
                <Link href="/contact" className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors">
                  Contact Sourcing Team &rarr;
                </Link>
              </div>
            </div>

            {/* Recent Posts Section */}
            {recentPosts.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-slate-800 font-bold text-xs uppercase tracking-widest border-b border-slate-100 pb-2">Recent Insights</h3>
                <div className="space-y-4">
                  {recentPosts.map((p: any) => (
                    <Link key={p.id} href={`/journal/${p.slug}`} className="group block">
                      <div className="glass rounded-2xl p-3.5 border border-slate-100 bg-white/70 card-hover flex gap-3.5 items-center shadow-sm">
                        <div className="w-16 h-12 bg-slate-50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                          {p.imageUrl ? (
                            <img src={resolveImageUrl(p.imageUrl)} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-slate-300 text-xs">📰</div>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-[11px] font-bold text-slate-800 group-hover:text-primary transition-colors truncate uppercase tracking-wide">{p.title}</h4>
                          <span className="text-[9px] text-slate-400 block mt-1">{p.readTime || 5} min read</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
