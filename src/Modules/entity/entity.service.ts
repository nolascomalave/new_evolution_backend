import { Injectable } from '@nestjs/common';
import { PrismaService, PrismaTransactionOrService, TransactionPrisma } from '../../prisma.service';
import { AddDto } from '../system_subscription_user/dto/system_subscription_user.dto';

export type AddParams = AddDto & {
    photo?: Express.Multer.File;
    id_system_subscription_user_moderator: number
};

@Injectable()
export class EntityService {
    constructor(private prisma: PrismaService) {}

    add(addData: AddParams, prisma?: PrismaTransactionOrService) {
        
    }
}