import { Injectable } from '@nestjs/common';
import { JapaneseWord } from '@jlearning-monorepo/api-common/contexts/shared/domain/japanese-word.type';
import { CreateJapaneseWordDto } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/dto/create-japanese-word.dto';
import { JapaneseWordPrimitives } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/entities/japanese-word';
import {
  JapaneseWordsRepository,
  DeleteResult,
} from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/repositories/japanese-words.repository';

@Injectable()
export class JapaneseWordsService {
  constructor(
    private readonly japaneseWordRepository: JapaneseWordsRepository
  ) {}

  async createJapaneseWord(
    wordData: CreateJapaneseWordDto
  ): Promise<JapaneseWordPrimitives> {
    return this.japaneseWordRepository.createJapaneseWord(wordData);
  }

  async createManyJapaneseWords(
    wordsData: CreateJapaneseWordDto[]
  ): Promise<JapaneseWordPrimitives[]> {
    return this.japaneseWordRepository.createManyJapaneseWords(wordsData);
  }

  async getAllJapaneseWords(): Promise<JapaneseWordPrimitives[]> {
    return this.japaneseWordRepository.getAllJapaneseWords();
  }

  async getJapaneseWordById(
    id: string
  ): Promise<JapaneseWordPrimitives | null> {
    return this.japaneseWordRepository.getJapaneseWordById(id);
  }

  async getJapaneseWordByWord(
    word: string
  ): Promise<JapaneseWordPrimitives | null> {
    return this.japaneseWordRepository.getJapaneseWordByWord(word);
  }

  async updateJapaneseWord(
    id: string,
    updates: Partial<JapaneseWordPrimitives>
  ): Promise<JapaneseWord | null> {
    return this.japaneseWordRepository.updateJapaneseWord(id, updates);
  }

  async deleteJapaneseWord(id: string): Promise<DeleteResult> {
    return this.japaneseWordRepository.deleteJapaneseWord(id);
  }
}
