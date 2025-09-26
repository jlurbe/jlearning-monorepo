import { JapaneseWord } from '../../../shared/domain/japanese-word.type';
import { CreateJapaneseWordDto } from '../dto/create-japanese-word.dto';
import { InsertResult, DeleteResult } from 'typeorm';

export abstract class JapaneseWordsRepository {
  abstract createJapaneseWord(
    wordData: CreateJapaneseWordDto
  ): Promise<JapaneseWord>;
  abstract createManyJapaneseWords(
    wordsData: CreateJapaneseWordDto[]
  ): Promise<InsertResult>;
  abstract getAllJapaneseWords(): Promise<JapaneseWord[]>;
  abstract getJapaneseWordById(id: string): Promise<JapaneseWord | null>;
  abstract getJapaneseWordByWord(word: string): Promise<JapaneseWord | null>;
  abstract updateJapaneseWord(
    id: string,
    updates: Partial<JapaneseWord>
  ): Promise<JapaneseWord | null>;
  abstract deleteJapaneseWord(id: string): Promise<DeleteResult>;
}
