import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { JapaneseWord } from '../entities/japanese-word.entity';
import { CreateJapaneseWordDto } from '../dto/create-japanese-word.dto';

@Injectable()
export class JapaneseWordService {
  constructor(
    @InjectRepository(JapaneseWord)
    private readonly japaneseWordRepository: Repository<JapaneseWord>
  ) {}

  async createJapaneseWord(
    wordData: CreateJapaneseWordDto
  ): Promise<JapaneseWord> {
    const newWord = this.japaneseWordRepository.create(wordData);
    return this.japaneseWordRepository.save(newWord);
  }

  async getAllJapaneseWords(): Promise<JapaneseWord[]> {
    return this.japaneseWordRepository.find();
  }

  async getJapaneseWordById(id: string): Promise<JapaneseWord | null> {
    return this.japaneseWordRepository.findOne({
      where: { id },
    });
  }

  async updateJapaneseWord(
    id: string,
    updates: Partial<JapaneseWord> // This `id` parameter will be updated in the controller
  ): Promise<JapaneseWord | null> {
    const word = await this.japaneseWordRepository.findOneBy({ id });
    if (!word) return null;
    Object.assign(word, updates);
    return this.japaneseWordRepository.save(word);
  }

  async deleteJapaneseWord(id: string): Promise<DeleteResult> {
    return this.japaneseWordRepository.delete(id);
  }
}
