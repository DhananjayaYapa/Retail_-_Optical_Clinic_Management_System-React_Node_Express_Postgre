import type { NextFunction, Request, Response } from 'express';
import logger from '../config/logger.js';
import { errorResponse } from '../shared/utils/responseHelper.js';

export class ApiError extends Error {
  public statusCode: number;
  public errors: unknown[] | null;

  constructor(message: string, statusCode = 500, errors: unknown[] | null = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation failed', errors: unknown[] | null = null) {
    super(message, 400, errors);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

export const notFoundHandler = (req: Request, res: Response) => {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error({ err }, err.message);

  if (err instanceof ApiError) {
    return errorResponse(res, err.message, err.statusCode, err.errors);
  }

  const errWithCode = err as Error & { code?: string };
  if (errWithCode.code === 'P2002') {
    return errorResponse(res, 'Duplicate entry', 409);
  }
  if (errWithCode.code === 'P2025') {
    return errorResponse(res, 'Record not found', 404);
  }
  if (errWithCode.code === 'P2003') {
    return errorResponse(res, 'Foreign key constraint failed', 400);
  }

  return errorResponse(res, 'Internal Server Error', 500);
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
