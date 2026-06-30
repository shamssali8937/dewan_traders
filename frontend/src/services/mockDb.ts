// Local Mock Database fallback layer when backend is offline/not-yet-connected
const LOCAL_STORAGE_KEY = 'dewan_mock_db';

const initialCategories = [
  { id: 'cat-1', name: 'Fresh Fruits', slug: 'fruits', type: 'fruits', description: 'Fresh mandarins, mangoes and local fruits from premium orchards.', imageUrl: '/images/fruits_hero.png', sortOrder: 1, _count: { products: 4 } },
  { id: 'cat-2', name: 'Vegetables', slug: 'vegetables', type: 'vegetables', description: 'Fresh vegetables sourced directly from quality farms.', imageUrl: '/images/vegetables_hero.png', sortOrder: 2, _count: { products: 4 } },
  { id: 'cat-rc', name: 'Premium Rice', slug: 'rice', type: 'rice', description: 'Export-grade long-grain and parboiled Basmati rice from Punjab.', imageUrl: '/images/rice_hero.png', sortOrder: 3, _count: { products: 2 } },
  { id: 'cat-3', name: 'Surgical Items', slug: 'surgical', type: 'surgical', description: 'High-quality stainless steel medical instruments.', imageUrl: '/images/surgical_hero.png', sortOrder: 4, _count: { products: 3 } },
  { id: 'cat-4', name: 'Sports Items', slug: 'sports', type: 'sports', description: 'Professional sports equipment and custom athletic gear.', imageUrl: '/images/sports_hero.png', sortOrder: 5, _count: { products: 3 } },
];

const initialProducts = [
  // Fruits
  { id: 'p-1', name: 'Sargodha Kinnow Mandarin', slug: 'kinnow-mandarin', sku: 'DT-FR-001', categoryId: 'cat-1', price: 90, unit: 'kg', stock: 8000, minOrderQty: 100, isFeatured: true, description: 'Premium grade juicy Kinnows directly from Sargodha orchards. Handpicked, washed, waxed, and packed for export.', origin: 'Pakistan', imageUrl: '/images/fruits_hero.png', category: { name: 'Fresh Fruits', slug: 'fruits', type: 'fruits' } },
  { id: 'p-2', name: 'Chaunsa Mango', slug: 'mango-chaunsa', sku: 'DT-FR-002', categoryId: 'cat-1', price: 160, unit: 'kg', stock: 5000, minOrderQty: 50, isFeatured: true, description: 'The famous sweet aromatic Chaunsa mango. Top-tier quality, fiberless, ideal for international markets.', origin: 'Pakistan', imageUrl: '/images/fruits_hero.png', category: { name: 'Fresh Fruits', slug: 'fruits', type: 'fruits' } },
  { id: 'p-3', name: 'Blood Orange', slug: 'blood-orange', sku: 'DT-FR-003', categoryId: 'cat-1', price: 110, unit: 'kg', stock: 3500, minOrderQty: 100, isFeatured: false, description: 'Rich dark-fleshed blood oranges, rich in vitamin C and sweet flavor.', origin: 'Pakistan', imageUrl: '/images/fruits_hero.png', category: { name: 'Fresh Fruits', slug: 'fruits', type: 'fruits' } },
  { id: 'p-4', name: 'Fresh Guava', slug: 'guava', sku: 'DT-FR-004', categoryId: 'cat-1', price: 70, unit: 'kg', stock: 4000, minOrderQty: 100, isFeatured: false, description: 'Fresh round white-fleshed guava, sweet taste and intense tropical aroma.', origin: 'Pakistan', imageUrl: '/images/fruits_hero.png', category: { name: 'Fresh Fruits', slug: 'fruits', type: 'fruits' } },
  // Vegetables
  { id: 'p-5', name: 'Red Onions', slug: 'red-onion', sku: 'DT-VG-001', categoryId: 'cat-2', price: 40, unit: 'kg', stock: 12000, minOrderQty: 500, isFeatured: true, description: 'Grade A medium-sized red onions, cured and graded for long transit times.', origin: 'Pakistan', imageUrl: '/images/vegetables_hero.png', category: { name: 'Vegetables', slug: 'vegetables', type: 'vegetables' } },
  { id: 'p-6', name: 'Potatoes (Mozika)', slug: 'potato', sku: 'DT-VG-002', categoryId: 'cat-2', price: 45, unit: 'kg', stock: 10000, minOrderQty: 500, isFeatured: false, description: 'High dry-matter potatoes, clean skin, sorted by size. Excellent for frying or table use.', origin: 'Pakistan', imageUrl: '/images/vegetables_hero.png', category: { name: 'Vegetables', slug: 'vegetables', type: 'vegetables' } },
  { id: 'p-7', name: 'Export Quality Tomatoes', slug: 'tomato', sku: 'DT-VG-003', categoryId: 'cat-2', price: 60, unit: 'kg', stock: 6000, minOrderQty: 200, isFeatured: false, description: 'Firm, uniform red tomatoes, harvested at stage 3-4 color index for transport stability.', origin: 'Pakistan', imageUrl: '/images/vegetables_hero.png', category: { name: 'Vegetables', slug: 'vegetables', type: 'vegetables' } },
  { id: 'p-8', name: 'Garlic Bulbs', slug: 'garlic', sku: 'DT-VG-004', categoryId: 'cat-2', price: 220, unit: 'kg', stock: 2500, minOrderQty: 100, isFeatured: true, description: 'Robust, fully cured garlic bulbs, thick white papery skins, intense flavor.', origin: 'Pakistan', imageUrl: '/images/vegetables_hero.png', category: { name: 'Vegetables', slug: 'vegetables', type: 'vegetables' } },
  // Rice
  { id: 'p-rc1', name: 'Super Kernel Basmati Rice', slug: 'super-kernel-basmati', sku: 'DT-RC-001', categoryId: 'cat-rc', price: 180, unit: 'kg', stock: 15000, minOrderQty: 1000, isFeatured: true, description: 'Premium fragrant long-grain Basmati rice, aged and polished for exports.', origin: 'Pakistan', imageUrl: '/images/rice_hero.png', category: { name: 'Premium Rice', slug: 'rice', type: 'rice' } },
  { id: 'p-rc2', name: '1121 Sella Basmati Rice', slug: '1121-sella-basmati', sku: 'DT-RC-002', categoryId: 'cat-rc', price: 210, unit: 'kg', stock: 12000, minOrderQty: 1000, isFeatured: false, description: 'Extra-long grain parboiled Basmati rice, double polished, clean sorted.', origin: 'Pakistan', imageUrl: '/images/rice_hero.png', category: { name: 'Premium Rice', slug: 'rice', type: 'rice' } },
  // Surgical
  { id: 'p-9', name: 'Surgical Scissors Set', slug: 'surgical-scissors-set', sku: 'DT-SG-001', categoryId: 'cat-3', price: 1800, unit: 'set', stock: 600, minOrderQty: 10, isFeatured: true, description: 'Complete set of Mayo and Metzenbaum surgical operating scissors. Premium stainless steel.', origin: 'Pakistan', imageUrl: '/images/surgical_hero.png', category: { name: 'Surgical Items', slug: 'surgical', type: 'surgical' } },
  { id: 'p-10', name: 'Hemostatic Forceps Set', slug: 'forceps-set', sku: 'DT-SG-002', categoryId: 'cat-3', price: 2200, unit: 'set', stock: 450, minOrderQty: 5, isFeatured: false, description: 'Straight and curved Halsted Mosquito hemostatic forceps. Corrosion-resistant.', origin: 'Pakistan', imageUrl: '/images/surgical_hero.png', category: { name: 'Surgical Items', slug: 'surgical', type: 'surgical' } },
  { id: 'p-11', name: 'Scalpel Handles & Blades', slug: 'scalpel-set', sku: 'DT-SG-003', categoryId: 'cat-3', price: 1200, unit: 'set', stock: 800, minOrderQty: 20, isFeatured: false, description: 'Standard surgical scalpel handles #3 and #4 with sterile stainless steel blades.', origin: 'Pakistan', imageUrl: '/images/surgical_hero.png', category: { name: 'Surgical Items', slug: 'surgical', type: 'surgical' } },
  // Sports
  { id: 'p-12', name: 'English Willow Cricket Bat', slug: 'cricket-bat', sku: 'DT-SP-001', categoryId: 'cat-4', price: 9500, unit: 'piece', stock: 350, minOrderQty: 5, isFeatured: true, description: 'Professional grade-1 English willow bat. Balanced pick-up, massive edges, large sweet spot.', origin: 'Pakistan', imageUrl: '/images/sports_hero.png', category: { name: 'Sports Items', slug: 'sports', type: 'sports' } },
  { id: 'p-13', name: 'Thermo Bonded Football', slug: 'football', sku: 'DT-SP-002', categoryId: 'cat-4', price: 2800, unit: 'piece', stock: 1200, minOrderQty: 20, isFeatured: true, description: 'FIFA Quality Pro match ball. Thermo bonded panel technology, textured polyurethane outer.', origin: 'Pakistan', imageUrl: '/images/sports_hero.png', category: { name: 'Sports Items', slug: 'sports', type: 'sports' } },
  { id: 'p-14', name: 'Composite Hockey Stick', slug: 'hockey-stick', sku: 'DT-SP-003', categoryId: 'cat-4', price: 6500, unit: 'piece', stock: 500, minOrderQty: 10, isFeatured: false, description: '80% carbon composite field hockey stick. Low bow profile, maximum power transfer.', origin: 'Pakistan', imageUrl: '/images/sports_hero.png', category: { name: 'Sports Items', slug: 'sports', type: 'sports' } },
];

const initialTestimonials = [
  { id: 't-1', name: 'Ahmed Al-Rashidi', position: 'Procurement Manager', company: 'Gulf Fresh Foods, Dubai', message: 'Dewan Traders has been our trusted supplier of Kinnow and mangoes for over 5 years. Exceptional quality and reliability.', rating: 5 },
  { id: 't-2', name: 'Sarah Chen', position: 'Import Director', company: 'Asia Fresh Trading, Singapore', message: 'Outstanding quality produce and professional export documentation. Highly recommended for Pakistani fruits.', rating: 5 },
  { id: 't-3', name: 'Mohammed Hassan', position: 'CEO', company: 'MedSupply International, Saudi Arabia', message: 'Top-quality surgical instruments at competitive prices. Their Sialkot-manufactured instruments meet international standards.', rating: 5 },
];

const initialJournal = [
  { id: 'j-1', title: 'Pakistan Fruit Export Trends: The Rise of Kinnow', slug: 'pakistan-fruit-export-trends', excerpt: 'An in-depth look at how Pakistani Kinnow Mandarin is dominating import markets in Russia, Central Asia, and the Middle East.', content: 'Pakistani Kinnow Mandarins are highly valued globally for their rich juice content and unique sweet-and-sour flavor profile. In this post, we discuss packaging technologies and cold chain management that ensure premium quality upon delivery...', tags: ['Exports', 'Kinnow', 'Agriculture'], imageUrl: '/images/fruits_hero.png', isPublished: true, publishedAt: new Date().toISOString(), author: 'Dewan Traders', readTime: 5 },
  { id: 'j-2', title: 'Sialkot Surgical Instruments Quality Standards', slug: 'sialkot-surgical-standards', excerpt: 'How surgical instrument manufacturers in Sialkot comply with FDA, CE, and ISO certifications to maintain global trust.', content: 'Sialkot accounts for over 95% of Pakistans surgical instrument exports. We discuss the manufacturing processes, grade-410/420 steel quality controls, and passivation techniques that ensure high reliability in critical healthcare operations...', tags: ['Surgical', 'Quality Control', 'Manufacturing'], imageUrl: '/images/surgical_hero.png', isPublished: true, publishedAt: new Date().toISOString(), author: 'Dewan Traders', readTime: 7 },
];

const initialContact = {
  address: 'Satellite Town, Sargodha, Punjab, Pakistan',
  city: 'Sargodha',
  country: 'Pakistan',
  phone1: '+92-48-3700000',
  phone2: '+92-300-1234567',
  email1: 'info@dewantraders.com',
  email2: 'export@dewantraders.com',
  whatsapp: '+92-300-1234567',
  workingHours: 'Mon–Sat: 9:00 AM – 6:00 PM (PKT)',
};

const initialCMS: Record<string, any> = {
  home: { title: 'Welcome to Dewan Traders', subtitle: 'Leading Pakistan Export Partner' },
  about: { title: 'About Dewan Traders', subtitle: 'Two Decades of Excellence' },
};

const initialUsers = [
  { id: 'u-admin', name: 'Sajjad Hussain Awan', email: 'admin@dewantraders.com', role: 'admin', userType: 'individual', isActive: true, phone: '+92-48-1234567' },
  { id: 'u-user', name: 'Demo Buyer', email: 'buyer@example.com', role: 'individual', userType: 'individual', isActive: true, phone: '+92-300-0000000' },
];

interface MockData {
  categories: any[];
  products: any[];
  testimonials: any[];
  journal: any[];
  contact: any;
  cms: any;
  orders: any[];
  inquiries: any[];
  users: any[];
}

function getDb(): MockData {
  if (typeof window === 'undefined') {
    return {
      categories: initialCategories,
      products: initialProducts,
      testimonials: initialTestimonials,
      journal: initialJournal,
      contact: initialContact,
      cms: initialCMS,
      orders: [],
      inquiries: [],
      users: initialUsers,
    };
  }
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) {
    const data = {
      categories: initialCategories,
      products: initialProducts,
      testimonials: initialTestimonials,
      journal: initialJournal,
      contact: initialContact,
      cms: initialCMS,
      orders: [],
      inquiries: [],
      users: initialUsers,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw);
}

function saveDb(data: MockData) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }
}

export const mockDb = {
  // Auth Mock
  login(email: string) {
    const db = getDb();
    const user = db.users.find(u => u.email === email);
    if (user) {
      return { user, accessToken: 'mock-jwt-token' };
    }
    // Auto-create individual user if not found for easy testing
    const newUser = {
      id: `u-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'individual',
      userType: 'individual',
      isActive: true,
    };
    db.users.push(newUser);
    saveDb(db);
    return { user: newUser, accessToken: 'mock-jwt-token' };
  },

  register(data: any) {
    const db = getDb();
    const newUser = {
      id: `u-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: 'individual',
      userType: data.userType,
      phone: data.phone,
      companyName: data.companyName,
      city: data.city,
      isActive: true,
    };
    db.users.push(newUser);
    saveDb(db);
    return { user: newUser, accessToken: 'mock-jwt-token' };
  },

  // Products CRUD
  getProducts(filters: any = {}) {
    const db = getDb();
    let list = [...db.products];
    if (filters.category) {
      list = list.filter(p => p.category?.slug === filters.category);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (filters.featured !== undefined) {
      list = list.filter(p => p.isFeatured === filters.featured);
    }
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const total = list.length;
    const offset = (page - 1) * limit;
    return {
      products: list.slice(offset, offset + limit),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },

  getProductBySlug(slug: string) {
    const db = getDb();
    return db.products.find(p => p.slug === slug);
  },

  createProduct(data: any) {
    const db = getDb();
    const cat = db.categories.find(c => c.id === data.categoryId) || db.categories[0];
    const newProduct = {
      ...data,
      id: `p-${Date.now()}`,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      sku: data.sku || `DT-MOCK-${Date.now().toString().slice(-4)}`,
      category: { name: cat.name, slug: cat.slug, type: cat.type },
    };
    db.products.push(newProduct);
    saveDb(db);
    return newProduct;
  },

  updateProduct(id: string, data: any) {
    const db = getDb();
    const idx = db.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      const cat = db.categories.find(c => c.id === data.categoryId) || db.categories[0];
      db.products[idx] = {
        ...db.products[idx],
        ...data,
        category: { name: cat.name, slug: cat.slug, type: cat.type },
      };
      saveDb(db);
      return db.products[idx];
    }
    return null;
  },

  deleteProduct(id: string) {
    const db = getDb();
    db.products = db.products.filter(p => p.id !== id);
    saveDb(db);
  },

  // Categories CRUD
  getCategories() {
    const db = getDb();
    return db.categories;
  },

  // Inquiries CRUD
  getInquiries(params: any = {}) {
    const db = getDb();
    let list = [...db.inquiries];
    if (params.status) {
      list = list.filter(i => i.status === params.status);
    }
    return { inquiries: list, pagination: { total: list.length, page: 1, limit: 100, pages: 1 } };
  },

  createInquiry(data: any) {
    const db = getDb();
    const newInquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    db.inquiries.push(newInquiry);
    saveDb(db);
    return newInquiry;
  },

  updateInquiryStatus(id: string, status: string, adminNotes?: string) {
    const db = getDb();
    const idx = db.inquiries.findIndex(i => i.id === id);
    if (idx !== -1) {
      db.inquiries[idx] = {
        ...db.inquiries[idx],
        status,
        adminNotes,
        respondedAt: status === 'responded' ? new Date().toISOString() : db.inquiries[idx].respondedAt,
      };
      saveDb(db);
      return db.inquiries[idx];
    }
    return null;
  },

  deleteInquiry(id: string) {
    const db = getDb();
    db.inquiries = db.inquiries.filter(i => i.id !== id);
    saveDb(db);
  },

  // Orders CRUD
  getOrders(params: any = {}) {
    const db = getDb();
    let list = [...db.orders];
    if (params.status) {
      list = list.filter(o => o.status === params.status);
    }
    return { orders: list, pagination: { total: list.length, page: 1, limit: 100, pages: 1 } };
  },

  getMyOrders(userId: string) {
    const db = getDb();
    return db.orders.filter(o => o.userId === userId);
  },

  createOrder(userId: string, data: any) {
    const db = getDb();
    const user = db.users.find(u => u.id === userId) || db.users[1];

    let subtotal = 0;
    const orderItems = [];

    for (const item of data.items) {
      const prod = db.products.find(p => p.id === item.productId);
      if (prod) {
        const itemTotal = Number(prod.price) * item.quantity;
        subtotal += itemTotal;
        orderItems.push({
          id: `item-${Date.now()}-${Math.random().toString().slice(2,5)}`,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: prod.price,
          total: itemTotal,
          product: { name: prod.name, unit: prod.unit },
        });
      }
    }

    const total = subtotal;
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `DT-MOCK-${Date.now().toString().slice(-6)}`,
      userId,
      user: { name: user.name, email: user.email, companyName: user.companyName },
      subtotal,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      notes: data.notes,
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingAddress,
      items: orderItems,
      createdAt: new Date().toISOString(),
    };

    db.orders.push(newOrder);
    saveDb(db);
    return newOrder;
  },

  updateOrderStatus(id: string, status: string, trackingNumber?: string) {
    const db = getDb();
    const idx = db.orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      db.orders[idx] = {
        ...db.orders[idx],
        status,
        trackingNumber: trackingNumber || db.orders[idx].trackingNumber,
      };
      saveDb(db);
      return db.orders[idx];
    }
    return null;
  },

  // Journal CRUD
  getJournalPosts(params: any = {}) {
    const db = getDb();
    return { posts: db.journal, pagination: { total: db.journal.length, page: 1, limit: 100, pages: 1 } };
  },

  createJournalPost(data: any) {
    const db = getDb();
    const newPost = {
      ...data,
      id: `j-${Date.now()}`,
      slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      publishedAt: new Date().toISOString(),
      author: 'Dewan Traders',
    };
    db.journal.push(newPost);
    saveDb(db);
    return newPost;
  },

  updateJournalPost(id: string, data: any) {
    const db = getDb();
    const idx = db.journal.findIndex(j => j.id === id);
    if (idx !== -1) {
      db.journal[idx] = { ...db.journal[idx], ...data };
      saveDb(db);
      return db.journal[idx];
    }
    return null;
  },

  deleteJournalPost(id: string) {
    const db = getDb();
    db.journal = db.journal.filter(j => j.id !== id);
    saveDb(db);
  },

  // CMS CRUD
  getPageContent(page: string) {
    const db = getDb();
    return db.cms[page] || null;
  },

  updatePageContent(page: string, data: any) {
    const db = getDb();
    db.cms[page] = data;
    saveDb(db);
    return data;
  },

  getContactInfo() {
    const db = getDb();
    return db.contact;
  },

  updateContactInfo(data: any) {
    const db = getDb();
    db.contact = { ...db.contact, ...data };
    saveDb(db);
    return db.contact;
  },

  getTestimonials() {
    const db = getDb();
    return db.testimonials;
  },

  createTestimonial(data: any) {
    const db = getDb();
    const newT = { id: `t-${Date.now()}`, ...data };
    db.testimonials.push(newT);
    saveDb(db);
    return newT;
  },

  updateTestimonial(id: string, data: any) {
    const db = getDb();
    const idx = db.testimonials.findIndex(t => t.id === id);
    if (idx !== -1) {
      db.testimonials[idx] = { ...db.testimonials[idx], ...data };
      saveDb(db);
      return db.testimonials[idx];
    }
    return null;
  },

  deleteTestimonial(id: string) {
    const db = getDb();
    db.testimonials = db.testimonials.filter(t => t.id !== id);
    saveDb(db);
  },

  getDashboardStats() {
    const db = getDb();
    const pendingOrders = db.orders.filter(o => o.status === 'pending').length;
    const pendingInquiries = db.inquiries.filter(i => i.status === 'pending').length;
    return {
      stats: {
        users: db.users.filter(u => u.role !== 'admin').length,
        products: db.products.length,
        orders: db.orders.length,
        inquiries: db.inquiries.length,
        pendingOrders,
        pendingInquiries,
      },
      recentOrders: [...db.orders].reverse().slice(0, 5),
      recentInquiries: [...db.inquiries].reverse().slice(0, 5),
    };
  },
};
