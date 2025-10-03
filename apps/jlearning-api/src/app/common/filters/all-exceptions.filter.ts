import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { DrizzleError } from 'drizzle-orm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object =
      'An unexpected internal server error occurred.';
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (exception instanceof DrizzleError) {
      status = HttpStatus.BAD_REQUEST; // Treat DB constraint errors as bad requests
      message = 'A database constraint was violated.';
      this.logger.error(`QueryFailedError: ${exception.message}`);
      stack = exception.stack;
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unhandled Error: ${exception.message}`);
      stack = exception.stack;
    } else {
      this.logger.error('Unhandled non-error exception:', exception);
    }

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      method: httpAdapter.getRequestMethod(request),
      message:
        typeof message === 'string'
          ? message
          : (message as any).message || 'Internal server error',
      ...(typeof message === 'object' && { details: message }),
      ...(process.env.NODE_ENV !== 'production' && { stack }),
    };

    this.logger.error(
      `HTTP Error ${status} on ${responseBody.method} ${responseBody.path}`,
      JSON.stringify(responseBody)
    );

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
