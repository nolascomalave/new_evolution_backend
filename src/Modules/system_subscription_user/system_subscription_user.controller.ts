import { BadRequestException, Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, Patch, Post, Query, Req, UnauthorizedException, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AddOrUpdateDto, ChangePasswordDto, ChangeStatusDto, GetByIdDto, GetByIdQueryDto, ResetPasswordDto } from './dto/system_subscription_user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddPipe } from './pipes/system_subscription_user.pipe';
import { PrismaService } from 'src/prisma.service';
import { SystemSubscriptionUserService } from './system_subscription_user.service';
import { diskStorage } from 'multer';
import Files from 'src/Util/Files';
import { RequestSession } from '../auth/middlewares/auth.middleware';
import { JSONParser, getAllFlatValuesOfDataAsArray } from 'src/util/formats';
import HandlerErrors from 'src/util/HandlerErrors';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('system-subscription-users')
@UseGuards(AuthGuard)
export class SystemSubscriptionUserController {
    constructor(
        private prisma: PrismaService,
        private service: SystemSubscriptionUserService
    ) {}

    // Status:
    //      200 Ok.
    //      401 Unauthorized.
    //      500 Error in server.
    @Get()
    async Index(@Query() { page = 1, search, status }: { page?: number, search?: string, status?: any }) {
        page = (isNaN(page) || !Number.isInteger(Number(page))) ? undefined : Number(page);
        search = (typeof search !== 'string' && typeof search !== 'number') ? undefined : (typeof search === 'number' ? ('').concat(search) : search);

        const users = await this.service.getAll({ page, search, status, WithoutPassword: true });

        return {
            data: JSONParser(users),
            message: 'Users result.'
        };
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.UNAUTHORIZED)
    // @UsePipes(new ValidationPipe())
    // Status:
    //      200 Ok.
    //      400 Errors in params.
    //      401 Unauthorized.
    //      404 Not found.
    //      500 Error in server.
    async getById(@Req() { user: { system_subscription_id } }: RequestSession, @Param() { id }: GetByIdDto, @Query() { allEntityInfo = false }: GetByIdQueryDto) {
        const result = await this.service[allEntityInfo === true ? 'getUserEntityById' : 'getById']({
            id,
            system_subscription_id: system_subscription_id
        });

        if(result !== null) {
            delete result.password;
        } else {
            throw new NotFoundException(undefined, 'User not found!');
        }

        const data = JSONParser(result);

        return data;
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
    async add(@Req() req: RequestSession, @Body(AddPipe) data: AddOrUpdateDto, @UploadedFile() photo: Express.Multer.File) {
        let errorsInProcess = new HandlerErrors;

        const prisma = await this.prisma.beginTransaction();

        try {
            const user = await this.service.addOrUpdate({
                ...data,
                photo,
                system_subscription_user_moderator_id: req.user.id,
                is_natural: true
            }, prisma);

            if(user.errors.existsErrors()) {
                errorsInProcess = user.errors;
                throw 'error';
            }

            delete user.data.fullUser.password;
            delete user.data.user.password;

            await prisma.commit();

            return {
                data: JSONParser(user.data),
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


    @Post('/:id')
    @HttpCode(HttpStatus.OK)
    // @UsePipes(new ValidationPipe())
    // Status:
    //      201 Created.
    //      400 Errors in params.
    //      401 Unauthorized.
    //      404 Unauthorized.
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
    async update(@Req() req: RequestSession, @Body(AddPipe) data: AddOrUpdateDto, @Param() { id }: GetByIdDto, @UploadedFile() photo: Express.Multer.File) {
        let errorsInProcess = new HandlerErrors;

        const prisma = await this.prisma.beginTransaction();

        try {
            const entityResult = await this.service.addOrUpdate({
                ...data,
                photo,
                system_subscription_user_id: id,
                system_subscription_user_moderator_id: req.user.id,
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
                if(errorsInProcess.get('system_subscription_user_id') === 404) {
                    throw new NotFoundException(undefined, 'User not found!');
                }

                throw new BadRequestException(getAllFlatValuesOfDataAsArray(errorsInProcess, true));
            }

            throw new InternalServerErrorException(e);
        }
    }

    @Patch('/change-status')
    @HttpCode(HttpStatus.OK)
    async changeStatus(@Req() { user: moderator }: RequestSession, @Body() data: ChangeStatusDto) {
        let errorsInProcess = new HandlerErrors;

        const prisma = await this.prisma.beginTransaction();

        try {
            const result = await this.service.changeStatus({
                ...data,
                system_subscription_user_moderator_id: moderator.id
            }, prisma);

            if(result.errors.existsErrors()) {
                errorsInProcess = result.errors;
                throw 'error';
            }

            delete result.data.password;

            await prisma.commit();

            return {
                data: result.data,
                message: `User ${data.type.toString() === 'ACTIVE' ? '' : 'in'}activated correctly!`
            };
        } catch(e: any) {
            console.log(e);
            await prisma.rollback();

            if(e === 'error') {
                throw new BadRequestException(getAllFlatValuesOfDataAsArray(errorsInProcess, true));
            }

            throw new InternalServerErrorException(e);
        }
    }

    @Patch('/reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() { system_subscription_user_id }: ResetPasswordDto) {
        const prisma = await this.prisma.beginTransaction();

        try {
            const { user, warning } = await this.service.resetUserPassword({
                id: system_subscription_user_id,
                sendEmail: true
            }, prisma);

            await prisma.commit();

            return {
                message: `The user's password was reset!`,
                warning
            };
        } catch(e: any) {
            await prisma.rollback();

            throw new InternalServerErrorException(e);
        }
    }

    @Patch('/change-password')
    @HttpCode(HttpStatus.OK)
    async changePassword(@Req() { user: moderator }: RequestSession, @Body() data: ChangePasswordDto) {

        const prisma = await this.prisma.beginTransaction();

        try {
            const { warning } = await this.service.changeUserPassword({system_subscription_user_id: moderator.id, ...data}, prisma);

            await prisma.commit();

            return {
                message: `Password has been changed!`,
                warning
            };
        } catch(e: any) {
            await prisma.rollback();

            if(e instanceof UnauthorizedException) {
                throw e;
            }

            throw new InternalServerErrorException(e);
        }
    }
}