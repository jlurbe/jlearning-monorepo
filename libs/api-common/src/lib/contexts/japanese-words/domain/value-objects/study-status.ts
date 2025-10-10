import { InvalidArgumentError } from '../../../shared/domain/errors/invalid-argument.error.js';
import { ValueObject } from '../../../shared/domain/value-objects/value-object.js';
import { StudyStatus as StudyStatusEnum } from '../../../shared/domain/japanese-word.type.js';

export class StudyStatus extends ValueObject<StudyStatusEnum> {
  constructor(override readonly value: StudyStatusEnum) {
    super(value);
    this.ensureIsValidStudyStatus(value);
  }

  private ensureIsValidStudyStatus(value: StudyStatusEnum): void {
    if (!Object.values(StudyStatusEnum).includes(value)) {
      throw new InvalidArgumentError(
        `Value on <${
          this.constructor.name
        }> [${this.toString()}] must be a valid StudyStatus enum value`
      );
    }
  }
}
