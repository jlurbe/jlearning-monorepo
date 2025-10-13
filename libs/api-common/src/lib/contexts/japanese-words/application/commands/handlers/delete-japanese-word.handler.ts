import { Injectable } from '@nestjs/common';
import { DeleteJapaneseWordCommand } from '../delete-japanese-word.command';
import { JapaneseWordsRepository } from '../../../domain/repositories/japanese-words.repository';

@Injectable()
export class DeleteJapaneseWordHandler {
  constructor(
    private readonly japaneseWordsRepository: JapaneseWordsRepository
  ) {}

  async execute(command: DeleteJapaneseWordCommand): Promise<void> {
    await this.japaneseWordsRepository.deleteJapaneseWord(command.id);
  }
}
