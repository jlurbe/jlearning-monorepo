import { Injectable } from '@nestjs/common';
import { UpdateJapaneseWordCommand } from '../update-japanese-word.command';
import { JapaneseWordsRepository } from '../../../domain/repositories/japanese-words.repository';
import { UpdateJapaneseWordDto } from '../../../domain/dto/update-japanese-word.dto';

@Injectable()
export class UpdateJapaneseWordHandler {
  constructor(
    private readonly japaneseWordsRepository: JapaneseWordsRepository
  ) {}

  async execute(command: UpdateJapaneseWordCommand) {
    const dto: UpdateJapaneseWordDto = {
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

    return this.japaneseWordsRepository.updateJapaneseWord(command.id, dto);
  }
}
