import type { Prisma } from '../../generated/prisma/client.js';
import prisma from '../../config/db.js';
import { ConflictError, NotFoundError } from '../../middleware/errorHandler.js';
import type {
  CreateBranchInput,
  ListBranchesQueryInput,
  UpdateBranchInput,
} from './branch.schema.js';

const includePayload = {
  _count: {
    select: {
      patients: true,
    },
  },
};

const buildUniqueConstraintMessage = (code: string) => `Branch with code ${code} already exists`;

export const createBranch = async (input: CreateBranchInput) => {
  const normalizedCode = input.code.trim().toUpperCase();

  try {
    return await prisma.branch.create({
      data: {
        name: input.name.trim(),
        code: normalizedCode,
        address: input.address?.trim() || null,
      },
      include: includePayload,
    });
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === 'P2002') {
      throw new ConflictError(buildUniqueConstraintMessage(normalizedCode));
    }
    throw error;
  }
};

export const listBranches = async (query: ListBranchesQueryInput) => {
  const where: Prisma.BranchWhereInput = {};

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { code: { contains: query.search.toUpperCase(), mode: 'insensitive' } },
      { address: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const skip = (query.page - 1) * query.limit;

  const [data, total] = await Promise.all([
    prisma.branch.findMany({
      where,
      include: includePayload,
      orderBy: {
        [query.sortBy]: query.sortOrder,
      },
      skip,
      take: query.limit,
    }),
    prisma.branch.count({ where }),
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

export const getBranchById = async (id: number) => {
  const branch = await prisma.branch.findUnique({
    where: { id },
    include: includePayload,
  });

  if (!branch) {
    throw new NotFoundError('Branch not found');
  }

  const [activePatients, deletedPatients] = await Promise.all([
    prisma.patient.count({ where: { branchId: id, deletedAt: null } }),
    prisma.patient.count({ where: { branchId: id, deletedAt: { not: null } } }),
  ]);

  return {
    ...branch,
    patientStats: {
      active: activePatients,
      deleted: deletedPatients,
      total: branch._count.patients,
    },
  };
};

export const updateBranch = async (id: number, input: UpdateBranchInput) => {
  const existing = await prisma.branch.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    throw new NotFoundError('Branch not found');
  }

  const normalizedCode = input.code?.trim().toUpperCase();

  try {
    return await prisma.branch.update({
      where: { id },
      data: {
        name: input.name?.trim(),
        code: normalizedCode,
        address:
          input.address === undefined
            ? undefined
            : input.address === null
              ? null
              : input.address.trim(),
      },
      include: includePayload,
    });
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === 'P2002') {
      throw new ConflictError(buildUniqueConstraintMessage(normalizedCode ?? ''));
    }
    throw error;
  }
};

export const deleteBranch = async (id: number) => {
  const existing = await prisma.branch.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    throw new NotFoundError('Branch not found');
  }

  const linkedPatients = await prisma.patient.count({ where: { branchId: id } });
  if (linkedPatients > 0) {
    throw new ConflictError('Cannot delete branch with linked patients');
  }

  return prisma.branch.delete({
    where: { id },
  });
};
