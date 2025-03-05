import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './schema/customer.schema';

@Injectable()
export class CustomerService {
    constructor(@InjectModel("Customer") private customerModel: Model<Customer>) {}

    async validateCustomer(email: string) {
        return this.customerModel.findOne({ email: email });
    }
}
