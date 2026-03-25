import type { Request, Response } from 'express';
import { successResponse } from '../../shared/utils/responseHelper.js';
import { asyncHandler, UnauthorizedError } from '../../middleware/errorHandler.js';
import { getProfile, loginUser } from './auth.service.js';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const loginResult = await loginUser(req.body, {
    ipAddress: req.ip,
    userAgent: req.get('user-agent') || undefined,
  });

  return successResponse(res, loginResult, 'Login successful');
});

export const profile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required');
  }

  const user = await getProfile(req.user.userId);
  return successResponse(res, user, 'Profile fetched successfully');
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  return successResponse(res, null, 'Logout successful');
});
