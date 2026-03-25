import { z } from 'zod';

const branchCodePattern = /^[A-Z0-9_-]{2,30}$/;

export const createBranchSchema = z.object({
  name: z.string().trim().min(2).max(120),
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(branchCodePattern, 'Code must be 2-30 chars (A-Z, 0-9, underscore, hyphen)'),
  address: z.string().trim().min(2).max(2000).optional(),
});

export const updateBranchSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    code: z
      .string()
      .trim()
      .toUpperCase()
      .regex(branchCodePattern, 'Code must be 2-30 chars (A-Z, 0-9, underscore, hyphen)')
      .optional(),
    address: z.string().trim().min(2).max(2000).nullable().optional(),
  })
  .refine(
    (payload) =>
      payload.name !== undefined || payload.code !== undefined || payload.address !== undefined,
    {
      message: 'At least one field is required for update',
    },
  );

export const listBranchesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().trim().max(120).optional(),
  sortBy: z.enum(['name', 'code', 'createdAt', 'updatedAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const branchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;
export type ListBranchesQueryInput = z.infer<typeof listBranchesQuerySchema>;
