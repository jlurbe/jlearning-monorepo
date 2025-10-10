import { InvalidArgumentError } from '../../../shared/domain/errors/invalid-argument.error.js';
import { ValueObject } from '../../../shared/domain/value-objects/value-object.js';
import { WordType as WordTypeEnum } from '../../../shared/domain/japanese-word.type.js';

export class WordType extends ValueObject<WordTypeEnum> {
  constructor(override readonly value: WordTypeEnum) {
    super(value);
    this.ensureIsValidWordType(value);
  }

  private ensureIsValidWordType(value: WordTypeEnum): void {
    if (!Object.values(WordTypeEnum).includes(value)) {
      throw new InvalidArgumentError(
        `Value on <${
          this.constructor.name
        }> [${this.toString()}] must be a valid WordType enum value`
      );
    }
  }
}
