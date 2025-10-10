import { HttpStatus } from '@nestjs/common';
import { BaseError } from './base.error.js';

export class InvalidArgumentError extends BaseError {
  constructor(message: string) {
    super(HttpStatus.BAD_REQUEST, message);
  }
}
