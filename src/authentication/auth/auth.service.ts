import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from '../customer/schema/customer.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { generateOtp } from '../Helper';
import { CustomerService } from '../customer/customer.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel("Customer") private customerModel: Model<Customer>,
        private customerService: CustomerService,
        private jwtService: JwtService
    ) { }

    async validateCustomer(email: string, password?: string) {
        const customer = await this.customerService.validateCustomer(email);
        if (!customer) {
            throw new Error("Customer not found");
        }

        console.log("-=-=-=-password--=-=-",password);
        

        if (password) {
            const isMatch = await bcrypt.compare(password, customer.password);
            if (!isMatch) {
                throw new Error("Invalid password");
            }
        }

        return customer;
    }

    async register(req) {
        const customer = await this.customerModel.findOne({ email: req.body.email });

        if (customer) {
            throw new Error("Email already exists");
        }

        const { otp, otpExpiry } = generateOtp();
        req.body.otp = otp;
        req.body.otpExpiry = otpExpiry;

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const newCustomer = await this.customerModel.create(req.body);
        if (newCustomer) {
            return { message: "OTP sent", email: req.body.email };
        }
    }

    async verifyOtp({ email, otp }) {
        const customer = await this.customerModel.findOne({ email });

        if (!customer) {
            throw new Error("Customer not found");
        }

        if (customer.otp !== otp || new Date(customer.otpExpiry) < new Date()) {
            throw new Error("Invalid or expired OTP");
        }

        customer.otp = null;
        customer.otpExpiry = null;
        await customer.save();

        return { message: "OTP verified successfully" };
    }

    async generateJwt(customer) {
        const payload = { id: customer._id, email: customer.email };
        return this.jwtService.sign(payload);
    }
}
