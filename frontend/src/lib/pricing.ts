// Enterprise B2B Pricing Utility for Dewan Traders
// Sourced from Sargodha & Sialkot market rates and export standards.

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

const PRICING_MAP: Record<string, ProductPricingDetails> = {
  // --- FRESH FRUITS ---
  'kinnow-mandarin': {
    slug: 'kinnow-mandarin',
    pkPrice: 120, // ₨120 per kg
    pkUnit: 'kg',
    pkMoq: 10, // 10 kg min order
    pkUnitLabel: 'kg',
    intPrice: 9.00, // $9.00 per 10kg export carton (~$900/MT)
    intUnit: 'carton (10kg)',
    intMoq: 1000, // 1000 cartons MOQ
    intUnitLabel: 'cartons',
    cartonSize: 1, // unit is already 1 carton
    cartonPriceUsd: 9.00,
    containerEstimate20ft: '2,200 Cartons (approx. 22 Metric Tons)',
    containerEstimate40ft: '2,800 Cartons (approx. 28 Metric Tons)'
  },
  'mango-chaunsa': {
    slug: 'mango-chaunsa',
    pkPrice: 350, // ₨350 per kg
    pkUnit: 'kg',
    pkMoq: 10,
    pkUnitLabel: 'kg',
    intPrice: 18.00, // $18.00 per 4kg premium carton (~$4,500/MT)
    intUnit: 'carton (4kg)',
    intMoq: 500, // 500 cartons MOQ
    intUnitLabel: 'cartons',
    cartonSize: 1,
    cartonPriceUsd: 18.00,
    containerEstimate20ft: '3,500 Cartons (approx. 14 Metric Tons)',
    containerEstimate40ft: '4,500 Cartons (approx. 18 Metric Tons)'
  },
  'blood-orange': {
    slug: 'blood-orange',
    pkPrice: 220, // ₨220 per kg
    pkUnit: 'kg',
    pkMoq: 10,
    pkUnitLabel: 'kg',
    intPrice: 11.00, // $11.00 per 10kg export carton (~$1,100/MT)
    intUnit: 'carton (10kg)',
    intMoq: 500,
    intUnitLabel: 'cartons',
    cartonSize: 1,
    cartonPriceUsd: 11.00,
    containerEstimate20ft: '2,200 Cartons (approx. 22 Metric Tons)',
    containerEstimate40ft: '2,800 Cartons (approx. 28 Metric Tons)'
  },
  'guava': {
    slug: 'guava',
    pkPrice: 180, // ₨180 per kg
    pkUnit: 'kg',
    pkMoq: 10,
    pkUnitLabel: 'kg',
    intPrice: 12.00, // $12.00 per 5kg export carton
    intUnit: 'carton (5kg)',
    intMoq: 400,
    intUnitLabel: 'cartons',
    cartonSize: 1,
    cartonPriceUsd: 12.00,
    containerEstimate20ft: '3,800 Cartons (approx. 19 Metric Tons)',
    containerEstimate40ft: '4,800 Cartons (approx. 24 Metric Tons)'
  },

  // --- VEGETABLES ---
  'red-onion': {
    slug: 'red-onion',
    pkPrice: 150, // ₨150 per kg
    pkUnit: 'kg',
    pkMoq: 10,
    pkUnitLabel: 'kg',
    intPrice: 380.00, // $380 per Metric Ton (FOB)
    intUnit: 'Metric Ton (MT)',
    intMoq: 25, // 25 MT (1 Reefer Container)
    intUnitLabel: 'MT',
    containerEstimate20ft: 'Not recommended for long transits',
    containerEstimate40ft: '25-28 Metric Tons (40ft Reefer)'
  },
  'potato': {
    slug: 'potato',
    pkPrice: 84, // ₨84 per kg
    pkUnit: 'kg',
    pkMoq: 10,
    pkUnitLabel: 'kg',
    intPrice: 320.00, // $320 per Metric Ton (FOB)
    intUnit: 'Metric Ton (MT)',
    intMoq: 25, // 25 MT MOQ
    intUnitLabel: 'MT',
    containerEstimate20ft: 'Not recommended',
    containerEstimate40ft: '26-28 Metric Tons (40ft Reefer)'
  },
  'tomato': {
    slug: 'tomato',
    pkPrice: 160, // ₨160 per kg
    pkUnit: 'kg',
    pkMoq: 10,
    pkUnitLabel: 'kg',
    intPrice: 8.00, // $8.00 per 10kg export carton
    intUnit: 'carton (10kg)',
    intMoq: 500,
    intUnitLabel: 'cartons',
    cartonSize: 1,
    cartonPriceUsd: 8.00,
    containerEstimate20ft: '2,200 Cartons (approx. 22 Metric Tons)',
    containerEstimate40ft: '2,800 Cartons (approx. 28 Metric Tons)'
  },
  'garlic': {
    slug: 'garlic',
    pkPrice: 450, // ₨450 per kg
    pkUnit: 'kg',
    pkMoq: 10,
    pkUnitLabel: 'kg',
    intPrice: 18.00, // $18.00 per 10kg export carton (~$1,800/MT)
    intUnit: 'carton (10kg)',
    intMoq: 200,
    intUnitLabel: 'cartons',
    cartonSize: 1,
    cartonPriceUsd: 18.00,
    containerEstimate20ft: '2,400 Cartons (approx. 24 Metric Tons)',
    containerEstimate40ft: '2,800 Cartons (approx. 28 Metric Tons)'
  },

  // --- PREMIUM RICE ---
  'super-kernel-basmati': {
    slug: 'super-kernel-basmati',
    pkPrice: 490, // ₨490 per kg
    pkUnit: 'kg',
    pkMoq: 10,
    pkUnitLabel: 'kg',
    intPrice: 1250.00, // $1,250 per Metric Ton
    intUnit: 'Metric Ton (MT)',
    intMoq: 20, // 20 MT MOQ (1 FCL 20ft dry)
    intUnitLabel: 'MT',
    containerEstimate20ft: '20-22 Metric Tons (Single FCL)',
    containerEstimate40ft: '26-28 Metric Tons (Heavy weight limits apply)'
  },
  '1121-sella-basmati': {
    slug: '1121-sella-basmati',
    pkPrice: 530, // ₨530 per kg
    pkUnit: 'kg',
    pkMoq: 10,
    pkUnitLabel: 'kg',
    intPrice: 1350.00, // $1,350 per Metric Ton
    intUnit: 'Metric Ton (MT)',
    intMoq: 20,
    intUnitLabel: 'MT',
    containerEstimate20ft: '20-22 Metric Tons (Single FCL)',
    containerEstimate40ft: '26-28 Metric Tons'
  },

  // --- SURGICAL INSTRUMENTS ---
  'surgical-scissors-set': {
    slug: 'surgical-scissors-set',
    pkPrice: 2200, // ₨2,200 per set
    pkUnit: 'set',
    pkMoq: 1,
    pkUnitLabel: 'set',
    intPrice: 12.50, // $12.50 FOB per set
    intUnit: 'set',
    intMoq: 100, // 100 sets MOQ
    intUnitLabel: 'sets',
    cartonSize: 20,
    cartonPriceUsd: 250.00,
    containerEstimate20ft: 'approx. 10,000 sets (500 cartons)',
    containerEstimate40ft: 'approx. 20,000 sets (1,000 cartons)'
  },
  'forceps-set': {
    slug: 'forceps-set',
    pkPrice: 2800, // ₨2,800 per set
    pkUnit: 'set',
    pkMoq: 1,
    pkUnitLabel: 'set',
    intPrice: 15.00, // $15.00 FOB per set
    intUnit: 'set',
    intMoq: 100,
    intUnitLabel: 'sets',
    cartonSize: 20,
    cartonPriceUsd: 300.00,
    containerEstimate20ft: 'approx. 10,000 sets (500 cartons)',
    containerEstimate40ft: 'approx. 20,000 sets (1,000 cartons)'
  },
  'scalpel-set': {
    slug: 'scalpel-set',
    pkPrice: 1800, // ₨1,800 per set
    pkUnit: 'set',
    pkMoq: 1,
    pkUnitLabel: 'set',
    intPrice: 9.50, // $9.50 FOB per set
    intUnit: 'set',
    intMoq: 200,
    intUnitLabel: 'sets',
    cartonSize: 50,
    cartonPriceUsd: 475.00,
    containerEstimate20ft: 'approx. 20,000 sets (400 cartons)',
    containerEstimate40ft: 'approx. 40,000 sets (800 cartons)'
  },

  // --- SPORTS ITEMS ---
  'cricket-bat': {
    slug: 'cricket-bat',
    pkPrice: 8500, // ₨8,500 per piece
    pkUnit: 'piece',
    pkMoq: 1,
    pkUnitLabel: 'piece',
    intPrice: 45.00, // $45.00 FOB Sialkot factory
    intUnit: 'piece',
    intMoq: 50, // 50 bats MOQ
    intUnitLabel: 'pieces',
    cartonSize: 10,
    cartonPriceUsd: 450.00,
    containerEstimate20ft: '3,000 pieces (300 cartons)',
    containerEstimate40ft: '6,000 pieces (600 cartons)'
  },
  'football': {
    slug: 'football',
    pkPrice: 3800, // ₨3,800 Sialkot premium thermo-bonded
    pkUnit: 'piece',
    pkMoq: 1,
    pkUnitLabel: 'piece',
    intPrice: 18.00, // $18.00 FOB export price
    intUnit: 'piece',
    intMoq: 500, // 500 footballs MOQ
    intUnitLabel: 'pieces',
    cartonSize: 50,
    cartonPriceUsd: 900.00,
    containerEstimate20ft: '10,000 pieces (200 cartons - deflated)',
    containerEstimate40ft: '22,000 pieces (440 cartons - deflated)'
  },
  'hockey-stick': {
    slug: 'hockey-stick',
    pkPrice: 5500, // ₨5,500 composite stick
    pkUnit: 'piece',
    pkMoq: 1,
    pkUnitLabel: 'piece',
    intPrice: 28.00, // $28.00 FOB
    intUnit: 'piece',
    intMoq: 50,
    intUnitLabel: 'pieces',
    cartonSize: 20,
    cartonPriceUsd: 560.00,
    containerEstimate20ft: '4,000 pieces (200 cartons)',
    containerEstimate40ft: '9,000 pieces (450 cartons)'
  }
};

// Map alternate slug names
const ALIASES: Record<string, string> = {
  // fruits
  'kinnow': 'kinnow-mandarin',
  'mango': 'mango-chaunsa',
  'fruits_hero.png': 'mango-chaunsa',
  
  // vegetables
  'fresh-onion': 'red-onion',
  'red-onions': 'red-onion',
  'vegetables_hero.png': 'red-onion',
  
  // rice
  'super-kernel-basmati-rice': 'super-kernel-basmati',
  '1121-sella-basmati-rice': '1121-sella-basmati',
  
  // surgical
  'surgical-scissors': 'surgical-scissors-set',
  'hemostatic-forceps-set': 'forceps-set',
  'scalpel-handles-blades': 'scalpel-set',
  'surgical_hero.png': 'surgical-scissors-set',
  'surgical-knife-set': 'scalpel-set',
  
  // sports
  'english-willow-cricket-bat': 'cricket-bat',
  'thermo-bonded-football': 'football',
  'composite-hockey-stick': 'hockey-stick',
  'sports_hero.png': 'football'
};

function normalizeSlug(slugOrSku: string): string {
  const clean = slugOrSku.toLowerCase().trim();
  if (PRICING_MAP[clean]) return clean;
  if (ALIASES[clean]) return ALIASES[clean];
  
  // Try search by substrings
  for (const key of Object.keys(PRICING_MAP)) {
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

export function getPricingDetails(slugOrSku?: string | null): ProductPricingDetails | undefined {
  if (!slugOrSku) return undefined;
  const normalized = normalizeSlug(slugOrSku);
  return PRICING_MAP[normalized];
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

export function formatProductPrice(slugOrSku: string, region: 'PK' | 'INT', fallbackPrice: number = 0): string {
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
