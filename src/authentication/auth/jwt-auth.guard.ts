
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { decodeToken } from '../Helper';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtCustomerGuard implements CanActivate {

    constructor(private reflector: Reflector) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
                context.getHandler(),
                context.getClass(),
            ]);

            if (
                isPublic &&
                !request.cookies['scrapify_'] &&
                !request?.headers?.authorization
            ) {
                return true;
            }

            const resp = await decodeToken(request, 'scrapify_');

            request.auth = resp;
            if (resp) {
                return true;
            } else {
                throw new UnauthorizedException('Please provide token');
            }
        } catch (error) {
            console.log('auth error - ', error.message);
        }
    }

}
