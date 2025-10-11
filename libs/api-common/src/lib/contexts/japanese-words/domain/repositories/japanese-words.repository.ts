import { JapaneseWord } from '../../../shared/domain/japanese-word.type';
import { CreateJapaneseWordDto } from '../dto/create-japanese-word.dto';
import { JapaneseWordPrimitives } from '../entities/japanese-word';

export interface InsertResult {
  insertId?: string;
  rowsAffected: number;
}

export interface DeleteResult {
  rowsAffected: number;
}

export abstract class JapaneseWordsRepository {
  abstract createJapaneseWord(
    wordData: CreateJapaneseWordDto
  ): Promise<JapaneseWordPrimitives>;
  abstract createManyJapaneseWords(
    wordsData: CreateJapaneseWordDto[]
  ): Promise<InsertResult>;
  abstract getAllJapaneseWords(): Promise<JapaneseWordPrimitives[]>;
  abstract getJapaneseWordById(
    id: string
  ): Promise<JapaneseWordPrimitives | null>;
  abstract getJapaneseWordByWord(
    word: string
  ): Promise<JapaneseWordPrimitives | null>;
  abstract updateJapaneseWord(
    id: string,
    updates: Partial<JapaneseWordPrimitives>
  ): Promise<JapaneseWordPrimitives | null>;
  abstract deleteJapaneseWord(id: string): Promise<DeleteResult>;
}
