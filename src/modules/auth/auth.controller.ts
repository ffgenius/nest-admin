import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/authDto';
import { JwtGuard } from '@/common/guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const res = await this.authService.login(loginDto);
    return res.status ? { token: res.token } : { primitive: 1, msg: res.msg };
  }

  @UseGuards(JwtGuard)
  @Get('/test')
  testToken() {
    return this.authService.testToken();
  }
}
