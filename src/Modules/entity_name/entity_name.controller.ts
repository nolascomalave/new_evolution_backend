import { Controller, Get, Req, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller('names')
export class EntityNameController {
    constructor(private prisma: PrismaService) {}

    @Get()
    async index() {
        return await this.prisma.entity_name.findMany();
    }
}
