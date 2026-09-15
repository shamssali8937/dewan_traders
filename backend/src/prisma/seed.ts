import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Dewan Traders database...');

  // ─── Admin User ───
  const hashedPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dewantraders.com' },
    update: {},
    create: {
      name: 'Sajjad Hussain Awan',
      email: 'admin@dewantraders.com',
      password: hashedPassword,
      role: 'admin',
      userType: 'individual',
      phone: '+92-48-1234567',
      city: 'Sargodha',
      country: 'Pakistan',
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // ─── Categories ───
  const categories = [
    { name: 'Fresh Fruits', slug: 'fruits', type: 'fruits' as const, description: 'Fresh imported and local fruits from premium farms worldwide.', imageUrl: '/images/fruits_hero.png', sortOrder: 1 },
    { name: 'Vegetables', slug: 'vegetables', type: 'vegetables' as const, description: 'Fresh vegetables sourced directly from quality farms.', imageUrl: '/images/vegetables_hero.png', sortOrder: 2 },
    { name: 'Premium Rice', slug: 'rice', type: 'rice' as const, description: 'Export-grade long-grain and parboiled Basmati rice from Punjab.', imageUrl: '/images/rice_hero.png', sortOrder: 3 },
    { name: 'Surgical Items', slug: 'surgical', type: 'surgical' as const, description: 'High-quality surgical and medical instruments for healthcare.', imageUrl: '/images/surgical_hero.png', sortOrder: 4 },
    { name: 'Sports Items', slug: 'sports', type: 'sports' as const, description: 'Professional sports equipment for athletes and teams.', imageUrl: '/images/sports_hero.png', sortOrder: 5 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categories seeded');

  const fruitsCategory   = await prisma.category.findUnique({ where: { slug: 'fruits' } });
  const vegCategory      = await prisma.category.findUnique({ where: { slug: 'vegetables' } });
  const riceCategory     = await prisma.category.findUnique({ where: { slug: 'rice' } });
  const surgicalCategory = await prisma.category.findUnique({ where: { slug: 'surgical' } });
  const sportsCategory   = await prisma.category.findUnique({ where: { slug: 'sports' } });

  // ─── Products ───
  const products = [
    // Fruits
    { name: 'Kinnow Mandarin',         slug: 'kinnow-mandarin',       sku: 'DT-FR-001', categoryId: fruitsCategory!.id,   price: 120,  unit: 'kg',    stock: 5000,  minOrderQty: 100, isFeatured: true,  description: 'Premium Sargodha Kinnow — the world-famous citrus fruit.', origin: 'Pakistan', imageUrl: '/images/fruits_hero.png' },
    { name: 'Mango Chaunsa',           slug: 'mango-chaunsa',         sku: 'DT-FR-002', categoryId: fruitsCategory!.id,   price: 350,  unit: 'kg',    stock: 3000,  minOrderQty: 50,  isFeatured: true,  description: 'Premium Chaunsa mango — sweet, fiberless, aromatic.', origin: 'Pakistan', imageUrl: '/images/fruits_hero.png' },
    { name: 'Blood Orange',            slug: 'blood-orange',          sku: 'DT-FR-003', categoryId: fruitsCategory!.id,   price: 220,  unit: 'kg',    stock: 2000,  minOrderQty: 50,  isFeatured: false, description: 'Fresh blood oranges with rich color and sweet flavor.', origin: 'Pakistan', imageUrl: '/images/fruits_hero.png' },
    { name: 'Guava',                   slug: 'guava',                 sku: 'DT-FR-004', categoryId: fruitsCategory!.id,   price: 180,  unit: 'kg',    stock: 4000,  minOrderQty: 100, isFeatured: false, description: 'Fresh white guava from Punjab farms.', origin: 'Pakistan', imageUrl: '/images/fruits_hero.png' },
    // Vegetables
    { name: 'Fresh Onion',             slug: 'fresh-onion',           sku: 'DT-VG-001', categoryId: vegCategory!.id,      price: 150,  unit: 'kg',    stock: 10000, minOrderQty: 500, isFeatured: true,  description: 'Premium quality onions for export markets.', origin: 'Pakistan', imageUrl: '/images/vegetables_hero.png' },
    { name: 'Potato',                  slug: 'potato',                sku: 'DT-VG-002', categoryId: vegCategory!.id,      price: 84,   unit: 'kg',    stock: 8000,  minOrderQty: 500, isFeatured: false, description: 'Grade A potatoes from Punjab.', origin: 'Pakistan', imageUrl: '/images/vegetables_hero.png' },
    { name: 'Tomato',                  slug: 'tomato',                sku: 'DT-VG-003', categoryId: vegCategory!.id,      price: 160,  unit: 'kg',    stock: 5000,  minOrderQty: 200, isFeatured: false, description: 'Fresh ripe tomatoes, export quality.', origin: 'Pakistan', imageUrl: '/images/vegetables_hero.png' },
    { name: 'Garlic',                  slug: 'garlic',                sku: 'DT-VG-004', categoryId: vegCategory!.id,      price: 450,  unit: 'kg',    stock: 2000,  minOrderQty: 100, isFeatured: true,  description: 'Premium quality garlic bulbs.', origin: 'Pakistan', imageUrl: '/images/vegetables_hero.png' },
    // Rice
    { name: 'Super Kernel Basmati Rice', slug: 'super-kernel-basmati', sku: 'DT-RC-001', categoryId: riceCategory!.id,  price: 490,  unit: 'kg',    stock: 15000, minOrderQty: 1000, isFeatured: true,  description: 'Premium fragrant long-grain Basmati rice, aged and polished for exports.', origin: 'Pakistan', imageUrl: '/images/rice_hero.png' },
    { name: '1121 Sella Basmati Rice', slug: '1121-sella-basmati',   sku: 'DT-RC-002', categoryId: riceCategory!.id,    price: 530,  unit: 'kg',    stock: 12000, minOrderQty: 1000, isFeatured: false, description: 'Extra-long grain parboiled Basmati rice, double polished, clean sorted.', origin: 'Pakistan', imageUrl: '/images/rice_hero.png' },
    // Surgical Items
    { name: 'Surgical Scissors Set',  slug: 'surgical-scissors-set', sku: 'DT-SG-001', categoryId: surgicalCategory!.id, price: 2200, unit: 'set',   stock: 500,   minOrderQty: 10,  isFeatured: true,  description: 'Professional surgical scissors set — stainless steel.', origin: 'Pakistan', imageUrl: '/images/surgical_hero.png' },
    { name: 'Forceps Set',            slug: 'forceps-set',           sku: 'DT-SG-002', categoryId: surgicalCategory!.id, price: 2800, unit: 'set',   stock: 300,   minOrderQty: 5,   isFeatured: false, description: 'High-grade stainless steel forceps for surgical use.', origin: 'Pakistan', imageUrl: '/images/surgical_hero.png' },
    { name: 'Surgical Knife Set',     slug: 'surgical-knife-set',    sku: 'DT-SG-003', categoryId: surgicalCategory!.id, price: 1800, unit: 'set',   stock: 200,   minOrderQty: 5,   isFeatured: false, description: 'Precision surgical knife set for professional use.', origin: 'Pakistan', imageUrl: '/images/surgical_hero.png' },
    // Sports Items
    { name: 'Cricket Bat',            slug: 'cricket-bat',           sku: 'DT-SP-001', categoryId: sportsCategory!.id,   price: 8500, unit: 'piece', stock: 1000,  minOrderQty: 10,  isFeatured: true,  description: 'Professional grade English willow cricket bat.', origin: 'Pakistan', imageUrl: '/images/sports_hero.png' },
    { name: 'Football',               slug: 'football',              sku: 'DT-SP-002', categoryId: sportsCategory!.id,   price: 3800, unit: 'piece', stock: 2000,  minOrderQty: 20,  isFeatured: false, description: 'FIFA approved match quality football.', origin: 'Pakistan', imageUrl: '/images/sports_hero.png' },
    { name: 'Hockey Stick',           slug: 'hockey-stick',          sku: 'DT-SP-003', categoryId: sportsCategory!.id,   price: 5500, unit: 'piece', stock: 800,   minOrderQty: 10,  isFeatured: false, description: 'Professional field hockey stick — fiberglass.', origin: 'Pakistan', imageUrl: '/images/sports_hero.png' },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { price: product.price as any, minOrderQty: product.minOrderQty, stock: product.stock },
      create: { ...product, price: product.price as any },
    });
  }
  console.log('✅ Products seeded');

  // ─── Contact Info ───
  await prisma.contactInfo.upsert({
    where: { id: 'contact-main' },
    update: {},
    create: {
      id: 'contact-main',
      address: 'Satellite Town, Sargodha, Punjab, Pakistan',
      city: 'Sargodha',
      country: 'Pakistan',
      phone1: '+92-48-3700000',
      phone2: '+92-300-1234567',
      email1: 'info@dewantraders.com',
      email2: 'export@dewantraders.com',
      whatsapp: '+92-300-1234567',
      workingHours: 'Mon–Sat: 9:00 AM – 6:00 PM (PKT)',
    },
  });
  console.log('✅ Contact info seeded');

  // ─── Payment Accounts ───
  // Only create if none exist to avoid duplication
  const existingPaymentAccounts = await prisma.paymentAccount.count();
  if (existingPaymentAccounts === 0) {
    const paymentAccounts = [
      {
        type: 'bank',
        bankName: 'Meezan Bank',
        accountTitle: 'Dewan Traders Private Limited',
        accountNumber: '9902010482810',
        iban: 'PK49MEZN009902010482810',
        branch: 'Sargodha Main Branch (Code 099)',
        isActive: true,
      },
      {
        type: 'easypaisa',
        accountTitle: 'Sajjad Hussain Awan',
        accountNumber: '03001234567',
        isActive: true,
      },
      {
        type: 'jazzcash',
        accountTitle: 'Sajjad Hussain Awan',
        accountNumber: '03097654321',
        isActive: true,
      },
    ];
    for (const pa of paymentAccounts) {
      await prisma.paymentAccount.create({ data: pa });
    }
    console.log('✅ Payment Accounts seeded');
  } else {
    console.log('ℹ️  Payment accounts already exist — skipped');
  }

  // ─── Shipping Config (singleton) — always upsert with real 2025 market rates ───
  // Pakistan domestic logistics costs (PKR) — Sep 2025 rates
  // International container freight (USD) — FOB Karachi / Port Qasim
  const shippingConfigData = {
    // Currency
    exchangeRatePkrPerUsd: 278,             // SBP indicative rate Sep 2025

    // Domestic Pakistan delivery (PKR flat fees)
    pkStandardDeliveryCost: 350,            // Standard courier 3–5 days (TCS / Leopards)
    pkExpressDeliveryCost: 750,             // Express next-day courier
    pkPremiumPackagingCost: 1800,           // Premium retail-ready packaging surcharge

    // International container base freight (USD) — one-way ocean freight estimate
    intContainer20ftReefer: 2200,           // 20ft Reefer FCL (temperature-controlled)
    intContainer40ftReefer: 3200,           // 40ft Reefer FCL
    intContainer20ftDry:    1200,           // 20ft Dry FCL (general cargo)
    intContainer40ftDry:    1800,           // 40ft Dry FCL
    intBulkLoose:            550,           // LCL / Bulk Loose cargo (per shipment base)

    // Packing surcharge multipliers (applied to product subtotal)
    // e.g. 1.15 means +15% on the product cost for export packing labour
    packMult20ftReefer: 1.18,               // Reefer 20ft — higher packing standard
    packMult40ftReefer: 1.22,               // Reefer 40ft
    packMult20ftDry:    1.05,               // Dry 20ft
    packMult40ftDry:    1.09,               // Dry 40ft

    // International documentation & customs clearance (USD flat fees)
    intDocumentationCost:    180,           // Phytosanitary cert, B/L, COO, fumigation etc.
    intCustomsClearanceCost: 280,           // Port customs clearance + CRO charges
  };

  const existingConfig = await prisma.shippingConfig.findFirst();
  if (existingConfig) {
    await prisma.shippingConfig.update({
      where: { id: existingConfig.id },
      data: shippingConfigData,
    });
    console.log('✅ Shipping config updated with current 2025 market rates');
  } else {
    await prisma.shippingConfig.create({
      data: { id: 'shipping-config-main', ...shippingConfigData },
    });
    console.log('✅ Shipping config created with current 2025 market rates');
  }

  // ─── Product Pricing (B2B prices) — always upsert so re-seeding refreshes prices ───
  //
  // Domestic (PK): PKR prices at Sargodha/Sialkot wholesale + retailer rates Sep 2025
  // International:  USD prices FOB Karachi / Port Qasim — current export market rates
  //
  // NOTE: slug keys must match product slugs in the products array above exactly.
  const productPricingDefaults: Record<string, {
    pkPrice: number; pkUnit: string; pkUnitLabel: string; pkMoq: number;
    intPrice: number; intUnit: string; intUnitLabel: string; intMoq: number;
    cartonSize?: number; cartonPriceUsd?: number;
    containerEst20ft?: string; containerEst40ft?: string;
  }> = {

    // ── Fresh Fruits ────────────────────────────────────────────────────────
    'kinnow-mandarin': {
      pkPrice: 120, pkUnit: 'kg', pkUnitLabel: 'kg', pkMoq: 100,
      // $9.50/10kg carton ≈ $950/MT FOB — current Sargodha kinnow export rate
      intPrice: 9.50, intUnit: 'carton (10 kg)', intUnitLabel: 'cartons', intMoq: 1000,
      cartonSize: 1, cartonPriceUsd: 9.50,
      containerEst20ft: '2,200 Cartons (approx. 22 Metric Tons)',
      containerEst40ft: '2,800 Cartons (approx. 28 Metric Tons)',
    },
    'mango-chaunsa': {
      pkPrice: 350, pkUnit: 'kg', pkUnitLabel: 'kg', pkMoq: 50,
      // $18.50/4kg carton — premium Chaunsa export season rate
      intPrice: 18.50, intUnit: 'carton (4 kg)', intUnitLabel: 'cartons', intMoq: 500,
      cartonSize: 1, cartonPriceUsd: 18.50,
      containerEst20ft: '3,500 Cartons (approx. 14 Metric Tons)',
      containerEst40ft: '4,500 Cartons (approx. 18 Metric Tons)',
    },
    'blood-orange': {
      pkPrice: 220, pkUnit: 'kg', pkUnitLabel: 'kg', pkMoq: 50,
      intPrice: 11.00, intUnit: 'carton (10 kg)', intUnitLabel: 'cartons', intMoq: 500,
      cartonSize: 1, cartonPriceUsd: 11.00,
      containerEst20ft: '2,200 Cartons (approx. 22 Metric Tons)',
      containerEst40ft: '2,800 Cartons (approx. 28 Metric Tons)',
    },
    'guava': {
      pkPrice: 180, pkUnit: 'kg', pkUnitLabel: 'kg', pkMoq: 100,
      intPrice: 12.00, intUnit: 'carton (5 kg)', intUnitLabel: 'cartons', intMoq: 400,
      cartonSize: 1, cartonPriceUsd: 12.00,
      containerEst20ft: '3,800 Cartons (approx. 19 Metric Tons)',
      containerEst40ft: '4,800 Cartons (approx. 24 Metric Tons)',
    },

    // ── Vegetables ──────────────────────────────────────────────────────────
    'fresh-onion': {                        // ← slug must match DB product slug exactly
      pkPrice: 150, pkUnit: 'kg', pkUnitLabel: 'kg', pkMoq: 500,
      // $380/MT FOB — current Pakistan red onion export rate
      intPrice: 380.00, intUnit: 'Metric Ton (MT)', intUnitLabel: 'MT', intMoq: 25,
      containerEst20ft: 'Not recommended for long transit',
      containerEst40ft: '25–28 Metric Tons (40ft Reefer)',
    },
    'potato': {
      pkPrice: 84, pkUnit: 'kg', pkUnitLabel: 'kg', pkMoq: 500,
      intPrice: 320.00, intUnit: 'Metric Ton (MT)', intUnitLabel: 'MT', intMoq: 25,
      containerEst20ft: 'Not recommended',
      containerEst40ft: '26–28 Metric Tons (40ft Reefer)',
    },
    'tomato': {
      pkPrice: 160, pkUnit: 'kg', pkUnitLabel: 'kg', pkMoq: 200,
      intPrice: 8.50, intUnit: 'carton (10 kg)', intUnitLabel: 'cartons', intMoq: 500,
      cartonSize: 1, cartonPriceUsd: 8.50,
      containerEst20ft: '2,200 Cartons (approx. 22 Metric Tons)',
      containerEst40ft: '2,800 Cartons (approx. 28 Metric Tons)',
    },
    'garlic': {
      pkPrice: 450, pkUnit: 'kg', pkUnitLabel: 'kg', pkMoq: 100,
      // $1,900/MT — premium Pakistan garlic export rate
      intPrice: 19.00, intUnit: 'carton (10 kg)', intUnitLabel: 'cartons', intMoq: 200,
      cartonSize: 1, cartonPriceUsd: 19.00,
      containerEst20ft: '2,400 Cartons (approx. 24 Metric Tons)',
      containerEst40ft: '2,800 Cartons (approx. 28 Metric Tons)',
    },

    // ── Premium Rice ────────────────────────────────────────────────────────
    'super-kernel-basmati': {
      pkPrice: 490, pkUnit: 'kg', pkUnitLabel: 'kg', pkMoq: 1000,
      // $1,300/MT FOB — Super Kernel Basmati current export rate
      intPrice: 1300.00, intUnit: 'Metric Ton (MT)', intUnitLabel: 'MT', intMoq: 20,
      containerEst20ft: '20–22 Metric Tons (Single 20ft FCL)',
      containerEst40ft: '26–28 Metric Tons (40ft FCL)',
    },
    '1121-sella-basmati': {
      pkPrice: 530, pkUnit: 'kg', pkUnitLabel: 'kg', pkMoq: 1000,
      // $1,400/MT FOB — 1121 Sella Basmati current export rate
      intPrice: 1400.00, intUnit: 'Metric Ton (MT)', intUnitLabel: 'MT', intMoq: 20,
      containerEst20ft: '20–22 Metric Tons (Single 20ft FCL)',
      containerEst40ft: '26–28 Metric Tons (40ft FCL)',
    },

    // ── Surgical Instruments (Sialkot FOB) ──────────────────────────────────
    'surgical-scissors-set': {
      pkPrice: 2200, pkUnit: 'set', pkUnitLabel: 'set', pkMoq: 10,
      intPrice: 12.50, intUnit: 'set', intUnitLabel: 'sets', intMoq: 100,
      cartonSize: 20, cartonPriceUsd: 250.00,
      containerEst20ft: 'approx. 10,000 sets (500 cartons)',
      containerEst40ft: 'approx. 20,000 sets (1,000 cartons)',
    },
    'forceps-set': {
      pkPrice: 2800, pkUnit: 'set', pkUnitLabel: 'set', pkMoq: 5,
      intPrice: 15.00, intUnit: 'set', intUnitLabel: 'sets', intMoq: 100,
      cartonSize: 20, cartonPriceUsd: 300.00,
      containerEst20ft: 'approx. 10,000 sets (500 cartons)',
      containerEst40ft: 'approx. 20,000 sets (1,000 cartons)',
    },
    'surgical-knife-set': {
      pkPrice: 1800, pkUnit: 'set', pkUnitLabel: 'set', pkMoq: 5,
      intPrice: 9.50, intUnit: 'set', intUnitLabel: 'sets', intMoq: 200,
      cartonSize: 50, cartonPriceUsd: 475.00,
      containerEst20ft: 'approx. 20,000 sets (400 cartons)',
      containerEst40ft: 'approx. 40,000 sets (800 cartons)',
    },

    // ── Sports Items (Sialkot FOB) ───────────────────────────────────────────
    'cricket-bat': {
      pkPrice: 8500, pkUnit: 'piece', pkUnitLabel: 'piece', pkMoq: 10,
      intPrice: 45.00, intUnit: 'piece', intUnitLabel: 'pieces', intMoq: 50,
      cartonSize: 10, cartonPriceUsd: 450.00,
      containerEst20ft: '3,000 pieces (300 cartons)',
      containerEst40ft: '6,000 pieces (600 cartons)',
    },
    'football': {
      pkPrice: 3800, pkUnit: 'piece', pkUnitLabel: 'piece', pkMoq: 20,
      intPrice: 18.00, intUnit: 'piece', intUnitLabel: 'pieces', intMoq: 500,
      cartonSize: 50, cartonPriceUsd: 900.00,
      containerEst20ft: '10,000 pieces (200 cartons — deflated)',
      containerEst40ft: '22,000 pieces (440 cartons — deflated)',
    },
    'hockey-stick': {
      pkPrice: 5500, pkUnit: 'piece', pkUnitLabel: 'piece', pkMoq: 10,
      intPrice: 28.00, intUnit: 'piece', intUnitLabel: 'pieces', intMoq: 50,
      cartonSize: 20, cartonPriceUsd: 560.00,
      containerEst20ft: '4,000 pieces (200 cartons)',
      containerEst40ft: '9,000 pieces (450 cartons)',
    },
  };

  const allProducts = await prisma.product.findMany({ select: { id: true, slug: true } });
  let pricingCount = 0;
  for (const p of allProducts) {
    const defaults = productPricingDefaults[p.slug];
    if (!defaults) {
      console.log(`  ⚠️  No pricing defaults found for slug: ${p.slug} — skipping`);
      continue;
    }
    await prisma.productPricing.upsert({
      where: { productId: p.id },
      // Always update: admins can fine-tune in the UI, but seed sets the base correctly
      update: { ...defaults },
      create: { productId: p.id, ...defaults },
    });
    pricingCount++;
  }
  console.log(`✅ Product pricing seeded/updated (${pricingCount} products)`);

  console.log('\n🎉 Database seeded successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin Email: admin@dewantraders.com');
  console.log('⚠️  Change the admin password immediately after first login.');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
