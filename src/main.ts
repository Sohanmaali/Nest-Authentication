import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

import * as cookieParser from 'cookie-parser'
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn"]
  });

  app.setGlobalPrefix("api")
  app.use(cookieParser())
  await app.listen(process.env.PORT ?? 3000);
  console.log("APP is runing on 3011");

}
bootstrap();
