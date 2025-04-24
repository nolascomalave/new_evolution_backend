import { Module, /* MiddlewareConsumer, NestModule, RequestMethod */ } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
// import { VerifyTokenMiddleware } from './middlewares/auth.middleware';
import { SystemSubscriptionUserModule } from '../system_subscription_user/system_subscription_user.module';

@Module({
    controllers: [AuthController],
    providers: [AuthService/* , UserService */, PrismaService, JwtService],
    imports: [SystemSubscriptionUserModule]
    /* [PrismaService] */
})
export class AuthModule/*  implements NestModule */ {
    /* configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(VerifyTokenMiddleware)
        .exclude(
            { path: 'auth/hash-password', method: RequestMethod.POST },
            { path: 'auth/login', method: RequestMethod.POST },
            { path: 'auth/refresh', method: RequestMethod.POST },
            'static/*'
        )
        .forRoutes('*');
    } */
}