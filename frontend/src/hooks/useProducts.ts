import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi, categoryApi } from '@/services/endpoints';
import { toast } from 'sonner';

export const PRODUCT_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...PRODUCT_KEYS.lists(), filters] as const,
  details: () => [...PRODUCT_KEYS.all, 'detail'] as const,
  detail: (slug: string) => [...PRODUCT_KEYS.details(), slug] as const,
  featured: () => [...PRODUCT_KEYS.all, 'featured'] as const,
};

export function useProducts(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(params || {}),
    queryFn: async () => {
      const res = await productApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: PRODUCT_KEYS.featured(),
    queryFn: async () => {
      const res = await productApi.getFeatured();
      return res.data.data;
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(slug),
    queryFn: async () => {
      const res = await productApi.getBySlug(slug);
      return res.data.data;
    },
    enabled: !!slug,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => productApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      toast.success('Product created successfully');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create product'),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => productApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      toast.success('Product updated successfully');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update product'),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      toast.success('Product deleted');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to delete product'),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await categoryApi.getAll();
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
