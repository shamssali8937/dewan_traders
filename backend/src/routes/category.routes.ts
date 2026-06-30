import { Router } from 'express';
import { categoryController } from '../controllers/product.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', categoryController.getAll);
router.post('/', authenticate, authorize('admin'), categoryController.create);
router.put('/:id', authenticate, authorize('admin'), categoryController.update);
router.delete('/:id', authenticate, authorize('admin'), categoryController.delete);

export default router;
