import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EntityEmailService } from './entity_email.service';

@Module({
    controllers: [],
    providers: [PrismaService, EntityEmailService],
    exports: [EntityEmailService]
})
export class EntityEmailModule {}
