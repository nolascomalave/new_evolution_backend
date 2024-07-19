import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, Post, Req, UploadedFile, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AddDto, GetByIdDto } from './dto/system_subscription_user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddPipe } from './pipes/system_subscription_user.pipe';
import { PrismaService, TransactionPrisma } from 'src/prisma.service';
import { SystemSubscriptionUserService } from './system_subscription_user.service';
import { diskStorage } from 'multer';
import Files from 'src/Util/Files';
import { RequestSession } from '../auth/middlewares/auth.middleware';
import { JSONParser, getAllFlatValuesOfDataAsArray } from 'src/util/formats';
import HandlerErrors from 'src/util/HandlerErrors';

@Controller('system-subscription-users')
export class SystemSubscriptionUserController {
    constructor(
        private prisma: PrismaService,
        private service: SystemSubscriptionUserService
    ) {}

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    // @UsePipes(new ValidationPipe())
    // Status:
    //      200 Ok.
    //      400 Errors in params.
    //      401 Unauthorized.
    //      404 Not found.
    //      500 Error in server.
    async getById(@Req() { user: { id_system_subscription } }: RequestSession, @Param() { id }: GetByIdDto) {
        const result = await this.service.getById({
            id,
            id_system_subscription
        });

        if(result !== null) {
            delete result.password;
        } else {
            throw new NotFoundException(undefined, 'User not found!');
        }

        return JSONParser(result);
    }


    @Post()
    @HttpCode(HttpStatus.CREATED)
    // @UsePipes(new ValidationPipe())
    // Status:
    //      201 Created.
    //      400 Errors in params.
    //      401 Unauthorized.
    //      500 Error in server.
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
    async add(@Req() req: RequestSession, @Body(AddPipe) data: AddDto, @UploadedFile() photo: Express.Multer.File) {
        let errorsInProcess = new HandlerErrors;

        const prisma = await this.prisma.beginTransaction();

        try {
            const entityResult = await this.service.add({
                ...data,
                photo,
                id_system_subscription_user_moderator: req.user.id,
                is_natural: true
            }, prisma);

            if(entityResult.errors.existsErrors()) {
                errorsInProcess = entityResult.errors;
                throw 'error';
            }

            delete entityResult.data.fullUser.password;
            delete entityResult.data.user.password;

            await prisma.commit();

            return {
                data: JSONParser(entityResult.data),
                message: 'User created!'
            };
        } catch(e: any) {
            console.log(e);
            await prisma.rollback();

            if(!!photo) {
                Files.deleteFile(photo.path);
            }

            if(e === 'error') {
                throw new BadRequestException(getAllFlatValuesOfDataAsArray(errorsInProcess, true));
            }

            throw new InternalServerErrorException(e);
        }
    }
}