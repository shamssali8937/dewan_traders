import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inquiryApi } from '@/services/endpoints';
import { toast } from 'sonner';

export function useInquiries(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['inquiries', params],
    queryFn: async () => {
      const res = await inquiryApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useCreateInquiry() {
  return useMutation({
    mutationFn: (data: unknown) => inquiryApi.create(data),
    onSuccess: () => toast.success('Inquiry submitted! We\'ll get back to you shortly.'),
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to submit inquiry'),
  });
}

export function useUpdateInquiryStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; status: string; adminNotes?: string }) =>
      inquiryApi.updateStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inquiries'] });
      toast.success('Inquiry updated');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update inquiry'),
  });
}

export function useDeleteInquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => inquiryApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inquiries'] });
      toast.success('Inquiry deleted');
    },
  });
}
