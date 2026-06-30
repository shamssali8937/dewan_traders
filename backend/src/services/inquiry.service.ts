import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';

export const inquiryService = {
  async create(data: any) {
    return prisma.inquiry.create({ data });
  },

  async getAll(filters: { page?: number; limit?: number; status?: string } = {}) {
    const { page = 1, limit = 20, status } = filters;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;

    const [total, inquiries] = await Promise.all([
      prisma.inquiry.count({ where }),
      prisma.inquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

    return { inquiries, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
  },

  async getById(id: string) {
    const inquiry = await prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) throw ApiError.notFound('Inquiry not found');
    return inquiry;
  },

  async updateStatus(id: string, status: string, adminNotes?: string) {
    return prisma.inquiry.update({
      where: { id },
      data: {
        status: status as any,
        adminNotes,
        respondedAt: status === 'responded' ? new Date() : undefined,
      },
    });
  },

  async delete(id: string) {
    return prisma.inquiry.delete({ where: { id } });
  },
};
