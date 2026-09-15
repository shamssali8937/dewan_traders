'use client';

import { useEffect } from 'react';
import { useShippingConfig } from '@/hooks/usePricing';
import { useMarketStore } from '@/store/marketStore';

/**
 * Fetches the shipping config from the DB on app boot and stores it
 * in the Zustand market store. Must be rendered inside QueryProvider.
 */
export default function ShippingConfigInitializer() {
  const { data: shippingConfig } = useShippingConfig();
  const setShippingConfig = useMarketStore((s) => s.setShippingConfig);
  const detectLocation = useMarketStore((s) => s.detectLocation);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  useEffect(() => {
    if (shippingConfig) {
      setShippingConfig(shippingConfig);
    }
  }, [shippingConfig, setShippingConfig]);

  return null;
}
