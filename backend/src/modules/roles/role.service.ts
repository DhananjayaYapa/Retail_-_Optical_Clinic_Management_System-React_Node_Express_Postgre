import type { Prisma } from '../../generated/prisma/client.js';
import prisma from '../../config/db.js';
import { ConflictError, NotFoundError, ValidationError } from '../../middleware/errorHandler.js';
import type { CreateRoleInput, ListRolesQueryInput, UpdateRoleInput } from './role.schema.js';

const SYSTEM_ROLES = new Set(['ADMIN', 'CASHIER']);

const includePayload = {
  _count: {
    select: {
      users: true,
    },
  },
};

const normalizeRoleName = (name: string): string => name.trim().toUpperCase();

export const createRole = async (input: CreateRoleInput) => {
  const roleName = normalizeRoleName(input.name);

  try {
    return await prisma.role.create({
      data: { name: roleName },
      include: includePayload,
    });
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === 'P2002') {
      throw new ConflictError(`Role ${roleName} already exists`);
    }
    throw error;
  }
};

export const listRoles = async (query: ListRolesQueryInput) => {
  const where: Prisma.RoleWhereInput = {};

  if (query.search) {
    where.name = {
      contains: query.search.toUpperCase(),
      mode: 'insensitive',
    };
  }

  const skip = (query.page - 1) * query.limit;

  const [data, total] = await Promise.all([
    prisma.role.findMany({
      where,
      include: includePayload,
      orderBy: {
        [query.sortBy]: query.sortOrder,
      },
      skip,
      take: query.limit,
    }),
    prisma.role.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
};

export const getRoleById = async (id: number) => {
  const role = await prisma.role.findUnique({
    where: { id },
    include: includePayload,
  });

  if (!role) {
    throw new NotFoundError('Role not found');
  }

  return role;
};

export const updateRole = async (id: number, input: UpdateRoleInput) => {
  const existing = await prisma.role.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundError('Role not found');
  }

  if (SYSTEM_ROLES.has(existing.name)) {
    throw new ValidationError(`System role ${existing.name} cannot be renamed`);
  }

  const nextName = normalizeRoleName(input.name);

  try {
    return await prisma.role.update({
      where: { id },
      data: { name: nextName },
      include: includePayload,
    });
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === 'P2002') {
      throw new ConflictError(`Role ${nextName} already exists`);
    }
    throw error;
  }
};

export const deleteRole = async (id: number) => {
  const existing = await prisma.role.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          users: true,
        },
      },
    },
  });

  if (!existing) {
    throw new NotFoundError('Role not found');
  }

  if (SYSTEM_ROLES.has(existing.name)) {
    throw new ValidationError(`System role ${existing.name} cannot be deleted`);
  }

  if (existing._count.users > 0) {
    throw new ConflictError('Cannot delete role assigned to users');
  }

  return prisma.role.delete({ where: { id } });
};
