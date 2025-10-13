import { CreateJapaneseWordCommand } from './create-japanese-word.command';

export class CreateManyJapaneseWordsCommand {
  constructor(public readonly words: CreateJapaneseWordCommand[]) {}
}
