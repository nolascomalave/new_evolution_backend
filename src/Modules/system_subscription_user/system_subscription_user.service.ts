import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService, PrismaTransactionOrService, TransactionPrisma } from "src/prisma.service";
import { AddOrUpdateParams, CompleteEntity, EntityService } from "../entity/entity.service";
import { adaptNumTwo, adaptZerosNum, generateRandomSecurePassword, username as usernameGenerator } from "src/util/formats";
import { hashSync, compareSync } from 'bcryptjs';
import { $Enums, system_subscription_user } from "@prisma/client";
import HandlerErrors from "src/util/HandlerErrors";
import { ChangeStatusDto, GetByIdDto } from "./dto/system_subscription_user.dto";
import { readFileSync } from "fs";
import { resolve } from "path";
// import resendInstance from "src/lib/resendInstance";
import { renderString } from "src/Util/functionals";
import { MailerService } from "src/mailer/mailer.service";
// import { ResendService } from "nestjs-resend";

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
    photo: null | string;
    is_admin: number | boolean;
    inactivated_at_system: Date | null;
    inactivated_at_system_subscription: Date | null;
    inactivated_at_system_subscription_user: Date | null;
    inactivated_by_system_subscription: Date | null;
    inactivated_by_system_subscription_user: Date | null;
    inactivated_at: Date | null;
    inactivated_by: number | null;
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
    inactivated_at_system: Date | null;
    inactivated_at_system_subscription: Date | null;
    inactivated_at_system_subscription_user: Date | null;
    inactivated_by_system_subscription: Date | null;
    inactivated_by_system_subscription_user: Date | null;
    inactivated_at: Date | null;
    inactivated_by: number | null;
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

const resetPasswordTemplate = readFileSync(resolve(__dirname, '../../../views/Templates/Email/reset-password.html'), { encoding:'utf8' });

@Injectable()
export class SystemSubscriptionUserService {
    constructor(
        private prisma: PrismaService,
        private entityService: EntityService,
        private mailerService: MailerService,
        // private resendService: ResendService
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

    async getAll({ page, search, status, WithoutPassword }: { page?: number, search?: string, status?: any, WithoutPassword?: boolean }) {
        let where: string[] | string = [];

        if((search ?? null) !== null) {
            search = search.trim().replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function(char) {
                switch (char) {
                    case "\"":
                    case "'":
                    case "\\":
                    case "%":
                        return "\\" + char; // Escapa el carácter con una barra invertida
                    default:
                        return char;
                }
            });

            where.push(`(
                username LIKE '%${search}%'
                OR complete_name LIKE '%${search}%'
                OR name LIKE '%${search}%'
            )`);
        }

        if((typeof status === 'string') || (typeof status === 'object' && !Array.isArray(status))) {
            let isValidStatus = true;

            if(typeof status !== 'object') {
                try {
                    status = JSON.parse(status);
                } catch(e: any) {
                    isValidStatus = false;
                }
            }

            if(isValidStatus) {
                if('Annulled' in status) {

                } else {
                    const statusCondition: string[] = [];

                    where.push(`COALESCE(annulled_at, annulled_at_system_subscription_user) IS NULL`);

                    if('Active' in status) {
                        statusCondition.push(`COALESCE(inactivated_at, inactivated_at_system_subscription_user) IS ${(status.Active === 'false' || status.Active === false || status.Active == 0) ? 'NOT' : ''} NULL`.replace(/ +/gi, ' '));
                    }

                    if('Inactive' in status) {
                        statusCondition.push(`COALESCE(inactivated_at, inactivated_at_system_subscription_user) IS ${(status.Inactive === 'false' || status.Inactive === false || status.Inactive == 0) ? '' : 'NOT'} NULL`.replace(/ +/gi, ' '));
                    }

                    where.push(`(${statusCondition.join("\nOR ")})`);
                }
            }
        } else {
            where.push(`COALESCE(annulled_at, annulled_at_system_subscription_user) IS NULL`);
        }

        where = where.length < 1 ? '' : ('where '.concat(where.join("\nAND ")));

        const sql = `SELECT
            *,
            IF('Malavé' LIKE '%Malavé', 0, 1) AS example
        FROM system_subscription_user_complete_info ssu
        ${where}`;

        let users: FullUser[] = await this.prisma.queryUnsafe(sql) ?? [];

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
                throw e;
            } else {
                if(errors.get('id_entity') === 404) {
                    errors.set('id_entity', 'Entity not found!');
                }
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

    async changeStatus(data: ChangeStatusDto & { id_system_subscription_user_moderator: number }, prisma?: TransactionPrisma, user?: system_subscription_user) {
        const isPosibleTransaction = !prisma,
            errors = new HandlerErrors(),
            system_subscription_user_id_field = 'id_system_subscription';
        let now: Date = new Date();

        if(isPosibleTransaction) {
            prisma = await this.prisma.beginTransaction();
        }

        try {
            const moderator_user = await prisma.system_subscription_user.findUnique({where: {id: data.id_system_subscription_user_moderator, annulled_at: null}}),
                where = {
                    id: data.id_system_subscription_user,
                    annulled_at: null
                };

            if(!moderator_user) {
                errors.set('id_system_subscription_user_moderator', 'Moderator user not found!');
            }

            user = await prisma.system_subscription_user.findUnique({ where });

            if(!user){
                errors.set(system_subscription_user_id_field, 404);
            }

            if(errors.existsErrors()) {
                throw 'error';
            }

            now = new Date();

            user = await prisma.system_subscription_user.update({
                data: {
                    inactivated_at: data.type.toString() === 'ACTIVE' ? null : (user.inactivated_at ?? `${adaptNumTwo(now.getFullYear())}-${adaptNumTwo(now.getMonth())}-${adaptNumTwo(now.getDate())}T${adaptNumTwo(now.getHours())}:${adaptNumTwo(now.getMinutes())}:${adaptNumTwo(now.getSeconds())}.${adaptZerosNum(now.getMilliseconds(), 3)}Z`),
                    inactivated_by: data.type.toString() === 'ACTIVE' ? null : (user.inactivated_by ?? data.id_system_subscription_user_moderator)
                },
                where
            });

            if(isPosibleTransaction) {
                await prisma.commit();
            }
        } catch(e: any) {
            if(isPosibleTransaction) {
                await prisma.rollback();
            }

            if(e !== 'error') {
                throw e;
            } else {
                if(errors.get(system_subscription_user_id_field) === 404) {
                    errors.set(system_subscription_user_id_field, 'User not found!');
                }
            }
        }

        return {
            data: user,
            errors: errors
        }
    }

    async resetUserPassword({ id, sendEmail = false }: { id: number, sendEmail?: boolean }, prisma?: TransactionPrisma) {
        const isPosibleTransaction = !prisma;
        let warning: string | undefined = undefined;

        if(isPosibleTransaction) {
            prisma = await this.prisma.beginTransaction();
        }

        try {
            let user: system_subscription_user = await prisma.system_subscription_user.findUnique({where: {id}});

            if(!user) {
                throw 404;
            }

            let newPassword: string;

            do {
                newPassword = generateRandomSecurePassword(8);
            } while(compareSync(newPassword, user.password));

            await prisma.system_subscription_user.update({
                data: {
                    password: hashSync(newPassword, 10)
                },
                where: {
                    id: user.id
                }
            });

            if(!!sendEmail) {
                const emails = await this.entityService.getEntityEmails(user.id_entity),
                    completeUser = await this.getUserEntityById({ id: user.id });

                if(emails.length < 1) {
                    warning = 'The user does not have a registered email to notify them that their password has been reset.';
                } else {
                    /* const result = await this.resendService.emails.send({
                        from: 'New Evolution <proheredes@gmail.com>',
                        to: ['nolascomalave@hotmail.com', 'proheredes@gmail.com'],
                        subject: 'Hello World',
                        html: renderString(resetPasswordTemplate, {
                            name: completeUser.name,
                            newPassword
                        }),
                    }); */

                    const result = await this.mailerService.sendMail({
                        /* from: {
                            name: 'New Evolution',
                            address: 'proheredes@gmail.com'
                        }, */
                        recipients: ['nolascomalave@hotmail.com', 'proheredes@gmail.com'],
                        subject: 'Reset Password',
                        html: renderString(resetPasswordTemplate, {
                            name: completeUser.name,
                            newPassword
                        })
                    });
                }
            }

            if(isPosibleTransaction) {
                await prisma.commit();
            }

            return {
                user,
                warning
            };
        } catch(e) {
            if(isPosibleTransaction) {
                await prisma.rollback();
            }

            throw e;
        }
    }
}