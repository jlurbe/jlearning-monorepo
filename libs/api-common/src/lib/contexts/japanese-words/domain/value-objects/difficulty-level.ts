import { InvalidArgumentError } from '../../../shared/domain/errors/invalid-argument.error.js';
import { ValueObject } from '../../../shared/domain/value-objects/value-object.js';
import { DifficultyLevel as DifficultyLevelEnum } from '../../../shared/domain/japanese-word.type.js';

export class DifficultyLevel extends ValueObject<DifficultyLevelEnum> {
  constructor(override readonly value: DifficultyLevelEnum) {
    super(value);
    this.ensureIsValidDifficultyLevel(value);
  }

  private ensureIsValidDifficultyLevel(value: DifficultyLevelEnum): void {
    if (!Object.values(DifficultyLevelEnum).includes(value)) {
      throw new InvalidArgumentError(
        `Value on <${
          this.constructor.name
        }> [${this.toString()}] must be a valid DifficultyLevel enum value`
      );
    }
  }
}
