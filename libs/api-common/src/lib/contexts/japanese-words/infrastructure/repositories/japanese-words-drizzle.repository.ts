import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import {
  JapaneseWordsRepository,
  InsertResult,
  DeleteResult,
} from '../../domain/repositories/japanese-words.repository';
import { CreateJapaneseWordDto } from '../../domain/dto/create-japanese-word.dto';
import {
  japaneseWordsTable,
  JapaneseWord,
  NewJapaneseWord,
} from '../schema/japanese-words.schema';
import { IDatabaseService } from '../../../shared/domain/database.interface';

@Injectable()
export class JapaneseWordsDrizzleRepository implements JapaneseWordsRepository {
  constructor(private readonly databaseService: IDatabaseService) {}

  async createJapaneseWord(
    wordData: CreateJapaneseWordDto
  ): Promise<JapaneseWord> {
    const [newWord] = await this.databaseService.db
      .insert(japaneseWordsTable)
      .values(wordData as NewJapaneseWord)
      .returning();

    return newWord as JapaneseWord;
  }

  async createManyJapaneseWords(
    wordsData: CreateJapaneseWordDto[]
  ): Promise<InsertResult> {
    try {
      const result = await this.databaseService.db
        .insert(japaneseWordsTable)
        .values(wordsData as NewJapaneseWord[])
        .onConflictDoNothing()
        .returning();

      return {
        rowsAffected: result.length,
        insertId: result[0]?.id,
      };
    } catch (error) {
      console.error('Error creating many Japanese words:', error);
      return { rowsAffected: 0 };
    }
  }

  async getAllJapaneseWords(): Promise<JapaneseWord[]> {
    return this.databaseService.db
      .select()
      .from(japaneseWordsTable) as unknown as JapaneseWord[];
  }

  async getJapaneseWordById(id: string): Promise<JapaneseWord | null> {
    const [word] = await this.databaseService.db
      .select()
      .from(japaneseWordsTable)
      .where(eq(japaneseWordsTable.id, id))
      .limit(1);

    return (word as JapaneseWord) || null;
  }

  async getJapaneseWordByWord(word: string): Promise<JapaneseWord | null> {
    const [result] = await this.databaseService.db
      .select()
      .from(japaneseWordsTable)
      .where(eq(japaneseWordsTable.word, word))
      .limit(1);

    return (result as JapaneseWord) || null;
  }

  async updateJapaneseWord(
    id: string,
    updates: Partial<JapaneseWord>
  ): Promise<JapaneseWord | null> {
    const [updatedWord] = await this.databaseService.db
      .update(japaneseWordsTable)
      .set(updates)
      .where(eq(japaneseWordsTable.id, id))
      .returning();

    return (updatedWord as JapaneseWord) || null;
  }

  async deleteJapaneseWord(id: string): Promise<DeleteResult> {
    const result = await this.databaseService.db
      .delete(japaneseWordsTable)
      .where(eq(japaneseWordsTable.id, id))
      .returning();

    return { rowsAffected: result.length };
  }
}
