import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { JapaneseWord } from '../entities/japanese-word.entity';
import { ExampleSentence } from '../entities/example-sentence.entity';
import {
  StudyStatus,
  DifficultyLevel,
  WordType,
} from '../../enums/vocabulary.enums';

@Injectable()
export class JapaneseWordService {
  constructor(
    @InjectRepository(JapaneseWord)
    private readonly japaneseWordRepository: Repository<JapaneseWord>
  ) {}

  async createJapaneseWord(
    wordData: {
      word: string;
      reading: string;
      translation: string;
      pronunciation: string;
      type: WordType;
      notes?: string;
      status?: StudyStatus;
      difficulty?: DifficultyLevel;
      reviewedAt?: Date;
    },
    exampleSentencesData: Array<{
      sentenceJp: string;
      sentenceReading: string;
      sentenceEn: string;
    }> = []
  ): Promise<JapaneseWord> {
    const newWord = this.japaneseWordRepository.create({
      ...wordData,
      exampleSentences: exampleSentencesData,
    });
    return this.japaneseWordRepository.save(newWord);
  }

  async getAllJapaneseWords(): Promise<JapaneseWord[]> {
    return this.japaneseWordRepository.find({
      relations: ['exampleSentences'],
    });
  }

  async getJapaneseWordById(id: number): Promise<JapaneseWord | null> {
    return this.japaneseWordRepository.findOne({
      where: { id },
      relations: ['exampleSentences'],
    });
  }

  async updateJapaneseWord(
    id: number,
    updates: Partial<JapaneseWord>
  ): Promise<JapaneseWord | null> {
    const word = await this.japaneseWordRepository.findOneBy({ id });
    if (!word) return null;
    Object.assign(word, updates);
    return this.japaneseWordRepository.save(word);
  }

  async deleteJapaneseWord(id: number): Promise<DeleteResult> {
    return this.japaneseWordRepository.delete(id);
  }
}
