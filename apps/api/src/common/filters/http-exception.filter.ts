import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import type { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx      = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status   = exception.getStatus()
    const body     = exception.getResponse()

    const message: string[] = Array.isArray((body as { message?: unknown }).message)
      ? (body as { message: string[] }).message
      : [typeof body === 'string' ? body : (body as { message?: string }).message ?? 'An error occurred']

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception.message, exception.stack)
    }

    response.status(status).json({
      success: false,
      error: { statusCode: status, message },
    })
  }
}
