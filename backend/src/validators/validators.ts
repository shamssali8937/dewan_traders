import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

// ─── Reusable: Run validation and return errors ───────────────────────────
export const validate = (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(', ');
    next(ApiError.badRequest(messages));
    return;
  }
  next();
};

// ─── Auth Validators ─────────────────────────────────────────────────────
export const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name too long'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
  body('userType').isIn(['individual', 'company']).withMessage('User type must be individual or company'),
  body('phone').optional().trim().isMobilePhone('any').withMessage('Invalid phone number'),
  body('companyName').optional().trim().isLength({ max: 200 }).withMessage('Company name too long'),
  validate,
];

export const validateLogin = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

export const validateForgotPassword = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  validate,
];

export const validateResetPassword = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
  validate,
];

// ─── Inquiry Validators ──────────────────────────────────────────────────
export const validateCreateInquiry = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional().trim().isLength({ max: 30 }),
  body('company').optional().trim().isLength({ max: 200 }),
  body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 300 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10, max: 5000 }).withMessage('Message must be 10–5000 characters'),
  validate,
];

// ─── Product Validators ──────────────────────────────────────────────────
export const validateCreateProduct = [
  body('name').trim().notEmpty().withMessage('Product name is required').isLength({ max: 200 }),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('minOrderQty').optional().isInt({ min: 1 }).withMessage('Minimum order quantity must be at least 1'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('categoryId').notEmpty().withMessage('Category ID is required'),
  validate,
];

export const validateUpdateProduct = [
  param('id').notEmpty().withMessage('Product ID is required'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('minOrderQty').optional().isInt({ min: 1 }).withMessage('Minimum order qty must be >= 1'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be >= 0'),
  validate,
];

// ─── Order Validators ────────────────────────────────────────────────────
export const validateCreateOrder = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').notEmpty().withMessage('Each item must have a productId'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Each item quantity must be at least 1'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  validate,
];

export const validateUpdateOrderStatus = [
  param('id').notEmpty().withMessage('Order ID is required'),
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  validate,
];

// ─── ID Param Validator ──────────────────────────────────────────────────
export const validateId = [
  param('id').notEmpty().withMessage('ID parameter is required'),
  validate,
];
