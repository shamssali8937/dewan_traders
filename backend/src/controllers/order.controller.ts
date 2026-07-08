import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middlewares/auth.middleware';
import { logger } from '../utils/logger';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../config/config';
import { uploadToCloudinary } from '../utils/cloudinary';

// ─── Multer Storage Config for payments ───
const uploadDir = path.join(process.cwd(), config.upload.dir, 'payments');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `receipt-${Date.now()}${ext}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExts = ['.jpg', '.jpeg', '.png', '.pdf'];
  const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExts.includes(ext) && allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file: only image files (jpg, jpeg, png) or PDF are allowed'));
  }
};

export const uploadPaymentProof = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.upload.maxSize }, // 5MB limit
});

export const orderController = {
  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await orderService.create(req.user!.id, req.body);
    logger.info(`Order created: ${order.orderNumber} by user ${req.user!.email}`);
    res.status(201).json(ApiResponse.created('Order placed successfully', order));
  }),

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, status } = req.query;
    const result = await orderService.getAll({
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
      status: status as string,
    });
    res.json(ApiResponse.ok('Orders retrieved', result));
  }),

  getMyOrders: asyncHandler(async (req: AuthRequest, res: Response) => {
    const orders = await orderService.getMyOrders(req.user!.id);
    res.json(ApiResponse.ok('Your orders', orders));
  }),

  getById: asyncHandler(async (req: AuthRequest, res: Response) => {
    const isAdmin = ['admin', 'manager'].includes(req.user!.role);
    const order = await orderService.getById(
      req.params.id as string,
      isAdmin ? undefined : req.user!.id
    );
    res.json(ApiResponse.ok('Order retrieved', order));
  }),

  updateStatus: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status, trackingNumber, estimatedDelivery } = req.body;
    const order = await orderService.updateStatus(req.params.id as string, status, trackingNumber, estimatedDelivery);
    logger.info(`Order ${order.orderNumber} status → ${status} by ${req.user?.email}`);
    res.json(ApiResponse.ok('Order status updated', order));
  }),

  uploadPayment: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Payment receipt screenshot file is required' });
    }
    const localUrlFallback = `/uploads/payments/${req.file.filename}`;
    const paymentProofUrl = await uploadToCloudinary(req.file.path, 'payments', localUrlFallback);

    const order = await orderService.uploadPaymentProof(req.params.id as string, req.user!.id, paymentProofUrl);
    logger.info(`Order ${order.orderNumber} payment proof resolved: ${paymentProofUrl} by customer ${req.user?.email}`);
    res.json(ApiResponse.ok('Payment receipt proof uploaded successfully', order));
  }),

  verifyPayment: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status, notes } = req.body;
    const order = await orderService.verifyPayment(req.params.id as string, status, notes as string);
    logger.info(`Order ${order.orderNumber} payment verified → ${status} by ${req.user?.email}`);
    res.json(ApiResponse.ok('Payment verification submitted', order));
  }),

  trackOrderPublic: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.trackOrderPublic(req.params.orderNumber as string);
    res.json(ApiResponse.ok('Order tracking details', order));
  }),
};
