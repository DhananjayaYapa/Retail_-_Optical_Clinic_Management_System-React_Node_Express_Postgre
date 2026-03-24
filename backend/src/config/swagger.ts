import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Retail Optical Clinic Management API',
      version: '1.0.0',
      description:
        'RESTful API for authentication, patient registration, and branch management in an optical clinic.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT access token',
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication and authorization' },
      { name: 'Patients', description: 'Patient registration and lifecycle' },
      { name: 'Branches', description: 'Clinic branch management' },
      { name: 'Roles', description: 'Role definitions and permissions' },
      { name: 'System', description: 'System health and meta endpoints' },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts', './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
