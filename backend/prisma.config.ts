import 'dotenv/config';
import { defineConfig } from 'prisma/config';

declare const process: {
  env: Record<string, string | undefined>;
};

export default defineConfig({
  schema: '../database/prisma/schema.prisma',
  migrations: {
    path: '../database/prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
