import { Injectable } from "@nestjs/common";
import { PrismaService, PrismaTransactionOrService } from "src/prisma.service";
import { AddParams, CompleteEntity, EntityService } from "../entity/entity.service";
import { username as usernameGenerator } from "src/util/formats";
import { hashSync } from 'bcryptjs';
import { system_subscription_user } from "@prisma/client";

type FullUser = {
    id: number;
    id_system: number;
    id_system_subscription: number;
    id_entity: number;
    id_system_subscription_user: number;
    username: string;
    password: string;
    name: string;
    complete_name: string;
    names: string | null;
    surnames: string | null;
    documents: string | null;
    phones: string | null;
    emails: string | null;
    is_admin: number | boolean;
    annulled_at_system: Date | null;
    annulled_at_system_subscription: Date | null;
    annulled_at_system_subscription_user: Date | null;
    annulled_by_system_subscription: Date | null;
    annulled_by_system_subscription_user: Date | null;
    annulled_at: Date | null;
    annulled_by: number | null;
}
@Injectable()
export class SystemSubscriptionUserService {
    constructor(
        private prisma: PrismaService,
        private entityService: EntityService
    ) {}

    async add(addData: AddParams, prisma?: PrismaTransactionOrService) {
        const isPosibleTransaction = !prisma;
        let errors: null | string[] = null,
            user: system_subscription_user | null = null,
            fullUser: FullUser | null = null;

        console.log('Inicia usuario');
        if(isPosibleTransaction) {
            prisma = await this.prisma.beginTransaction();
        }

        try {
            console.log('Inicia creación de entidad.');
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

            console.log('Inicia Consulta 1');
            const moderator_user: CompleteEntity | null = !data ? null : await this.prisma.findOneUnsafe(`SELECT
                *
            FROM entity_complete_info eci
            WHERE id = ${addData.id_system_subscription_user_moderator}`, prisma);

            console.log('Inicia Consulta 2');
            const usernames: string[] = !moderator_user ? null : (await this.prisma.queryUnsafe<{username: string}>(`SELECT
                ssu.username
            FROM entity_complete_info eci
            INNER JOIN system_subscription_user ssu
                ON ssu.id_entity = eci.id
            WHERE eci.id_system_subscription = ${moderator_user.id_system_subscription}`, prisma) ?? [])
                .map(el => (el.username));

            console.log(data.fullEntity);

            const username: string | null = (!data || !moderator_user || !usernames) ? null : usernameGenerator(data.fullEntity.names.split(' ')[0], data.fullEntity.surnames.split(' ')[0], []);

            console.log('Inicia creación de usurio 1');
            user = (!data || !moderator_user) ? null : (await this.prisma.system_subscription_user.create({
                data: {
                    id_entity: data.entity.id,
                    id_system_subscription: moderator_user.id_system_subscription,
                    created_by: addData.id_system_subscription_user_moderator,
                    username: username,
                    password: hashSync(username, 10)
                }
            }));

            fullUser = !user ? null : await this.prisma.findOneUnsafe(`SELECT
                *
            FROM system_subscription_user_complete_info ssu
            WHERE id_system_subscription_user = ${user.id}`, prisma);

            if(!data) {
                errors = entityErrors;
                throw 'error';
            }

            if(isPosibleTransaction && ('commit' in prisma)) {
                prisma.commit();
            }
            console.log('user');
        } catch(e: any) {
            if(isPosibleTransaction && ('rollback' in prisma)) {
                prisma.rollback();
            }
            console.log('user');

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