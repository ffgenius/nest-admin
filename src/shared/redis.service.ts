import Redis from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
  ) {}

  async get(key: string) {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  async del(key: string) {
    await this.redisClient.del(key);
    return true;
  }
}
