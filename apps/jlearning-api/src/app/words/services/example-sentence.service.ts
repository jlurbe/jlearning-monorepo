import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExampleSentence } from '../entities/example-sentence.entity';
import { JapaneseWord } from '../entities/japanese-word.entity';

@Injectable()
export class ExampleSentenceService {
  constructor(
    @InjectRepository(ExampleSentence)
    private readonly exampleSentenceRepository: Repository<ExampleSentence>,
    @InjectRepository(JapaneseWord)
    private readonly japaneseWordRepository: Repository<JapaneseWord>
  ) {}

  async createExampleSentence(
    wordId: number,
    sentenceData: {
      sentenceJp: string;
      sentenceReading: string;
      sentenceEn: string;
    }
  ): Promise<ExampleSentence | null> {
    const japaneseWord = await this.japaneseWordRepository.findOneBy({
      id: wordId,
    });
    if (!japaneseWord) {
      return null; // Or throw an error
    }
    const newSentence = this.exampleSentenceRepository.create({
      ...sentenceData,
      japaneseWord,
    });
    return this.exampleSentenceRepository.save(newSentence);
  }

  async getExampleSentenceById(id: number): Promise<ExampleSentence | null> {
    return this.exampleSentenceRepository.findOne({
      where: { id },
      relations: ['japaneseWord'],
    });
  }

  async getExampleSentencesForWord(wordId: number): Promise<ExampleSentence[]> {
    return this.exampleSentenceRepository.find({
      where: { japaneseWord: { id: wordId } },
    });
  }

  async updateExampleSentence(
    id: number,
    updates: Partial<ExampleSentence>
  ): Promise<ExampleSentence | null> {
    const sentence = await this.exampleSentenceRepository.findOneBy({ id });
    if (!sentence) return null;
    Object.assign(sentence, updates);
    return this.exampleSentenceRepository.save(sentence);
  }

  async deleteExampleSentence(id: number): Promise<void> {
    await this.exampleSentenceRepository.delete(id);
  }
}
