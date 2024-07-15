import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EntityDocumentService } from './entity_document.service';

@Module({
    controllers: [],
    providers: [PrismaService, EntityDocumentService],
    exports: [EntityDocumentService]
})
export class EntityDocumentModule {}
