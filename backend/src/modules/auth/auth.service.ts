import bcrypt from 'bcryptjs';
import prisma from '../../config/db.js';
import { generateToken } from '../../middleware/auth.js';
import { ApiError, NotFoundError, UnauthorizedError } from '../../middleware/errorHandler.js';
import { AUTH_SECURITY } from '../../shared/constants/index.js';
import type { LoginInput } from './auth.schema.js';

const MAX_FAILED_ATTEMPTS = AUTH_SECURITY.MAX_FAILED_ATTEMPTS;
const ATTEMPT_WINDOW_MINUTES = AUTH_SECURITY.ATTEMPT_WINDOW_MINUTES;
const LOCKOUT_MINUTES = AUTH_SECURITY.LOCKOUT_MINUTES;

const minutesAgo = (minutes: number): Date => {
  return new Date(Date.now() - minutes * 60 * 1000);
};

const getLockedUntil = (lastFailedAttemptAt: Date): Date => {
  return new Date(lastFailedAttemptAt.getTime() + LOCKOUT_MINUTES * 60 * 1000);
};

const getRemainingLockoutSeconds = (lockedUntil: Date): number => {
  return Math.max(0, Math.ceil((lockedUntil.getTime() - Date.now()) / 1000));
};

const getRecentFailedAttemptCount = async (email: string): Promise<number> => {
  return prisma.authLoginAttempt.count({
    where: {
      email,
      isSuccess: false,
      attemptedAt: {
        gte: minutesAgo(ATTEMPT_WINDOW_MINUTES),
      },
    },
  });
};

const getLatestFailedAttempt = async (email: string): Promise<Date | null> => {
  const latest = await prisma.authLoginAttempt.findFirst({
    where: {
      email,
      isSuccess: false,
      attemptedAt: {
        gte: minutesAgo(ATTEMPT_WINDOW_MINUTES),
      },
    },
    select: {
      attemptedAt: true,
    },
    orderBy: {
      attemptedAt: 'desc',
    },
  });

  return latest?.attemptedAt ?? null;
};

const enforceLockoutIfNeeded = async (email: string): Promise<void> => {
  const [failedCount, latestFailed] = await Promise.all([
    getRecentFailedAttemptCount(email),
    getLatestFailedAttempt(email),
  ]);

  if (failedCount < MAX_FAILED_ATTEMPTS || !latestFailed) {
    return;
  }

  const lockedUntil = getLockedUntil(latestFailed);
  if (lockedUntil > new Date()) {
    throw new ApiError(
      `Account temporarily locked due to multiple failed login attempts. Try again in ${LOCKOUT_MINUTES} minutes.`,
      423,
      [{ remainingLockoutSeconds: getRemainingLockoutSeconds(lockedUntil) }],
    );
  }
};

const recordLoginAttempt = async (params: {
  email: string;
  userId?: number;
  isSuccess: boolean;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> => {
  await prisma.authLoginAttempt.create({
    data: {
      email: params.email,
      userId: params.userId,
      isSuccess: params.isSuccess,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    },
  });
};

const sanitizeUser = (user: {
  id: number;
  email: string;
  role: { id: number; name: string };
  createdAt: Date;
  updatedAt: Date;
}) => {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const loginUser = async (
  input: LoginInput,
  requestMeta: { ipAddress?: string; userAgent?: string },
) => {
  const normalizedEmail = input.email.trim().toLowerCase();

  await enforceLockoutIfNeeded(normalizedEmail);

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: {
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const passwordMatched = user ? await bcrypt.compare(input.password, user.passwordHash) : false;

  await recordLoginAttempt({
    email: normalizedEmail,
    userId: user?.id,
    isSuccess: passwordMatched,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  if (!passwordMatched || !user) {
    const failedCount = await getRecentFailedAttemptCount(normalizedEmail);
    if (failedCount >= MAX_FAILED_ATTEMPTS) {
      throw new ApiError(
        `Account temporarily locked due to multiple failed login attempts. Try again in ${LOCKOUT_MINUTES} minutes.`,
        423,
        [{ failedAttempts: failedCount, maxFailedAttempts: MAX_FAILED_ATTEMPTS }],
      );
    }

    throw new UnauthorizedError('Invalid email or password');
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role.name,
  });

  return {
    token,
    user: sanitizeUser(user),
  };
};

export const getProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError('Authenticated user not found');
  }

  return sanitizeUser(user);
};
