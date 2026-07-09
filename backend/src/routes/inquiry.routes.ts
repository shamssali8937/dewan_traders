import { Router } from 'express';
import { inquiryController } from '../controllers/inquiry.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validateCreateInquiry, validateId } from '../validators/validators';

const router = Router();

// Public — anyone can send inquiry (with validation)
router.post('/', validateCreateInquiry, inquiryController.create);

// Admin only
router.get('/', authenticate, authorize('admin', 'manager'), inquiryController.getAll);
// Admin/User replies
router.post('/:id/reply', authenticate, validateId, inquiryController.createReply);
router.get('/:id', authenticate, authorize('admin', 'manager'), validateId, inquiryController.getById);
router.patch('/:id/status', authenticate, authorize('admin', 'manager'), validateId, inquiryController.updateStatus);
router.delete('/:id', authenticate, authorize('admin'), validateId, inquiryController.delete);

export default router;
