import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { LoginDto } from './dto/authDto';
import {
  CustomError,
  ErrorCode,
} from '../../common/exceptions/custom.exception';

@Injectable()
export class AuthService {
  private readonly prisma: PrismaClient;

  constructor(private readonly configService: ConfigService) {
    this.prisma = new PrismaClient();
  }

  // 登录
  async login(loginDto: LoginDto) {
    const res = await this.prisma.user.findFirst({
      where: {
        username: loginDto.username,
      },
    });
    if (!res) return ErrorCode.ERR_10002;
    if (res.password !== loginDto.password) return ErrorCode.ERR_10003;
    return '登录成功';
  }
}
