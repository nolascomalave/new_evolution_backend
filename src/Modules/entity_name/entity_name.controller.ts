import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('names')
@UseGuards(AuthGuard)
export class EntityNameController {
    constructor(private prisma: PrismaService) {}

    @Get()
    async index() {
        return await this.prisma.entity_name.findMany();
    }
}
