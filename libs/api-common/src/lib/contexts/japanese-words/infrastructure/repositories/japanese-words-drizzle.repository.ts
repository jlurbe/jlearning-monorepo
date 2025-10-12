import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import {
  JapaneseWordsRepository,
  DeleteResult,
} from '../../domain/repositories/japanese-words.repository';
import { CreateJapaneseWordDto } from '../../domain/dto/create-japanese-word.dto';
import {
  japaneseWordsTable,
  JapaneseWord,
  NewJapaneseWord,
} from '../schema/japanese-words.schema';
import { IDatabaseService } from '../../../shared/domain/database.interface';
import { JapaneseWordPrimitives } from '../../domain/entities/japanese-word';

@Injectable()
export class JapaneseWordsDrizzleRepository implements JapaneseWordsRepository {
  constructor(
    @Inject('IDatabaseService')
    private readonly databaseService: IDatabaseService
  ) {}

  async createJapaneseWord(
    wordData: CreateJapaneseWordDto
  ): Promise<JapaneseWordPrimitives> {
    const [newWord] = await this.databaseService.db
      .insert(japaneseWordsTable)
      .values(wordData as NewJapaneseWord)
      .returning();

    return newWord as JapaneseWord;
  }

  async createManyJapaneseWords(
    wordsData: CreateJapaneseWordDto[]
  ): Promise<JapaneseWordPrimitives[]> {
    try {
      const result = await this.databaseService.db
        .insert(japaneseWordsTable)
        .values(wordsData as NewJapaneseWord[])
        .onConflictDoNothing()
        .returning();

      return result as JapaneseWordPrimitives[];
    } catch (error) {
      console.error('Error creating many Japanese words:', error);
      return [];
    }
  }

  async getAllJapaneseWords(): Promise<JapaneseWordPrimitives[]> {
    return this.databaseService.db
      .select()
      .from(japaneseWordsTable) as unknown as JapaneseWordPrimitives[];
  }

  async getJapaneseWordById(
    id: string
  ): Promise<JapaneseWordPrimitives | null> {
    const [word] = await this.databaseService.db
      .select()
      .from(japaneseWordsTable)
      .where(eq(japaneseWordsTable.id, id))
      .limit(1);

    return (word as JapaneseWordPrimitives) || null;
  }

  async getJapaneseWordByWord(
    word: string
  ): Promise<JapaneseWordPrimitives | null> {
    const [result] = await this.databaseService.db
      .select()
      .from(japaneseWordsTable)
      .where(eq(japaneseWordsTable.word, word))
      .limit(1);

    return (result as JapaneseWordPrimitives) || null;
  }

  async updateJapaneseWord(
    id: string,
    updates: Partial<JapaneseWordPrimitives>
  ): Promise<JapaneseWordPrimitives | null> {
    const [updatedWord] = await this.databaseService.db
      .update(japaneseWordsTable)
      .set(updates)
      .where(eq(japaneseWordsTable.id, id))
      .returning();

    return (updatedWord as JapaneseWordPrimitives) || null;
  }

  async deleteJapaneseWord(id: string): Promise<DeleteResult> {
    const result = await this.databaseService.db
      .delete(japaneseWordsTable)
      .where(eq(japaneseWordsTable.id, id))
      .returning();

    return { rowsAffected: result.length };
  }
}
