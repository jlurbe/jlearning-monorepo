import { Injectable } from '@nestjs/common';
import { CreateJapaneseWordDto } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/dto/create-japanese-word.dto';
import { JapaneseWordEntity } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/entities/japanese-word';
import { JapaneseWordsRepository } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/repositories/japanese-words.repository';
import { UpdateJapaneseWordDto } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/dto/update-japanese-word.dto';

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
  ): Promise<JapaneseWordEntity[]> {
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
    updates: UpdateJapaneseWordDto
  ): Promise<JapaneseWordEntity | null> {
    return this.japaneseWordRepository.updateJapaneseWord(id, updates);
  }

  async deleteJapaneseWord(id: string): Promise<void> {
    await this.japaneseWordRepository.deleteJapaneseWord(id);
  }
}
