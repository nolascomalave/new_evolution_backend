import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EntityTypeService } from './entity_type.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetEntityTypeHierarchyDto } from './dto/entity_type.dto';
import { JSONParser } from 'src/util/formats';

@Controller('entity_type')
@UseGuards(AuthGuard)
export class EntityTypeController {
    constructor(
        // private prisma: PrismaService,
        private service: EntityTypeService
    ) {};

    // Status:
    //      200 Ok.
    //      401 Unauthorized.
    //      500 Error in server.
    @Get("entity_type_hierarchy")
    async getWithHierarchyRelation(@Query() params: GetEntityTypeHierarchyDto) {
        const users = await this.service.getWithHierarchyRelation(params);

        return {
            data: JSONParser(users),
            message: 'Users result.'
        };
    }
}