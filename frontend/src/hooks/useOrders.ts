import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '@/services/endpoints';
import { toast } from 'sonner';

export function useMyOrders() {
  return useQuery({
    queryKey: ['orders', 'my'],
    queryFn: async () => {
      const res = await orderApi.getMyOrders();
      return res.data.data;
    },
  });
}

export function useAllOrders(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['orders', 'all', params],
    queryFn: async () => {
      const res = await orderApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const res = await orderApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => orderApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order placed successfully!');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to place order'),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; status: string; trackingNumber?: string }) =>
      orderApi.updateStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated');
    },
  });
}
