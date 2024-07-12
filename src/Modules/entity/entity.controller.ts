import { Controller, Get, Req, Res } from '@nestjs/common';

@Controller('entity')
export class EntityController {
    @Get()
    index() {
        return {
            message: 'Hello'
        };
    }
}