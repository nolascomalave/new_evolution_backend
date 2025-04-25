import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService, PrismaTransactionOrService, TransactionPrisma } from "src/prisma.service";
import { CompleteEntity, EntityService } from "../entity/entity.service";
import { adaptNumTwo, adaptZerosNum, generateRandomSecurePassword, username as usernameGenerator } from "src/util/formats";
import { hashSync, compareSync } from 'bcryptjs';
import { $Enums, system_subscription_user } from "@prisma/client";
import HandlerErrors from "src/util/HandlerErrors";
import { AddOrUpdateDto, ChangePasswordDto, ChangeStatusDto, GetByIdDto } from "./dto/system_subscription_user.dto";
import { readFileSync } from "fs";
import { resolve } from "path";
// import resendInstance from "src/lib/resendInstance";
import { renderString } from "src/Util/functionals";
import { MailerService } from "src/mailer/mailer.service";
import { escape } from "querystring";
// import { ResendService } from "nestjs-resend";

export type AddOrUpdateParams = AddOrUpdateDto & {
    is_natural: boolean;
    photo?: Express.Multer.File;
    system_subscription_user_moderator_id: string
};

export type FullUser = {
    id: string;
    system_id: string;
    system_subscription_id: string;
    entity_id: string;
    system_subscription_user_id: string;
    username: string;
    password: string;
    name: string;
    names_obj: string | {
        type: string,
        names: string[],
        entity_name_type_id: string
    }[];
    complete_name: string;
    names: string | null;
    surnames: string | null;
    documents: null | {
        id: string,
        order: number,
        symbol: string,
        city_id: null | number,
        category: string,
        document: string,
        state_id: null | number,
        entity_id: string,
        country_id: null | number,
        entity_document_id: string,
        entity_document_category_id: string
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
    inactivated_by: string | null;
    annulled_at_system: Date | null;
    annulled_at_system_subscription: Date | null;
    annulled_at_system_subscription_user: Date | null;
    annulled_by_system_subscription: Date | null;
    annulled_by_system_subscription_user: Date | null;
    annulled_at: Date | null;
    annulled_by: string | null;
}

export type CompleteEntityUser = {
    id: string;
    system_id: string;
    system_subscription_id: string;
    entity_id: string;
    system_subscription_user_id: string;
    username: string;
    password: string;
    name: string;
    names_obj: string | {
        type: string,
        names: string[],
        entity_name_type_id: string
    }[];
    complete_name: string;
    names: string | null;
    surnames: string | null;
    documents: null | {
        id: string,
        order: number,
        symbol: string,
        city_id: null | number,
        category: string,
        document: string,
        state_id: null | number,
        entity_id: string,
        country_id: null | number,
        entity_document_id: string,
        entity_document_category_id: string
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
    inactivated_by: string | null;
    annulled_at_system: Date | null;
    annulled_at_system_subscription: Date | null;
    annulled_at_system_subscription_user: Date | null;
    annulled_by_system_subscription: Date | null;
    annulled_by_system_subscription_user: Date | null;
    annulled_at: Date | null;
    annulled_by: string | null;
    entity_parent_id: string;
    document_id: string;
    is_natural: 1 | 0;
    gender: null | $Enums.entity_gender_enum;
    date_birth: null | string | Date;
    address: null | string;
    photo: null | string;
    created_at: number;
    created_by: string;
    updated_at: number;
    updated_by: string;
    legal_name: null | string;
    business_name: null | string;
    comercial_designation: null | string;
}

const resetPasswordTemplate = readFileSync(resolve(__dirname, '../../../views/Templates/Email/reset-password.html'), { encoding:'utf8' });
const changePasswordTemplate = readFileSync(resolve(__dirname, '../../../views/Templates/Email/change-password.html'), { encoding:'utf8' });

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
                unaccent(LOWER(username)) COLLATE "und-x-icu" LIKE unaccent(LOWER('%${search}%'))
                OR unaccent(LOWER(complete_name)) COLLATE "und-x-icu" LIKE unaccent(LOWER('%${search}%'))
                OR unaccent(LOWER(name)) COLLATE "und-x-icu" LIKE unaccent(LOWER('%${search}%'))
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
            *
        FROM system_subscription_user_complete_info ssu
        ${where}`;

        let users: FullUser[] = await this.prisma.queryUnsafe(sql) ?? [];

        users = users.map(user => this.parseUser(user, WithoutPassword));

        return users;
    }

    async getById({ id, system_subscription_id }: GetByIdDto & { system_subscription_id?: string }) {
        let AND: string[] | string = [
            `annulled_at IS NULL`
        ];

        if(system_subscription_id !== undefined) {
            AND.push(`system_subscription_id = '${escape(system_subscription_id)}'`);
        }

        AND = AND.length < 1 ? '' : ('AND '.concat(AND.join("\nAND ")));

        const sql = `SELECT
            *
        FROM system_subscription_user_complete_info ssu
        WHERE system_subscription_user_id = '${escape(id)}'
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

    async getUserEntityById({ id, system_subscription_id }: GetByIdDto & { system_subscription_id?: string }) {
        let AND: string[] | string = [
            `ssu.annulled_at IS NULL`
        ];

        if(system_subscription_id !== undefined) {
            AND.push(`ssu.system_subscription_id = '${escape(system_subscription_id)}'`);
        }

        AND = AND.length < 1 ? '' : ('AND '.concat(AND.join("\nAND ")));

        const sql = `SELECT
            ssu.*,
            ent.entity_parent_id,
            ent.document_id,
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
            ON ent.id = ssu.entity_id
        WHERE ssu.system_subscription_user_id = '${escape(id)}'
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
            user = ('system_subscription_user_id' in addData) ? await prisma.system_subscription_user.findUnique({where: {id: addData.system_subscription_user_id}}) : null;

            if(!user && ('system_subscription_user_id' in addData)) {
                errors.set('system_subscription_user_id', 404);
                throw 'error';
            }

            const {
                data,
                errors: entityErrors
            } = await this.entityService.addOrUpdate({
                entity_id: !user ? undefined : user.entity_id,
                names: addData.names,
                documents: addData.documents,
                emails: addData.emails,
                phones: addData.phones,
                gender: addData.gender,
                address: addData.address,
                photo: addData.photo,
                removePhoto: addData.removePhoto,
                system_subscription_user_moderator_id: addData.system_subscription_user_moderator_id,
                is_natural: addData.is_natural
            }, prisma);

            const moderator_user: CompleteEntityUser | null = !data ? null : await this.prisma.findOneUnsafe(`SELECT
                *
            FROM system_subscription_user_complete_info eci
            WHERE id = '${escape(addData.system_subscription_user_moderator_id)}'`, prisma);

            const usernames: string[] = (!!user || !moderator_user) ? null : (await this.prisma.queryUnsafe<{username: string}>(`SELECT
                ssu.username
            FROM entity_complete_info eci
            INNER JOIN system_subscription_user ssu
                ON ssu.entity_id = eci.id
            WHERE eci.system_subscription_id = '${escape(moderator_user.system_subscription_id)}'`, prisma) ?? [])
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
                        entity_id: data.entity.id,
                        system_subscription_id: moderator_user.system_subscription_id,
                        created_by: addData.system_subscription_user_moderator_id,
                        username: username,
                        password: hashSync(username, 10)
                    }
                }));
            }

            fullUser = !user ? null : await this.prisma.findOneUnsafe(`SELECT
                ssu.*,
                ent.entity_parent_id,
                ent.document_id,
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
                ON ent.id = ssu.entity_id
            WHERE ssu.system_subscription_user_id = '${escape(user.id)}'`, prisma);

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
                if(errors.get('entity_id') === 404) {
                    errors.set('entity_id', 'Entity not found!');
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

    async changeStatus(data: ChangeStatusDto & { system_subscription_user_moderator_id: string }, prisma?: TransactionPrisma, user?: system_subscription_user) {
        const isPosibleTransaction = !prisma,
            errors = new HandlerErrors(),
            system_subscription_user_field_id = 'system_subscription_id';
        let now: Date = new Date();

        if(isPosibleTransaction) {
            prisma = await this.prisma.beginTransaction();
        }

        try {
            const moderator_user = await prisma.system_subscription_user.findUnique({where: {id: data.system_subscription_user_moderator_id, annulled_at: null}}),
                where = {
                    id: data.system_subscription_user_id,
                    annulled_at: null
                };

            if(!moderator_user) {
                errors.set('system_subscription_user_moderator_id', 'Moderator user not found!');
            }

            user = await prisma.system_subscription_user.findUnique({ where });

            if(!user){
                errors.set(system_subscription_user_field_id, 404);
            }

            if(errors.existsErrors()) {
                throw 'error';
            }

            now = new Date();

            user = await prisma.system_subscription_user.update({
                data: {
                    inactivated_at: data.type.toString() === 'ACTIVE' ? null : (user.inactivated_at ?? `${adaptNumTwo(now.getFullYear())}-${adaptNumTwo(now.getMonth())}-${adaptNumTwo(now.getDate())}T${adaptNumTwo(now.getHours())}:${adaptNumTwo(now.getMinutes())}:${adaptNumTwo(now.getSeconds())}.${adaptZerosNum(now.getMilliseconds(), 3)}Z`),
                    inactivated_by: data.type.toString() === 'ACTIVE' ? null : (user.inactivated_by ?? data.system_subscription_user_moderator_id)
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
                if(errors.get(system_subscription_user_field_id) === 404) {
                    errors.set(system_subscription_user_field_id, 'User not found!');
                }
            }
        }

        return {
            data: user,
            errors: errors
        }
    }

    async changeUserPassword({ system_subscription_user_id, current_password, new_password }: {system_subscription_user_id: string} & ChangePasswordDto, prisma?: TransactionPrisma) {
        const isPosibleTransaction = !prisma;
        let warning: string | undefined = undefined;

        if(isPosibleTransaction) {
            prisma = await this.prisma.beginTransaction();
        }

        try {
            let user: system_subscription_user = await prisma.system_subscription_user.findUnique({where: {id: system_subscription_user_id}});

            if(!user) {
                throw 404;
            }

            if(!user || !compareSync(current_password, user.password)) {
                throw new UnauthorizedException();
            }

            user = await prisma.system_subscription_user.update({
                data: {
                    password: hashSync(new_password, 10)
                },
                where: {
                    id: user.id
                }
            });

            const emails = await this.entityService.getEntityEmails(user.entity_id),
                completeUser = await this.getUserEntityById({ id: user.id });

            if(emails.length < 1) {
                warning = 'The user does not have a registered email to notify them that their password has been reset.';
            } else {

                const result = await this.mailerService.sendMail({
                    recipients: ['nolascomalave@hotmail.com', 'proheredes@gmail.com'],
                    subject: 'Password Changed',
                    html: renderString(changePasswordTemplate, { name: completeUser.name })
                });
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

    async resetUserPassword({ id, sendEmail = false }: { id: string, sendEmail?: boolean }, prisma?: TransactionPrisma) {
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
                const emails = await this.entityService.getEntityEmails(user.entity_id),
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