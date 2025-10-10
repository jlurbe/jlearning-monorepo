import { InvalidArgumentError } from '../errors/invalid-argument.error.js';
import { validate } from 'uuid';
import { ValueObject } from './value-object.js';

export class UuidValueObject extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureIsValidUuid(value);
  }

  private ensureIsValidUuid(value: string): void {
    if (!validate(value)) {
      throw new InvalidArgumentError(
        `Value on <${
          this.constructor.name
        }> [${this.toString()}] must be a valid UUID`
      );
    }
  }
}
