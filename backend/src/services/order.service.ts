import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';

export const orderService = {
  async create(userId: string, data: any) {
    const { items, notes, shippingAddress, billingAddress, paymentMethod } = data;

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

    const tax = subtotal * 0;
    const total = subtotal + tax;
    const orderNumber = `DT-${Date.now()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        subtotal,
        tax,
        total,
        notes,
        shippingAddress,
        billingAddress,
        paymentMethod,
        paymentProofStatus: 'pending_upload',
        items: { create: orderItems },
      },
      include: {
        items: { include: { product: { select: { name: true, unit: true } } } },
        user: { select: { name: true, email: true, phone: true, companyName: true } },
      },
    });

    const { notificationService } = require('./notification.service');
    const { mailer } = require('../utils/mailer');

    // Create notifications
    await notificationService.create(
      userId,
      'Order Placed Successfully',
      `Your order ${orderNumber} has been received. Please complete payment.`,
      'order_placed'
    );
    await notificationService.createForAdmins(
      'New Order Received',
      `Order ${orderNumber} placed by ${order.user.name}. Value: ${total} PKR.`,
      'order_placed'
    );

    // Send confirmation emails
    const paymentAccounts = await prisma.paymentAccount.findMany({ where: { isActive: true } });
    mailer.sendOrderConfirmation(
      order.user.email,
      order.user.name,
      orderNumber,
      String(total),
      order.items,
      paymentMethod,
      paymentAccounts
    );

    mailer.notifyAdminNewOrder({
      customerName: order.user.name,
      companyName: order.user.companyName || 'N/A',
      email: order.user.email,
      phone: order.user.phone || 'N/A',
      productName: order.items[0]?.product?.name || 'General Commodity',
      quantity: order.items[0]?.quantity || 0,
      total: String(total),
      paymentMethod,
      orderNumber,
      id: order.id,
    });

    return order;
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

  async uploadPaymentProof(id: string, userId: string, filename: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { user: { select: { name: true } } },
    });
    if (!order) throw ApiError.notFound('Order not found');
    if (order.userId !== userId) throw ApiError.forbidden('Access denied');

    const paymentProofUrl = `/uploads/payments/${filename}`;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        paymentProofUrl,
        paymentProofUploadedAt: new Date(),
        paymentProofStatus: 'pending_verification',
      },
    });

    const { notificationService } = require('./notification.service');
    const { mailer } = require('../utils/mailer');

    // Create notifications
    await notificationService.create(
      userId,
      'Payment Proof Uploaded',
      `Payment screenshot submitted for order ${order.orderNumber}. Pending verification.`,
      'payment_uploaded'
    );
    await notificationService.createForAdmins(
      'Payment Proof Submitted',
      `Payment proof uploaded for order ${order.orderNumber} by ${order.user.name}.`,
      'payment_uploaded'
    );

    // Email alert to Admin
    mailer.notifyAdminPaymentProof({
      orderNumber: order.orderNumber,
      customerName: order.user.name,
      orderId: order.id,
      proofUrl: paymentProofUrl,
    });

    return updatedOrder;
  },

  async verifyPayment(id: string, status: string, notes?: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    });
    if (!order) throw ApiError.notFound('Order not found');

    const isApproved = status === 'approved';
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        paymentProofStatus: status,
        paymentProofNotes: notes || null,
        status: isApproved ? 'processing' : order.status,
        paymentStatus: isApproved ? 'paid' : order.paymentStatus,
      },
    });

    const { notificationService } = require('./notification.service');
    const { mailer } = require('../utils/mailer');

    if (isApproved) {
      await notificationService.create(
        order.userId,
        'Payment Verified successfully',
        `Your payment for order ${order.orderNumber} is approved. Order status set to Processing.`,
        'payment_verified'
      );
      mailer.sendPaymentVerified(order.user.email, order.user.name, order.orderNumber);
    } else {
      await notificationService.create(
        order.userId,
        'Payment Verification Rejected',
        `Payment proof rejected for ${order.orderNumber}. Reason: ${notes || 'Invalid proof'}`,
        'payment_uploaded'
      );
      mailer.sendPaymentRejected(order.user.email, order.user.name, order.orderNumber, notes || 'Invalid receipt');
    }

    return updatedOrder;
  },

  async updateStatus(id: string, status: string, trackingNumber?: string, estimatedDelivery?: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    });
    if (!order) throw ApiError.notFound('Order not found');

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: status as any, trackingNumber, estimatedDelivery },
    });

    const { notificationService } = require('./notification.service');
    const { mailer } = require('../utils/mailer');

    // In-app notifications
    await notificationService.create(
      order.userId,
      `Order Status Set to ${status.toUpperCase()}`,
      `Your shipment order ${order.orderNumber} is now ${status}.`,
      status
    );

    if (status === 'delivered') {
      await notificationService.createForAdmins(
        'Order Completed',
        `Shipment contract ${order.orderNumber} was marked as delivered.`,
        'delivered'
      );
    }

    // Status-specific email alerts
    if (status === 'processing') {
      mailer.sendProcessingAlert(order.user.email, order.user.name, order.orderNumber);
    } else if (status === 'shipped') {
      mailer.sendShippedAlert(order.user.email, order.user.name, order.orderNumber, trackingNumber || 'N/A');
    } else if (status === 'delivered') {
      mailer.sendDeliveredAlert(order.user.email, order.user.name, order.orderNumber);
    }

    return updatedOrder;
  },

  async trackOrderPublic(orderNumber: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: { include: { product: { select: { name: true, unit: true, imageUrl: true } } } },
      },
    });
    if (!order) throw ApiError.notFound('Order not found');
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt,
      items: order.items,
      total: order.total,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      notes: order.notes,
      paymentMethod: order.paymentMethod,
      estimatedDelivery: order.estimatedDelivery,
      updatedAt: order.updatedAt,
    };
  },
};
