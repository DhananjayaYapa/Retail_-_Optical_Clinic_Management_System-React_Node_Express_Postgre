import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { create, getById, list, remove, update } from './role.controller.js';
import {
  createRoleSchema,
  listRolesQuerySchema,
  roleIdParamSchema,
  updateRoleSchema,
} from './role.schema.js';

const router = Router();

/**
 * @swagger
 * /api/v1/roles:
 *   post:
 *     summary: Create role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Role created
 */
router.post('/', authenticate, authorize('ADMIN'), validate({ body: createRoleSchema }), create);

/**
 * @swagger
 * /api/v1/roles:
 *   get:
 *     summary: List roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Roles list
 */
router.get('/', authenticate, authorize('ADMIN'), validate({ query: listRolesQuerySchema }), list);

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   get:
 *     summary: Get role by id
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role details
 */
router.get(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: roleIdParamSchema }),
  getById,
);

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   patch:
 *     summary: Update role (non-system roles)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role updated
 */
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: roleIdParamSchema, body: updateRoleSchema }),
  update,
);

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   delete:
 *     summary: Delete role (admin only)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role deleted
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: roleIdParamSchema }),
  remove,
);

export default router;
