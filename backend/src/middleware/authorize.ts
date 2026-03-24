import type { NextFunction, Request, Response } from 'express';
import { ForbiddenError, UnauthorizedError } from './errorHandler.js';

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new UnauthorizedError('Authentication required'));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new ForbiddenError('You are not allowed to access this resource'));
      return;
    }

    next();
  };
};
