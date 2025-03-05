import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { CustomerModule } from '../customer/customer.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [CustomerModule, PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "123456789dsdsd",
      signOptions: { expiresIn: "10h" }

    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {
  constructor() {
    console.log("-=--=-JWT_SECRET-=-=-=-", process.env.JWT_SECRET);

  }
}
