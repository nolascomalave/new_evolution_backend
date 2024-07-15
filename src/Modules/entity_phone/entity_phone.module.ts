import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EntityPhoneService } from './entity_phone.service';

@Module({
    controllers: [],
    providers: [PrismaService, EntityPhoneService],
    exports: [EntityPhoneService]
})
export class EntityPhoneModule {}
