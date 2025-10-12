import { Injectable } from '@nestjs/common';
import { CreateJapaneseWordCommand } from '../create-japanese-word.command';
import { JapaneseWordsRepository } from '../../../domain/repositories/japanese-words.repository';
import { CreateJapaneseWordDto } from '../../../domain/dto/create-japanese-word.dto';

@Injectable()
export class CreateJapaneseWordHandler {
  constructor(
    private readonly japaneseWordsRepository: JapaneseWordsRepository
  ) {}

  async execute(command: CreateJapaneseWordCommand) {
    const dto: CreateJapaneseWordDto = {
      word: command.word,
      reading: command.reading,
      translation: command.translation,
      pronunciation: command.pronunciation,
      exampleSentence: command.exampleSentence,
      type: command.type as any,
      notes: command.notes,
      status: command.status as any,
      difficulty: command.difficulty as any,
      reviewedAt: command.reviewedAt,
    };

    return this.japaneseWordsRepository.createJapaneseWord(dto);
  }
}
