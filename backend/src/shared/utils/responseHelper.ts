import type { Response } from 'express';

export const successResponse = (
  res: Response,
  data: unknown = null,
  message = 'Success',
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const errorResponse = (
  res: Response,
  message = 'An error occurred',
  statusCode = 500,
  errors: unknown[] | null = null,
) => {
  const payload: Record<string, unknown> = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };

  if (errors) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
};
