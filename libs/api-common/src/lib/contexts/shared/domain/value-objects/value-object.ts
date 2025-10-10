import { InvalidArgumentError } from '../errors/invalid-argument.error.js';

export type Primitives = string | number | boolean | Date | null;

export abstract class ValueObject<T extends Primitives> {
  readonly value: T;

  constructor(value: T) {
    this.value = value;
    this.ensureValueIsDefined(value);
  }

  protected ensureValueIsDefined(value: T): void {
    if (value === undefined) {
      throw new InvalidArgumentError(
        `Value on <${
          this.constructor.name
        }> [${this.toString()}] must be defined`
      );
    }
  }

  ensureIsNotNull(value: unknown): void {
    if (value === null) {
      throw new InvalidArgumentError(
        `Value on <${
          this.constructor.name
        }> [${this.toString()}] must be not null`
      );
    }
  }

  equals(other: ValueObject<T>): boolean {
    return (
      other.constructor.name === this.constructor.name &&
      other.value === this.value
    );
  }

  toString(): string {
    if (this.value instanceof Date) return this.value.toISOString();
    if (typeof this.value === 'object') return JSON.stringify(this.value);
    if (this.value === null) return 'null';
    if (this.value === undefined) return 'undefined';
    return this.value.toString();
  }

  toLog(): T {
    return this.value;
  }

  toResponse(): T {
    return this.value;
  }
}
