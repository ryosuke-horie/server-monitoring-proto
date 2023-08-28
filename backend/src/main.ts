import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // CORS設定を有効化
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://server-monitoring-prototype.vercel.app',
    ],
  });

  await app.listen(3000);
}
bootstrap();
