import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';

export const orderService = {
  async create(userId: string, data: any) {
    const { items, notes, shippingAddress, billingAddress } = data;

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw ApiError.notFound(`Product ${item.productId} not found`);

      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
        total: itemTotal,
        notes: item.notes,
      });
    }

    const tax = subtotal * 0; // Tax TBD
    const total = subtotal + tax;
    const orderNumber = `DT-${Date.now()}`;

    return prisma.order.create({
      data: {
        orderNumber,
        userId,
        subtotal,
        tax,
        total,
        notes,
        shippingAddress,
        billingAddress,
        items: { create: orderItems },
      },
      include: {
        items: { include: { product: { select: { name: true, unit: true } } } },
        user: { select: { name: true, email: true } },
      },
    });
  },

  async getAll(filters: { page?: number; limit?: number; status?: string } = {}) {
    const { page = 1, limit = 20, status } = filters;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true, companyName: true } },
          items: { include: { product: { select: { name: true } } } },
        },
      }),
    ]);

    return { orders, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
  },

  async getMyOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { product: { select: { name: true, unit: true, imageUrl: true } } } },
      },
    });
  },

  async getById(id: string, userId?: string) {
    const where: any = { id };
    if (userId) where.userId = userId;

    const order = await prisma.order.findUnique({
      where,
      include: {
        user: { select: { name: true, email: true, phone: true, companyName: true } },
        items: { include: { product: { select: { name: true, unit: true, imageUrl: true } } } },
      },
    });
    if (!order) throw ApiError.notFound('Order not found');
    return order;
  },

  async updateStatus(id: string, status: string, trackingNumber?: string) {
    return prisma.order.update({
      where: { id },
      data: { status: status as any, trackingNumber },
    });
  },
};
