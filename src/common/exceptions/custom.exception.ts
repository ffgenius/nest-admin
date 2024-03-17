/**
 * 自定义异常
 */

import * as ErrorCode from './error-code';
import { HttpException, HttpStatus } from '@nestjs/common';

type ErrorType = (typeof ErrorCode)[keyof typeof ErrorCode];

const getErrorCode = (errorType: ErrorType) => {
  const key = Object.keys(ErrorCode).find(
    (key) => ErrorCode[key] === errorType,
  );
  return key ? +errorType.split('_')[1] : -1;
};

export class CustomException extends HttpException {
  protected code: number;

  constructor(errorCode: ErrorType, message?: string, status?: HttpStatus) {
    message = message ?? errorCode;
    super(message, status ?? HttpStatus.BAD_REQUEST);
    this.code = getErrorCode(errorCode);
  }
}

export { ErrorCode };
