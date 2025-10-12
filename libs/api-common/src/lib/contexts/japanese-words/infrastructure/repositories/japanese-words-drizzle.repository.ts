import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { JapaneseWordsRepository } from '../../domain/repositories/japanese-words.repository';
import { CreateJapaneseWordDto } from '../../domain/dto/create-japanese-word.dto';
import { japaneseWordsTable } from '../schema/japanese-words.schema';
import { IDatabaseService } from '../../../shared/domain/database.interface';
import {
  JapaneseWordEntity,
  JapaneseWordPrimitives,
} from '../../domain/entities/japanese-word';
import { UpdateJapaneseWordDto } from '../../domain/dto/update-japanese-word.dto';

@Injectable()
export class JapaneseWordsDrizzleRepository implements JapaneseWordsRepository {
  constructor(
    @Inject('IDatabaseService')
    private readonly databaseService: IDatabaseService
  ) {}

  async createJapaneseWord(
    wordData: CreateJapaneseWordDto
  ): Promise<JapaneseWordEntity> {
    const [newWord] = await this.databaseService.db
      .insert(japaneseWordsTable)
      .values(wordData)
      .returning();

    return new JapaneseWordEntity(newWord as JapaneseWordPrimitives);
  }

  async createManyJapaneseWords(
    wordsData: CreateJapaneseWordDto[]
  ): Promise<JapaneseWordEntity[]> {
    try {
      const result = await this.databaseService.db
        .insert(japaneseWordsTable)
        .values(wordsData)
        .onConflictDoNothing()
        .returning();

      return result.map(
        (word) => new JapaneseWordEntity(word as JapaneseWordPrimitives)
      );
    } catch (error) {
      console.error('Error creating many Japanese words:', error);
      return [];
    }
  }

  async getAllJapaneseWords(): Promise<JapaneseWordEntity[]> {
    const result = await this.databaseService.db
      .select()
      .from(japaneseWordsTable);

    return result.map(
      (word) => new JapaneseWordEntity(word as JapaneseWordPrimitives)
    );
  }

  async getJapaneseWordById(id: string): Promise<JapaneseWordEntity | null> {
    const [word] = await this.databaseService.db
      .select()
      .from(japaneseWordsTable)
      .where(eq(japaneseWordsTable.id, id))
      .limit(1);

    return word ? new JapaneseWordEntity(word as JapaneseWordPrimitives) : null;
  }

  async updateJapaneseWord(
    id: string,
    updates: UpdateJapaneseWordDto
  ): Promise<JapaneseWordEntity | null> {
    const [updatedWord] = await this.databaseService.db
      .update(japaneseWordsTable)
      .set(updates)
      .where(eq(japaneseWordsTable.id, id))
      .returning();

    return updatedWord
      ? new JapaneseWordEntity(updatedWord as JapaneseWordPrimitives)
      : null;
  }

  async deleteJapaneseWord(id: string): Promise<void> {
    await this.databaseService.db
      .delete(japaneseWordsTable)
      .where(eq(japaneseWordsTable.id, id));
  }
}
