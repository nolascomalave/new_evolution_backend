import { Injectable } from "@nestjs/common";
import { PrismaService, PrismaTransactionOrService } from "src/prisma.service";
import { AddParams, CompleteEntity, EntityService } from "../entity/entity.service";
import { username as usernameGenerator } from "src/util/formats";
import { hashSync } from 'bcryptjs';
import { system_subscription_user } from "@prisma/client";
import HandlerErrors from "src/util/HandlerErrors";
import { GetByIdDto } from "./dto/system_subscription_user.dto";

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

    async getById({ id, id_system_subscription }: GetByIdDto & { id_system_subscription?: number }) {
        let AND: string[] | string = [
            `annulled_at IS NULL`
        ];

        if(id_system_subscription !== undefined) {
            AND.push(`id_system_subscription_user = ${id_system_subscription}`);
        }

        AND = AND.length < 1 ? '' : ('AND '.concat(AND.join("\nAND ")));

        const sql = `SELECT
            *
        FROM system_subscription_user_complete_info ssu
        WHERE id_system_subscription_user = ${id}
            ${AND}`;

        const user: FullUser | null = await this.prisma.findOneUnsafe(sql);

        return user;
    }

    async add(addData: AddParams, prisma?: PrismaTransactionOrService) {
        const isPosibleTransaction = !prisma;
        let errors = new HandlerErrors,
            user: system_subscription_user | null = null,
            fullUser: FullUser | null = null;

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

            const moderator_user: CompleteEntity | null = !data ? null : await this.prisma.findOneUnsafe(`SELECT
                *
            FROM entity_complete_info eci
            WHERE id = ${addData.id_system_subscription_user_moderator}`, prisma);

            const usernames: string[] = !moderator_user ? null : (await this.prisma.queryUnsafe<{username: string}>(`SELECT
                ssu.username
            FROM entity_complete_info eci
            INNER JOIN system_subscription_user ssu
                ON ssu.id_entity = eci.id
            WHERE eci.id_system_subscription = ${moderator_user.id_system_subscription}`, prisma) ?? [])
                .map(el => (el.username));

            const username: string | null = (!data || !moderator_user || !usernames || !data.fullEntity.names) ? null : usernameGenerator(data.fullEntity.names.split(' ')[0], data.fullEntity.surnames === null ? 'user' : data.fullEntity.surnames.split(' ')[0], usernames);

            user = (!data || !moderator_user || !username) ? null : (await prisma.system_subscription_user.create({
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
            } else if(data.fullEntity.names === null) {
                errors.set('system_subscription_user', 'User must have a first name.');
            }

            if(errors.existsErrors()) {
                throw 'error';
            }

            if(isPosibleTransaction && ('commit' in prisma)) {
                prisma.commit();
            }
        } catch(e: any) {
            if(isPosibleTransaction && ('rollback' in prisma)) {
                prisma.rollback();
            }

            if(e !== 'error') {
                throw e;
            }
        }

        return {
            data: errors.existsErrors() ? null : {
                user,
                fullUser
            },
            errors: errors,
        };
    }
}