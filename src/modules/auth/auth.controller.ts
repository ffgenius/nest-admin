import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/authDto';
import * as svgCaptcha from 'svg-captcha';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Req() req, @Body() loginDto: LoginDto) {
    const res = await this.authService.login(req?.session?.code, loginDto);
    return res.status
      ? { token: res.token }
      : { primitive: 1, message: res.message };
  }

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
}
