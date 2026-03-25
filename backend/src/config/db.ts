import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

type PrismaClientInstance = PrismaClient;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientInstance };

function createPrismaClient(): PrismaClientInstance {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const dbSsl = process.env.DB_SSL?.toLowerCase();
  const shouldUseSslFromEnv = dbSsl === 'true' ? true : dbSsl === 'false' ? false : undefined;

  let shouldUseSslFromUrl = false;
  try {
    const sslMode = new URL(connectionString).searchParams.get('sslmode')?.toLowerCase();
    shouldUseSslFromUrl =
      sslMode === 'require' || sslMode === 'verify-ca' || sslMode === 'verify-full';
  } catch {
    //handled by pg/Prisma at connection time.
  }

  const shouldUseSsl = shouldUseSslFromEnv ?? shouldUseSslFromUrl;

  const adapter = new PrismaPg({
    connectionString,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
