// Enterprise B2B Pricing Utility for Dewan Traders
// Sourced from Sargodha & Sialkot market rates and export standards.
//
// NOTE: The DEFAULT_PRICING_MAP below is used as:
//   1. A fallback when the pricing API is unavailable
//   2. The "Reset to Defaults" values in the admin pricing editor
// Live pricing is fetched from the database via /api/pricing/product/:productId

export interface ProductPricingDetails {
  slug: string;
  // Domestic (Pakistan)
  pkPrice: number;       // Price in PKR per kg/piece/set
  pkUnit: string;        // e.g. "kg", "piece", "set"
  pkMoq: number;         // MOQ (e.g. 10 for kg, 1 for items)
  pkUnitLabel: string;   // e.g. "kg", "piece", "set"
  
  // International (Export)
  intPrice: number;      // Price in USD per unit
  intUnit: string;       // e.g. "kg", "carton", "Metric Ton (MT)", "piece", "set"
  intMoq: number;        // MOQ
  intUnitLabel: string;  // e.g. "carton", "MT", "piece", "set"
  
  // Logistics metadata for export
  cartonSize?: number;       // e.g. units in one carton
  cartonPriceUsd?: number;   // Carton price in USD (if applicable)
  containerEstimate20ft?: string; // Est. quantity in 20ft container
  containerEstimate40ft?: string; // Est. quantity in 40ft container
}

/** Default/fallback pricing map — mirrors the DB defaults.
 *  Used when API is unavailable or as a reset baseline in the admin UI. */
export const DEFAULT_PRICING_MAP: Record<string, ProductPricingDetails> = {

  // --- FRESH FRUITS ---
  // Prices: PKR = Sargodha wholesale Sep 2025 | USD = FOB Karachi/Port Qasim Sep 2025
  'kinnow-mandarin': {
    slug: 'kinnow-mandarin',
    pkPrice: 120,            // ₨120/kg wholesale
    pkUnit: 'kg', pkMoq: 100, pkUnitLabel: 'kg',
    intPrice: 9.50,          // $9.50/10kg carton ≈ $950/MT FOB
    intUnit: 'carton (10 kg)', intMoq: 1000, intUnitLabel: 'cartons',
    cartonSize: 1, cartonPriceUsd: 9.50,
    containerEstimate20ft: '2,200 Cartons (approx. 22 Metric Tons)',
    containerEstimate40ft: '2,800 Cartons (approx. 28 Metric Tons)',
  },
  'mango-chaunsa': {
    slug: 'mango-chaunsa',
    pkPrice: 350,            // ₨350/kg
    pkUnit: 'kg', pkMoq: 50, pkUnitLabel: 'kg',
    intPrice: 18.50,         // $18.50/4kg carton — premium export season
    intUnit: 'carton (4 kg)', intMoq: 500, intUnitLabel: 'cartons',
    cartonSize: 1, cartonPriceUsd: 18.50,
    containerEstimate20ft: '3,500 Cartons (approx. 14 Metric Tons)',
    containerEstimate40ft: '4,500 Cartons (approx. 18 Metric Tons)',
  },
  'blood-orange': {
    slug: 'blood-orange',
    pkPrice: 220,
    pkUnit: 'kg', pkMoq: 50, pkUnitLabel: 'kg',
    intPrice: 11.00,
    intUnit: 'carton (10 kg)', intMoq: 500, intUnitLabel: 'cartons',
    cartonSize: 1, cartonPriceUsd: 11.00,
    containerEstimate20ft: '2,200 Cartons (approx. 22 Metric Tons)',
    containerEstimate40ft: '2,800 Cartons (approx. 28 Metric Tons)',
  },
  'guava': {
    slug: 'guava',
    pkPrice: 180,
    pkUnit: 'kg', pkMoq: 100, pkUnitLabel: 'kg',
    intPrice: 12.00,
    intUnit: 'carton (5 kg)', intMoq: 400, intUnitLabel: 'cartons',
    cartonSize: 1, cartonPriceUsd: 12.00,
    containerEstimate20ft: '3,800 Cartons (approx. 19 Metric Tons)',
    containerEstimate40ft: '4,800 Cartons (approx. 24 Metric Tons)',
  },

  // --- VEGETABLES ---
  'fresh-onion': {           // ← matches DB product slug
    slug: 'fresh-onion',
    pkPrice: 150,
    pkUnit: 'kg', pkMoq: 500, pkUnitLabel: 'kg',
    intPrice: 380.00,        // $380/MT FOB
    intUnit: 'Metric Ton (MT)', intMoq: 25, intUnitLabel: 'MT',
    containerEstimate20ft: 'Not recommended for long transit',
    containerEstimate40ft: '25–28 Metric Tons (40ft Reefer)',
  },
  'potato': {
    slug: 'potato',
    pkPrice: 84,
    pkUnit: 'kg', pkMoq: 500, pkUnitLabel: 'kg',
    intPrice: 320.00,
    intUnit: 'Metric Ton (MT)', intMoq: 25, intUnitLabel: 'MT',
    containerEstimate20ft: 'Not recommended',
    containerEstimate40ft: '26–28 Metric Tons (40ft Reefer)',
  },
  'tomato': {
    slug: 'tomato',
    pkPrice: 160,
    pkUnit: 'kg', pkMoq: 200, pkUnitLabel: 'kg',
    intPrice: 8.50,
    intUnit: 'carton (10 kg)', intMoq: 500, intUnitLabel: 'cartons',
    cartonSize: 1, cartonPriceUsd: 8.50,
    containerEstimate20ft: '2,200 Cartons (approx. 22 Metric Tons)',
    containerEstimate40ft: '2,800 Cartons (approx. 28 Metric Tons)',
  },
  'garlic': {
    slug: 'garlic',
    pkPrice: 450,
    pkUnit: 'kg', pkMoq: 100, pkUnitLabel: 'kg',
    intPrice: 19.00,         // $1,900/MT — premium garlic export
    intUnit: 'carton (10 kg)', intMoq: 200, intUnitLabel: 'cartons',
    cartonSize: 1, cartonPriceUsd: 19.00,
    containerEstimate20ft: '2,400 Cartons (approx. 24 Metric Tons)',
    containerEstimate40ft: '2,800 Cartons (approx. 28 Metric Tons)',
  },

  // --- PREMIUM RICE ---
  'super-kernel-basmati': {
    slug: 'super-kernel-basmati',
    pkPrice: 490,
    pkUnit: 'kg', pkMoq: 1000, pkUnitLabel: 'kg',
    intPrice: 1300.00,       // $1,300/MT FOB — Super Kernel current rate
    intUnit: 'Metric Ton (MT)', intMoq: 20, intUnitLabel: 'MT',
    containerEstimate20ft: '20–22 Metric Tons (Single 20ft FCL)',
    containerEstimate40ft: '26–28 Metric Tons (40ft FCL)',
  },
  '1121-sella-basmati': {
    slug: '1121-sella-basmati',
    pkPrice: 530,
    pkUnit: 'kg', pkMoq: 1000, pkUnitLabel: 'kg',
    intPrice: 1400.00,       // $1,400/MT FOB — 1121 Sella current rate
    intUnit: 'Metric Ton (MT)', intMoq: 20, intUnitLabel: 'MT',
    containerEstimate20ft: '20–22 Metric Tons (Single 20ft FCL)',
    containerEstimate40ft: '26–28 Metric Tons (40ft FCL)',
  },

  // --- SURGICAL INSTRUMENTS (Sialkot FOB) ---
  'surgical-scissors-set': {
    slug: 'surgical-scissors-set',
    pkPrice: 2200,
    pkUnit: 'set', pkMoq: 10, pkUnitLabel: 'set',
    intPrice: 12.50,
    intUnit: 'set', intMoq: 100, intUnitLabel: 'sets',
    cartonSize: 20, cartonPriceUsd: 250.00,
    containerEstimate20ft: 'approx. 10,000 sets (500 cartons)',
    containerEstimate40ft: 'approx. 20,000 sets (1,000 cartons)',
  },
  'forceps-set': {
    slug: 'forceps-set',
    pkPrice: 2800,
    pkUnit: 'set', pkMoq: 5, pkUnitLabel: 'set',
    intPrice: 15.00,
    intUnit: 'set', intMoq: 100, intUnitLabel: 'sets',
    cartonSize: 20, cartonPriceUsd: 300.00,
    containerEstimate20ft: 'approx. 10,000 sets (500 cartons)',
    containerEstimate40ft: 'approx. 20,000 sets (1,000 cartons)',
  },
  'surgical-knife-set': {    // ← matches DB slug (was scalpel-set in old map)
    slug: 'surgical-knife-set',
    pkPrice: 1800,
    pkUnit: 'set', pkMoq: 5, pkUnitLabel: 'set',
    intPrice: 9.50,
    intUnit: 'set', intMoq: 200, intUnitLabel: 'sets',
    cartonSize: 50, cartonPriceUsd: 475.00,
    containerEstimate20ft: 'approx. 20,000 sets (400 cartons)',
    containerEstimate40ft: 'approx. 40,000 sets (800 cartons)',
  },

  // --- SPORTS ITEMS (Sialkot FOB) ---
  'cricket-bat': {
    slug: 'cricket-bat',
    pkPrice: 8500,
    pkUnit: 'piece', pkMoq: 10, pkUnitLabel: 'piece',
    intPrice: 45.00,
    intUnit: 'piece', intMoq: 50, intUnitLabel: 'pieces',
    cartonSize: 10, cartonPriceUsd: 450.00,
    containerEstimate20ft: '3,000 pieces (300 cartons)',
    containerEstimate40ft: '6,000 pieces (600 cartons)',
  },
  'football': {
    slug: 'football',
    pkPrice: 3800,
    pkUnit: 'piece', pkMoq: 20, pkUnitLabel: 'piece',
    intPrice: 18.00,
    intUnit: 'piece', intMoq: 500, intUnitLabel: 'pieces',
    cartonSize: 50, cartonPriceUsd: 900.00,
    containerEstimate20ft: '10,000 pieces (200 cartons — deflated)',
    containerEstimate40ft: '22,000 pieces (440 cartons — deflated)',
  },
  'hockey-stick': {
    slug: 'hockey-stick',
    pkPrice: 5500,
    pkUnit: 'piece', pkMoq: 10, pkUnitLabel: 'piece',
    intPrice: 28.00,
    intUnit: 'piece', intMoq: 50, intUnitLabel: 'pieces',
    cartonSize: 20, cartonPriceUsd: 560.00,
    containerEstimate20ft: '4,000 pieces (200 cartons)',
    containerEstimate40ft: '9,000 pieces (450 cartons)',
  },
};

// Alias map — maps alternate slugs/filenames → canonical slug in DEFAULT_PRICING_MAP
const ALIASES: Record<string, string> = {
  // fruits
  'kinnow': 'kinnow-mandarin',
  'mango': 'mango-chaunsa',
  'fruits_hero.png': 'mango-chaunsa',

  // vegetables — 'fresh-onion' is now canonical (matches DB slug)
  'red-onion': 'fresh-onion',
  'red-onions': 'fresh-onion',
  'vegetables_hero.png': 'fresh-onion',

  // rice
  'super-kernel-basmati-rice': 'super-kernel-basmati',
  '1121-sella-basmati-rice': '1121-sella-basmati',

  // surgical — 'surgical-knife-set' is now canonical (matches DB slug)
  'surgical-scissors': 'surgical-scissors-set',
  'hemostatic-forceps-set': 'forceps-set',
  'scalpel-set': 'surgical-knife-set',
  'scalpel-handles-blades': 'surgical-knife-set',
  'surgical_hero.png': 'surgical-scissors-set',

  // sports
  'english-willow-cricket-bat': 'cricket-bat',
  'thermo-bonded-football': 'football',
  'composite-hockey-stick': 'hockey-stick',
  'sports_hero.png': 'football',
};

function normalizeSlug(slugOrSku: string): string {
  const clean = slugOrSku.toLowerCase().trim();
  if (DEFAULT_PRICING_MAP[clean]) return clean;
  if (ALIASES[clean]) return ALIASES[clean];
  
  // Try search by substrings
  for (const key of Object.keys(DEFAULT_PRICING_MAP)) {
    if (clean.includes(key) || key.includes(clean)) return key;
  }
  
  // Check common aliases
  for (const alias of Object.keys(ALIASES)) {
    if (clean.includes(alias) || alias.includes(clean)) {
      return ALIASES[alias];
    }
  }
  
  return clean;
}

/** Look up fallback pricing details for a product slug.
 *  Prefer using useProductPricing() hook for live DB values. */
export function getPricingDetails(slugOrSku?: string | null): ProductPricingDetails | undefined {
  if (!slugOrSku) return undefined;
  const normalized = normalizeSlug(slugOrSku);
  return DEFAULT_PRICING_MAP[normalized];
}

export function getProductPrice(slugOrSku: string, region: 'PK' | 'INT', fallbackPrice: number = 0): number {
  const details = getPricingDetails(slugOrSku);
  if (!details) return fallbackPrice;
  return region === 'PK' ? details.pkPrice : details.intPrice;
}

export function getProductUnit(slugOrSku: string, region: 'PK' | 'INT', fallbackUnit: string = 'kg'): string {
  const details = getPricingDetails(slugOrSku);
  if (!details) return fallbackUnit;
  return region === 'PK' ? details.pkUnit : details.intUnit;
}

export function getProductMoq(slugOrSku: string, region: 'PK' | 'INT', fallbackMoq: number = 1): number {
  const details = getPricingDetails(slugOrSku);
  if (!details) return fallbackMoq;
  return region === 'PK' ? details.pkMoq : details.intMoq;
}

export function formatProductPrice(slugOrSku: string | any, region: 'PK' | 'INT', fallbackPrice: number = 0): string {
  if (typeof slugOrSku === 'object' && slugOrSku !== null) {
    return getCardPriceInfo(slugOrSku, region).priceDisplay;
  }

  const details = getPricingDetails(slugOrSku);
  if (!details) {
    if (region === 'PK') {
      return `₨ ${Math.round(fallbackPrice * 278).toLocaleString()}`;
    }
    return `$${fallbackPrice.toLocaleString()}`;
  }
  
  if (region === 'PK') {
    return `₨ ${Math.round(details.pkPrice).toLocaleString()}`;
  } else {
    return `$${details.intPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

/** Get complete price, unit, and MOQ display info for any product object, prioritizing DB pricing with static fallback */
export function getCardPriceInfo(product: any, region: 'PK' | 'INT') {
  if (product?.pricing) {
    if (region === 'PK') {
      const price = Number(product.pricing.pkPrice);
      return {
        priceDisplay: `₨ ${Math.round(price).toLocaleString()}`,
        unit: product.pricing.pkUnit || 'kg',
        moq: product.pricing.pkMoq ?? 1,
      };
    } else {
      const price = Number(product.pricing.intPrice);
      return {
        priceDisplay: `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        unit: product.pricing.intUnit || 'kg',
        moq: product.pricing.intMoq ?? 100,
      };
    }
  }

  // If live base product price is available
  if (product?.price && Number(product.price) > 0) {
    const rawPrice = Number(product.price);
    if (region === 'PK') {
      return {
        priceDisplay: `₨ ${Math.round(rawPrice * 278).toLocaleString()}`,
        unit: product.unit || 'kg',
        moq: product.minOrderQty || 1,
      };
    } else {
      return {
        priceDisplay: `$${rawPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        unit: product.unit || 'kg',
        moq: product.minOrderQty || 100,
      };
    }
  }

  // Fallback to static map or base product props
  const details = getPricingDetails(product?.slug || product?.sku);
  if (region === 'PK') {
    const price = details ? details.pkPrice : Number(product?.price || 0) * 278;
    const unit = details ? details.pkUnit : product?.unit || 'kg';
    const moq = details ? details.pkMoq : 1;
    return {
      priceDisplay: `₨ ${Math.round(price).toLocaleString()}`,
      unit,
      moq,
    };
  } else {
    const price = details ? details.intPrice : Number(product?.price || 0);
    const unit = details ? details.intUnit : product?.unit || 'kg';
    const moq = details ? details.intMoq : product?.minOrderQty || 100;
    return {
      priceDisplay: `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      unit,
      moq,
    };
  }
}
