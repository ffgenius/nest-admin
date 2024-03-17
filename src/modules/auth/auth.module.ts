import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { RedisService } from '@/shared/redis.service';

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy, RedisService],
})
export class AuthModule {}
