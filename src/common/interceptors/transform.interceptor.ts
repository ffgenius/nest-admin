/**
 * 响应拦截
 */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        if (data?.primitive) {
          delete data.primitive;
          return { ...data, code: 200 };
        } else {
          return { data, message: 'OK', code: 200 };
        }
      }),
    );
  }
}
