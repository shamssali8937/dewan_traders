import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pricingApi } from '@/services/endpoints';
import { toast } from 'sonner';

// ─── Query Keys ────────────────────────────────────────────────────────────────
export const PRICING_KEYS = {
  shipping: ['pricing', 'shipping'] as const,
  products: ['pricing', 'products'] as const,
  product: (productId: string) => ['pricing', 'product', productId] as const,
};

// ─── SHIPPING CONFIG ──────────────────────────────────────────────────────────

/** Fetch the global shipping config (public). Cached 5 minutes. */
export function useShippingConfig() {
  return useQuery({
    queryKey: PRICING_KEYS.shipping,
    queryFn: async () => {
      const res = await pricingApi.getShippingConfig();
      return res.data.data as ShippingConfig | null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

/** Admin: update the global shipping config. */
export function useUpdateShippingConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ShippingConfig>) => pricingApi.updateShippingConfig(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRICING_KEYS.shipping });
      toast.success('Shipping configuration updated successfully');
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || 'Failed to update shipping config'),
  });
}

// ─── PRODUCT PRICING ──────────────────────────────────────────────────────────

/** Fetch pricing for a single product (public). Cached 5 minutes. */
export function useProductPricing(productId: string | undefined) {
  return useQuery({
    queryKey: PRICING_KEYS.product(productId || ''),
    queryFn: async () => {
      const res = await pricingApi.getForProduct(productId!);
      return res.data.data as ProductPricing | null;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

/** Admin: fetch all product pricings list. */
export function useAllProductPricings() {
  return useQuery({
    queryKey: PRICING_KEYS.products,
    queryFn: async () => {
      const res = await pricingApi.getAllPricings();
      return res.data.data as ProductPricing[];
    },
    staleTime: 2 * 60 * 1000,
  });
}

/** Admin: create or update pricing for a product. */
export function useUpsertProductPricing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: Partial<ProductPricing> }) =>
      pricingApi.upsertForProduct(productId, data),
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: PRICING_KEYS.product(variables.productId) });
      qc.invalidateQueries({ queryKey: PRICING_KEYS.products });
      toast.success('Product pricing saved successfully');
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || 'Failed to save pricing'),
  });
}

/** Admin: delete pricing row for a product (reverts to product.price fallback). */
export function useDeleteProductPricing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => pricingApi.deletePricingForProduct(productId),
    onSuccess: (_res, productId) => {
      qc.invalidateQueries({ queryKey: PRICING_KEYS.product(productId) });
      qc.invalidateQueries({ queryKey: PRICING_KEYS.products });
      toast.success('Pricing reset to product default');
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || 'Failed to delete pricing'),
  });
}

// ─── TypeScript Interfaces ────────────────────────────────────────────────────

export interface ProductPricing {
  id: string;
  productId: string;
  product?: { id: string; name: string; slug: string; sku: string };

  pkPrice: number;
  pkUnit: string;
  pkUnitLabel: string;
  pkMoq: number;

  intPrice: number;
  intUnit: string;
  intUnitLabel: string;
  intMoq: number;

  cartonSize?: number | null;
  cartonPriceUsd?: number | null;
  containerEst20ft?: string | null;
  containerEst40ft?: string | null;

  updatedAt: string;
}

export interface ShippingConfig {
  id: string;
  exchangeRatePkrPerUsd: number;
  pkStandardDeliveryCost: number;
  pkExpressDeliveryCost: number;
  pkPremiumPackagingCost: number;
  intContainer20ftReefer: number;
  intContainer40ftReefer: number;
  intContainer20ftDry: number;
  intContainer40ftDry: number;
  intBulkLoose: number;
  packMult20ftReefer: number;
  packMult40ftReefer: number;
  packMult20ftDry: number;
  packMult40ftDry: number;
  intDocumentationCost: number;
  intCustomsClearanceCost: number;
  updatedAt: string;
}
