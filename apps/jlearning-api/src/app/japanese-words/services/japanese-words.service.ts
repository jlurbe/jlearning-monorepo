import { Injectable } from '@nestjs/common';
import { JapaneseWord } from '@jlearning-monorepo/api-common/contexts/shared/domain/japanese-word.type';
import { CreateJapaneseWordDto } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/dto/create-japanese-word.dto';
import {
  JapaneseWordsRepository,
  InsertResult,
  DeleteResult,
} from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/repositories/japanese-words.repository';

@Injectable()
export class JapaneseWordsService {
  constructor(
    private readonly japaneseWordRepository: JapaneseWordsRepository
  ) {}

  async createJapaneseWord(
    wordData: CreateJapaneseWordDto
  ): Promise<JapaneseWord> {
    return this.japaneseWordRepository.createJapaneseWord(wordData);
  }

  async createManyJapaneseWords(
    wordsData: CreateJapaneseWordDto[]
  ): Promise<InsertResult> {
    return this.japaneseWordRepository.createManyJapaneseWords(wordsData);
  }

  async getAllJapaneseWords(): Promise<JapaneseWord[]> {
    return this.japaneseWordRepository.getAllJapaneseWords();
  }

  async getJapaneseWordById(id: string): Promise<JapaneseWord | null> {
    return this.japaneseWordRepository.getJapaneseWordById(id);
  }

  async getJapaneseWordByWord(word: string): Promise<JapaneseWord | null> {
    return this.japaneseWordRepository.getJapaneseWordByWord(word);
  }

  async updateJapaneseWord(
    id: string,
    updates: Partial<JapaneseWord>
  ): Promise<JapaneseWord | null> {
    return this.japaneseWordRepository.updateJapaneseWord(id, updates);
  }

  async deleteJapaneseWord(id: string): Promise<DeleteResult> {
    return this.japaneseWordRepository.deleteJapaneseWord(id);
  }
}
