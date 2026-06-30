import { Router } from 'express';
import { journalController } from '../controllers/journal.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', journalController.getAll);
router.get('/:slug', journalController.getBySlug);

// Admin
router.get('/admin/all', authenticate, authorize('admin', 'manager'), journalController.getAllAdmin);
router.post('/', authenticate, authorize('admin', 'manager'), journalController.create);
router.put('/:id', authenticate, authorize('admin', 'manager'), journalController.update);
router.delete('/:id', authenticate, authorize('admin'), journalController.delete);

export default router;
