import { Router } from 'express';
import { paymentAccountController } from '../controllers/paymentAccount.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public
router.get('/active', paymentAccountController.getActive);

// Admin Only
router.post('/', authenticate, authorize('admin', 'manager'), paymentAccountController.create);
router.get('/', authenticate, authorize('admin', 'manager'), paymentAccountController.getAll);
router.get('/:id', authenticate, authorize('admin', 'manager'), paymentAccountController.getById);
router.put('/:id', authenticate, authorize('admin', 'manager'), paymentAccountController.update);
router.delete('/:id', authenticate, authorize('admin'), paymentAccountController.delete);

export default router;
