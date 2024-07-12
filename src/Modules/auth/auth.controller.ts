import { Body, Controller, Get, HttpCode, HttpStatus, Post, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { system_subscription_user } from '@prisma/client';
import { hashSync, compareSync } from 'bcryptjs';
import { escape } from 'querystring';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshJwtGuard } from './guards/refresh.guard';

const EXPIRE_TIME = 20 * 1000;

@Controller('auth')
export class AuthController {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    /* @Post('hash-password')
    @HttpCode(HttpStatus.OK)
    hashPassword(@Body() data: {password: string}) {
        return {
            password: hashSync(data.password, 10)
        };
    } */

    @Post('login')
    // Posible status code: 200, 400, 401, 500
    @HttpCode(HttpStatus.OK)
    // @UsePipes(new ValidationPipe())
    async login(@Body() credentials: LoginDto) {
        const user: system_subscription_user | undefined = await this.prisma.findOneUnsafe(`SELECT
            *
        FROM system_subscription_user ssu
        WHERE ssu.annulled_at IS NULL
            AND ssu.username = '${escape(credentials.username)}'
            AND EXISTS(
                SELECT
                    *
                FROM system_subscription ss
                INNER JOIN \`system\` sys
                    ON sys.id = ss.id_system
                WHERE ss.id = ssu.id_system_subscription
                    AND COALESCE(sys.annulled_at, ss.annulled_at) IS NULL
                    AND ss.id = ${credentials.id_system_subscription}
                    AND sys.id = ${credentials.id_system}
            )`);

        if(!user || !compareSync(credentials.password, user.password)) {
            throw new UnauthorizedException();
        }

        delete user.password;

        return {
            user,
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

    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    async refreshToken(@Body() body) {
        const payload = { ...body };

        return {
            accessToken: await this.jwtService.signAsync(payload, {
                expiresIn: '1d',
                secret: process.env.jwtSecretKey,
            }),
            refreshToken: await this.jwtService.signAsync(payload, {
                expiresIn: '7d',
                secret: process.env.jwtRefreshTokenKey,
            }),
            expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME)
        };
    }
}