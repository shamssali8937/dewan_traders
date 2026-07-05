import { Request, Response } from 'express';
import { paymentAccountService } from '../services/paymentAccount.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middlewares/auth.middleware';

export const paymentAccountController = {
  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const account = await paymentAccountService.create(req.body);
    res.status(201).json(ApiResponse.created('Payment account created successfully', account));
  }),

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const accounts = await paymentAccountService.getAll();
    res.json(ApiResponse.ok('Payment accounts retrieved', accounts));
  }),

  getActive: asyncHandler(async (req: Request, res: Response) => {
    const accounts = await paymentAccountService.getActive();
    res.json(ApiResponse.ok('Active payment accounts retrieved', accounts));
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const account = await paymentAccountService.getById(req.params.id as string);
    res.json(ApiResponse.ok('Payment account retrieved', account));
  }),

  update: asyncHandler(async (req: AuthRequest, res: Response) => {
    const account = await paymentAccountService.update(req.params.id as string, req.body);
    res.json(ApiResponse.ok('Payment account updated successfully', account));
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    await paymentAccountService.delete(req.params.id as string);
    res.json(ApiResponse.ok('Payment account deleted successfully'));
  }),
};
