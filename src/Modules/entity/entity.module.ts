import { Module } from '@nestjs/common';
import { EntityController } from './entity.controller';
import { PrismaService } from 'src/prisma.service';
import { EntityService } from './entity.service';
import { EntityDocumentModule } from '../entity_document/entity_document.module';
import { EntityNameModule } from '../entity_name/entity_name.module';
import { EntityEmailModule } from '../entity_email/entity_email.module';
import { EntityPhoneModule } from '../entity_phone/entity_phone.module';
import { JwtService } from '@nestjs/jwt';

@Module({
    controllers: [EntityController],
    providers: [PrismaService, EntityService, JwtService],
    imports: [EntityDocumentModule, EntityNameModule, EntityEmailModule, EntityPhoneModule],
    exports: [EntityService]
})
export class EntityModule {}
