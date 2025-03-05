import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from './schema/customer.schema';
import { CustomerService } from './customer.service';

@Module({

  imports: [
    MongooseModule.forFeature([{ name: "Customer", schema: CustomerSchema }])
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService, MongooseModule]
})
export class CustomerModule { }
