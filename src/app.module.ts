import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({

  imports: [

    ConfigModule.forRoot(),

    MongooseModule.forRoot(process.env.DB_URL, { serverSelectionTimeoutMS: 20000 }),
    AuthenticationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
