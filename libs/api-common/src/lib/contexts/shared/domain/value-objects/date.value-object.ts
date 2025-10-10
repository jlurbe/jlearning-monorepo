import { InvalidArgumentError } from '../errors/invalid-argument.error.js';
import { ValueObject } from './value-object.js';

/**
 * This value object is used to store a date in the ISO format from an unix timestamp
 * @param value - The unix timestamp to convert to ISO format.
 * @returns A string in the ISO format.
 */
export class DateValueObject extends ValueObject<string> {
  constructor(value: Date | number = new Date()) {
    super(
      typeof value === 'number'
        ? new Date(value * 1000).toISOString()
        : value.toISOString()
    );
    this.ensureIsValidDate(this.value);
  }

  protected ensureIsValidDate(dateString: string): void {
    if (isNaN(Date.parse(dateString))) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> does not allow the value <${dateString}> as a valid ISO date.`
      );
    }
  }
}
