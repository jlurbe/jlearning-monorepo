import { Injectable } from '@nestjs/common';
import { DeleteResult, InsertResult } from 'typeorm';
import { JapaneseWordEntity } from '@jlearning-monorepo/api-common/contexts/japanese-words/infrastructure/entities/japanese-word.entity';
import { CreateJapaneseWordDto } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/dto/create-japanese-word.dto';
import { JapaneseWordsRepository } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/repositories/japanese-words.repository';

@Injectable()
export class JapaneseWordsService {
  constructor(
    private readonly japaneseWordRepository: JapaneseWordsRepository
  ) {}

  async createJapaneseWord(
    wordData: CreateJapaneseWordDto
  ): Promise<JapaneseWordEntity> {
    return this.japaneseWordRepository.createJapaneseWord(wordData);
  }

  async createManyJapaneseWords(
    wordsData: CreateJapaneseWordDto[]
  ): Promise<InsertResult> {
    return this.japaneseWordRepository.createManyJapaneseWords(wordsData);
  }

  async getAllJapaneseWords(): Promise<JapaneseWordEntity[]> {
    return this.japaneseWordRepository.getAllJapaneseWords();
  }

  async getJapaneseWordById(id: string): Promise<JapaneseWordEntity | null> {
    return this.japaneseWordRepository.getJapaneseWordById(id);
  }

  async getJapaneseWordByWord(
    word: string
  ): Promise<JapaneseWordEntity | null> {
    return this.japaneseWordRepository.getJapaneseWordByWord(word);
  }

  async updateJapaneseWord(
    id: string,
    updates: Partial<JapaneseWordEntity>
  ): Promise<JapaneseWordEntity | null> {
    return this.japaneseWordRepository.updateJapaneseWord(id, updates);
  }

  async deleteJapaneseWord(id: string): Promise<DeleteResult> {
    return this.japaneseWordRepository.deleteJapaneseWord(id);
  }
}
