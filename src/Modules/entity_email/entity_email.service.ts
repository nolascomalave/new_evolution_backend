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
    entity_id?: number;
    entity_email_id: number;
    email: any;
    created_by: number;
    order?: number;
    name?: string;
} | any;

type ProcessMultipleEmailsType = {
    entity_id?: number;
    emails: string[];
    order: number;
    created_by: number;
    name?: string;
} | any;

export type ChangeEmailOrderType = {
    entity_email_id: number;
    entity_id: number;
    order: number;
    name?: string;
} | any;

type GetBelongingSystemType = {
    NotEqualEntityID?: boolean;
    entity_id?: number;
    entity_email_id?: number;
    system_subscription_id?: number;
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

            errors.set('entity_id', validateId(params.entity_id, params.name + ' entity ID'));
            errors.set('created_by', validateId(params.created_by, params.name + ' processing user ID', true));
            errors.set('entity_email_id', validateId(params.entity_email_id, params.name + ' ID'));
            errors.set(params.name, validateEmail(params.email, params.name, true));

            if(!errors.exists('entity_id') && (params.entity_id ?? null) !== null) {
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
                const entity = (params.entity_id ?? null) === null ? null : await prisma.entity.findUnique({ where: { id: params.entity_id } }),
                    user = (params.created_by ?? null) === null ? null : await prisma.system_subscription_user.findUnique({ where: { id: params.created_by } });
                let email_by_entity: entity_email_by_entity | null = null;

                if(params.entity_email_id) {
                    email = await prisma.entity_email.findUnique({ where: { id: params.entity_email_id } });

                    if(!email) {
                        errors.set('entity_email_id', params.name + ' not found!');
                    }
                } else {
                    email = await prisma.entity_email.findUnique({ where: { email: params.email.trim().toLowerCase() } });
                }

                if(params.entity_id && !entity) {
                    errors.set('entity_id', params.name + ' entity not found!');
                }

                if(!user) {
                    errors.set('created_by', params.name + ' processing user not found!');
                }

                if(user && entity && email && (params.order ?? null) !== null && params.order == 1) {
                    const exisingEmailByEntity = await this.getBelongingSystem({
                        entity_id: Number(entity.id),
                        system_subscription_id: Number(user.system_subscription_id),
                        entity_email_id: Number(email.id),
                        NotEqualEntityID: true
                    }, prisma);

                    if(exisingEmailByEntity) {
                        errors.set('entity_email_id', params.name + ' already exists for another entity as principal!');
                    }
                }

                if(errors.existsErrors()) {
                    throw errors;
                }

                /* if(entity && email) {
                    email_by_entity = await prisma.entity_email_by_entity.findUnique({
                        where: {
                            entity_email_id_entity_id: {
                                entity_id: entity.id,
                                entity_email_id: email.id
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
                } else if(existingEmail) { // Solo pasa por aquí si email es el registro encontrado por la variable params.entity_email_id y existe un registro que tiene el correo electrónico buscado y es diferente del correo a editar.
                    oldEmail = email;
                    email = existingEmail;
                } else if(params.entity_email_id) {
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
                            entity_id_entity_email_id: {
                                entity_id: entity.id,
                                entity_email_id: email.id
                            }
                        }
                    });

                    if(!email_by_entity) {
                        email_by_entity = await prisma.entity_email_by_entity.create({
                            data: {
                                entity_id: entity.id,
                                entity_email_id: email.id,
                                created_by: user?.id ?? 0,
                                order: params.order ?? 0
                            }
                        });
                    } else {
                        email_by_entity = await prisma.entity_email_by_entity.update({
                            where: {
                                entity_id_entity_email_id: {
                                    entity_id: entity.id,
                                    entity_email_id: email.id
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
                                entity_id_entity_email_id: {
                                    entity_id: entity.id,
                                    entity_email_id: oldEmail.id
                                }
                            }
                        });

                        if(email_by_entity2 && !email_by_entity2.annulled_at) {
                            await prisma.entity_email_by_entity.update({
                                where: {
                                    entity_id_entity_email_id: {
                                        entity_id: entity.id,
                                        entity_email_id: oldEmail.id
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
                            entity_id: entity.id,
                            entity_email_id: email.id,
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

            errors.set('entity_id', validateId(params.entity_id, params.name + ' entity ID'));
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
                const entity = (params.entity_id ?? null) === null ? null : await prisma.entity.findUnique({ where: { id: params.entity_id } }),
                    user = (params.created_by ?? null) === null ? null : await prisma.system_subscription_user.findUnique({ where: { id: params.created_by } });

                if(params.entity_id && !entity) {
                    errors.set('entity_id', params.name + ' entity not found!');
                }

                if(!user) {
                    errors.set('created_by', params.name + ' processing user not found!');
                }

                if(!errors.existsErrors()) {
                    for(let i = 0; i < params.emails.length; i++) {
                        const emailResult = await this.processEmail({
                            entity_id: params.entity_id,
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
                                entity_id: entity?.id,
                                NOT: {
                                    entity_email_id: {
                                        in: emails.map(el => el.id)
                                    }
                                }
                            }
                        });

                        const changedEmailOrder = await this.changeEmailOrder({
                            entity_id: entity?.id,
                            entity_email_id: emails[0].id,
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

            errors.set('entity_id', validateId(params.entity_id, params.name + ' entity ID', true));
            errors.set('entity_email_id', validateId(params.entity_email_id, params.name + ' ID', true));

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
                const entity: entity | null = await prisma.entity.findUnique({ where: { id: params.entity_id } }),
                    email_by_entity: entity_email_by_entity | null = !entity ? null : await prisma.entity_email_by_entity.findFirst({ where: { entity_id: entity.id, entity_email_id: params.entity_email_id } });

                email = await prisma.entity_email.findUnique({ where: { id: params.entity_email_id } });

                if(!email) {
                    errors.set('entity_email_id', params.name + ' not found!');
                }

                if(!entity) {
                    errors.set('entity_id', params.name + ' entity not found!');
                }

                if(entity && email && !email_by_entity) {
                    errors.set('entity_email_id', params.name + ' does not belong to the entity!');
                }

                if(errors.existsErrors()) {
                    throw errors;
                }

                await prisma.entity_email_by_entity.update({
                    data: {
                        order: params.order
                    },
                    where: {
                        entity_id_entity_email_id: {
                            entity_id: entity?.id ?? 0,
                            entity_email_id: email?.id ?? 0
                        }
                    }
                });

                await prisma.$queryRawUnsafe(`UPDATE entity_email_by_entity ee
                INNER JOIN (
                    SELECT
                        ee.entity_id,
                        ee.entity_email_id,
                        ROW_NUMBER() OVER(PARTITION BY ee.entity_id ORDER BY CONVERT(CONCAT(IF(ee.entity_id = ${entity?.id} AND ee.entity_email_id = ${email?.id}, ${params.order}, ee.order), '.', CONCAT(IF(ee.entity_id = ${entity?.id} AND ee.entity_email_id = ${email?.id}, 0, 1))), DECIMAL(18, 1)) ASC) AS real_order
                    FROM entity_email_by_entity ee
                    WHERE ee.annulled_at IS NULL
                        AND ee.entity_id = 1
                ) email
                    ON email.entity_email_id = ee.entity_email_id
                    AND email.entity_id = ee.entity_id
                SET
                    "order" = email.real_order`);

                const maxNotNullOrder = await prisma.entity_email_by_entity.aggregate({
                    _max: {
                        order: true,
                    },

                    where: {
                        entity_id: entity?.id,
                        NOT: {
                            annulled_at: null
                        }
                    }
                });

                await prisma.$queryRawUnsafe(`UPDATE entity_email_by_entity ee
                INNER JOIN (
                    SELECT
                        ee.entity_id,
                        ee.entity_email_id,
                        ROW_NUMBER() OVER(PARTITION BY ee.entity_id ORDER BY CONVERT(CONCAT(IF(ee.entity_id = ${entity?.id} AND ee.entity_email_id = ${email?.id}, ${params.order}, ee.order), '.', CONCAT(IF(ee.entity_id = ${entity?.id} AND ee.entity_email_id = ${email?.id}, 0, 1))), DECIMAL(18, 1)) ASC) AS real_order
                    FROM entity_email_by_entity ee
                    WHERE ee.annulled_at IS NOT NULL
                        AND ee.entity_id = 1
                ) email
                    ON email.entity_email_id = ee.entity_email_id
                    AND email.entity_id = ee.entity_id
                SET
                    "order" = (email.real_order + ${maxNotNullOrder._max.order ?? 0})`);

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

        if('entity_id' in params) {
            AND.push(`ent.id ${params.NotEqualEntityID === true ? '<>' : '='} ${params.entity_id}`);
        }

        if('entity_email_id' in params) {
            AND.push(`ee.id = ${params.entity_email_id}`);
        }

        if('system_subscription_id' in params) {
            AND.push(`ssu.system_subscription_id = ${params.system_subscription_id}`);
        }

        AND = AND.length < 1 ? '' : `AND ${AND.join("\nAND ")}`;

        const sql = `SELECT
            ee.*
        FROM entity_email ee
        INNER JOIN entity_email_by_entity eee
            ON eee.entity_email_id = ee.id
        INNER JOIN entity ent
            ON ent.id = eee.entity_id
        INNER JOIN system_subscription_user_complete_info ssu
            ON (
                (
                    ent.created_by IS NOT NULL
                    AND ssu.system_subscription_user_id = ent.created_by
                )
                OR (
                    ent.created_by IS NULL
                    AND ssu.entity_id = ent.id
                )
            )
        WHERE COALESCE(ent.annulled_at, eee.annulled_at) IS NULL
            AND eee.order = 1
            ${AND}`;

        const result: entity_email[] = await prisma.$queryRawUnsafe(sql) ?? [];

        return result.length < 1 ? null : result[0];
    }
}