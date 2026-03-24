import express from 'express';

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

export default router;
