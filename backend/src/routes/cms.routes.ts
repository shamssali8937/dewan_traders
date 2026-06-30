import { Router } from 'express';
import { cmsController } from '../controllers/cms.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public
router.get('/pages/:page', cmsController.getPage);
router.get('/contact', cmsController.getContactInfo);
router.get('/testimonials', cmsController.getTestimonials);

// Admin
router.get('/dashboard', authenticate, authorize('admin', 'manager'), cmsController.getDashboardStats);
router.put('/pages/:page', authenticate, authorize('admin', 'manager'), cmsController.upsertPage);
router.put('/contact', authenticate, authorize('admin'), cmsController.upsertContactInfo);
router.post('/testimonials', authenticate, authorize('admin'), cmsController.createTestimonial);
router.put('/testimonials/:id', authenticate, authorize('admin'), cmsController.updateTestimonial);
router.delete('/testimonials/:id', authenticate, authorize('admin'), cmsController.deleteTestimonial);

export default router;
