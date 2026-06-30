import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/refresh
router.post('/refresh', authController.refreshToken);

// POST /api/auth/logout  (protected)
router.post('/logout', authenticate, authController.logout);

// GET /api/auth/me  (protected)
router.get('/me', authenticate, authController.me);

// GET /api/auth/users (protected, admin/manager only)
router.get('/users', authenticate, authorize('admin', 'manager'), authController.getAllUsers);

// POST /api/auth/forgot-password (public)
router.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/reset-password (public, requires token)
router.post('/reset-password', authController.resetPassword);

export default router;
