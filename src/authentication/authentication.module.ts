import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CustomerService } from './customer/customer.service';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [AuthModule, CustomerModule],
  providers: [CustomerService]
})
export class AuthenticationModule {}
