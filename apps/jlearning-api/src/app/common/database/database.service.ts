import { Injectable, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { migrate } from 'drizzle-orm/libsql/migrator';
import * as schema from '@jlearning-monorepo/api-common/contexts/japanese-words/infrastructure/schema/japanese-words.schema';
import { IDatabaseService } from '@jlearning-monorepo/api-common/contexts/shared/domain/database.interface';

@Injectable()
export class DatabaseService implements OnModuleInit, IDatabaseService {
  public db: ReturnType<typeof drizzle>;

  constructor() {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL || '',
      authToken: process.env.TURSO_AUTH_TOKEN || '',
    });

    this.db = drizzle(client, { schema });
  }

  async onModuleInit() {
    try {
      // Run migrations if TURSO_DATABASE_URL is set
      if (process.env.TURSO_DATABASE_URL) {
        await migrate(this.db, { migrationsFolder: './drizzle' });
        console.log('✅ Database migrations completed successfully');
      } else {
        console.log('⚠️  TURSO_DATABASE_URL not set, skipping migrations');
      }
    } catch (error) {
      console.error('❌ Database migration failed:', error);
      throw error;
    }
  }
}
