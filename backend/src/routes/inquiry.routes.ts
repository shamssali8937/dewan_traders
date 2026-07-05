import { Router } from 'express';
import { inquiryController } from '../controllers/inquiry.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public — anyone can send inquiry
router.post('/', inquiryController.create);

// Admin only
router.get('/', authenticate, authorize('admin', 'manager'), inquiryController.getAll);
// Admin/User replies
router.post('/:id/reply', authenticate, inquiryController.createReply);
router.get('/:id', authenticate, authorize('admin', 'manager'), inquiryController.getById);
router.patch('/:id/status', authenticate, authorize('admin', 'manager'), inquiryController.updateStatus);
router.delete('/:id', authenticate, authorize('admin'), inquiryController.delete);

export default router;
