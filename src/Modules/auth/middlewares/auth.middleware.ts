import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { system_subscription_user } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

type ReqUser = system_subscription_user & { password?: string };

export interface RequestSession extends Request {
    user?: ReqUser
};

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
    constructor(private jwtService: JwtService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const token = this.extractTokenFromHeader(req);

        if (!token) throw new UnauthorizedException();

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.jwtSecretKey,
            });
            req['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }

        next();
    }

    private extractTokenFromHeader(request: Request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}