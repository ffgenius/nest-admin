import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { generateDocument } from '@/config/doc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'bin',
      name: 'bin-session',
      rolling: true,
      cookie: { maxAge: 1000 * 60 * 60 },
      resave: false,
      saveUninitialized: true,
    }),
  );
  generateDocument(app);
  await app.listen(3000);
  console.log('🚀 启动成功: http://localhost:3000');
}
bootstrap();
