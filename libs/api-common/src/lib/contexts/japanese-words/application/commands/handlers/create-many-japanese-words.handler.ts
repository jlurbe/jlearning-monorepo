import { Injectable } from '@nestjs/common';
import { CreateManyJapaneseWordsCommand } from '../create-many-japanese-words.command';
import { JapaneseWordsRepository } from '../../../domain/repositories/japanese-words.repository';
import { CreateJapaneseWordDto } from '../../../domain/dto/create-japanese-word.dto';

@Injectable()
export class CreateManyJapaneseWordsHandler {
  constructor(
    private readonly japaneseWordsRepository: JapaneseWordsRepository
  ) {}

  async execute(command: CreateManyJapaneseWordsCommand) {
    const dtos: CreateJapaneseWordDto[] = command.words.map((word) => ({
      word: word.word,
      reading: word.reading,
      translation: word.translation,
      pronunciation: word.pronunciation,
      exampleSentence: word.exampleSentence,
      type: word.type as any,
      notes: word.notes,
      status: word.status as any,
      difficulty: word.difficulty as any,
      reviewedAt: word.reviewedAt,
    }));

    return this.japaneseWordsRepository.createManyJapaneseWords(dtos);
  }
}
