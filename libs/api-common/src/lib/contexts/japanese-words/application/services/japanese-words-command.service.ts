import { Injectable } from '@nestjs/common';
import { CreateJapaneseWordCommand } from '../commands/create-japanese-word.command';
import { CreateManyJapaneseWordsCommand } from '../commands/create-many-japanese-words.command';
import { UpdateJapaneseWordCommand } from '../commands/update-japanese-word.command';
import { DeleteJapaneseWordCommand } from '../commands/delete-japanese-word.command';
import { CreateJapaneseWordHandler } from '../commands/handlers/create-japanese-word.handler';
import { CreateManyJapaneseWordsHandler } from '../commands/handlers/create-many-japanese-words.handler';
import { UpdateJapaneseWordHandler } from '../commands/handlers/update-japanese-word.handler';
import { DeleteJapaneseWordHandler } from '../commands/handlers/delete-japanese-word.handler';
import { JapaneseWordEntity } from '../../domain/entities/japanese-word';

@Injectable()
export class JapaneseWordsCommandService {
  constructor(
    private readonly createJapaneseWordHandler: CreateJapaneseWordHandler,
    private readonly createManyJapaneseWordsHandler: CreateManyJapaneseWordsHandler,
    private readonly updateJapaneseWordHandler: UpdateJapaneseWordHandler,
    private readonly deleteJapaneseWordHandler: DeleteJapaneseWordHandler
  ) {}

  async createJapaneseWord(
    command: CreateJapaneseWordCommand
  ): Promise<JapaneseWordEntity> {
    return this.createJapaneseWordHandler.execute(command);
  }

  async createManyJapaneseWords(
    command: CreateManyJapaneseWordsCommand
  ): Promise<JapaneseWordEntity[]> {
    return this.createManyJapaneseWordsHandler.execute(command);
  }

  async updateJapaneseWord(
    command: UpdateJapaneseWordCommand
  ): Promise<JapaneseWordEntity | null> {
    return this.updateJapaneseWordHandler.execute(command);
  }

  async deleteJapaneseWord(command: DeleteJapaneseWordCommand): Promise<void> {
    return this.deleteJapaneseWordHandler.execute(command);
  }
}
