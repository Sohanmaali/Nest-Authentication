import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from '../customer/schema/customer.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { generate } from 'rxjs';
import { generateOtp } from '../Helper';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class AuthService {

    constructor(@InjectModel("Customer") private customerModel: Model<Customer>,
        private customerService: CustomerService
    ) { }
    async validateCustomer(email: string) {
        const customer = await this.customerService.validateCustomer(email);
        if (!customer) {
            throw new Error("customer not found");
        }
        return customer
    }

    async register(req) {

        const customer = await this.customerModel.findOne({ email: req.body.email });

        if (customer) {
            throw new Error("email already exist");
        }

        const { otp, otpExpiry } = generateOtp()
        req.body.otp = otp;
        req.body.otpExpiry = otpExpiry

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const newCustomer = this.customerModel.create(req.body);
        if (newCustomer) {
            return { message: "OTP sent" }
        }

    }

}
