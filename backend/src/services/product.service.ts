import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';

interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
  isActive?: boolean;
}

export const productService = {
  async getAll(filters: ProductFilters = {}) {
    const { page = 1, limit = 12, category, search, featured, isActive = true } = filters;
    const skip = (page - 1) * limit;

    const where: any = { isActive };
    if (category) where.category = { slug: category };
    if (featured !== undefined) where.isFeatured = featured;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: { select: { id: true, name: true, slug: true, type: true } } },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      }),
    ]);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async getBySlug(slugOrId: string) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: slugOrId },
          { id: slugOrId }
        ]
      },
      include: { category: true },
    });
    if (!product) throw ApiError.notFound('Product not found');
    return product;
  },

  async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) throw ApiError.notFound('Product not found');
    return product;
  },

  async create(data: any) {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const sku = data.sku || `DT-${Date.now()}`;

    return prisma.product.create({
      data: { ...data, slug, sku },
      include: { category: true },
    });
  },

  async update(id: string, data: any) {
    await productService.getById(id);
    return prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });
  },

  async delete(id: string) {
    await productService.getById(id);
    return prisma.product.delete({ where: { id } });
  },

  async getFeatured() {
    return prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 8,
      include: { category: { select: { name: true, slug: true, type: true } } },
    });
  },
};

export const categoryService = {
  async getAll() {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true } } },
    });
  },

  async create(data: any) {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-');
    return prisma.category.create({ data: { ...data, slug } });
  },

  async update(id: string, data: any) {
    return prisma.category.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.category.delete({ where: { id } });
  },
};
