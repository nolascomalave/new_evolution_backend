import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import Files from 'src/Util/Files';
import { JSONParser, getAllFlatValuesOfDataAsArray } from 'src/util/formats';
import { EntityService } from './entity.service';
import { RequestSession } from '../auth/middlewares/auth.middleware';
import { AddOrUpdateDto, GetByIdDto } from './dto/entity.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import HandlerErrors from 'src/util/HandlerErrors';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('entity')
@UseGuards(AuthGuard)
export class EntityController {
    constructor(
        private prisma: PrismaService,
        private service: EntityService
    ) {}

    // Status:
    //      200 Ok.
    //      401 Unauthorized.
    //      500 Error in server.
    @Get()
    async Index(@Query() { page = 1, search, status }: { page?: number, search?: string, status?: any }) {
        page = (isNaN(page) || !Number.isInteger(Number(page))) ? undefined : Number(page);
        search = (typeof search !== 'string' && typeof search !== 'number') ? undefined : (typeof search === 'number' ? ('').concat(search) : search);

        const users = await this.service.getAll({ page, search, status });

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
    async getById(@Req() { user: { system_subscription_id } }: RequestSession, @Param() { id }: GetByIdDto) {
        const result = await this.service.getById({
            id,
            system_subscription_id: Number(system_subscription_id)
        });

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
    async add(@Req() req: RequestSession, @Body() data: AddOrUpdateDto, @UploadedFile() photo: Express.Multer.File) {
        let errorsInProcess = new HandlerErrors;

        const prisma = await this.prisma.beginTransaction();

        try {
            const entityResult = await this.service.addOrUpdate({
                ...data,
                photo,
                system_subscription_user_moderator_id: Number(req.user.id)
            }, prisma);

            if(entityResult.errors.existsErrors()) {
                errorsInProcess = entityResult.errors;
                throw 'error';
            }

            await prisma.commit();

            return {
                data: JSONParser(entityResult.data),
                message: 'Entity created!'
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
    async update(@Req() req: RequestSession, @Body() data: AddOrUpdateDto, @Param() { id }: GetByIdDto, @UploadedFile() photo: Express.Multer.File) {
        let errorsInProcess = new HandlerErrors;

        const prisma = await this.prisma.beginTransaction();

        try {
            const entityResult = await this.service.addOrUpdate({
                ...data,
                photo,
                entity_id: id,
                system_subscription_user_moderator_id: Number(req.user.id)
            }, prisma);

            if(entityResult.errors.existsErrors()) {
                errorsInProcess = entityResult.errors;
                throw 'error';
            }

            await prisma.commit();

            return {
                data: JSONParser(entityResult.data),
                message: 'Entiy created!'
            };
        } catch(e: any) {
            console.log(e);
            await prisma.rollback();

            if(!!photo) {
                Files.deleteFile(photo.path);
            }

            if(e === 'error') {
                if(errorsInProcess.get('entity_id') === 404) {
                    throw new NotFoundException(undefined, 'Entiy not found!');
                }

                throw new BadRequestException(getAllFlatValuesOfDataAsArray(errorsInProcess, true));
            }

            throw new InternalServerErrorException(e);
        }
    }
}