import { Request, Response } from 'express';
import { inquiryService } from '../services/inquiry.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middlewares/auth.middleware';
import { logger } from '../utils/logger';
import { mailer } from '../utils/mailer';

export const inquiryController = {
  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = { ...req.body, userId: req.user?.id };
    const inquiry = await inquiryService.create(data);
    logger.info(`New inquiry from ${inquiry.email}: ${inquiry.subject}`);
    // Confirmation to sender + notify admin (both non-blocking)
    mailer.sendInquiryConfirmation(inquiry.email, inquiry.name, inquiry.subject);
    mailer.notifyAdminNewInquiry(inquiry);
    res.status(201).json(ApiResponse.created('Inquiry submitted successfully', inquiry));
  }),

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, status } = req.query;
    const result = await inquiryService.getAll({
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
      status: status as string,
    });
    res.json(ApiResponse.ok('Inquiries retrieved', result));
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const inquiry = await inquiryService.getById(req.params.id as string);
    res.json(ApiResponse.ok('Inquiry retrieved', inquiry));
  }),

  updateStatus: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status, adminNotes } = req.body;
    const inquiry = await inquiryService.updateStatus(req.params.id as string, status, adminNotes);
    logger.info(`Inquiry ${req.params.id} status → ${status} by ${req.user?.email}`);
    res.json(ApiResponse.ok('Inquiry updated', inquiry));
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    await inquiryService.delete(req.params.id as string);
    logger.warn(`Inquiry ${req.params.id} deleted by ${req.user?.email}`);
    res.json(ApiResponse.ok('Inquiry deleted'));
  }),
};
