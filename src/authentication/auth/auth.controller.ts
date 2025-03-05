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
            console.log("-=-=-=-=-=-req.user-=-=-", req.user);
            const token = await this.authService.generateJwt(req.user);
            res.cookie('scrapify_', token, {
                httpOnly: true, // Prevents JavaScript access (Secure)
                secure: process.env.NODE_ENV === 'production', // HTTPS in production
                sameSite: 'strict', // Prevent CSRF attacks
                maxAge: 3600000, // 1 hour expiry
            });
            return res.status(200).json({ message: "Login successful", });
        } catch (error) {

            console.log("--=--==-=-=error-=-==--=", error);

            return res.status(400).json({ message: error.message });
        }
    }

    @Post('customer/logout')
    async logout(@Res() res) {
        res.clearCookie('scrapify_'); // Remove token cookie
        return res.status(200).json({ message: 'Logout successful' });
    }

    @Post('customer/register')
    async register(@Req() req, @Res() res) {
        try {
            const result = await this.authService.register(req);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    @Post('customer/verify-otp')
    async verifyOtp(@Req() req, @Res() res) {
        try {
            const verified = await this.authService.verifyOtp(req.body);
            return res.status(200).json(verified);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
