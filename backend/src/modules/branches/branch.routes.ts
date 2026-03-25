import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { create, getById, list, remove, update } from './branch.controller.js';
import {
  branchIdParamSchema,
  createBranchSchema,
  listBranchesQuerySchema,
  updateBranchSchema,
} from './branch.schema.js';

const router = Router();

/**
 * @swagger
 * /api/v1/branches:
 *   post:
 *     summary: Create a clinic branch
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Branch created
 */
router.post('/', authenticate, authorize('ADMIN'), validate({ body: createBranchSchema }), create);

/**
 * @swagger
 * /api/v1/branches:
 *   get:
 *     summary: List branches
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Branch list
 */
router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'CASHIER'),
  validate({ query: listBranchesQuerySchema }),
  list,
);

/**
 * @swagger
 * /api/v1/branches/{id}:
 *   get:
 *     summary: Get branch details
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Branch details
 */
router.get(
  '/:id',
  authenticate,
  authorize('ADMIN', 'CASHIER'),
  validate({ params: branchIdParamSchema }),
  getById,
);

/**
 * @swagger
 * /api/v1/branches/{id}:
 *   patch:
 *     summary: Update branch
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Branch updated
 */
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: branchIdParamSchema, body: updateBranchSchema }),
  update,
);

/**
 * @swagger
 * /api/v1/branches/{id}:
 *   delete:
 *     summary: Delete branch if no linked patients
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Branch deleted
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: branchIdParamSchema }),
  remove,
);

export default router;
