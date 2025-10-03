import { LibSQLDatabase } from 'drizzle-orm/libsql';

export interface IDatabaseService {
  db: LibSQLDatabase<Record<string, unknown>>;
}
