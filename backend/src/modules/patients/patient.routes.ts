import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { create, getById, list, restore, softDelete, update } from './patient.controller.js';
import {
  createPatientSchema,
  deletePatientSchema,
  getPatientByIdQuerySchema,
  listPatientsQuerySchema,
  patientIdParamSchema,
  updatePatientSchema,
} from './patient.schema.js';

const router = Router();

/**
 * @swagger
 * /api/v1/patients:
 *   post:
 *     summary: Register a new patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Patient created
 *       409:
 *         description: Potential duplicate detected
 */
router.post('/', authenticate, authorize('ADMIN'), validate({ body: createPatientSchema }), create);

/**
 * @swagger
 * /api/v1/patients:
 *   get:
 *     summary: List patients with search and filters
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patient list
 */
router.get('/', authenticate, validate({ query: listPatientsQuerySchema }), list);

/**
 * @swagger
 * /api/v1/patients/{id}:
 *   get:
 *     summary: Get patient by id
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patient details
 */
router.get(
  '/:id',
  authenticate,
  validate({ params: patientIdParamSchema, query: getPatientByIdQuerySchema }),
  getById,
);

/**
 * @swagger
 * /api/v1/patients/{id}:
 *   patch:
 *     summary: Update active patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patient updated
 */
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN', 'CASHIER', 'OPTOMETRIST'),
  validate({ params: patientIdParamSchema, body: updatePatientSchema }),
  update,
);

/**
 * @swagger
 * /api/v1/patients/{id}:
 *   delete:
 *     summary: Soft delete patient (admin only)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patient soft deleted
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: patientIdParamSchema, body: deletePatientSchema }),
  softDelete,
);

/**
 * @swagger
 * /api/v1/patients/{id}/restore:
 *   post:
 *     summary: Restore soft deleted patient (admin only)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patient restored
 */
router.post(
  '/:id/restore',
  authenticate,
  authorize('ADMIN', 'CASHIER'),
  validate({ params: patientIdParamSchema }),
  restore,
);

export default router;
