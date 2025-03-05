import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }
    @UseGuards(AuthGuard("customer-local"))
    @Post('customer/login')
    async login(@Req() req, @Res() res) {
        try {
            // res.status(200).json(await this.authService.register(req));
        } catch (error) {

            res.status(400).json({ message: error.message });

        }
    }

    @Post('customer/register')
    async register(@Req() req, @Res() res) {
        try {
            res.status(200).json(await this.authService.register(req));
        } catch (error) {

            res.status(400).json({ message: error.message });

        }
    }

}
