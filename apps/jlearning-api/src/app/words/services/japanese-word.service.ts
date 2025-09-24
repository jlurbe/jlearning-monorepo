import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
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

  async createManyJapaneseWords(
    wordsData: CreateJapaneseWordDto[]
  ): Promise<InsertResult> {
    // Using the query builder allows us to specify an `orIgnore` instruction.
    // This tells the database (SQLite in this case) to simply skip inserting
    // a row if it would violate a UNIQUE constraint (like on our 'word' column).
    // This is highly efficient for bulk inserts where duplicates might exist.
    return this.japaneseWordRepository
      .createQueryBuilder()
      .insert()
      .into(JapaneseWord)
      .values(wordsData)
      .orIgnore()
      .execute();
  }

  async getAllJapaneseWords(): Promise<JapaneseWord[]> {
    return this.japaneseWordRepository.find();
  }

  async getJapaneseWordById(id: string): Promise<JapaneseWord | null> {
    return this.japaneseWordRepository.findOne({
      where: { id },
    });
  }

  async getJapaneseWordByWord(word: string): Promise<JapaneseWord | null> {
    return this.japaneseWordRepository.findOne({
      where: { word },
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
