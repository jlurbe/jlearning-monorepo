import { HttpStatus } from '@nestjs/common';
import { BaseError } from './base.error.js';

export class DatabaseRecordNotFoundError extends BaseError {
  constructor(message: string) {
    super(HttpStatus.NOT_FOUND, message);
  }
}
