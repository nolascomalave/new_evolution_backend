import { Injectable } from "@nestjs/common";
import { PrismaService, PrismaTransactionOrService } from "src/prisma.service";
import { AddParams, EntityService } from "../entity/entity.service";

@Injectable()
export class SystemSubscriptionUserService {
    constructor(
        private prisma: PrismaService,
        private entityService: EntityService
    ) {}

    async add(addData: AddParams, prisma?: PrismaTransactionOrService) {
        const isPosibleTransaction = !prisma;

        if(isPosibleTransaction) {
            prisma = await this.prisma.beginTransaction();
        }

        try {
            const entity = await this.entityService.add({
                names: addData.names,
                documents: addData.documents,
                emails: addData.emails,
                phones: addData.phones,
                gender: addData.gender,
                address: addData.address,
                photo: addData.photo,
                id_system_subscription_user_moderator: addData.id_system_subscription_user_moderator
            }, prisma);


            if(isPosibleTransaction && ('rollback' in prisma) && (typeof prisma.rollback === 'function')) {
                prisma.rollback();
            }
        } catch(e: any) {
            if(isPosibleTransaction && ('rollback' in prisma) && (typeof prisma.rollback === 'function')) {
                prisma.rollback();
            }
        }
    }
}