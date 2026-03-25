import { z } from 'zod';

const roleNamePattern = /^[A-Z][A-Z0-9_]{1,49}$/;

export const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .toUpperCase()
    .regex(roleNamePattern, 'Role name must be 2-50 chars and use A-Z, 0-9, underscore'),
});

export const updateRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .toUpperCase()
    .regex(roleNamePattern, 'Role name must be 2-50 chars and use A-Z, 0-9, underscore'),
});

export const listRolesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().trim().max(50).optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const roleIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type ListRolesQueryInput = z.infer<typeof listRolesQuerySchema>;
