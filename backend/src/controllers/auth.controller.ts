import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middlewares/auth.middleware';
import { config } from '../config/config';
import { logger } from '../utils/logger';
import { mailer } from '../utils/mailer';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: !config.isDev,
  sameSite: 'strict' as const,
};

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    logger.info(`New user registered: ${result.user.email} (${result.user.role})`);
    // Send welcome email (non-blocking)
    mailer.sendWelcome(result.user.email, result.user.name);
    res
      .cookie('accessToken', result.accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 })
      .cookie('refreshToken', result.refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .status(201)
      .json(ApiResponse.created('Registration successful', result.user));
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    logger.info(`User login: ${result.user.email}`);
    res
      .cookie('accessToken', result.accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 })
      .cookie('refreshToken', result.refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .json(ApiResponse.ok('Login successful', { user: result.user, accessToken: result.accessToken }));
  }),

  refreshToken: asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    const result = await authService.refreshToken(token);
    res
      .cookie('accessToken', result.accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 })
      .cookie('refreshToken', result.refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .json(ApiResponse.ok('Token refreshed', { accessToken: result.accessToken }));
  }),

  logout: asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user) {
      await authService.logout(req.user.id);
      logger.info(`User logout: ${req.user.email}`);
    }
    res
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .json(ApiResponse.ok('Logged out successfully'));
  }),

  me: asyncHandler(async (req: AuthRequest, res: Response) => {
    res.json(ApiResponse.ok('User profile', req.user));
  }),

  getAllUsers: asyncHandler(async (_req: Request, res: Response) => {
    const result = await authService.getAllUsers();
    res.json(ApiResponse.ok('Users list retrieved', result));
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    const result = await authService.forgotPassword(email);
    if (result) {
      mailer.sendPasswordReset(result.email, result.name, result.resetToken);
    }
    // Always return success to prevent email enumeration
    logger.info(`Password reset requested for: ${email}`);
    res.json(ApiResponse.ok('If that email exists, a reset link has been sent.'));
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }
    await authService.resetPassword(token, password);
    logger.info('Password reset successful');
    res.json(ApiResponse.ok('Password reset successfully. Please log in.'));
  }),

  updateProfile: asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await authService.updateProfile(req.user!.id, req.body);
    logger.info(`User profile updated for ID: ${user.id} by ${user.email}`);
    res.json(ApiResponse.ok('Profile updated successfully', user));
  }),
};
