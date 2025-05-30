import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EntityTypeService } from './entity_type.service';
// import { EntityModule } from '../entity/entity.module';
import { JwtService } from '@nestjs/jwt';
import { EntityTypeController } from './entity_type.controller';

@Module({
    controllers: [EntityTypeController],
    providers: [PrismaService, EntityTypeService, JwtService],
    //imports: [EntityModule],
    exports: [EntityTypeService]
})
export class EntityTypeModule {}
