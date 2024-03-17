/**
 * jwt 验证策略
 */
import { PassportStrategy } from '@nestjs/passport';
import {
  CustomException,
  ErrorCode,
} from '@/common/exceptions/custom.exception';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisService } from '@/shared/redis.service';
import { AuthService } from './auth.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ACCESS_TOKEN_EXPIRATION_TIME } from '@/config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly redisService: RedisService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || configService.get('JWT_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    // mock user date
    const user = {
      username: 'zs',
      enable: true,
    };
    if (!user.enable) throw new CustomException(ErrorCode.ERR_11007);
    // const currentRole = user.roles.find(
    //   (item) => item.code === payload.currentRoleCode,
    // );
    // if (!currentRole.enable) {
    //   throw new CustomException(ErrorCode.ERR_11008);
    // }

    // 从请求头提取 JWT
    const reqToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    // 从Redis中获取用户访问令牌
    const accessToken = await this.redisService.get(
      this.authService.getAccessTokenKey(payload),
    );

    // 如果请求令牌不等于访问令牌
    if (reqToken !== accessToken) {
      await this.redisService.del(this.authService.getAccessTokenKey(payload));
      throw new HttpException(ErrorCode.ERR_11002, HttpStatus.UNAUTHORIZED);
    }

    // 延长token过期时间
    await this.redisService.set(
      this.authService.getAccessTokenKey(payload),
      accessToken,
      ACCESS_TOKEN_EXPIRATION_TIME,
    );

    return {
      userId: payload.userId,
      username: payload.username,
      roleCodes: payload.roleCodes || [],
      currentRoleCode: payload.currentRoleCode,
      captcha: payload.captcha,
    };
  }
}
