import { Module } from '@nestjs/common';
import { EntityController } from './entity.controller';
import { PrismaService } from 'src/prisma.service';
import { EntityService } from './entity.service';

@Module({
    controllers: [EntityController],
    providers: [PrismaService, EntityService],
    exports: [EntityService]
})
export class EntityModule {}
