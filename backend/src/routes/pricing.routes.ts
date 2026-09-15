import { Router } from 'express';
import { productPricingController, shippingConfigController } from '../controllers/pricing.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// ─── SHIPPING CONFIG ─────────────────────────────────────────────────────────
// Public: anyone can read the shipping config (needed for checkout form)
router.get('/shipping', shippingConfigController.get);
// Admin/Manager: update shipping config
router.put('/shipping', authenticate, authorize('admin', 'manager'), shippingConfigController.update);

// ─── PRODUCT PRICING (all products — admin list) ─────────────────────────────
router.get('/products', authenticate, authorize('admin', 'manager'), productPricingController.getAll);

// ─── PRODUCT PRICING (per product) ──────────────────────────────────────────
// Public: read pricing for a single product
router.get('/product/:productId', productPricingController.getForProduct);
// Admin/Manager: upsert pricing for a single product
router.put('/product/:productId', authenticate, authorize('admin', 'manager'), productPricingController.upsert);
// Admin only: delete pricing for a single product (reverts to DB fallback)
router.delete('/product/:productId', authenticate, authorize('admin'), productPricingController.delete);

export default router;
