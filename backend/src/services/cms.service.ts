import { prisma } from '../config/database';

export const cmsService = {
  async getPage(page: string) {
    return prisma.pageContent.findUnique({ where: { page } });
  },

  async upsertPage(page: string, data: any) {
    return prisma.pageContent.upsert({
      where: { page },
      update: data,
      create: { page, ...data },
    });
  },

  async getContactInfo() {
    return prisma.contactInfo.findFirst();
  },

  async upsertContactInfo(data: any) {
    const existing = await prisma.contactInfo.findFirst();
    if (existing) {
      return prisma.contactInfo.update({ where: { id: existing.id }, data });
    }
    return prisma.contactInfo.create({ data });
  },

  async getTestimonials() {
    return prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  },

  async createTestimonial(data: any) {
    return prisma.testimonial.create({ data });
  },

  async updateTestimonial(id: string, data: any) {
    return prisma.testimonial.update({ where: { id }, data });
  },

  async deleteTestimonial(id: string) {
    return prisma.testimonial.delete({ where: { id } });
  },

  async getDashboardStats() {
    const [users, products, orders, inquiries, pendingOrders, pendingInquiries] = await Promise.all([
      prisma.user.count({ where: { role: { not: 'admin' } } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.inquiry.count(),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.inquiry.count({ where: { status: 'pending' } }),
    ]);

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });

    const recentInquiries = await prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return {
      stats: { users, products, orders, inquiries, pendingOrders, pendingInquiries },
      recentOrders,
      recentInquiries,
    };
  },
};
