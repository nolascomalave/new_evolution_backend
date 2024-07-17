import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { VerifyTokenMiddleware } from './middlewares/auth.middleware';

@Module({
    controllers: [AuthController],
    providers: [AuthService/* , UserService */, PrismaService, JwtService],
    /* [PrismaService] */
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(VerifyTokenMiddleware)
        .exclude(
            { path: 'auth/login', method: RequestMethod.POST },
            { path: 'auth/refresh', method: RequestMethod.POST },
            'static/*'
        )
        .forRoutes('*');
    }
}