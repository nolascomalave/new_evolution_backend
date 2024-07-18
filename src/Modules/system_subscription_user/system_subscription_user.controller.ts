import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, Post, Req, UploadedFile, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AddDto } from './dto/system_subscription_user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddPipe } from './pipes/system_subscription_user.pipe';
import { PrismaService, TransactionPrisma } from 'src/prisma.service';
import { SystemSubscriptionUserService } from './system_subscription_user.service';
import { diskStorage } from 'multer';
import Files from 'src/Util/Files';
import { RequestSession } from '../auth/middlewares/auth.middleware';
import { Prisma } from '@prisma/client';
import { JSONParser, getAllFlatValuesOfDataAsArray } from 'src/util/formats';
import HandlerErrors from 'src/util/HandlerErrors';

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
        let errorsInProcess = new HandlerErrors,
            dataProcess: any = null;

        /* try {
            await this.prisma.$transaction(async (prisma: TransactionPrisma) => {
                const {
                    data: userData,
                    errors
                } = await this.service.add({
                    ...data,
                    photo,
                    id_system_subscription_user_moderator: req.user.id,
                    is_natural: true
                }, prisma);

                if(!!errors) {
                    errorsInProcess = errors;
                    throw 'error';
                }

                dataProcess = userData;

                return console.log('finalizado');
            }, {
                timeout: 10000, // default: 5000
            });
        } catch(e: any) {
            console.log(e);
            if(!!photo) {
                Files.deleteFile(photo.path);
            }

            if(e === 'error') {
                throw new BadRequestException(errorsInProcess);
            }

            throw new InternalServerErrorException(e);
        }

        return {
            data: dataProcess,
            message: 'User created!'
        }; */

        const prisma = await this.prisma.beginTransaction();

        try {
            const {
                data: userData,
                errors
            } = await this.service.add({
                ...data,
                photo,
                id_system_subscription_user_moderator: req.user.id,
                is_natural: true
            }, prisma);

            if(errors.existsErrors()) {
                errorsInProcess = errors;
                throw 'error';
            }

            await prisma.rollback();

            delete userData.fullUser.password;
            delete userData.user.password;

            return {
                data: JSONParser(userData),
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