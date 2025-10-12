import { CreateJapaneseWordDto } from '../dto/create-japanese-word.dto';
import { UpdateJapaneseWordDto } from '../dto/update-japanese-word.dto';
import { JapaneseWordEntity } from '../entities/japanese-word';

export abstract class JapaneseWordsRepository {
  abstract createJapaneseWord(
    wordData: CreateJapaneseWordDto
  ): Promise<JapaneseWordEntity>;
  abstract createManyJapaneseWords(
    wordsData: CreateJapaneseWordDto[]
  ): Promise<JapaneseWordEntity[]>;
  abstract getAllJapaneseWords(): Promise<JapaneseWordEntity[]>;
  abstract getJapaneseWordById(id: string): Promise<JapaneseWordEntity | null>;
  abstract getJapaneseWordByWord(
    word: string
  ): Promise<JapaneseWordEntity | null>;
  abstract updateJapaneseWord(
    id: string,
    updates: UpdateJapaneseWordDto
  ): Promise<JapaneseWordEntity | null>;
  abstract deleteJapaneseWord(id: string): Promise<void>;
}
