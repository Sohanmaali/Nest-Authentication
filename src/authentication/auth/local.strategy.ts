import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { CustomerService } from "../customer/customer.service";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "customer-local") {
    constructor(private readonly authService: AuthService) {
        super(
            {
                usernameField: "email",
                passwordField: process.env.LOGIN_WITH == "OTP" ? "email" : "password",
            }
        )

    }
    async validate(email: string, password?: string) {
        console.log("callign");

        const customer = await this.authService.validateCustomer(email);

        return customer
    }
}