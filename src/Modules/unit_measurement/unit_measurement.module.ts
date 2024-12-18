import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
// import { SystemSubscriptionUserService } from './system_subscription_user.service';
// import { EntityDocumentModule } from '../entity_document/entity_document.module';
// import { ResendModule } from 'nestjs-resend';

@Module({
    // controllers: [SystemSubscriptionUserController],
    providers: [PrismaService/* , SystemSubscriptionUserService */],
    // exports: [SystemSubscriptionUserService]
})
export class UnitMeasurementModule {}
