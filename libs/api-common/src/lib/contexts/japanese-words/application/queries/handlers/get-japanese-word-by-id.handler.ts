import { Injectable } from '@nestjs/common';
import { GetJapaneseWordByIdQuery } from '../get-japanese-word-by-id.query';
import { JapaneseWordsRepository } from '../../../domain/repositories/japanese-words.repository';

@Injectable()
export class GetJapaneseWordByIdHandler {
  constructor(
    private readonly japaneseWordsRepository: JapaneseWordsRepository
  ) {}

  async execute(query: GetJapaneseWordByIdQuery) {
    return this.japaneseWordsRepository.getJapaneseWordById(query.id);
  }
}
