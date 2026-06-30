import { Request, Response } from 'express';
import { journalService } from '../services/journal.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

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

  create: asyncHandler(async (req: Request, res: Response) => {
    const post = await journalService.create(req.body);
    res.status(201).json(ApiResponse.created('Post created', post));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const post = await journalService.update(req.params.id as string, req.body);
    res.json(ApiResponse.ok('Post updated', post));
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await journalService.delete(req.params.id as string);
    res.json(ApiResponse.ok('Post deleted'));
  }),
};
