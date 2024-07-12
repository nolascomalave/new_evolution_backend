import { Module } from '@nestjs/common';
import { EntityNameController } from './entity_name.controller';
import { EntityNameService } from './entity_name.service';
import { PrismaService } from 'src/prisma.service';

@Module({
    controllers: [EntityNameController],
    providers: [EntityNameService, PrismaService]
})
export class EntityNameModule {}
