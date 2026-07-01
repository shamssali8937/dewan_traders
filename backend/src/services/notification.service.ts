import { prisma } from '../config/database';

export const notificationService = {
  async create(userId: string, title: string, message: string, type: string) {
    return prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
  },

  async createForAdmins(title: string, message: string, type: string) {
    const admins = await prisma.user.findMany({
      where: { role: { in: ['admin', 'manager'] } },
      select: { id: true },
    });

    const notifications = admins.map((admin) => ({
      userId: admin.id,
      title,
      message,
      type,
    }));

    return prisma.notification.createMany({
      data: notifications,
    });
  },

  async getMyNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  },

  async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  },

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },
};
