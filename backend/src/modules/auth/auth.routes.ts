import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { login, logout, profile } from './auth.controller.js';
import { loginSchema } from './auth.schema.js';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticate user and return access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@clinic.local
 *               password:
 *                 type: string
 *                 example: Admin@12345
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       423:
 *         description: Account temporarily locked
 */
router.post('/login', validate({ body: loginSchema }), login);

/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     summary: Get authenticated user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authenticate, profile);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout current user (JWT is client-side discard for now)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', authenticate, logout);

export default router;
