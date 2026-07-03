'use client';

import { useState } from 'react';
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from '@/hooks/useCms';
import { Plus, Edit2, Trash2, Star, MessageSquare, X, Check, Eye, Search } from 'lucide-react';

export default function AdminTestimonialsPage() {
  const { data, isLoading } = useTestimonials();
  const { mutate: createTestimonial } = useCreateTestimonial();
  const { mutate: updateTestimonial } = useUpdateTestimonial();
  const { mutate: deleteTestimonial } = useDeleteTestimonial();

  const [search, setSearch] = useState('');
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const testimonials = data || [];
  const filtered = testimonials.filter((t: any) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.message.toLowerCase().includes(search.toLowerCase()) ||
    (t.company && t.company.toLowerCase().includes(search.toLowerCase()))
  );

  const handleEdit = (t: any) => {
    setEditingTestimonial(t);
    setName(t.name);
    setPosition(t.position || '');
    setCompany(t.company || '');
    setMessage(t.message);
    setRating(t.rating);
    setImageUrl(t.imageUrl || '');
    setIsActive(t.isActive);
  };

  const handleCreateOpen = () => {
    setIsCreateOpen(true);
    setName('');
    setPosition('');
    setCompany('');
    setMessage('');
    setRating(5);
    setImageUrl('');
    setIsActive(true);
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    updateTestimonial({
      id: editingTestimonial.id,
      data: { name, position, company, message, rating, imageUrl, isActive }
    }, {
      onSuccess: () => setEditingTestimonial(null)
    });
  };

  const saveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    createTestimonial({
      name, position, company, message, rating, imageUrl, isActive
    }, {
      onSuccess: () => setIsCreateOpen(false)
    });
  };

  const handleDelete = (id: string, author: string) => {
    if (confirm(`Delete testimonial from "${author}"?`)) {
      deleteTestimonial(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Testimonials Panel</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-semibold">Publish verified wholesale client reviews and partner feedback</p>
        </div>
        <button onClick={handleCreateOpen}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10">
          <Plus size={14} /> Add Review
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
          <input type="text" placeholder="Search testimonials..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200 shadow-sm" />
        </div>
      </div>

      <div className="glass rounded-3xl border border-slate-100 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-slate-600 font-bold uppercase tracking-wider px-5 py-3.5">Reviewer</th>
                <th className="text-slate-600 font-bold uppercase tracking-wider px-5 py-3.5">Corporate Feedback</th>
                <th className="text-slate-600 font-bold uppercase tracking-wider px-5 py-3.5">Rating</th>
                <th className="text-slate-600 font-bold uppercase tracking-wider px-5 py-3.5">Status</th>
                <th className="text-right text-slate-600 font-bold uppercase tracking-wider px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-5 py-4"><div className="h-4 bg-slate-100 rounded" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center space-y-2">
                    <MessageSquare className="mx-auto text-slate-500" size={32} />
                    <p className="text-slate-600 font-bold uppercase">No testimonials recorded</p>
                  </td>
                </tr>
              ) : (
                filtered.map((t: any) => (
                  <tr key={t.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">{t.name}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{t.position || 'Importer'} &middot; {t.company || 'Global Trade'}</p>
                    </td>
                    <td className="px-5 py-4 max-w-sm italic text-slate-500">"{t.message}"</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: t.rating }).map((_, idx) => (
                          <Star key={idx} size={11} className="fill-amber-400" />
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                        t.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {t.isActive ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(t)}
                          className="p-1.5 rounded-lg hover:bg-sky-50 border border-transparent hover:border-sky-100 text-slate-600 hover:text-primary transition-all">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(t.id, t.name)}
                          className="p-1.5 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100 text-slate-600 hover:text-red-500 transition-all">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/35 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-100 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Add Client Review</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-600 hover:text-slate-800"><X size={16} /></button>
            </div>

            <form onSubmit={saveCreate} className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1.5 block">Reviewer Name *</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. John Doe"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1.5 block">Corporate Position</label>
                  <input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="e.g. Director of Sourcing"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1.5 block">Company Name</label>
                  <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Apex Imports Ltd."
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1.5 block">Rating (1 to 5 Stars)</label>
                  <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800 font-bold">
                    <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                    <option value="3">⭐⭐⭐ (3 Stars)</option>
                    <option value="2">⭐⭐ (2 Stars)</option>
                    <option value="1">⭐ (1 Star)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1.5 block">Review Message *</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} placeholder="Feedback on cargo quality, delivery transit times, or custom checks..."
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800 resize-none font-sans" />
              </div>

              <div className="flex justify-between items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-slate-300 text-primary focus:ring-primary/40 w-4 h-4" />
                  Show Testimonial (Active)
                </label>

                <div className="flex gap-2">
                  <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 border border-slate-200 hover:bg-slate-50 font-bold rounded-xl text-[10px] uppercase tracking-wider">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider shadow-md shadow-primary/10">Publish</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTestimonial && (
        <div className="fixed inset-0 bg-slate-900/35 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-100 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Edit Review</h3>
              <button onClick={() => setEditingTestimonial(null)} className="text-slate-600 hover:text-slate-800"><X size={16} /></button>
            </div>

            <form onSubmit={saveEdit} className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1.5 block">Reviewer Name *</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. John Doe"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1.5 block">Corporate Position</label>
                  <input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="e.g. Director of Sourcing"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1.5 block">Company Name</label>
                  <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Apex Imports Ltd."
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1.5 block">Rating (1 to 5 Stars)</label>
                  <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800 font-bold">
                    <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                    <option value="3">⭐⭐⭐ (3 Stars)</option>
                    <option value="2">⭐⭐ (2 Stars)</option>
                    <option value="1">⭐ (1 Star)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1.5 block">Review Message *</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} placeholder="Feedback on cargo quality, delivery transit times, or custom checks..."
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800 resize-none font-sans" />
              </div>

              <div className="flex justify-between items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-slate-300 text-primary focus:ring-primary/40 w-4 h-4" />
                  Show Testimonial (Active)
                </label>

                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditingTestimonial(null)} className="px-4 py-2 border border-slate-200 hover:bg-slate-50 font-bold rounded-xl text-[10px] uppercase tracking-wider">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider shadow-md shadow-primary/10">Save Changes</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
