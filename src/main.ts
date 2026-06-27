// main.ts

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { NestExpressApplication } from '@nestjs/platform-express';

import { join } from 'path';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.use(
    bodyParser.json({
      limit: '500mb',
    }),
  );

  app.use(
    bodyParser.urlencoded({
      limit: '500mb',
      extended: true,
    }),
  );

  app.enableCors({
    origin: ['http://localhost:4000' , 'http://localhost:3000'],
    credentials: true,
  });

  await app.listen(3500);
}

bootstrap();
