import { Router } from 'express';
import { orderController, uploadPaymentProof } from '../controllers/order.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/track/:orderNumber', orderController.trackOrderPublic);

// User routes (protected)
router.post('/', authenticate, orderController.create);
router.get('/my-orders', authenticate, orderController.getMyOrders);
router.get('/:id', authenticate, orderController.getById);
router.post('/:id/payment-proof', authenticate, uploadPaymentProof.single('receipt'), orderController.uploadPayment);

// Admin routes
router.get('/', authenticate, authorize('admin', 'manager'), orderController.getAll);
router.patch('/:id/status', authenticate, authorize('admin', 'manager'), orderController.updateStatus);
router.patch('/:id/verify-payment', authenticate, authorize('admin', 'manager'), orderController.verifyPayment);

export default router;
