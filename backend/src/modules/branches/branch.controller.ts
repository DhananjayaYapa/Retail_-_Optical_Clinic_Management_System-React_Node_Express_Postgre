import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { successResponse } from '../../shared/utils/responseHelper.js';
import {
  createBranch,
  deleteBranch,
  getBranchById,
  listBranches,
  updateBranch,
} from './branch.service.js';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const branch = await createBranch(req.body);
  return successResponse(res, branch, 'Branch created successfully', 201);
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const result = await listBranches(req.query as never);
  return successResponse(res, result, 'Branches fetched successfully');
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const branch = await getBranchById(id);
  return successResponse(res, branch, 'Branch fetched successfully');
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const branch = await updateBranch(id, req.body);
  return successResponse(res, branch, 'Branch updated successfully');
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const deleted = await deleteBranch(id);
  return successResponse(res, deleted, 'Branch deleted successfully');
});
