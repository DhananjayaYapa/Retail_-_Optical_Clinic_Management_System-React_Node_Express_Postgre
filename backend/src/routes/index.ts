import express from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import branchRoutes from '../modules/branches/branch.routes.js';
import patientRoutes from '../modules/patients/patient.routes.js';
import roleRoutes from '../modules/roles/role.routes.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is running
 */
router.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'Retail Optical Clinic Management API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
  });
});

router.use('/auth', authRoutes);
router.use('/branches', branchRoutes);
router.use('/patients', patientRoutes);
router.use('/roles', roleRoutes);

export default router;
