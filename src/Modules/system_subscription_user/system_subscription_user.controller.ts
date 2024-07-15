import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, Post, Req, UploadedFile, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AddDto } from './dto/system_subscription_user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddPipe } from './pipes/system_subscription_user.pipe';
import { PrismaService } from 'src/prisma.service';
import { SystemSubscriptionUserService } from './system_subscription_user.service';
import { diskStorage } from 'multer';
import Files from 'src/Util/Files';
import { RequestSession } from '../auth/middlewares/auth.middleware';

@Controller('system-subscription-users')
export class SystemSubscriptionUserController {
    constructor(
        private prisma: PrismaService,
        private service: SystemSubscriptionUserService
    ) {}

    @Get()
    Index() {
        return {
            Hola: 'Example'
        };
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(
        FileInterceptor(
            'photo',
            {
                storage: diskStorage({
                    destination: './uploads',
                })
            }
        )
    )
    // @UsePipes(new ValidationPipe())
    // Status:
    //      201 Created.
    //      400 Errors in params.
    //      401 Unauthorized.
    //      500 Error in server.
    async add(@Req() req: RequestSession, @Body(AddPipe) data: AddDto, @UploadedFile() photo: Express.Multer.File) {
        try {
            const {
                data: userData,
                errors
            } = await this.service.add({
                ...data,
                photo,
                id_system_subscription_user_moderator: req.user.id,
                is_natural: true
            });
        } catch(e: any) {
            if(!!photo) {
                Files.deleteFile(photo.path);
            }

            if(e !== 'error') {
                throw new InternalServerErrorException(e);
            }
        }

        // throw new BadRequestException(['names.0 Error']);

        /* if(result.errors) {
            return {
                message: result.errors.arrayErrors(),

            }
        } */

        return {data};
    }
}