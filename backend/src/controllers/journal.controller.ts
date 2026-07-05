import { Request, Response } from 'express';
import { journalService } from '../services/journal.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middlewares/auth.middleware';
import { logger } from '../utils/logger';

export const journalController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const result = await journalService.getAll({
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 9,
    });
    res.json(ApiResponse.ok('Journal posts retrieved', result));
  }),

  getAllAdmin: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const result = await journalService.getAll({
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
      published: undefined,
    });
    res.json(ApiResponse.ok('Journal posts retrieved', result));
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const post = await journalService.getBySlug(req.params.slug as string);
    res.json(ApiResponse.ok('Post retrieved', post));
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const post = await journalService.create(req.body);
    logger.info(`Journal post created: "${post.title}" by ${req.user?.email}`);
    res.status(201).json(ApiResponse.created('Post created', post));
  }),

  update: asyncHandler(async (req: AuthRequest, res: Response) => {
    const post = await journalService.update(req.params.id as string, req.body);
    logger.info(`Journal post updated: "${post.title}" by ${req.user?.email}`);
    res.json(ApiResponse.ok('Post updated', post));
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    await journalService.delete(req.params.id as string);
    logger.warn(`Journal post deleted: ID ${req.params.id} by ${req.user?.email}`);
    res.json(ApiResponse.ok('Post deleted'));
  }),
};
