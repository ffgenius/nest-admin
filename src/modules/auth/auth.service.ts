import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { LoginDto } from './dto/authDto';
import { ErrorCode } from '../../common/exceptions/custom.exception';
import { JwtService } from '@nestjs/jwt';
import { ACCESS_TOKEN_EXPIRATION_TIME, USER_ACCESS_TOKEN_KEY } from '@/config';
import { RedisService } from '@/shared/redis.service';
import { ERR_10004 } from "@/common/exceptions/error-code";

@Injectable()
export class AuthService {
  private readonly prisma: PrismaClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {
    this.prisma = new PrismaClient();
  }

  // 登录
  async login(code, loginDto: LoginDto) {
    const res = await this.prisma.user.findFirst({
      where: {
        username: loginDto.username,
      },
    });
    let status = 0;
    if (code.toLocaleLowerCase() !== loginDto.captcha.toLocaleLowerCase())
      return { status, message: ErrorCode.ERR_10004 };
    if (!res) return { status, message: ErrorCode.ERR_10002 };
    if (res.password !== loginDto.password)
      return { status, message: ErrorCode.ERR_10003 };
    const payload = {
      username: loginDto.username,
      password: loginDto.password,
      userId: res.id,
    };
    status = 1;
    return {
      token: await this.generateToken(payload),
      status,
    };
  }

  // token 生成
  async generateToken(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
    });
    await this.redisService.set(
      this.getAccessTokenKey(payload),
      accessToken,
      ACCESS_TOKEN_EXPIRATION_TIME,
    );
    return accessToken;
  }

  getAccessTokenKey(payload: any) {
    return `${USER_ACCESS_TOKEN_KEY}:${payload.userId}${
      payload.captcha ? ':' + payload.captcha : ''
    }`;
  }
}
