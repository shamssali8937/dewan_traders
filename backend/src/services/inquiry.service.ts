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
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        replies: { orderBy: { createdAt: 'asc' } },
        user: { select: { name: true, email: true } },
      },
    });
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
      include: {
        replies: { orderBy: { createdAt: 'asc' } },
      },
    });
  },

  async createReply(inquiryId: string, message: string, sender: string) {
    const inquiry = await prisma.inquiry.findUnique({ where: { id: inquiryId } });
    if (!inquiry) throw ApiError.notFound('Inquiry not found');

    const reply = await prisma.inquiryReply.create({
      data: {
        inquiryId,
        message,
        sender,
      },
    });

    // Update inquiry status
    await prisma.inquiry.update({
      where: { id: inquiryId },
      data: {
        status: sender === 'admin' ? 'responded' : 'read',
        respondedAt: sender === 'admin' ? new Date() : undefined,
      },
    });

    // Handle notifications
    const { notificationService } = require('./notification.service');
    const { mailer } = require('../utils/mailer');

    if (sender === 'admin') {
      if (inquiry.userId) {
        await notificationService.create(
          inquiry.userId,
          'Admin Responded to Inquiry',
          `Dewan Traders admin replied to inquiry: "${message.slice(0, 60)}..."`,
          'inquiry_reply'
        );
      }

      // Fetch contact info
      const contactInfo = await prisma.contactInfo.findFirst();
      await mailer.sendInquiryReply(
        inquiry.email,
        inquiry.name,
        inquiry.subject,
        inquiry.message,
        message,
        contactInfo
      );
    } else {
      await notificationService.createForAdmins(
        'New Reply from Client',
        `${inquiry.name} replied: "${message.slice(0, 60)}..."`,
        'inquiry_reply'
      );
    }

    return reply;
  },

  async delete(id: string) {
    return prisma.inquiry.delete({ where: { id } });
  },
};
