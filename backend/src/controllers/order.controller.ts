import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middlewares/auth.middleware';
import { logger } from '../utils/logger';
import { mailer } from '../utils/mailer';

export const orderController = {
  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await orderService.create(req.user!.id, req.body);
    logger.info(`Order created: ${order.orderNumber} by user ${req.user!.email}`);
    // Send confirmation email (non-blocking)
    mailer.sendOrderConfirmation(
      req.user!.email,
      req.user!.email,
      order.orderNumber,
      String(order.total),
      (order as any).items || []
    );
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
    const { status, trackingNumber } = req.body;
    const order = await orderService.updateStatus(req.params.id as string, status, trackingNumber);
    logger.info(`Order ${order.orderNumber} status → ${status} by ${req.user?.email}`);
    res.json(ApiResponse.ok('Order status updated', order));
  }),
};
