import { Request, Response } from 'express';
import { cmsService } from '../services/cms.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export const cmsController = {
  getPage: asyncHandler(async (req: Request, res: Response) => {
    const content = await cmsService.getPage(req.params.page as string);
    res.json(ApiResponse.ok('Page content retrieved', content));
  }),

  upsertPage: asyncHandler(async (req: Request, res: Response) => {
    const content = await cmsService.upsertPage(req.params.page as string, req.body);
    res.json(ApiResponse.ok('Page content updated', content));
  }),

  getContactInfo: asyncHandler(async (_req: Request, res: Response) => {
    const info = await cmsService.getContactInfo();
    res.json(ApiResponse.ok('Contact info retrieved', info));
  }),

  upsertContactInfo: asyncHandler(async (req: Request, res: Response) => {
    const info = await cmsService.upsertContactInfo(req.body);
    res.json(ApiResponse.ok('Contact info updated', info));
  }),

  getTestimonials: asyncHandler(async (_req: Request, res: Response) => {
    const testimonials = await cmsService.getTestimonials();
    res.json(ApiResponse.ok('Testimonials retrieved', testimonials));
  }),

  createTestimonial: asyncHandler(async (req: Request, res: Response) => {
    const testimonial = await cmsService.createTestimonial(req.body);
    res.status(201).json(ApiResponse.created('Testimonial created', testimonial));
  }),

  updateTestimonial: asyncHandler(async (req: Request, res: Response) => {
    const testimonial = await cmsService.updateTestimonial(req.params.id as string, req.body);
    res.json(ApiResponse.ok('Testimonial updated', testimonial));
  }),

  deleteTestimonial: asyncHandler(async (req: Request, res: Response) => {
    await cmsService.deleteTestimonial(req.params.id as string);
    res.json(ApiResponse.ok('Testimonial deleted'));
  }),

  getDashboardStats: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await cmsService.getDashboardStats();
    res.json(ApiResponse.ok('Dashboard stats', stats));
  }),
};
