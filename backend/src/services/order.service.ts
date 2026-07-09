import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';

// B2B Enterprise Pricing Map matching frontend pricing.ts
const PRICING_MAP: Record<string, { pkPrice: number; intPrice: number }> = {
  'kinnow-mandarin': { pkPrice: 120, intPrice: 9.00 },
  'mango-chaunsa': { pkPrice: 350, intPrice: 18.00 },
  'blood-orange': { pkPrice: 220, intPrice: 11.00 },
  'guava': { pkPrice: 180, intPrice: 12.00 },
  'red-onion': { pkPrice: 150, intPrice: 380.00 },
  'potato': { pkPrice: 84, intPrice: 320.00 },
  'tomato': { pkPrice: 160, intPrice: 8.00 },
  'garlic': { pkPrice: 450, intPrice: 18.00 },
  'super-kernel-basmati': { pkPrice: 490, intPrice: 1250.00 },
  '1121-sella-basmati': { pkPrice: 530, intPrice: 1350.00 },
  'surgical-scissors-set': { pkPrice: 2200, intPrice: 12.50 },
  'forceps-set': { pkPrice: 2800, intPrice: 15.00 },
  'scalpel-set': { pkPrice: 1800, intPrice: 9.50 },
  'cricket-bat': { pkPrice: 8500, intPrice: 45.00 },
  'football': { pkPrice: 3800, intPrice: 18.00 },
  'hockey-stick': { pkPrice: 5500, intPrice: 28.00 }
};

const ALIASES: Record<string, string> = {
  'kinnow': 'kinnow-mandarin',
  'mango': 'mango-chaunsa',
  'fresh-onion': 'red-onion',
  'red-onions': 'red-onion',
  'super-kernel-basmati-rice': 'super-kernel-basmati',
  '1121-sella-basmati-rice': '1121-sella-basmati',
  'surgical-scissors': 'surgical-scissors-set',
  'hemostatic-forceps-set': 'forceps-set',
  'scalpel-handles-blades': 'scalpel-set',
  'surgical-knife-set': 'scalpel-set',
  'english-willow-cricket-bat': 'cricket-bat',
  'thermo-bonded-football': 'football',
  'composite-hockey-stick': 'hockey-stick'
};

function getProductB2bPrice(slug: string, isInternational: boolean, fallback: number): number {
  const clean = slug.toLowerCase().trim();
  let targetKey = clean;
  if (PRICING_MAP[clean]) {
    targetKey = clean;
  } else if (ALIASES[clean]) {
    targetKey = ALIASES[clean];
  } else {
    for (const key of Object.keys(PRICING_MAP)) {
      if (clean.includes(key) || key.includes(clean)) {
        targetKey = key;
        break;
      }
    }
  }
  
  const pricing = PRICING_MAP[targetKey];
  if (!pricing) return fallback;
  return isInternational ? pricing.intPrice : pricing.pkPrice;
}

export const orderService = {
  async create(userId: string, data: any) {
    const { items, notes, shippingAddress, billingAddress, paymentMethod } = data;

    const isInternational = notes ? (
      notes.includes('Market: International') ||
      notes.includes('International') ||
      notes.includes('USD') ||
      notes.includes('Container') ||
      notes.includes('Incoterm')
    ) : false;

    // Calculate packing surcharge multiplier
    let packingMultiplier = 1.0;
    if (notes && typeof notes === 'string') {
      const notesUpper = notes.toUpperCase();
      if (notesUpper.includes('4FT_REEFER') || notesUpper.includes('40FT_REEFER')) packingMultiplier = 1.25;
      else if (notesUpper.includes('2FT_REEFER') || notesUpper.includes('20FT_REEFER')) packingMultiplier = 1.15;
      else if (notesUpper.includes('4FT_DRY') || notesUpper.includes('40FT_DRY')) packingMultiplier = 1.08;
      else if (notesUpper.includes('2FT_DRY') || notesUpper.includes('20FT_DRY')) packingMultiplier = 1.04;
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw ApiError.notFound(`Product ${item.productId} not found`);

      const basePrice = getProductB2bPrice(product.slug, isInternational, Number(product.price));
      const adjustedPrice = basePrice * packingMultiplier;
      const itemTotal = adjustedPrice * item.quantity;
      subtotal += itemTotal;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: adjustedPrice,
        total: itemTotal,
        notes: item.notes,
      });
    }

    // Calculate dynamic shipping, delivery, and docs surcharges
    let shippingCost = 0;
    if (isInternational) {
      let containerBaseCost = 0;
      const notesUpper = notes ? notes.toUpperCase() : '';
      if (notesUpper.includes('20FT_REEFER')) containerBaseCost = 1800;
      else if (notesUpper.includes('40FT_REEFER')) containerBaseCost = 2800;
      else if (notesUpper.includes('20FT_DRY')) containerBaseCost = 1000;
      else if (notesUpper.includes('40FT_DRY')) containerBaseCost = 1500;
      else if (notesUpper.includes('BULK_LOOSE') || notesUpper.includes('BULK/LOOSE')) containerBaseCost = 400;

      let docClearanceCost = 0;
      if (notesUpper.includes('DOCS')) docClearanceCost += 150;
      if (notesUpper.includes('CUSTOMS')) docClearanceCost += 250;

      shippingCost = containerBaseCost + docClearanceCost;
    } else {
      let localPackagingTotal = 0;
      if (notes && notes.includes('Packaging: Premium Packaging')) {
        localPackagingTotal = 1500;
      }

      let localDeliveryTotal = 0;
      if (notes) {
        if (notes.includes('Delivery: EXPRESS')) localDeliveryTotal = 600;
        else if (notes.includes('Delivery: STANDARD')) localDeliveryTotal = 250;
      }

      shippingCost = localPackagingTotal + localDeliveryTotal;
    }

    const tax = subtotal * 0;
    const total = subtotal + shippingCost;
    const orderNumber = `DT-${Date.now()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        subtotal,
        tax,
        shippingCost,
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

  async uploadPaymentProof(id: string, userId: string, paymentProofUrl: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { user: { select: { name: true } } },
    });
    if (!order) throw ApiError.notFound('Order not found');
    if (order.userId !== userId) throw ApiError.forbidden('Access denied');

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
