import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './schema/customer.schema';
import { generateOtp } from '../Helper';

@Injectable()
export class CustomerService {

    constructor(@InjectModel("Customer") private customerModel: Model<Customer>) {

    }


    async validateCustomer(email: string) {
        const customer: any = await this.customerModel.findOne({ email: email });
        const { otp, otpExpiry } = generateOtp()
        customer.otp = otp;
        customer.otpExpiry = otpExpiry
        if (customer) {
            customer.save();
        }
        return customer;
    }

}
