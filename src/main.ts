import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn"]
  });

  app.setGlobalPrefix("api")
  await app.listen(process.env.PORT ?? 3000);
  console.log("APP is runing on 3011");

}
bootstrap();
