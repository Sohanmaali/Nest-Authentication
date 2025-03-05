 import * as jwt from 'jsonwebtoken';

export const generateOtp = () => {
    let otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = new Date();

    otp = process.env.MODE == "local" ? "1234" : otp
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 1);
    return { otp, otpExpiry }
}

export  async function decodeToken(
    request: any,
    headerName: string,
): Promise<any> {
    try {
        // Extract token from the Authorization header or cookies
        const authHeader = request.headers["authorization"];
        let token = '';


        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1]; // Extract the token after "Bearer"
        } else if (request.cookies && request.cookies[headerName]) {
            token = request.cookies[headerName];
        }

        if (!token) {
            throw new Error('No token provided');
        }

        // Verify and decode the token using the correct JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return decoded;
    } catch (error) {
        console.error('Token decoding error:', error.message);
        return null; // or throw an error if you prefer to handle it higher up
    }
}