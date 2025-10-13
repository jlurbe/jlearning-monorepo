import { HttpStatus } from '@nestjs/common';

export class BaseError extends Error {
  public override readonly name: string;
  public readonly httpCode: HttpStatus;

  constructor(httpCode: HttpStatus, description?: string) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.httpCode = httpCode;

    Error.captureStackTrace(this);
  }
}
