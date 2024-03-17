/**
 * 公共模块
 *
 */
import { Global, Module } from '@nestjs/common';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionFilter } from '@/common/filters/all-exception.filter';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [],
  providers: [
    RedisService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      inject: [ConfigService],
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_POST'),
          db: configService.get('REDIS_DB'),
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class SharedModule {}
