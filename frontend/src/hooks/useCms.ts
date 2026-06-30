import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, journalApi, cmsApi } from '@/services/endpoints';
import { toast } from 'sonner';

export function useJournalPosts(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['journal', params],
    queryFn: async () => {
      const res = await journalApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useJournalPost(slug: string) {
  return useQuery({
    queryKey: ['journal', 'post', slug],
    queryFn: async () => {
      const res = await journalApi.getBySlug(slug);
      return res.data.data;
    },
    enabled: !!slug,
  });
}

export function useCreateJournalPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => journalApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['journal'] }); toast.success('Post created'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create post'),
  });
}

export function useUpdateJournalPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => journalApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['journal'] }); toast.success('Post updated'); },
  });
}

export function useDeleteJournalPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => journalApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['journal'] }); toast.success('Post deleted'); },
  });
}

// ─── CMS Hooks ─────────────────────────────────────────────────────

export function usePageContent(page: string) {
  return useQuery({
    queryKey: ['cms', 'page', page],
    queryFn: async () => {
      const res = await cmsApi.getPage(page);
      return res.data.data;
    },
    enabled: !!page,
  });
}

export function useContactInfo() {
  return useQuery({
    queryKey: ['cms', 'contact'],
    queryFn: async () => {
      const res = await cmsApi.getContactInfo();
      return res.data.data;
    },
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ['cms', 'testimonials'],
    queryFn: async () => {
      const res = await cmsApi.getTestimonials();
      return res.data.data;
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['cms', 'dashboard'],
    queryFn: async () => {
      const res = await cmsApi.getDashboardStats();
      return res.data.data;
    },
    refetchInterval: 30000,
  });
}

export function useUpdatePageContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ page, data }: { page: string; data: unknown }) => cmsApi.updatePage(page, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['cms', 'page', vars.page] });
      toast.success('Page content updated');
    },
  });
}

export function useAdminJournalPosts(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['journal', 'admin', params],
    queryFn: async () => {
      const res = await journalApi.getAllAdmin(params);
      return res.data.data;
    },
  });
}

export function useUpdateContactInfo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => cmsApi.updateContactInfo(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cms', 'contact'] });
      toast.success('Contact info updated');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update contact info'),
  });
}

export function useCreateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => cmsApi.createTestimonial(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cms', 'testimonials'] });
      toast.success('Testimonial created');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create testimonial'),
  });
}

export function useUpdateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => cmsApi.updateTestimonial(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cms', 'testimonials'] });
      toast.success('Testimonial updated');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update testimonial'),
  });
}

export function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cmsApi.deleteTestimonial(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cms', 'testimonials'] });
      toast.success('Testimonial deleted');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to delete testimonial'),
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const res = await authApi.getUsers();
      return res.data.data;
    },
  });
}

