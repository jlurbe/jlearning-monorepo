import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import {
  StudyStatus,
  DifficultyLevel,
  WordType,
} from '../../../shared/domain/japanese-word.type';

export const japaneseWordsTable = sqliteTable('japanese_words', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  word: text('word').notNull().unique(),
  reading: text('reading'),
  translation: text('translation'),
  pronunciation: text('pronunciation'),
  exampleSentence: text('example_sentence'),
  type: text('type'),
  notes: text('notes'),
  status: text('status').default(StudyStatus.NEW),
  difficulty: text('difficulty').default(DifficultyLevel.BEGINNER),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
  reviewedAt: integer('reviewed_at', { mode: 'timestamp' }),
});

export type JapaneseWord = typeof japaneseWordsTable.$inferSelect & {
  type: WordType | null;
  status: StudyStatus | null;
  difficulty: DifficultyLevel | null;
};
export type NewJapaneseWord = typeof japaneseWordsTable.$inferInsert & {
  type: WordType | null;
  status: StudyStatus | null;
  difficulty: DifficultyLevel | null;
};
