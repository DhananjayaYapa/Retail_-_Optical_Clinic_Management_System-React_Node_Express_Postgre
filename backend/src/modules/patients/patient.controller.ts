import type { Request, Response } from 'express';
import { successResponse } from '../../shared/utils/responseHelper.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import {
  createPatient,
  getPatientById,
  listPatients,
  restorePatient,
  softDeletePatient,
  updatePatient,
} from './patient.service.js';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const result = await createPatient(req.body);
  return successResponse(res, result, 'Patient created successfully', 201);
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const result = await listPatients(req.query as never);
  return successResponse(res, result, 'Patients fetched successfully');
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const includeDeleted = Boolean((req.query as { includeDeleted?: boolean }).includeDeleted);
  const patient = await getPatientById(id, includeDeleted);
  return successResponse(res, patient, 'Patient fetched successfully');
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await updatePatient(id, req.body);
  return successResponse(res, result, 'Patient updated successfully');
});

export const softDelete = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const actorUserId = req.user!.userId;
  const result = await softDeletePatient(id, actorUserId, req.body);
  return successResponse(res, result, 'Patient deleted successfully');
});

export const restore = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await restorePatient(id);
  return successResponse(res, result, 'Patient restored successfully');
});
