import { Injectable } from "@nestjs/common";
import { PrismaService, PrismaTransactionOrService } from "src/prisma.service";
import { AddParams, CompleteEntity, EntityService } from "../entity/entity.service";
import { username as usernameGenerator } from "src/util/formats";
import { hashSync } from 'bcryptjs';
import { system_subscription_user } from "@prisma/client";

@Injectable()
export class SystemSubscriptionUserService {
    constructor(
        private prisma: PrismaService,
        private entityService: EntityService
    ) {}

    async add(addData: AddParams, prisma?: PrismaTransactionOrService) {
        const isPosibleTransaction = !prisma;
        let errors: null | string[] = null,
            user: system_subscription_user | null,
            fullUser: any;

        if(isPosibleTransaction) {
            prisma = await this.prisma.beginTransaction();
        }

        try {
            const {
                data,
                errors: entityErrors
            } = await this.entityService.add({
                names: addData.names,
                documents: addData.documents,
                emails: addData.emails,
                phones: addData.phones,
                gender: addData.gender,
                address: addData.address,
                photo: addData.photo,
                id_system_subscription_user_moderator: addData.id_system_subscription_user_moderator,
                is_natural: addData.is_natural
            }, prisma);

            const moderator_user: CompleteEntity | null = !data ? null : await prisma.findOneUnsafe(`SELECT
                *
            FROM entity_complete_info eci
            WHERE id = ${addData.id_system_subscription_user_moderator}`);

            const usernames: {username: string}[] = !moderator_user ? null : (await prisma.findOneUnsafe(`SELECT
                ssu.username
            FROM entity_complete_info eci
            INNER JOIN system_subscription_user ssu
                ON ssu.id_entity = eci.id
            WHERE eci.id_system_subscription = ${moderator_user.id_system_subscription}`) ?? [])
                .map(el => (el.username));

            const username: string | null = (!data || !moderator_user || !usernames) ? null : usernameGenerator(data.fullEntity.names.split(' ')[0], data.fullEntity.surnames.split(' ')[0], []);

            user = (!data || !moderator_user) ? null : (await this.prisma.system_subscription_user.create({
                data: {
                    id_entity: data.entity.id,
                    id_system_subscription: moderator_user.id_system_subscription,
                    created_by: addData.id_system_subscription_user_moderator,
                    username: username,
                    password: hashSync(username, 10)
                }
            }));

            fullUser = !user ? null : await prisma.findOneUnsafe(`SELECT
                *
            FROM system_subscription_user_complete_info ssu
            WHERE id_system_subscription_user = ${user.id}`);

            if(!data) {
                errors = entityErrors;
                throw 'error';
            }

            if(isPosibleTransaction && ('rollback' in prisma) && (typeof prisma.rollback === 'function')) {
                prisma.rollback();
            }
        } catch(e: any) {
            if(isPosibleTransaction && ('rollback' in prisma) && (typeof prisma.rollback === 'function')) {
                prisma.rollback();
            }

            if(e !== 'error') {
                throw e;
            }
        }

        return {
            data: !!errors ? null : {
                user,
                fullUser
            },
            errors: !errors ? null : errors,
        };
    }
}