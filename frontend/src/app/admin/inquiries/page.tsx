'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, CheckCircle, Clock, XCircle, MessageSquare, Trash2, Sparkles } from 'lucide-react';
import { useInquiries, useUpdateInquiryStatus, useDeleteInquiry } from '@/hooks/useInquiries';
import { formatDate } from '@/lib/utils';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending', color: 'bg-amber-50 border-amber-100 text-amber-600', icon: Clock },
  read: { label: 'Read', color: 'bg-blue-50 border-blue-100 text-blue-600', icon: Eye },
  responded: { label: 'Responded', color: 'bg-emerald-50 border-emerald-100 text-emerald-600', icon: CheckCircle },
  closed: { label: 'Closed', color: 'bg-slate-100 border-slate-200 text-slate-500', icon: XCircle },
};

export default function AdminInquiriesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const { data, isLoading } = useInquiries({ status: statusFilter || undefined });
  const { mutate: updateStatus } = useUpdateInquiryStatus();
  const { mutate: deleteInquiry } = useDeleteInquiry();

  const inquiries = data?.inquiries || [];
  const filtered = search
    ? inquiries.filter((i: any) =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.email.toLowerCase().includes(search.toLowerCase()) ||
        i.subject.toLowerCase().includes(search.toLowerCase())
      )
    : inquiries;

  const handleStatusUpdate = (id: string, status: string) => {
    updateStatus({ id, status, adminNotes });
    setSelectedInquiry(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Inquiries</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-semibold">{data?.pagination?.total || 0} total trade submissions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search by sender name, email, or subject..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200 shadow-sm" />
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {['', 'pending', 'read', 'responded', 'closed'].map((s) => {
            const cfg = s ? STATUS_CONFIG[s] : null;
            return (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                  statusFilter === s
                    ? 'bg-gradient-to-r from-primary to-sky-600 text-white shadow-sm'
                    : 'glass text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}>
                {s ? STATUS_CONFIG[s].label : 'All'}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* List Column */}
        <div className="lg:col-span-1 space-y-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-4 animate-pulse bg-white border border-slate-100">
                <div className="h-4 bg-slate-100 rounded mb-2 w-1/2" />
                <div className="h-3 bg-slate-100 rounded w-5/6" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center bg-white border border-slate-100 shadow-sm space-y-2">
              <MessageSquare className="mx-auto text-slate-300" size={32} />
              <p className="text-xs text-slate-400 font-bold uppercase">No inquiries registered</p>
            </div>
          ) : (
            filtered.map((inquiry: any) => {
              const cfg = STATUS_CONFIG[inquiry.status] || STATUS_CONFIG.pending;
              const Icon = cfg.icon;
              return (
                <button key={inquiry.id}
                  onClick={() => { setSelectedInquiry(inquiry); setAdminNotes(inquiry.adminNotes || ''); }}
                  className={`w-full text-left glass rounded-2xl p-4 border transition-all hover:bg-slate-50/20 shadow-sm flex flex-col justify-between ${
                    selectedInquiry?.id === inquiry.id
                      ? 'border-primary/50 bg-sky-50/40'
                      : 'border-slate-100 bg-white/80'
                  }`}>
                  <div className="flex items-start justify-between gap-2 mb-2 w-full">
                    <p className="text-xs font-bold text-slate-800 truncate">{inquiry.name}</p>
                    <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-bold border capitalize shrink-0 ${cfg.color}`}>
                      <Icon size={9} /> {cfg.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate font-semibold mb-2">{inquiry.subject}</p>
                  <p className="text-[9px] text-slate-400 font-bold tracking-wide uppercase">{formatDate(inquiry.createdAt)}</p>
                </button>
              );
            })
          )}
        </div>

        {/* Detail Column */}
        <div className="lg:col-span-2">
          {!selectedInquiry ? (
            <div className="glass rounded-3xl p-16 text-center border border-slate-100 bg-white/80 h-full flex flex-col items-center justify-center shadow-sm space-y-3">
              <MessageSquare className="text-slate-300" size={36} />
              <p className="text-slate-400 text-xs font-bold uppercase">Select an inquiry to view details</p>
            </div>
          ) : (
            <motion.div key={selectedInquiry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-6 border border-slate-100 bg-white/80 shadow-md space-y-6">
              
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{selectedInquiry.subject}</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{formatDate(selectedInquiry.createdAt)}</p>
                </div>
                <button onClick={() => {
                  if (confirm('Delete this inquiry?')) { deleteInquiry(selectedInquiry.id); setSelectedInquiry(null); }
                }} className="p-2 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100 text-slate-400 hover:text-red-500 transition-all shadow-sm">
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Sender Details Grid */}
              <div className="grid sm:grid-cols-2 gap-4 p-4.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold text-slate-700">
                {[
                  ['Name', selectedInquiry.name],
                  ['Email', selectedInquiry.email],
                  ['Phone / WhatsApp', selectedInquiry.phone || '—'],
                  ['Company', selectedInquiry.company || '—'],
                  ['Target Product', selectedInquiry.productName || '—'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">{label}</p>
                    <p className="text-slate-800 mt-1 font-bold">{value}</p>
                  </div>
                ))}
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Client Message</p>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-2xl p-4">{selectedInquiry.message}</p>
              </div>

              {/* Internal Notes */}
              <div className="space-y-2">
                <label className="text-[9px] text-slate-400 uppercase tracking-widest font-bold block">Internal Admin Notes</label>
                <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={3}
                  placeholder="Add internal notes..."
                  className="w-full px-3 py-2 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200 resize-none shadow-sm" />
              </div>

              {/* Status Update Actions */}
              <div className="space-y-2.5">
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
                    <button key={status} onClick={() => handleStatusUpdate(selectedInquiry.id, status)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                        selectedInquiry.status === status
                          ? cfg.color
                          : 'glass text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-slate-200'
                      }`}>
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
