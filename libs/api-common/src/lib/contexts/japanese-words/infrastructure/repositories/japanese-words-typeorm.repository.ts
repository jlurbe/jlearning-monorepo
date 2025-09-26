import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, InsertResult, Repository } from 'typeorm';
import { JapaneseWordEntity } from '../entities/japanese-word.entity';
import { CreateJapaneseWordDto } from '../../domain/dto/create-japanese-word.dto';
import { JapaneseWordsRepository } from '../../domain/repositories/japanese-words.repository';

@Injectable()
export class JapaneseWordsTypeormRepository
  extends Repository<JapaneseWordEntity>
  implements JapaneseWordsRepository
{
  constructor(private dataSource: DataSource) {
    super(JapaneseWordEntity, dataSource.createEntityManager());
  }

  async createJapaneseWord(
    wordData: CreateJapaneseWordDto
  ): Promise<JapaneseWordEntity> {
    const newWord = this.create(wordData);
    return this.save(newWord);
  }

  async createManyJapaneseWords(
    wordsData: CreateJapaneseWordDto[]
  ): Promise<InsertResult> {
    // Using the query builder allows us to specify an `orIgnore` instruction.
    // This tells the database (SQLite in this case) to simply skip inserting
    // a row if it would violate a UNIQUE constraint (like on our 'word' column).
    // This is highly efficient for bulk inserts where duplicates might exist.
    return this.createQueryBuilder()
      .insert()
      .into(JapaneseWordEntity)
      .values(wordsData)
      .orIgnore()
      .execute();
  }

  async getAllJapaneseWords(): Promise<JapaneseWordEntity[]> {
    return this.find();
  }

  async getJapaneseWordById(id: string): Promise<JapaneseWordEntity | null> {
    return this.findOneBy({ id });
  }

  async getJapaneseWordByWord(
    word: string
  ): Promise<JapaneseWordEntity | null> {
    return this.findOne({
      where: { word },
    });
  }

  async updateJapaneseWord(
    id: string,
    updates: Partial<JapaneseWordEntity>
  ): Promise<JapaneseWordEntity | null> {
    const word = await this.findOneBy({ id });
    if (!word) return null;
    Object.assign(word, updates);
    return this.save(word);
  }

  async deleteJapaneseWord(id: string): Promise<DeleteResult> {
    return this.delete(id);
  }
}
