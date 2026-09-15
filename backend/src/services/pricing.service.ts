import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT PRICING
// ─────────────────────────────────────────────────────────────────────────────

export const productPricingService = {
  async getForProduct(productId: string) {
    return prisma.productPricing.findUnique({
      where: { productId },
    });
  },

  async getAll() {
    return prisma.productPricing.findMany({
      include: {
        product: { select: { id: true, name: true, slug: true, sku: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  },

  async upsert(productId: string, data: {
    pkPrice: number;
    pkUnit: string;
    pkUnitLabel: string;
    pkMoq: number;
    intPrice: number;
    intUnit: string;
    intUnitLabel: string;
    intMoq: number;
    cartonSize?: number | null;
    cartonPriceUsd?: number | null;
    containerEst20ft?: string | null;
    containerEst40ft?: string | null;
  }) {
    // Verify the product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw ApiError.notFound('Product not found');

    return prisma.productPricing.upsert({
      where: { productId },
      create: { productId, ...data },
      update: { ...data },
      include: {
        product: { select: { id: true, name: true, slug: true, sku: true } },
      },
    });
  },

  async delete(productId: string) {
    const existing = await prisma.productPricing.findUnique({ where: { productId } });
    if (!existing) throw ApiError.notFound('Pricing record not found');
    return prisma.productPricing.delete({ where: { productId } });
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SHIPPING CONFIG (Global Singleton)
// ─────────────────────────────────────────────────────────────────────────────

const SHIPPING_CONFIG_ID = 'shipping-config-main';

export const shippingConfigService = {
  async get() {
    let config = await prisma.shippingConfig.findFirst();
    if (!config) {
      // Auto-create with all defaults on first access
      config = await prisma.shippingConfig.create({
        data: { id: SHIPPING_CONFIG_ID },
      });
    }
    return config;
  },

  async update(data: {
    exchangeRatePkrPerUsd?: number;
    pkStandardDeliveryCost?: number;
    pkExpressDeliveryCost?: number;
    pkPremiumPackagingCost?: number;
    intContainer20ftReefer?: number;
    intContainer40ftReefer?: number;
    intContainer20ftDry?: number;
    intContainer40ftDry?: number;
    intBulkLoose?: number;
    packMult20ftReefer?: number;
    packMult40ftReefer?: number;
    packMult20ftDry?: number;
    packMult40ftDry?: number;
    intDocumentationCost?: number;
    intCustomsClearanceCost?: number;
  }) {
    const existing = await prisma.shippingConfig.findFirst();
    if (existing) {
      return prisma.shippingConfig.update({
        where: { id: existing.id },
        data,
      });
    }
    // Create with defaults + provided values
    return prisma.shippingConfig.create({
      data: { id: SHIPPING_CONFIG_ID, ...data },
    });
  },
};
