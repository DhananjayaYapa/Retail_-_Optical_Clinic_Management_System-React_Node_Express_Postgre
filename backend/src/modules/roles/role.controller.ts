import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { successResponse } from '../../shared/utils/responseHelper.js';
import { createRole, deleteRole, getRoleById, listRoles, updateRole } from './role.service.js';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const role = await createRole(req.body);
  return successResponse(res, role, 'Role created successfully', 201);
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const result = await listRoles(req.query as never);
  return successResponse(res, result, 'Roles fetched successfully');
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const role = await getRoleById(Number(req.params.id));
  return successResponse(res, role, 'Role fetched successfully');
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const role = await updateRole(Number(req.params.id), req.body);
  return successResponse(res, role, 'Role updated successfully');
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const role = await deleteRole(Number(req.params.id));
  return successResponse(res, role, 'Role deleted successfully');
});
