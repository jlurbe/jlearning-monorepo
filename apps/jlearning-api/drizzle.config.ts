import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema:
    '../../libs/api-common/src/lib/contexts/japanese-words/infrastructure/schema/japanese-words.schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || '',
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
