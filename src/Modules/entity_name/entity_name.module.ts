import { Module } from '@nestjs/common';
import { EntityNameController } from './entity_name.controller';
import { EntityNameService } from './entity_name.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    controllers: [EntityNameController],
    providers: [EntityNameService, PrismaService, JwtService],
    exports: [EntityNameService]
})
export class EntityNameModule {}
