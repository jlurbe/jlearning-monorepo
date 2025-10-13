import { InvalidArgumentError } from '../errors/invalid-argument.error.js';
import { ValueObject } from './value-object.js';

export class StringValueObject extends ValueObject<string> {
  constructor(override readonly value: string) {
    super(value);
    this.ensureIsValidString(value);
  }

  private ensureIsValidString(value: string): void {
    if (typeof value !== 'string') {
      throw new InvalidArgumentError(
        `Value on <${
          this.constructor.name
        }> [${this.toString()}] must be a string`
      );
    }
  }
}
