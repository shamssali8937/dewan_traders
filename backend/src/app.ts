import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';

import { config } from './config/config';
import { prisma } from './config/database';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

// Routes
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import inquiryRoutes from './routes/inquiry.routes';
import orderRoutes from './routes/order.routes';
import journalRoutes from './routes/journal.routes';
import cmsRoutes from './routes/cms.routes';
import paymentAccountRoutes from './routes/paymentAccount.routes';
import notificationRoutes from './routes/notification.routes';

const app = express();

// Trust reverse proxy (Render, Heroku, Nginx, Cloudflare) for rate limiting client IPs
app.set('trust proxy', 1);

// ─── Security ───────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ─── CORS ───────────────────────────────
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Global Rate Limiting ─────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

// ─── Strict Auth Rate Limit (login / forgot-password) ─────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // max 10 attempts per 15 min
  message: { success: false, message: 'Too many login attempts. Please wait 15 minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // only count failed attempts
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// ─── Registration Rate Limit ─────────────────────────────────────────
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // max 5 registrations per IP per 15 min
  message: { success: false, message: 'Too many registration attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/register', registerLimiter);

// ─── Inquiry Spam Rate Limit ──────────────────────────────────────────
const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // max 10 inquiries per IP per 15 min
  message: { success: false, message: 'Too many inquiries submitted. Please wait before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/inquiries', inquiryLimiter);

// ─── Body Parsers ────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Input Sanitization Middleware ──────────────
// Strip any HTML tags and dangerous characters from string fields
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return obj
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')        // strip all HTML tags
      .replace(/javascript:/gi, '')   // remove javascript: protocol
      .replace(/on\w+\s*=/gi, '')     // remove event handlers (onclick= etc.)
      .trim();
  }
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, sanitizeObject(v)]));
  }
  return obj;
}

app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
});

// Custom Console HTTP request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`[HTTP] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ─── HTTP Logger ─────────────────────────
if (config.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: { write: (msg: string) => logger.info(msg.trim()) },
  }));
}

// ─── Static Files (uploads) ──────────────
app.use('/uploads', express.static(path.join(process.cwd(), config.upload.dir)));

// ─── Enhanced Health Check ────────────────────────
app.get('/api/health', async (_req, res) => {
  let dbStatus = 'ok';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = 'unavailable';
  }
  res.status(dbStatus === 'ok' ? 200 : 503).json({
    success: true,
    service: 'Dewan Traders API',
    status: dbStatus === 'ok' ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ──────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/payment-accounts', paymentAccountRoutes);
app.use('/api/notifications', notificationRoutes);

// ─── 404 + Error Handler ─────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
