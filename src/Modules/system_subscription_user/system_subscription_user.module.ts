import { Module } from '@nestjs/common';
import { SystemSubscriptionUserController } from './system_subscription_user.controller';
import { PrismaService } from 'src/prisma.service';
import { SystemSubscriptionUserService } from './system_subscription_user.service';
import { EntityModule } from '../entity/entity.module';
// import { EntityDocumentModule } from '../entity_document/entity_document.module';
// import { ResendModule } from 'nestjs-resend';
import { MailerModule } from 'src/mailer/mailer.module';
import { JwtService } from '@nestjs/jwt';

@Module({
    controllers: [SystemSubscriptionUserController],
    providers: [PrismaService, SystemSubscriptionUserService, JwtService],
    imports: [
        EntityModule,
        MailerModule,
        /* ResendModule.forRoot({
            apiKey: process.env.RESEND_TOKEN,
        }) */
    ],
    exports: [SystemSubscriptionUserService]
})
export class SystemSubscriptionUserModule {}
