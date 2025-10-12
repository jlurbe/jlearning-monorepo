import { Injectable } from '@nestjs/common';
import { GetAllJapaneseWordsQuery } from '../queries/get-all-japanese-words.query';
import { GetJapaneseWordByIdQuery } from '../queries/get-japanese-word-by-id.query';
import { GetAllJapaneseWordsHandler } from '../queries/handlers/get-all-japanese-words.handler';
import { GetJapaneseWordByIdHandler } from '../queries/handlers/get-japanese-word-by-id.handler';
import { JapaneseWordEntity } from '../../domain/entities/japanese-word';

@Injectable()
export class JapaneseWordsQueryService {
  constructor(
    private readonly getAllJapaneseWordsHandler: GetAllJapaneseWordsHandler,
    private readonly getJapaneseWordByIdHandler: GetJapaneseWordByIdHandler
  ) {}

  async getAllJapaneseWords(
    query: GetAllJapaneseWordsQuery
  ): Promise<JapaneseWordEntity[]> {
    return this.getAllJapaneseWordsHandler.execute(query);
  }

  async getJapaneseWordById(
    query: GetJapaneseWordByIdQuery
  ): Promise<JapaneseWordEntity | null> {
    return this.getJapaneseWordByIdHandler.execute(query);
  }
}
