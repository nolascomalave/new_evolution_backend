import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('test')
@UseGuards(AuthGuard)
export class TestController {
    @Get()
    index() {
        return {
            message: 'Hello'
        };
    }
}
