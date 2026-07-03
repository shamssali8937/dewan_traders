import { Request, Response } from 'express';
import { productService, categoryService } from '../services/product.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middlewares/auth.middleware';
import { logger } from '../utils/logger';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../config/config';
import { uploadToCloudinary } from '../utils/cloudinary';

// ─── Multer Storage Config ───────────────────────────────────────────
const uploadDir = path.join(process.cwd(), config.upload.dir, 'products');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `product-${Date.now()}${ext}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only image files (jpg, png, webp) are allowed'));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.upload.maxSize },
});

// ─── Controllers ─────────────────────────────────────────────────────
export const productController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, category, search, featured } = req.query;
    const result = await productService.getAll({
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 12,
      category: category as string,
      search: search as string,
      featured: featured === 'true' ? true : undefined,
    });
    res.json(ApiResponse.ok('Products retrieved', result));
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.getBySlug(req.params.slug as string);
    res.json(ApiResponse.ok('Product retrieved', product));
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.getById(req.params.id as string);
    res.json(ApiResponse.ok('Product retrieved', product));
  }),

  getFeatured: asyncHandler(async (_req: Request, res: Response) => {
    const products = await productService.getFeatured();
    res.json(ApiResponse.ok('Featured products', products));
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const product = await productService.create(req.body);
    logger.info(`Product created: "${product.name}" (${product.sku}) by ${req.user?.email}`);
    res.status(201).json(ApiResponse.created('Product created', product));
  }),

  update: asyncHandler(async (req: AuthRequest, res: Response) => {
    const product = await productService.update(req.params.id as string, req.body);
    logger.info(`Product updated: "${product.name}" by ${req.user?.email}`);
    res.json(ApiResponse.ok('Product updated', product));
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    await productService.delete(req.params.id as string);
    logger.warn(`Product deleted: ID ${req.params.id} by ${req.user?.email}`);
    res.json(ApiResponse.ok('Product deleted'));
  }),

  // ─── Image Upload ──────────────────────────────────────────────────
  uploadImage: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }
    const localUrlFallback = `/uploads/products/${req.file.filename}`;
    const imageUrl = await uploadToCloudinary(req.file.path, 'products', localUrlFallback);
    logger.info(`Product image resolved: ${imageUrl}`);
    res.json(ApiResponse.ok('Image uploaded successfully', { imageUrl }));
  }),
};

export const categoryController = {
  getAll: asyncHandler(async (_req: Request, res: Response) => {
    const categories = await categoryService.getAll();
    res.json(ApiResponse.ok('Categories retrieved', categories));
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const category = await categoryService.create(req.body);
    logger.info(`Category created: "${category.name}" by ${req.user?.email}`);
    res.status(201).json(ApiResponse.created('Category created', category));
  }),

  update: asyncHandler(async (req: AuthRequest, res: Response) => {
    const category = await categoryService.update(req.params.id as string, req.body);
    logger.info(`Category updated: "${category.name}" by ${req.user?.email}`);
    res.json(ApiResponse.ok('Category updated', category));
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    await categoryService.delete(req.params.id as string);
    logger.warn(`Category deleted: ID ${req.params.id} by ${req.user?.email}`);
    res.json(ApiResponse.ok('Category deleted'));
  }),
};
