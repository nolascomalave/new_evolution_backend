import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { system_subscription_user } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import { hashSync, compareSync } from 'bcryptjs';
import { LoginDto } from "./dto/auth.dto";
import { FullUser, SystemSubscriptionUserService } from '../system_subscription_user/system_subscription_user.service';
import { escape } from "querystring";
import { JSONParser } from "src/util/formats";
import { EXPIRE_TIME } from "./auth.controller";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private systemSubscriptionUserService: SystemSubscriptionUserService
    ) {}

    hashPassword(password) {
        return hashSync(password, 10);
    }

    async getUserToLogin(credentials: LoginDto) {
        const user: FullUser | system_subscription_user | undefined = await this.prisma.findOneUnsafe(`SELECT
            ssu.*
        FROM system_subscription_user ssu
        WHERE COALESCE(ssu.annulled_at, ssu.inactivated_at) IS NULL
            AND ssu.username = '${escape(credentials.username)}'
            AND EXISTS(
                SELECT
                    *
                FROM system_subscription ss
                INNER JOIN "system" sys
                    ON sys.id = ss.system_id
                WHERE ss.id = ssu.system_subscription_id
                    AND COALESCE(sys.annulled_at, ss.annulled_at, sys.inactivated_at, ss.inactivated_at) IS NULL
                    AND ss.id = '${escape(credentials.system_subscription_id)}'
                    AND sys.id = '${escape(credentials.system_id)}'
            )`);

        console.log(`SELECT
        ssu.*
    FROM system_subscription_user ssu
    WHERE COALESCE(ssu.annulled_at, ssu.inactivated_at) IS NULL
        AND ssu.username = '${escape(credentials.username)}'
        AND EXISTS(
            SELECT
                *
            FROM system_subscription ss
            INNER JOIN "system" sys
                ON sys.id = ss.system_id
            WHERE ss.id = ssu.system_subscription_id
                AND COALESCE(sys.annulled_at, ss.annulled_at, sys.inactivated_at, ss.inactivated_at) IS NULL
                AND ss.id = '${escape(credentials.system_subscription_id)}'
                AND sys.id = '${escape(credentials.system_id)}'
        )`);

        if(!user || !compareSync(credentials.password, user.password)) {
            throw new UnauthorizedException();
        }

        const userData = await this.systemSubscriptionUserService.getUserEntityById({id: user.id});

        if(!userData) {
            throw new InternalServerErrorException();
        }

        return {
            user,
            userData
        };
    }

    async loginWithToken(credentials: LoginDto) {
        const { user, userData } = await this.getUserToLogin(credentials);

        if('password' in userData) {
            delete userData.password;
        }

        delete user.password;

        return {
            user: JSONParser(userData),
            backendTokens: {
                accessToken: await this.jwtService.signAsync(user, {
                    expiresIn: '1d',
                    secret: process.env.jwtSecretKey,
                }),
                refreshToken: await this.jwtService.signAsync(user, {
                    expiresIn: '7d',
                    secret: process.env.jwtRefreshTokenKey,
                }),
                expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
            },
        };
    }

    async loginWithCookieSession(credentials: LoginDto, session: Record<string, any>) {
        const { user, userData } = await this.getUserToLogin(credentials);

        if('password' in userData) {
            delete userData.password;
        }

        delete user.password;

        session.user = user;

        return JSONParser(userData);
    }
}