import { Injectable } from '@nestjs/common';
import { GetAllJapaneseWordsQuery } from '../get-all-japanese-words.query';
import { JapaneseWordsRepository } from '../../../domain/repositories/japanese-words.repository';

@Injectable()
export class GetAllJapaneseWordsHandler {
  constructor(
    private readonly japaneseWordsRepository: JapaneseWordsRepository
  ) {}

  async execute(query: GetAllJapaneseWordsQuery) {
    // For now, we'll get all words and filter in memory
    // In a real application, you'd implement filtering in the repository
    const allWords = await this.japaneseWordsRepository.getAllJapaneseWords();

    let filteredWords = allWords;

    // Apply filters
    if (query.status) {
      filteredWords = filteredWords.filter(
        (word) => word.toPrimitives().status === query.status
      );
    }

    if (query.difficulty) {
      filteredWords = filteredWords.filter(
        (word) => word.toPrimitives().difficulty === query.difficulty
      );
    }

    if (query.type) {
      filteredWords = filteredWords.filter(
        (word) => word.toPrimitives().type === query.type
      );
    }

    // Apply pagination
    if (query.page && query.limit) {
      const startIndex = (query.page - 1) * query.limit;
      const endIndex = startIndex + query.limit;
      filteredWords = filteredWords.slice(startIndex, endIndex);
    }

    return filteredWords;
  }
}
