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
    constructor(private reflector: Reflector) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      try {
        const request = context.switchToHttp().getRequest();
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
          context.getHandler(),
          context.getClass(),
        ]);
  
        if (isPublic) {
          return true; // Allow access to public routes
        }
  
        // Check for token in headers or cookies
        if (!request.cookies['scrapify_'] && !request?.headers?.authorization) {
          throw new UnauthorizedException('Authorization token is missing');
        }
  
        const resp = await decodeToken(request, 'scrapify_');
  
        if (!resp) {
          throw new UnauthorizedException('Invalid or expired token');
        }
  
        request.auth = resp;
        return true;
      } catch (error) {
        console.log('Auth error:', error.message);
        throw new UnauthorizedException(error.message || 'Unauthorized');
      }
    }
  }
  