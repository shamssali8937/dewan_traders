import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getProductPrice, getProductUnit, getProductMoq, formatProductPrice, getPricingDetails, ProductPricingDetails } from '@/lib/pricing';

export type MarketRegion = 'PK' | 'INT';

interface MarketState {
  region: MarketRegion;
  exchangeRate: number; // 1 USD = X PKR
  premiumPackagingCost: number; // in PKR
  hasSetPreference: boolean;
  setRegion: (region: MarketRegion) => void;
  setExchangeRate: (rate: number) => void;
  setPremiumPackagingCost: (cost: number) => void;
  convertUsdToPkr: (amount: number) => number;
  convertPkrToUsd: (amount: number) => number;
  formatPrice: (amount: number) => string;
  detectLocation: () => void;
  
  // Custom B2B pricing overrides
  getProductPrice: (slugOrSku: string, fallbackPrice?: number) => number;
  getProductUnit: (slugOrSku: string, fallbackUnit?: string) => string;
  getProductMoq: (slugOrSku: string, fallbackMoq?: number) => number;
  formatProductPrice: (slugOrSku: string, fallbackPrice?: number) => string;
  getPricingDetails: (slugOrSku: string) => ProductPricingDetails | undefined;
}

export const useMarketStore = create<MarketState>()(
  persist(
    (set, get) => ({
      region: 'INT',
      exchangeRate: 278,
      premiumPackagingCost: 1500, // PKR 1,500 standard
      hasSetPreference: false,

      setRegion: (region) => set({ region, hasSetPreference: true }),
      setExchangeRate: (exchangeRate) => set({ exchangeRate }),
      setPremiumPackagingCost: (premiumPackagingCost) => set({ premiumPackagingCost }),

      convertUsdToPkr: (amount) => {
        return amount * get().exchangeRate;
      },

      convertPkrToUsd: (amount) => {
        return amount / get().exchangeRate;
      },

      formatPrice: (amount) => {
        const { region, exchangeRate } = get();
        if (region === 'PK') {
          return `₨ ${Math.round(amount * exchangeRate).toLocaleString()}`;
        } else {
          return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
        }
      },

      detectLocation: () => {
        if (get().hasSetPreference) return;

        let detected: MarketRegion = 'INT';
        
        try {
          // Check browser timezone
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (tz === 'Asia/Karachi') {
            detected = 'PK';
          }

          // Check navigator languages
          if (navigator.languages && navigator.languages.some(lang => {
            const l = lang.toLowerCase();
            return l.includes('pk') || l.includes('ur');
          })) {
            detected = 'PK';
          }
        } catch (e) {
          console.error('Error detecting browser region details:', e);
        }

        set({ region: detected });
      },

      // Custom pricing getters mapped to state's active region
      getProductPrice: (slugOrSku, fallbackPrice) => {
        return getProductPrice(slugOrSku, get().region, fallbackPrice);
      },
      
      getProductUnit: (slugOrSku, fallbackUnit) => {
        return getProductUnit(slugOrSku, get().region, fallbackUnit);
      },
      
      getProductMoq: (slugOrSku, fallbackMoq) => {
        return getProductMoq(slugOrSku, get().region, fallbackMoq);
      },
      
      formatProductPrice: (slugOrSku, fallbackPrice) => {
        return formatProductPrice(slugOrSku, get().region, fallbackPrice);
      },

      getPricingDetails: (slugOrSku) => {
        return getPricingDetails(slugOrSku);
      }
    }),
    {
      name: 'dewan-market-settings',
      partialize: (state) => ({
        region: state.region,
        exchangeRate: state.exchangeRate,
        premiumPackagingCost: state.premiumPackagingCost,
        hasSetPreference: state.hasSetPreference,
      }),
    }
  )
);
