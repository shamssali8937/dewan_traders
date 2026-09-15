import { Request, Response } from 'express';
import { productPricingService, shippingConfigService } from '../services/pricing.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middlewares/auth.middleware';
import { logger } from '../utils/logger';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT PRICING CONTROLLERS
// ─────────────────────────────────────────────────────────────────────────────

export const productPricingController = {
  // GET /api/pricing/product/:productId — public
  getForProduct: asyncHandler(async (req: Request, res: Response) => {
    const pricing = await productPricingService.getForProduct(String(req.params.productId));
    res.json(ApiResponse.ok('Product pricing retrieved', pricing));
  }),

  // GET /api/pricing/products — admin only
  getAll: asyncHandler(async (_req: Request, res: Response) => {
    const pricings = await productPricingService.getAll();
    res.json(ApiResponse.ok('All product pricings retrieved', pricings));
  }),

  // PUT /api/pricing/product/:productId — admin/manager
  upsert: asyncHandler(async (req: AuthRequest, res: Response) => {
    const productId = String(req.params.productId);
    const pricing = await productPricingService.upsert(productId, req.body);
    logger.info(`Product pricing updated for productId: ${productId} by ${req.user?.email}`);
    res.json(ApiResponse.ok('Product pricing saved', pricing));
  }),

  // DELETE /api/pricing/product/:productId — admin only
  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    const productId = String(req.params.productId);
    await productPricingService.delete(productId);
    logger.warn(`Product pricing deleted for productId: ${productId} by ${req.user?.email}`);
    res.json(ApiResponse.ok('Product pricing deleted'));
  }),
};

// ─────────────────────────────────────────────────────────────────────────────
// SHIPPING CONFIG CONTROLLERS
// ─────────────────────────────────────────────────────────────────────────────

export const shippingConfigController = {
  // GET /api/pricing/shipping — public
  get: asyncHandler(async (_req: Request, res: Response) => {
    const config = await shippingConfigService.get();
    // Normalize Prisma Decimal fields to plain JS numbers to avoid string concat bugs on frontend
    const normalized = config ? {
      id: config.id,
      exchangeRatePkrPerUsd:   Number(config.exchangeRatePkrPerUsd),
      pkStandardDeliveryCost:  Number(config.pkStandardDeliveryCost),
      pkExpressDeliveryCost:   Number(config.pkExpressDeliveryCost),
      pkPremiumPackagingCost:  Number(config.pkPremiumPackagingCost),
      intContainer20ftReefer:  Number(config.intContainer20ftReefer),
      intContainer40ftReefer:  Number(config.intContainer40ftReefer),
      intContainer20ftDry:     Number(config.intContainer20ftDry),
      intContainer40ftDry:     Number(config.intContainer40ftDry),
      intBulkLoose:            Number(config.intBulkLoose),
      packMult20ftReefer:      Number(config.packMult20ftReefer),
      packMult40ftReefer:      Number(config.packMult40ftReefer),
      packMult20ftDry:         Number(config.packMult20ftDry),
      packMult40ftDry:         Number(config.packMult40ftDry),
      intDocumentationCost:    Number(config.intDocumentationCost),
      intCustomsClearanceCost: Number(config.intCustomsClearanceCost),
      updatedAt: config.updatedAt,
    } : null;
    res.json(ApiResponse.ok('Shipping config retrieved', normalized));
  }),

  // PUT /api/pricing/shipping — admin/manager
  update: asyncHandler(async (req: AuthRequest, res: Response) => {
    const config = await shippingConfigService.update(req.body);
    const normalized = {
      id: config.id,
      exchangeRatePkrPerUsd:   Number(config.exchangeRatePkrPerUsd),
      pkStandardDeliveryCost:  Number(config.pkStandardDeliveryCost),
      pkExpressDeliveryCost:   Number(config.pkExpressDeliveryCost),
      pkPremiumPackagingCost:  Number(config.pkPremiumPackagingCost),
      intContainer20ftReefer:  Number(config.intContainer20ftReefer),
      intContainer40ftReefer:  Number(config.intContainer40ftReefer),
      intContainer20ftDry:     Number(config.intContainer20ftDry),
      intContainer40ftDry:     Number(config.intContainer40ftDry),
      intBulkLoose:            Number(config.intBulkLoose),
      packMult20ftReefer:      Number(config.packMult20ftReefer),
      packMult40ftReefer:      Number(config.packMult40ftReefer),
      packMult20ftDry:         Number(config.packMult20ftDry),
      packMult40ftDry:         Number(config.packMult40ftDry),
      intDocumentationCost:    Number(config.intDocumentationCost),
      intCustomsClearanceCost: Number(config.intCustomsClearanceCost),
      updatedAt: config.updatedAt,
    };
    logger.info(`Shipping config updated by ${req.user?.email}`);
    res.json(ApiResponse.ok('Shipping config updated', normalized));
  }),
};
