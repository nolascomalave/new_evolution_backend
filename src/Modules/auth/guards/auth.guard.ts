import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
import { system_subscription_user } from '@prisma/client';
  import { Request } from 'express';
import { type SessionData } from 'express-session';
import { FullUser } from 'src/Modules/system_subscription_user/system_subscription_user.service';

@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        if(((request.session as (Partial<SessionData> & { user?: FullUser | system_subscription_user })).user ?? null) == null) {
            throw new UnauthorizedException();
        }

        return true;
    }
}