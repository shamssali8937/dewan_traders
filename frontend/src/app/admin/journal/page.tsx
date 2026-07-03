'use client';

import { useState } from 'react';
import { useAdminJournalPosts, useCreateJournalPost, useUpdateJournalPost, useDeleteJournalPost } from '@/hooks/useCms';
import { Plus, Edit2, Trash2, Search, Newspaper, Check, X, Eye, Image as ImageIcon, Loader } from 'lucide-react';
import { formatDate, resolveImageUrl } from '@/lib/utils';
import { productApi } from '@/services/endpoints';
import { toast } from 'sonner';

export default function AdminJournalPage() {
  const [search, setSearch] = useState('');
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [uploading, setUploading] = useState(false);

  const { data, isLoading } = useAdminJournalPosts();
  const { mutate: createPost } = useCreateJournalPost();
  const { mutate: updatePost } = useUpdateJournalPost();
  const { mutate: deletePost } = useDeleteJournalPost();

  const posts: any[] = Array.isArray(data) ? data : (data as any)?.posts ?? [];
  const filtered = posts.filter((p: any) =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    (p.summary || p.excerpt || '')?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setTitle(post.title);
    setSummary(post.summary || '');
    setContent(post.content || '');
    setSlug(post.slug);
    setImageUrl(post.imageUrl || '');
    setIsPublished(post.isPublished || false);
  };

  const handleCreateOpen = () => {
    setIsCreateOpen(true);
    setTitle('');
    setSummary('');
    setContent('');
    setSlug('');
    setImageUrl('');
    setIsPublished(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await productApi.uploadImage(formData);
      setImageUrl(res.data.data.imageUrl);
      toast.success('Journal image uploaded!');
    } catch {
      toast.error('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return;
    updatePost({
      id: editingPost.id,
      data: { title, summary, content, slug, imageUrl, isPublished }
    }, {
      onSuccess: () => setEditingPost(null)
    });
  };

  const saveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return;
    createPost({
      title, summary, content, slug, imageUrl, isPublished
    }, {
      onSuccess: () => setIsCreateOpen(false)
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete post "${name}"?`)) {
      deletePost(id);
    }
  };

  const autoGenerateSlug = (val: string) => {
    setTitle(val);
    setSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Journal Desk</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-semibold">Publish news, insights, and global cargo updates</p>
        </div>
        <button onClick={handleCreateOpen}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10">
          <Plus size={14} /> Write Post
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
          <input type="text" placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200 shadow-sm" />
        </div>
      </div>

      {/* Grid List */}
      <div className="glass rounded-3xl border border-slate-100 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-slate-600 font-bold uppercase tracking-wider px-5 py-3.5">Article</th>
                <th className="text-slate-600 font-bold uppercase tracking-wider px-5 py-3.5">Slug</th>
                <th className="text-slate-600 font-bold uppercase tracking-wider px-5 py-3.5">Publish Status</th>
                <th className="text-slate-600 font-bold uppercase tracking-wider px-5 py-3.5">Date</th>
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
                    <Newspaper className="mx-auto text-slate-500" size={32} />
                    <p className="text-slate-600 font-bold uppercase">No articles published</p>
                  </td>
                </tr>
              ) : (
                filtered.map((post: any) => (
                  <tr key={post.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-5 py-4 max-w-sm">
                      <p className="font-bold text-slate-800 truncate">{post.title}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5 truncate">{post.summary || 'No summary provided.'}</p>
                    </td>
                    <td className="px-5 py-4 font-mono text-[10px] text-slate-500">{post.slug}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                        post.isPublished ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 font-bold tracking-wide text-[10px]">{formatDate(post.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(post)}
                          className="p-1.5 rounded-lg hover:bg-sky-50 border border-transparent hover:border-sky-100 text-slate-600 hover:text-primary transition-all">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(post.id, post.title)}
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
          <div className="w-full max-w-2xl bg-white border border-slate-100 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Publish New Article</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-600 hover:text-slate-800"><X size={16} /></button>
            </div>

            <form onSubmit={saveCreate} className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1 block">Title *</label>
                  <input value={title} onChange={(e) => autoGenerateSlug(e.target.value)} required placeholder="e.g. Rice Exports Reach Record High"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1 block">URL Slug *</label>
                  <input value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="rice-exports-record"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800 font-mono" />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1 block">Summary / Teaser</label>
                <input value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short intro displayed on the journal list index..."
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1.5 block">Banner Image</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                      id="create-post-image-file"
                    />
                    <label
                      htmlFor="create-post-image-file"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-all disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <Loader size={13} className="animate-spin text-primary" /> Uploading...
                        </>
                      ) : (
                        <>
                          <ImageIcon size={13} /> Upload File
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {imageUrl && (
                  <div className="w-16 h-10 rounded-lg border border-slate-100 overflow-hidden bg-slate-50 relative shrink-0">
                    <img
                      src={resolveImageUrl(imageUrl)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1 block">Post Content *</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={6} placeholder="Full markdown or HTML content..."
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800 font-sans resize-none" />
              </div>

              <div className="flex justify-between items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded border-slate-300 text-primary focus:ring-primary/40 w-4 h-4" />
                  Publish immediately (Active)
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
      {editingPost && (
        <div className="fixed inset-0 bg-slate-900/35 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white border border-slate-100 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Edit Article</h3>
              <button onClick={() => setEditingPost(null)} className="text-slate-600 hover:text-slate-800"><X size={16} /></button>
            </div>

            <form onSubmit={saveEdit} className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1 block">Title *</label>
                  <input value={title} onChange={(e) => autoGenerateSlug(e.target.value)} required placeholder="e.g. Rice Exports Reach Record High"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1 block">URL Slug *</label>
                  <input value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="rice-exports-record"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800 font-mono" />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1 block">Summary / Teaser</label>
                <input value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short intro displayed on the journal list index..."
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1.5 block">Banner Image</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                      id="edit-post-image-file"
                    />
                    <label
                      htmlFor="edit-post-image-file"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-all disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <Loader size={13} className="animate-spin text-primary" /> Uploading...
                        </>
                      ) : (
                        <>
                          <ImageIcon size={13} /> Upload File
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {imageUrl && (
                  <div className="w-16 h-10 rounded-lg border border-slate-100 overflow-hidden bg-slate-50 relative shrink-0">
                    <img
                      src={resolveImageUrl(imageUrl)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] text-slate-600 uppercase tracking-widest mb-1 block">Post Content *</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={6} placeholder="Full markdown or HTML content..."
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800 font-sans resize-none" />
              </div>

              <div className="flex justify-between items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded border-slate-300 text-primary focus:ring-primary/40 w-4 h-4" />
                  Publish immediately (Active)
                </label>

                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditingPost(null)} className="px-4 py-2 border border-slate-200 hover:bg-slate-50 font-bold rounded-xl text-[10px] uppercase tracking-wider">Cancel</button>
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
