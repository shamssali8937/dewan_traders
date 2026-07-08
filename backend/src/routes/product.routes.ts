import { Router } from 'express';
import { productController, categoryController, upload } from '../controllers/product.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validateCreateProduct, validateUpdateProduct, validateId } from '../validators/validators';

const router = Router();

// ─── PUBLIC ROUTES ───
router.get('/', productController.getAll);
router.get('/featured', productController.getFeatured);
router.get('/:slug', productController.getBySlug);

// ─── ADMIN ROUTES ───
router.post('/', authenticate, authorize('admin', 'manager'), validateCreateProduct, productController.create);
router.put('/:id', authenticate, authorize('admin', 'manager'), validateUpdateProduct, productController.update);
router.patch('/:id', authenticate, authorize('admin', 'manager'), validateId, productController.update);
router.delete('/:id', authenticate, authorize('admin'), validateId, productController.delete);

// ─── IMAGE UPLOAD ───
router.post(
  '/upload/image',
  authenticate,
  authorize('admin', 'manager'),
  upload.single('image'),
  productController.uploadImage
);

export default router;
