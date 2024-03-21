import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '验证码不能为空' })
  captcha: string;
}

export class UserDot {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;
}
