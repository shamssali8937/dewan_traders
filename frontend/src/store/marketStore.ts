import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getProductPrice, getProductUnit, getProductMoq, formatProductPrice, getPricingDetails, ProductPricingDetails } from '@/lib/pricing';
import type { ShippingConfig } from '@/hooks/usePricing';

export type MarketRegion = 'PK' | 'INT';

// Default shipping config values (used while DB config is loading or unavailable)
const DEFAULT_SHIPPING: Partial<ShippingConfig> = {
  exchangeRatePkrPerUsd: 278,
  pkStandardDeliveryCost: 250,
  pkExpressDeliveryCost: 600,
  pkPremiumPackagingCost: 1500,
  intContainer20ftReefer: 1800,
  intContainer40ftReefer: 2800,
  intContainer20ftDry: 1000,
  intContainer40ftDry: 1500,
  intBulkLoose: 400,
  packMult20ftReefer: 1.15,
  packMult40ftReefer: 1.25,
  packMult20ftDry: 1.04,
  packMult40ftDry: 1.08,
  intDocumentationCost: 150,
  intCustomsClearanceCost: 250,
};

interface MarketState {
  region: MarketRegion;
  hasSetPreference: boolean;

  // Shipping config loaded from DB (may be null while loading)
  shippingConfig: Partial<ShippingConfig> | null;
  
  // Convenience getters (derived from shippingConfig or defaults)
  exchangeRate: number;
  premiumPackagingCost: number;

  setRegion: (region: MarketRegion) => void;
  setShippingConfig: (config: ShippingConfig) => void;
  detectLocation: () => void;
  convertUsdToPkr: (amount: number) => number;
  convertPkrToUsd: (amount: number) => number;
  formatPrice: (amount: number) => string;

  // B2B pricing helpers (fallback to static map if API unavailable)
  getProductPrice: (slugOrSku: string, fallbackPrice?: number) => number;
  getProductUnit: (slugOrSku: string, fallbackUnit?: string) => string;
  getProductMoq: (slugOrSku: string, fallbackMoq?: number) => number;
  formatProductPrice: (slugOrSku: string, fallbackPrice?: number) => string;
  getPricingDetails: (slugOrSku: string) => ProductPricingDetails | undefined;

  // Shipping config accessors (return DB value or default)
  getContainerCost: (containerType: string) => number;
  getPackingMultiplier: (containerType: string) => number;
  getDocumentationCost: () => number;
  getCustomsClearanceCost: () => number;
  getStandardDeliveryCost: () => number;
  getExpressDeliveryCost: () => number;
}

export const useMarketStore = create<MarketState>()(
  persist(
    (set, get) => ({
      region: 'INT',
      hasSetPreference: false,
      shippingConfig: null,

      get exchangeRate() {
        const cfg = get().shippingConfig;
        return cfg?.exchangeRatePkrPerUsd ?? DEFAULT_SHIPPING.exchangeRatePkrPerUsd!;
      },
      get premiumPackagingCost() {
        const cfg = get().shippingConfig;
        return Number(cfg?.pkPremiumPackagingCost ?? DEFAULT_SHIPPING.pkPremiumPackagingCost!);
      },

      setRegion: (region) => set({ region, hasSetPreference: true }),

      setShippingConfig: (config) => {
        // Normalize all Decimal fields to plain numbers when storing
        const normalized: Partial<ShippingConfig> = {
          ...config,
          exchangeRatePkrPerUsd:   Number(config.exchangeRatePkrPerUsd),
          pkStandardDeliveryCost:  Number(config.pkStandardDeliveryCost),
          pkExpressDeliveryCost:   Number(config.pkExpressDeliveryCost),
          pkPremiumPackagingCost:  Number(config.pkPremiumPackagingCost),
          intContainer20ftReefer:  Number(config.intContainer20ftReefer),
          intContainer40ftReefer:  Number(config.intContainer40ftReefer),
          intContainer20ftDry:     Number(config.intContainer20ftDry),
          intContainer40ftDry:     Number(config.intContainer40ftDry),
          intBulkLoose:            Number(config.intBulkLoose),
          packMult20ftReefer:      Number(config.packMult20ftReefer),
          packMult40ftReefer:      Number(config.packMult40ftReefer),
          packMult20ftDry:         Number(config.packMult20ftDry),
          packMult40ftDry:         Number(config.packMult40ftDry),
          intDocumentationCost:    Number(config.intDocumentationCost),
          intCustomsClearanceCost: Number(config.intCustomsClearanceCost),
        };
        set({ shippingConfig: normalized });
      },

      detectLocation: () => {
        if (get().hasSetPreference) return;
        let detected: MarketRegion = 'INT';
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (tz === 'Asia/Karachi') detected = 'PK';
          if (navigator.languages?.some(lang => {
            const l = lang.toLowerCase();
            return l.includes('pk') || l.includes('ur');
          })) detected = 'PK';
        } catch (e) {
          console.error('Error detecting browser region details:', e);
        }
        set({ region: detected });
      },

      convertUsdToPkr: (amount) => amount * get().exchangeRate,
      convertPkrToUsd: (amount) => amount / get().exchangeRate,

      formatPrice: (amount) => {
        const { region, exchangeRate } = get();
        if (region === 'PK') {
          return `₨ ${Math.round(amount * exchangeRate).toLocaleString()}`;
        }
        return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
      },

      // B2B pricing fallback helpers
      getProductPrice: (slugOrSku, fallbackPrice) => getProductPrice(slugOrSku, get().region, fallbackPrice),
      getProductUnit: (slugOrSku, fallbackUnit) => getProductUnit(slugOrSku, get().region, fallbackUnit),
      getProductMoq: (slugOrSku, fallbackMoq) => getProductMoq(slugOrSku, get().region, fallbackMoq),
      formatProductPrice: (slugOrSku, fallbackPrice) => formatProductPrice(slugOrSku, get().region, fallbackPrice),
      getPricingDetails: (slugOrSku) => getPricingDetails(slugOrSku),

      // Shipping config accessors — all wrapped in Number() to guard against Decimal string coercion
      getContainerCost: (containerType) => {
        const cfg = get().shippingConfig ?? DEFAULT_SHIPPING;
        switch (containerType) {
          case '20ft_reefer': return Number(cfg.intContainer20ftReefer ?? 1800);
          case '40ft_reefer': return Number(cfg.intContainer40ftReefer ?? 2800);
          case '20ft_dry':    return Number(cfg.intContainer20ftDry    ?? 1000);
          case '40ft_dry':    return Number(cfg.intContainer40ftDry    ?? 1500);
          case 'bulk_loose':  return Number(cfg.intBulkLoose           ?? 400);
          default:            return 0;
        }
      },
      getPackingMultiplier: (containerType) => {
        const cfg = get().shippingConfig ?? DEFAULT_SHIPPING;
        switch (containerType) {
          case '20ft_reefer': return Number(cfg.packMult20ftReefer ?? 1.15);
          case '40ft_reefer': return Number(cfg.packMult40ftReefer ?? 1.25);
          case '20ft_dry':    return Number(cfg.packMult20ftDry    ?? 1.04);
          case '40ft_dry':    return Number(cfg.packMult40ftDry    ?? 1.08);
          default:            return 1.0;
        }
      },
      getDocumentationCost: () => {
        const cfg = get().shippingConfig ?? DEFAULT_SHIPPING;
        return Number(cfg.intDocumentationCost ?? 150);
      },
      getCustomsClearanceCost: () => {
        const cfg = get().shippingConfig ?? DEFAULT_SHIPPING;
        return Number(cfg.intCustomsClearanceCost ?? 250);
      },
      getStandardDeliveryCost: () => {
        const cfg = get().shippingConfig ?? DEFAULT_SHIPPING;
        return Number(cfg.pkStandardDeliveryCost ?? 250);
      },
      getExpressDeliveryCost: () => {
        const cfg = get().shippingConfig ?? DEFAULT_SHIPPING;
        return Number(cfg.pkExpressDeliveryCost ?? 600);
      },
    }),
    {
      name: 'dewan-market-settings',
      partialize: (state) => ({
        region: state.region,
        hasSetPreference: state.hasSetPreference,
        // Note: shippingConfig is NOT persisted — always fetched fresh from DB
      }),
    }
  )
);
