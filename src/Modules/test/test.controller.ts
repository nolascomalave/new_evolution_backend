import { Controller, Get, Req, Res } from '@nestjs/common';

@Controller('test')
export class TestController {
    @Get()
    index() {
        return {
            message: 'Hello'
        };
    }
}
