import { Router } from 'express';
import { orderController, uploadPaymentProof } from '../controllers/order.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validateCreateOrder, validateUpdateOrderStatus, validateId } from '../validators/validators';

const router = Router();

// Public routes
router.get('/track/:orderNumber', orderController.trackOrderPublic);

// User routes (protected)
router.post('/', authenticate, validateCreateOrder, orderController.create);
router.get('/my-orders', authenticate, orderController.getMyOrders);
router.get('/:id', authenticate, validateId, orderController.getById);
router.post('/:id/payment-proof', authenticate, validateId, uploadPaymentProof.single('receipt'), orderController.uploadPayment);

// Admin routes
router.get('/', authenticate, authorize('admin', 'manager'), orderController.getAll);
router.patch('/:id/status', authenticate, authorize('admin', 'manager'), validateUpdateOrderStatus, orderController.updateStatus);
router.patch('/:id/verify-payment', authenticate, authorize('admin', 'manager'), validateId, orderController.verifyPayment);

export default router;
