import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Query, Session, UnprocessableEntityException, InternalServerErrorException } from '@nestjs/common';
import { hashSync } from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';
import { LoginDto, LoginOptionsDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshJwtGuard } from './guards/refresh.guard';
import { SystemSubscriptionUserService } from '../system_subscription_user/system_subscription_user.service';
import { AuthService } from './auth.service';

export const EXPIRE_TIME = 1000 * 60 * 60 * 24;

@Controller('auth')
export class AuthController {
    constructor(
        private jwtService: JwtService,
        private service: AuthService
    ) {}

    @Post('hash-password')
    @HttpCode(HttpStatus.OK)
    hashPassword(@Body() data: {password: string}) {
        return {
            password: hashSync(data.password, 10)
        };
    }

    @Post('login')
    // Posible status code: 200, 400, 401, 500
    @HttpCode(HttpStatus.OK)
    // @UsePipes(new ValidationPipe())
    async login(
        @Body() credentials: LoginDto,
        @Session() session: Record<string, any>,
        @Query() options?: LoginOptionsDto
    ) {
        /* await (new Promise((resolve) => setTimeout(resolve, 1000)));
        throw new UnprocessableEntityException(); */
        const cookieSessionOpt = "cookie-session";

        if(!!options && (cookieSessionOpt in options) && options[cookieSessionOpt] === true) {
            return this.service.loginWithCookieSession(credentials, session);
        } else {
            return this.service.loginWithToken(credentials);
        }
    }

    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
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

    @Get('check-session')
    @HttpCode(HttpStatus.OK)
    checkSession(@Session() session: Record<string, any>,) {
      if (!!session.user) {
        return { isAuthenticated: true, user: session.user };
      } else {
        return { isAuthenticated: false };
      }
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Session() session: Record<string, any>) {
        const okResponse = { message: 'Closed session' };

        if(!session.user) {
            return okResponse;
        }

        // Destruye la sesión
        return session.destroy((err) => {
            if (err) {
                throw new InternalServerErrorException('Error al cerrar sesión');
            }
            return okResponse;
        });
    }
}