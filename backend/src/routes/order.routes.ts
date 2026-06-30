import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// User routes (protected)
router.post('/', authenticate, orderController.create);
router.get('/my-orders', authenticate, orderController.getMyOrders);
router.get('/:id', authenticate, orderController.getById);

// Admin routes
router.get('/', authenticate, authorize('admin', 'manager'), orderController.getAll);
router.patch('/:id/status', authenticate, authorize('admin', 'manager'), orderController.updateStatus);

export default router;
