import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService, PrismaTransactionOrService } from "src/prisma.service";
import { AddOrUpdateParams, CompleteEntity, EntityService } from "../entity/entity.service";
import { JSONParser, username as usernameGenerator } from "src/util/formats";
import { hashSync } from 'bcryptjs';
import { $Enums, system_subscription_user } from "@prisma/client";
import HandlerErrors from "src/util/HandlerErrors";
import { GetByIdDto } from "./dto/system_subscription_user.dto";

export type FullUser = {
    id: number;
    id_system: number;
    id_system_subscription: number;
    id_entity: number;
    id_system_subscription_user: number;
    username: string;
    password: string;
    name: string;
    names_obj: string | {
        type: string,
        names: string[],
        id_entity_name_type: number
    }[];
    complete_name: string;
    names: string | null;
    surnames: string | null;
    documents: null | {
        id: number,
        order: number,
        symbol: string,
        id_city: null | number,
        category: string,
        document: string,
        id_state: null | number,
        id_entity: number,
        id_country: null | number,
        id_entity_document: number,
        id_entity_document_category: number
    };
    phones: null | string[];
    emails: null | string[];
    is_admin: number | boolean;
    annulled_at_system: Date | null;
    annulled_at_system_subscription: Date | null;
    annulled_at_system_subscription_user: Date | null;
    annulled_by_system_subscription: Date | null;
    annulled_by_system_subscription_user: Date | null;
    annulled_at: Date | null;
    annulled_by: number | null;
}

export type CompleteEntityUser = {
    id: number;
    id_system: number;
    id_system_subscription: number;
    id_entity: number;
    id_system_subscription_user: number;
    username: string;
    password: string;
    name: string;
    names_obj: string | {
        type: string,
        names: string[],
        id_entity_name_type: number
    }[];
    complete_name: string;
    names: string | null;
    surnames: string | null;
    documents: null | {
        id: number,
        order: number,
        symbol: string,
        id_city: null | number,
        category: string,
        document: string,
        id_state: null | number,
        id_entity: number,
        id_country: null | number,
        id_entity_document: number,
        id_entity_document_category: number
    };
    phones: null | string[];
    emails: null | string[];
    is_admin: number | boolean;
    annulled_at_system: Date | null;
    annulled_at_system_subscription: Date | null;
    annulled_at_system_subscription_user: Date | null;
    annulled_by_system_subscription: Date | null;
    annulled_by_system_subscription_user: Date | null;
    annulled_at: Date | null;
    annulled_by: number | null;
    id_entity_parent: number;
    id_document: number;
    is_natural: 1 | 0;
    gender: null | $Enums.entity_gender;
    date_birth: null | string | Date;
    address: null | string;
    photo: null | string;
    created_at: number;
    created_by: number;
    updated_at: number;
    updated_by: number;
    legal_name: null | string;
    business_name: null | string;
    comercial_designation: null | string;
}

@Injectable()
export class SystemSubscriptionUserService {
    constructor(
        private prisma: PrismaService,
        private entityService: EntityService
    ) {}

    parseUser(user: CompleteEntityUser | FullUser, WithoutPassword: boolean = false) {
        if(user.documents !== null && (typeof user.documents === 'string')) {
            user.documents = JSON.parse(user.documents);
        }

        if(user.emails !== null && (typeof user.emails === 'string')) {
            user.emails = JSON.parse(user.emails);
        }

        if(user.names_obj !== null && (typeof user.names_obj === 'string')) {
            user.names_obj = JSON.parse(user.names_obj);

            if(Array.isArray(user.names_obj)) {
                user.names_obj = user.names_obj.map(names => {
                    names.names = Array.isArray(names.names) ? names.names : JSON.parse(names.names);
                    return names;
                });
            }
        }

        if(user.phones !== null && (typeof user.phones === 'string')) {
            user.phones = JSON.parse(user.phones);
        }

        if(WithoutPassword === true) {
            delete user.password;
        }

        return user;
    }

    async getAll({ page, search, WithoutPassword }: { page?: number, search?: string, WithoutPassword?: boolean }) {
        let where: string[] | string = [
            `annulled_at IS NULL`
        ];

        where = where.length < 1 ? '' : ('where '.concat(where.join("\nAND ")));

        const sql = `SELECT
            *
        FROM system_subscription_user_complete_info ssu
        ${where}`;

        let users: FullUser[] = await this.prisma.queryUnsafe(sql) ?? [];

        console.log(users);
        users = users.map(user => this.parseUser(user, WithoutPassword));

        return users;
    }

    async getById({ id, id_system_subscription }: GetByIdDto & { id_system_subscription?: number }) {
        let AND: string[] | string = [
            `annulled_at IS NULL`
        ];

        if(id_system_subscription !== undefined) {
            AND.push(`id_system_subscription = ${id_system_subscription}`);
        }

        AND = AND.length < 1 ? '' : ('AND '.concat(AND.join("\nAND ")));

        const sql = `SELECT
            *
        FROM system_subscription_user_complete_info ssu
        WHERE id_system_subscription_user = ${id}
            ${AND}`;

        let user: FullUser | null = await this.prisma.findOneUnsafe(sql);

        if(!!user) {
            /* if(user.documents !== null && (typeof user.documents === 'string')) {
                user.documents = JSON.parse(user.documents);
            }

            if(user.emails !== null && (typeof user.emails === 'string')) {
                user.emails = JSON.parse(user.emails);
            }

            if(user.names_obj !== null && (typeof user.names_obj === 'string')) {
                user.names_obj = JSON.parse(user.names_obj);

                if(Array.isArray(user.names_obj)) {
                    user.names_obj = user.names_obj.map(names => {
                        names.names = Array.isArray(names.names) ? names.names : JSON.parse(names.names);
                        return names;
                    });
                }
            }

            if(user.phones !== null && (typeof user.phones === 'string')) {
                user.phones = JSON.parse(user.phones);
            } */
        }

        return user;
    }

    async getUserEntityById({ id, id_system_subscription }: GetByIdDto & { id_system_subscription?: number }) {
        let AND: string[] | string = [
            `ssu.annulled_at IS NULL`
        ];

        if(id_system_subscription !== undefined) {
            AND.push(`ssu.id_system_subscription = ${id_system_subscription}`);
        }

        AND = AND.length < 1 ? '' : ('AND '.concat(AND.join("\nAND ")));

        const sql = `SELECT
            ssu.*,
            ent.id_entity_parent,
            ent.id_document,
            ent.is_natural,
            ent.gender,
            ent.date_birth,
            ent.address,
            ent.photo,
            ent.created_at,
            ent.created_by,
            ent.updated_at,
            ent.updated_by,
            ent.legal_name,
            ent.business_name,
            ent.comercial_designation
        FROM system_subscription_user_complete_info ssu
        INNER JOIN entity_complete_info ent
            ON ent.id = ssu.id_entity
        WHERE ssu.id_system_subscription_user = ${id}
            ${AND}`;

        let user: CompleteEntityUser | null = await this.prisma.findOneUnsafe(sql);

        if(!!user) {
            if(user.documents !== null && (typeof user.documents === 'string')) {
                user.documents = JSON.parse(user.documents);
            }

            if(user.emails !== null && (typeof user.emails === 'string')) {
                user.emails = JSON.parse(user.emails);
            }

            if(user.names_obj !== null && (typeof user.names_obj === 'string')) {
                user.names_obj = JSON.parse(user.names_obj);

                if(Array.isArray(user.names_obj)) {
                    user.names_obj = user.names_obj.map(names => {
                        names.names = Array.isArray(names.names) ? names.names : JSON.parse(names.names);
                        return names;
                    });
                }
            }

            if(user.phones !== null && (typeof user.phones === 'string')) {
                user.phones = JSON.parse(user.phones);
            }
        }

        return user;
    }

    async addOrUpdate(addData: AddOrUpdateParams, prisma?: PrismaTransactionOrService) {
        const isPosibleTransaction = !prisma;
        let errors = new HandlerErrors,
            user: system_subscription_user | null = null,
            fullUser: CompleteEntityUser | null = null;

        if(isPosibleTransaction) {
            prisma = await this.prisma.beginTransaction();
        }

        try {
            user = ('id_system_subscription_user' in addData) ? await prisma.system_subscription_user.findUnique({where: {id: Number(addData.id_system_subscription_user)}}) : null;

            if(!user && !('id_system_subscription_user' in addData)) {
                errors.set('id_system_subscription_user', 404);
                throw 'error';
            }

            const {
                data,
                errors: entityErrors
            } = await this.entityService.addOrUpdate({
                id_entity: !user ? undefined : user.id_entity,
                names: addData.names,
                documents: addData.documents,
                emails: addData.emails,
                phones: addData.phones,
                gender: addData.gender,
                address: addData.address,
                photo: addData.photo,
                removePhoto: addData.removePhoto,
                id_system_subscription_user_moderator: addData.id_system_subscription_user_moderator,
                is_natural: addData.is_natural
            }, prisma);

            const moderator_user: CompleteEntity | null = !data ? null : await this.prisma.findOneUnsafe(`SELECT
                *
            FROM entity_complete_info eci
            WHERE id = ${addData.id_system_subscription_user_moderator}`, prisma);

            const usernames: string[] = (!!user || !moderator_user) ? null : (await this.prisma.queryUnsafe<{username: string}>(`SELECT
                ssu.username
            FROM entity_complete_info eci
            INNER JOIN system_subscription_user ssu
                ON ssu.id_entity = eci.id
            WHERE eci.id_system_subscription = ${moderator_user.id_system_subscription}`, prisma) ?? [])
                .map(el => (el.username));

            const username: string | null = (!data || !moderator_user || !usernames || !data.fullEntity.names) ? null : usernameGenerator(data.fullEntity.names.split(' ')[0], data.fullEntity.surnames === null ? 'user' : data.fullEntity.surnames.split(' ')[0], usernames);

            if(!!user) {
                /* user = await prisma.system_subscription_user.update({
                    where: {
                        id: user.id
                    },
                    data: {

                    }
                }) */
            } else {
                user = (!data || !moderator_user || !username) ? null : (await prisma.system_subscription_user.create({
                    data: {
                        id_entity: data.entity.id,
                        id_system_subscription: moderator_user.id_system_subscription,
                        created_by: addData.id_system_subscription_user_moderator,
                        username: username,
                        password: hashSync(username, 10)
                    }
                }));
            }

            fullUser = !user ? null : await this.prisma.findOneUnsafe(`SELECT
                ssu.*,
                ent.id_entity_parent,
                ent.id_document,
                ent.is_natural,
                ent.gender,
                ent.date_birth,
                ent.address,
                ent.photo,
                ent.created_at,
                ent.created_by,
                ent.updated_at,
                ent.updated_by,
                ent.legal_name,
                ent.business_name,
                ent.comercial_designation
            FROM system_subscription_user_complete_info ssu
            INNER JOIN entity_complete_info ent
                ON ent.id = ssu.id_entity
            WHERE ssu.id_system_subscription_user = ${user.id}`, prisma);

            if(!data) {
                errors = entityErrors;
            } else if(data.fullEntity.names === null) {
                errors.set('system_subscription_user', 'User must have a first name.');
            }

            if(errors.existsErrors()) {
                throw 'error';
            }

            if(isPosibleTransaction && ('commit' in prisma)) {
                await prisma.commit();
            }
        } catch(e: any) {
            if(isPosibleTransaction && ('rollback' in prisma)) {
                await prisma.rollback();
            }

            if(e !== 'error') {
                if(errors.get('id_entity') === 404) {
                    errors.set('id_entity', 'Entity not found!');
                }

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