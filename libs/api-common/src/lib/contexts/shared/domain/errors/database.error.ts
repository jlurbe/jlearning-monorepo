import { HttpStatus } from '@nestjs/common';
import { BaseError } from './base.error.js';

export class DatabaseError extends BaseError {
  constructor(message: string) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message);
  }
}
