import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, UserDot } from './dto/authDto';
import * as svgCaptcha from 'svg-captcha';
import { JwtGuard } from '@/common/guards';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({
    summary: '登录',
    operationId: 'login',
  })
  async login(@Req() req, @Body() loginDto: LoginDto) {
    const res = await this.authService.login(req?.session?.code, loginDto);
    return res.status
      ? { token: res.token }
      : { primitive: 1, message: res.message };
  }

  @ApiOperation({
    summary: '获取图片验证码',
    operationId: 'getCaptcha',
  })
  @Get('/captcha')
  async createCaptcha(@Req() req, @Res() res) {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 40,
      width: 80,
      height: 40,
      background: '#fff',
      color: true,
    });
    req.session.code = captcha.text || '';
    res.type('image/svg+xml');
    res.send({
      img: captcha.data,
      code: 200,
    });
  }

  @ApiOperation({
    summary: '获取用户信息',
    operationId: 'getUserInfo',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: UserDot,
  })
  @Get('/currentUser')
  @UseGuards(JwtGuard)
  getUserInfo(@Req() req: Request) {
    return this.authService.getUserInfo(req);
  }
}
