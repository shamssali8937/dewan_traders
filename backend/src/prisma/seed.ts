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

  const fruitsCategory = await prisma.category.findUnique({ where: { slug: 'fruits' } });
  const vegCategory = await prisma.category.findUnique({ where: { slug: 'vegetables' } });
  const riceCategory = await prisma.category.findUnique({ where: { slug: 'rice' } });
  const surgicalCategory = await prisma.category.findUnique({ where: { slug: 'surgical' } });
  const sportsCategory = await prisma.category.findUnique({ where: { slug: 'sports' } });

  // ─── Products ───
  const products = [
    // Fruits
    { name: 'Kinnow Mandarin', slug: 'kinnow-mandarin', sku: 'DT-FR-001', categoryId: fruitsCategory!.id, price: 80, unit: 'kg', stock: 5000, minOrderQty: 100, isFeatured: true, description: 'Premium Sargodha Kinnow — the world-famous citrus fruit.', origin: 'Pakistan', imageUrl: '/images/fruits_hero.png' },
    { name: 'Mango Chaunsa', slug: 'mango-chaunsa', sku: 'DT-FR-002', categoryId: fruitsCategory!.id, price: 150, unit: 'kg', stock: 3000, minOrderQty: 50, isFeatured: true, description: 'Premium Chaunsa mango — sweet, fiberless, aromatic.', origin: 'Pakistan', imageUrl: '/images/fruits_hero.png' },
    { name: 'Blood Orange', slug: 'blood-orange', sku: 'DT-FR-003', categoryId: fruitsCategory!.id, price: 120, unit: 'kg', stock: 2000, minOrderQty: 50, description: 'Fresh blood oranges with rich color and sweet flavor.', origin: 'Pakistan', imageUrl: '/images/fruits_hero.png' },
    { name: 'Guava', slug: 'guava', sku: 'DT-FR-004', categoryId: fruitsCategory!.id, price: 60, unit: 'kg', stock: 4000, minOrderQty: 100, description: 'Fresh white guava from Punjab farms.', origin: 'Pakistan', imageUrl: '/images/fruits_hero.png' },
    // Vegetables
    { name: 'Fresh Onion', slug: 'fresh-onion', sku: 'DT-VG-001', categoryId: vegCategory!.id, price: 35, unit: 'kg', stock: 10000, minOrderQty: 500, isFeatured: true, description: 'Premium quality onions for export markets.', origin: 'Pakistan', imageUrl: '/images/vegetables_hero.png' },
    { name: 'Potato', slug: 'potato', sku: 'DT-VG-002', categoryId: vegCategory!.id, price: 45, unit: 'kg', stock: 8000, minOrderQty: 500, description: 'Grade A potatoes from Punjab.', origin: 'Pakistan', imageUrl: '/images/vegetables_hero.png' },
    { name: 'Tomato', slug: 'tomato', sku: 'DT-VG-003', categoryId: vegCategory!.id, price: 55, unit: 'kg', stock: 5000, minOrderQty: 200, description: 'Fresh ripe tomatoes, export quality.', origin: 'Pakistan', imageUrl: '/images/vegetables_hero.png' },
    { name: 'Garlic', slug: 'garlic', sku: 'DT-VG-004', categoryId: vegCategory!.id, price: 200, unit: 'kg', stock: 2000, minOrderQty: 100, isFeatured: true, description: 'Premium quality garlic bulbs.', origin: 'Pakistan', imageUrl: '/images/vegetables_hero.png' },
    // Rice
    { name: 'Super Kernel Basmati Rice', slug: 'super-kernel-basmati', sku: 'DT-RC-001', categoryId: riceCategory!.id, price: 180, unit: 'kg', stock: 15000, minOrderQty: 1000, isFeatured: true, description: 'Premium fragrant long-grain Basmati rice, aged and polished for exports.', origin: 'Pakistan', imageUrl: '/images/rice_hero.png' },
    { name: '1121 Sella Basmati Rice', slug: '1121-sella-basmati', sku: 'DT-RC-002', categoryId: riceCategory!.id, price: 210, unit: 'kg', stock: 12000, minOrderQty: 1000, isFeatured: false, description: 'Extra-long grain parboiled Basmati rice, double polished, clean sorted.', origin: 'Pakistan', imageUrl: '/images/rice_hero.png' },
    // Surgical Items
    { name: 'Surgical Scissors Set', slug: 'surgical-scissors-set', sku: 'DT-SG-001', categoryId: surgicalCategory!.id, price: 1500, unit: 'set', stock: 500, minOrderQty: 10, isFeatured: true, description: 'Professional surgical scissors set — stainless steel.', origin: 'Pakistan', imageUrl: '/images/surgical_hero.png' },
    { name: 'Forceps Set', slug: 'forceps-set', sku: 'DT-SG-002', categoryId: surgicalCategory!.id, price: 2000, unit: 'set', stock: 300, minOrderQty: 5, description: 'High-grade stainless steel forceps for surgical use.', origin: 'Pakistan', imageUrl: '/images/surgical_hero.png' },
    { name: 'Surgical Knife Set', slug: 'surgical-knife-set', sku: 'DT-SG-003', categoryId: surgicalCategory!.id, price: 3500, unit: 'set', stock: 200, minOrderQty: 5, description: 'Precision surgical knife set for professional use.', origin: 'Pakistan', imageUrl: '/images/surgical_hero.png' },
    // Sports Items
    { name: 'Cricket Bat', slug: 'cricket-bat', sku: 'DT-SP-001', categoryId: sportsCategory!.id, price: 2500, unit: 'piece', stock: 1000, minOrderQty: 10, isFeatured: true, description: 'Professional grade English willow cricket bat.', origin: 'Pakistan', imageUrl: '/images/sports_hero.png' },
    { name: 'Football', slug: 'football', sku: 'DT-SP-002', categoryId: sportsCategory!.id, price: 800, unit: 'piece', stock: 2000, minOrderQty: 20, description: 'FIFA approved match quality football.', origin: 'Pakistan', imageUrl: '/images/sports_hero.png' },
    { name: 'Hockey Stick', slug: 'hockey-stick', sku: 'DT-SP-003', categoryId: sportsCategory!.id, price: 1800, unit: 'piece', stock: 800, minOrderQty: 10, description: 'Professional field hockey stick — fiberglass.', origin: 'Pakistan', imageUrl: '/images/sports_hero.png' },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
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

  // ─── Testimonials ───
  const testimonials = [
    { name: 'Ahmed Al-Rashidi', position: 'Procurement Manager', company: 'Gulf Fresh Foods, Dubai', message: 'Dewan Traders has been our trusted supplier of Kinnow and mangoes for over 5 years. Exceptional quality and reliability.', rating: 5 },
    { name: 'Sarah Chen', position: 'Import Director', company: 'Asia Fresh Trading, Singapore', message: 'Outstanding quality produce and professional export documentation. Highly recommended for Pakistani fruits.', rating: 5 },
    { name: 'Mohammed Hassan', position: 'CEO', company: 'MedSupply International, Saudi Arabia', message: 'Top-quality surgical instruments at competitive prices. Their Sialkot-manufactured instruments meet international standards.', rating: 5 },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log('✅ Testimonials seeded');

  // ─── Payment Accounts ───
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

  console.log('\n🎉 Database seeded successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin Email   : admin@dewantraders.com');
  console.log('Admin Password: Admin@123');
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
