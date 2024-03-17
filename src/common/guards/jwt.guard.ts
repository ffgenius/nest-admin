/**
 * jwt 验证
 */
import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
