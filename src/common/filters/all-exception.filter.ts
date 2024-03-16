/**
 * 异常过滤器
 */
import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // 获取当前上下文
    const ctx = host.switchToHttp();
    //获取响应对象
    const response = ctx.getResponse<Response>();
    // 获取请求对象
    const request = ctx.getRequest<Request>();
    // 异常对象响应数据
    const exceptionResponse = exception.getResponse?.();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      code: exception.code ?? status,
      error: exception.name,
      message: exceptionResponse?.message ?? exception.message,
      timestamp: new Date().toISOString(),
      originUrl: request.originalUrl,
    });
  }
}
