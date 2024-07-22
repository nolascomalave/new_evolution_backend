import { Prisma, PrismaClient, entity, entity_email, entity_email_by_entity } from "@prisma/client";
import { PrismaService, TransactionPrisma } from '../../prisma.service';

// utils:
import {
    validateId,
    validateEmail,
    validateCuantity
} from '../../util/validators';
// import { extractNumberInText, destilde } from "../util/formats";
import HandlerErrors from "../../util/HandlerErrors";

type ProcessEmailType = {
    id_entity?: number;
    id_entity_email: number;
    email: any;
    created_by: number;
    order?: number;
    name?: string;
} | any;

type ProcessMultipleEmailsType = {
    id_entity?: number;
    emails: string[];
    order: number;
    created_by: number;
    name?: string;
} | any;

export type ChangeEmailOrderType = {
    id_entity_email: number;
    id_entity: number;
    order: number;
    name?: string;
} | any;

type GetBelongingSystemType = {
    NotEqualEntityID?: boolean;
    id_entity?: number;
    id_entity_email?: number;
    id_system_subscription?: number;
}

export class EntityEmailService {
    constructor(private prisma: PrismaService) {}

    async processEmail(params: ProcessEmailType, prisma?: Prisma.TransactionClient | PrismaClient | TransactionPrisma) {
        const errors = new HandlerErrors();

        let isPosibleTransaction = false,
            email: entity_email | null = null,
            oldEmail: entity_email | null = null;

        if(!prisma) {
            isPosibleTransaction = true;
        }

        if(typeof params !== 'object' || Array.isArray(params)) {
            errors.set('params', 'The Email parameter must be defined as a JSON object!');

            return {
                errors,
                data: null
            };
        } else {
            params.name ??= 'email';

            errors.set('id_entity', validateId(params.id_entity, params.name + ' entity ID'));
            errors.set('created_by', validateId(params.created_by, params.name + ' processing user ID', true));
            errors.set('id_entity_email', validateId(params.id_entity_email, params.name + ' ID'));
            errors.set(params.name, validateEmail(params.email, params.name, true));

            if(!errors.exists('id_entity') && (params.id_entity ?? null) !== null) {
                errors.set('order', validateCuantity({
                    num: params.order,
                    name: params.name + ' order',
                    min: 0,
                    int: true,
                    required: true
                }));
            }
        }

        if(errors.existsErrors()) {
            return {
                errors,
                data: null
            };
        }

        try {
            prisma ??= await this.prisma.beginTransaction();

            try {
                const entity = (params.id_entity ?? null) === null ? null : await prisma.entity.findUnique({ where: { id: params.id_entity } }),
                    user = (params.created_by ?? null) === null ? null : await prisma.system_subscription_user.findUnique({ where: { id: params.created_by } });
                let email_by_entity: entity_email_by_entity | null = null;

                if(params.id_entity_email) {
                    email = await prisma.entity_email.findUnique({ where: { id: params.id_entity_email } });

                    if(!email) {
                        errors.set('id_entity_email', params.name + ' not found!');
                    }
                } else {
                    email = await prisma.entity_email.findUnique({ where: { email: params.email.trim().toLowerCase() } });
                }

                if(params.id_entity && !entity) {
                    errors.set('id_entity', params.name + ' entity not found!');
                }

                if(!user) {
                    errors.set('created_by', params.name + ' processing user not found!');
                }

                if(user && entity && email && (params.order ?? null) !== null && params.order == 1) {
                    const exisingEmailByEntity = await this.getBelongingSystem({
                        id_entity: entity.id,
                        id_system_subscription: user.id_system_subscription,
                        id_entity_email: email.id,
                        NotEqualEntityID: true
                    }, prisma);

                    if(exisingEmailByEntity) {
                        errors.set('id_entity_email', params.name + ' already exists for another entity as principal!');
                    }
                }

                if(errors.existsErrors()) {
                    throw errors;
                }

                /* if(entity && email) {
                    email_by_entity = await prisma.entity_email_by_entity.findUnique({
                        where: {
                            id_entity_id_entity_email: {
                                id_entity: entity.id,
                                id_entity_email: email.id
                            }
                        }
                    });
                } */

                const existingEmail: entity_email | null = await prisma.entity_email.findFirst({
                    where: {
                        email: params.email.toString().trim().toLowerCase(),

                        ...(
                            !email ?
                                {}
                            :
                                {
                                    NOT: {
                                        id: email.id
                                    }
                                }
                        )
                    }
                });

                if(!email) {
                    email = await prisma.entity_email.create({
                        data: {
                            email: params.email,
                            created_by: user?.id ?? 0
                        }
                    });
                } else if(existingEmail) { // Solo pasa por aquí si email es el registro encontrado por la variable params.id_entity_email y existe un registro que tiene el correo electrónico buscado y es diferente del correo a editar.
                    oldEmail = email;
                    email = existingEmail;
                } else if(params.id_entity_email) {
                    email = await prisma.entity_email.update({
                        where: {
                            id: email.id
                        },
                        data: {
                            email: params.email.trim().toLowerCase()
                        }
                    });
                }

                if(entity) {
                    email_by_entity = await prisma.entity_email_by_entity.findUnique({
                        where: {
                            id_entity_id_entity_email: {
                                id_entity: entity.id,
                                id_entity_email: email.id
                            }
                        }
                    });

                    if(!email_by_entity) {
                        email_by_entity = await prisma.entity_email_by_entity.create({
                            data: {
                                id_entity: entity.id,
                                id_entity_email: email.id,
                                created_by: user?.id ?? 0,
                                order: params.order ?? 0
                            }
                        });
                    } else {
                        email_by_entity = await prisma.entity_email_by_entity.update({
                            where: {
                                id_entity_id_entity_email: {
                                    id_entity: entity.id,
                                    id_entity_email: email.id
                                }
                            },
                            data: {
                                annulled_by: null,
                                annulled_at: null,
                                order: params.order ?? 0
                            }
                        });
                    }

                    email = await prisma.entity_email.update({
                        where: {
                            id: email.id
                        },
                        data: {
                            annulled_at: null,
                            annulled_by: null
                        }
                    });

                    if(oldEmail) {
                        const email_by_entity2 = await prisma.entity_email_by_entity.findUnique({
                            where: {
                                id_entity_id_entity_email: {
                                    id_entity: entity.id,
                                    id_entity_email: oldEmail.id
                                }
                            }
                        });

                        if(email_by_entity2 && !email_by_entity2.annulled_at) {
                            await prisma.entity_email_by_entity.update({
                                where: {
                                    id_entity_id_entity_email: {
                                        id_entity: entity.id,
                                        id_entity_email: oldEmail.id
                                    }
                                },
                                data: {
                                    annulled_by: user?.id ?? 0,
                                    annulled_at: new Date(),
                                    order: params.order ?? 0
                                }
                            });
                        }
                    }

                    if(entity) {
                        const changedEmailOrder = await this.changeEmailOrder({
                            id_entity: entity.id,
                            id_entity_email: email.id,
                            order: params.order ?? 0,
                            name: params.name
                        }, prisma);

                        if(changedEmailOrder.errors.existsErrors()) {
                            errors.merege(changedEmailOrder.errors);
                            throw errors;
                        }
                    }
                }

                if(isPosibleTransaction && 'commit' in prisma) {
                    await prisma.commit();
                }
            } catch(e: any) {
                if(isPosibleTransaction && 'commit' in prisma) {
                    await prisma.rollback();
                }

                if(!(e instanceof HandlerErrors)) {
                    console.log(e);
                    errors.set('server', 'An unexpected error has occurred!');
                }
            }
        } catch(e: any) {
            console.log(e);
            errors.set('server', 'An unexpected error has occurred!');
        }

        return {
            errors,
            data: errors.existsErrors() ? null : email
        };
    }

    async processMultipleEmails(params: ProcessMultipleEmailsType, prisma?: Prisma.TransactionClient | PrismaClient | TransactionPrisma) {
        const errors = new HandlerErrors();

        let isPosibleTransaction = false,
            emails: entity_email[] = [];

        if(!prisma) {
            isPosibleTransaction = true;
        }

        if(typeof params !== 'object' || Array.isArray(params)) {
            errors.set('params', 'The Emails parameter must be defined as a JSON object!');

            return {
                errors,
                data: null
            };
        } else {
            params.name ??= 'emails';

            errors.set('id_entity', validateId(params.id_entity, params.name + ' entity ID'));
            errors.set('created_by', validateId(params.created_by, params.name + ' processing user ID', true));

            if(!Array.isArray(params.emails)) {
                errors.set(params.name, params.name + ' must be an array!');
            } else if(params.emails.length < 1) {
                errors.set(params.name, params.name + ' parameter must contain at least one item!');
            }
        }

        if(errors.existsErrors()) {
            return {
                errors,
                data: null
            };
        }

        try {
            prisma ??= await this.prisma.beginTransaction();

            try {
                const entity = (params.id_entity ?? null) === null ? null : await prisma.entity.findUnique({ where: { id: params.id_entity } }),
                    user = (params.created_by ?? null) === null ? null : await prisma.system_subscription_user.findUnique({ where: { id: params.created_by } });

                if(params.id_entity && !entity) {
                    errors.set('id_entity', params.name + ' entity not found!');
                }

                if(!user) {
                    errors.set('created_by', params.name + ' processing user not found!');
                }

                if(!errors.existsErrors()) {
                    for(let i = 0; i < params.emails.length; i++) {
                        const emailResult = await this.processEmail({
                            id_entity: params.id_entity,
                            email: params.emails[i],
                            created_by: params.created_by,
                            order: i + 1,
                            name: params.name.concat('.' + i)
                        }, prisma);

                        if(emailResult.errors.existsErrors()) {
                            errors.pushErrorInArray('emails', emailResult.errors.getErrors());
                        } else if(emailResult.data) {
                            emails.push(emailResult.data);
                        }
                    }

                    if(errors.existsErrors()) {
                        throw errors;
                    }

                    if(entity && emails.length > 0) {
                        const updateds = await prisma.entity_email_by_entity.updateMany({
                            data: {
                                annulled_by: user?.id,
                                annulled_at: new Date()
                            },
                            where: {
                                id_entity: entity?.id,
                                NOT: {
                                    id_entity_email: {
                                        in: emails.map(el => el.id)
                                    }
                                }
                            }
                        });

                        const changedEmailOrder = await this.changeEmailOrder({
                            id_entity: entity?.id,
                            id_entity_email: emails[0].id,
                            order: 1,
                            name: params.name + '.0'
                        }, prisma);

                        if(changedEmailOrder.errors.existsErrors()) {
                            errors.merege(changedEmailOrder.errors);
                            throw errors;
                        }
                    }
                } else {
                    throw errors;
                }

                if(isPosibleTransaction && 'commit' in prisma) {
                    await prisma.commit();
                }
            } catch(e: any) {
                if(isPosibleTransaction && 'commit' in prisma) {
                    await prisma.rollback();
                }

                if(!(e instanceof HandlerErrors)) {
                    console.log(e);
                    errors.set('server', 'An unexpected error has occurred!');
                }
            }
        } catch(e: any) {
            console.log(e);
            errors.set('server', 'An unexpected error has occurred!');
        }

        return {
            errors,
            data: errors.existsErrors() ? null : emails
        };
    }

    async changeEmailOrder(params: ChangeEmailOrderType, prisma?: Prisma.TransactionClient | PrismaClient | TransactionPrisma) {
        const errors = new HandlerErrors();

        let isPosibleTransaction = false,
            email: entity_email | null = null;

        if(!prisma) {
            isPosibleTransaction = true;
        }

        if(typeof params !== 'object' || Array.isArray(params)) {
            errors.set('params', 'The email order allocator parameter must be defined as a JSON object!');

            return {
                errors,
                data: null
            };
        } else {
            params.name ??= 'email';

            errors.set('id_entity', validateId(params.id_entity, params.name + ' entity ID', true));
            errors.set('id_entity_email', validateId(params.id_entity_email, params.name + ' ID', true));

            if(!errors.existsErrors()) {
                errors.set('order', validateCuantity({
                    num: params.order,
                    name: params.name + ' order',
                    min: 0,
                    int: true,
                    required: true
                }));
            }
        }

        if(errors.existsErrors()) {
            return {
                errors,
                data: null
            };
        }

        try {
            prisma ??= await this.prisma.beginTransaction();

            try {
                const entity: entity | null = await prisma.entity.findUnique({ where: { id: params.id_entity } }),
                    email_by_entity: entity_email_by_entity | null = !entity ? null : await prisma.entity_email_by_entity.findFirst({ where: { id_entity: entity.id, id_entity_email: params.id_entity_email } });

                email = await prisma.entity_email.findUnique({ where: { id: params.id_entity_email } });

                if(!email) {
                    errors.set('id_entity_email', params.name + ' not found!');
                }

                if(!entity) {
                    errors.set('id_entity', params.name + ' entity not found!');
                }

                if(entity && email && !email_by_entity) {
                    errors.set('id_entity_email', params.name + ' does not belong to the entity!');
                }

                if(errors.existsErrors()) {
                    throw errors;
                }

                await prisma.entity_email_by_entity.update({
                    data: {
                        order: params.order
                    },
                    where: {
                        id_entity_id_entity_email: {
                            id_entity: entity?.id ?? 0,
                            id_entity_email: email?.id ?? 0
                        }
                    }
                });

                await prisma.$queryRawUnsafe(`UPDATE entity_email_by_entity ee
                INNER JOIN (
                    SELECT
                        ee.id_entity,
                        ee.id_entity_email,
                        ROW_NUMBER() OVER(PARTITION BY ee.id_entity ORDER BY CONVERT(CONCAT(IF(ee.id_entity = ${entity?.id} AND ee.id_entity_email = ${email?.id}, ${params.order}, ee.order), '.', CONCAT(IF(ee.id_entity = ${entity?.id} AND ee.id_entity_email = ${email?.id}, 0, 1))), DECIMAL(18, 1)) ASC) AS real_order
                    FROM entity_email_by_entity ee
                    WHERE ee.annulled_at IS NULL
                        AND ee.id_entity = 1
                ) email
                    ON email.id_entity_email = ee.id_entity_email
                    AND email.id_entity = ee.id_entity
                SET
                    \`order\` = email.real_order`);

                const maxNotNullOrder = await prisma.entity_email_by_entity.aggregate({
                    _max: {
                        order: true,
                    },

                    where: {
                        id_entity: entity?.id,
                        NOT: {
                            annulled_at: null
                        }
                    }
                });

                await prisma.$queryRawUnsafe(`UPDATE entity_email_by_entity ee
                INNER JOIN (
                    SELECT
                        ee.id_entity,
                        ee.id_entity_email,
                        ROW_NUMBER() OVER(PARTITION BY ee.id_entity ORDER BY CONVERT(CONCAT(IF(ee.id_entity = ${entity?.id} AND ee.id_entity_email = ${email?.id}, ${params.order}, ee.order), '.', CONCAT(IF(ee.id_entity = ${entity?.id} AND ee.id_entity_email = ${email?.id}, 0, 1))), DECIMAL(18, 1)) ASC) AS real_order
                    FROM entity_email_by_entity ee
                    WHERE ee.annulled_at IS NOT NULL
                        AND ee.id_entity = 1
                ) email
                    ON email.id_entity_email = ee.id_entity_email
                    AND email.id_entity = ee.id_entity
                SET
                    \`order\` = (email.real_order + ${maxNotNullOrder._max.order ?? 0})`);

                if(isPosibleTransaction && 'commit' in prisma) {
                    await prisma.commit();
                }
            } catch(e: any) {
                if(isPosibleTransaction && 'commit' in prisma) {
                    await prisma.rollback();
                }

                if(!(e instanceof HandlerErrors)) {
                    console.log(e);
                    errors.set('server', 'An unexpected error has occurred!');
                }
            }
        } catch(e: any) {
            console.log(e);
            errors.set('server', 'An unexpected error has occurred!');
        }

        return {
            errors,
            data: errors.existsErrors() ? null : email
        };
    }

    // Funcíon que obtiene el sistema
    async getBelongingSystem(params: GetBelongingSystemType, prisma: Prisma.TransactionClient | PrismaClient | TransactionPrisma = this.prisma) {
        let AND: string[] | string = [];

        if('id_entity' in params) {
            AND.push(`ent.id ${params.NotEqualEntityID === true ? '<>' : '='} ${params.id_entity}`);
        }

        if('id_entity_email' in params) {
            AND.push(`ee.id = ${params.id_entity_email}`);
        }

        if('id_system_subscription' in params) {
            AND.push(`ssu.id_system_subscription = ${params.id_system_subscription}`);
        }

        AND = AND.length < 1 ? '' : `AND ${AND.join("\nAND ")}`;

        const sql = `SELECT
            ee.*
        FROM entity_email ee
        INNER JOIN entity_email_by_entity eee
            ON eee.id_entity_email = ee.id
        INNER JOIN entity ent
            ON ent.id = eee.id_entity
        INNER JOIN system_subscription_user_complete_info ssu
            ON (
                (
                    ent.created_by IS NOT NULL
                    AND ssu.id_system_subscription_user = ent.created_by
                )
                OR (
                    ent.created_by IS NULL
                    AND ssu.id_entity = ent.id
                )
            )
        WHERE COALESCE(ent.annulled_at, eee.annulled_at) IS NULL
            AND eee.order = 1
            ${AND}`;

        const result: entity_email[] = await prisma.$queryRawUnsafe(sql) ?? [];

        return result.length < 1 ? null : result[0];
    }
}