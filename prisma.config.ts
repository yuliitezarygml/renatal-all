import { defineConfig } from '@prisma/config';
import { env } from 'process';

export default defineConfig({
  earlyAccess: true,
  migrate: {
    connectionString: env.DATABASE_URL
  }
});
