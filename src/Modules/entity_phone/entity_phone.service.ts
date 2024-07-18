import { Prisma, PrismaClient, entity, entity_phone, entity_phone_by_entity } from "@prisma/client";
import { PrismaService, TransactionPrisma } from '../../prisma.service';

// utils:
import {
    validateId,
    validatePhoneNumber,
    validateCuantity
} from '../../util/validators';
// import { extractNumberInText, destilde } from "../util/formats";
import HandlerErrors from "../../util/HandlerErrors";

type ProcessPhoneType = {
    id_entity?: number;
    id_entity_phone: number;
    phone: any;
    created_by: number;
    order?: number;
    name?: string;
} | any;

type ProcessMultiplePhonesType = {
    id_entity?: number;
    phones: string[];
    created_by: number;
    name?: string;
} | any;

export type ChangePhoneOrderType = {
    id_entity_phone: number;
    id_entity: number;
    order: number;
    name?: string;
} | any;

type GetBelongingSystemType = {
    NotEqualEntityID?: boolean;
    id_entity?: number;
    id_entity_phone?: number;
    id_system_subscription?: number;
}

export class EntityPhoneService {
    constructor(private prisma: PrismaService) {}

    async processPhone(params: ProcessPhoneType, prisma?: Prisma.TransactionClient | PrismaClient | TransactionPrisma) {
        const errors = new HandlerErrors();

        let isPosibleTransaction = false,
            phone: entity_phone | null = null,
            oldPhone: entity_phone | null = null;

        if(!prisma) {
            isPosibleTransaction = true;
        }

        if(typeof params !== 'object' || Array.isArray(params)) {
            errors.set('params', 'The parameter name must be defined as a JSON object!');

            return {
                errors,
                data: null
            };
        } else {
            params.name ??= 'phone';

            errors.set('id_entity', validateId(params.id_entity, params.name + ' entity ID'));
            errors.set('created_by', validateId(params.created_by, params.name + ' processing user ID', true));
            errors.set('id_entity_phone', validateId(params.id_entity_phone, params.name + ' ID'));
            errors.set('phone', validatePhoneNumber(params.phone, params.name, true));

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
                let phone_by_entity: entity_phone_by_entity | null = null;

                if(params.id_entity_phone) {
                    phone = await prisma.entity_phone.findUnique({ where: { id: params.id_entity_phone } });

                    if(!phone) {
                        errors.set('id_entity_phone', params.name + ' not found!');
                    }
                } else {
                    phone = await prisma.entity_phone.findUnique({ where: { phone: params.phone.toString().trim().toLowerCase() } });
                }

                if(params.id_entity && !entity) {
                    errors.set('id_entity', params.name + ' entity not found!');
                }

                if(!user) {
                    errors.set('created_by', params.name + ' processing user not found!');
                }

                if(user && entity && phone && (params.order ?? null) !== null && params.order == 1) {
                    const exisingPhoneByEntity = await this.getBelongingSystem({
                        id_entity: entity.id,
                        id_system_subscription: user.id_system_subscription,
                        id_entity_phone: phone.id,
                        NotEqualEntityID: true
                    }, prisma);

                    if(exisingPhoneByEntity) {
                        errors.set('id_entity_email', params.name + ' already exists!');
                    }
                }

                if(errors.existsErrors()) {
                    throw errors;
                }

                /* if(entity && phone) {
                    phone_by_entity = await prisma.entity_phone_by_entity.findUnique({
                        where: {
                            id_entity_id_entity_phone: {
                                id_entity: entity.id,
                                id_entity_phone: phone.id
                            }
                        }
                    });
                } */

                const existingPhone: entity_phone | null = await prisma.entity_phone.findFirst({
                    where: {
                        phone: params.phone.toString().trim().toLowerCase(),

                        ...(
                            !phone ?
                                {}
                            :
                                {
                                    NOT: {
                                        id: phone.id
                                    }
                                }
                        )
                    }
                });

                if(!phone) {
                    phone = await prisma.entity_phone.create({
                        data: {
                            phone: params.phone,
                            created_by: user?.id ?? 0
                        }
                    });
                } else if(existingPhone) { // Solo pasa por aquí si phone es el registro encontrado por la variable params.id_entity_phone y existe un teléfono que tiene el número buscado y es diferente del teléfono a editar.
                    oldPhone = phone;
                    phone = existingPhone;
                } else if(params.id_entity_phone) {
                    phone = await prisma.entity_phone.update({
                        where: {
                            id: phone.id
                        },
                        data: {
                            phone: params.phone.trim().toLowerCase()
                        }
                    });
                }

                if(entity) {
                    phone_by_entity = await prisma.entity_phone_by_entity.findUnique({
                        where: {
                            id_entity_id_entity_phone: {
                                id_entity: entity.id,
                                id_entity_phone: phone.id
                            }
                        }
                    });

                    if(!phone_by_entity) {
                        phone_by_entity = await prisma.entity_phone_by_entity.create({
                            data: {
                                id_entity: entity.id,
                                id_entity_phone: phone.id,
                                created_by: user?.id ?? 0,
                                order: params.order ?? 0
                            }
                        });
                    } else {
                        phone_by_entity = await prisma.entity_phone_by_entity.update({
                            where: {
                                id_entity_id_entity_phone: {
                                    id_entity: entity.id,
                                    id_entity_phone: phone.id
                                }
                            },
                            data: {
                                annulled_by: null,
                                annulled_at: null,
                                order: params.order ?? 0
                            }
                        });
                    }

                    phone = await prisma.entity_phone.update({
                        where: {
                            id: phone.id
                        },
                        data: {
                            annulled_at: null,
                            annulled_by: null
                        }
                    });

                    if(oldPhone) {
                        const phone_by_entity2 = await prisma.entity_phone_by_entity.findUnique({
                            where: {
                                id_entity_id_entity_phone: {
                                    id_entity: entity.id,
                                    id_entity_phone: oldPhone.id
                                }
                            }
                        });

                        if(phone_by_entity2 && !phone_by_entity2.annulled_at) {
                            await prisma.entity_phone_by_entity.update({
                                where: {
                                    id_entity_id_entity_phone: {
                                        id_entity: entity.id,
                                        id_entity_phone: oldPhone.id
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
                        const changedPhoneOrder = await this.changePhoneOrder({
                            id_entity: entity.id,
                            id_entity_phone: phone.id,
                            order: params.order ?? 0,
                            name: params.name
                        }, prisma);

                        if(changedPhoneOrder.errors.existsErrors()) {
                            errors.merege(changedPhoneOrder.errors);
                            throw errors;
                        }
                    }
                }

                if(isPosibleTransaction && 'commit' in prisma) {
                    prisma.commit();
                }
            } catch(e: any) {
                if(isPosibleTransaction && 'commit' in prisma) {
                    prisma.rollback();
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
            data: errors.existsErrors() ? null : phone
        };
    }

    async processMultiplePhones(params: ProcessMultiplePhonesType, prisma?: Prisma.TransactionClient | PrismaClient | TransactionPrisma) {
        const errors = new HandlerErrors();

        let isPosibleTransaction = false,
            phones: entity_phone[] = [];

        if(!prisma) {
            isPosibleTransaction = true;
        }

        if(typeof params !== 'object' || Array.isArray(params)) {
            errors.set('params', 'The phones parameter must be defined as a JSON object!');

            return {
                errors,
                data: null
            };
        } else {
            params.name ??= 'phones';

            errors.set('id_entity', validateId(params.id_entity, params.name + ' entity ID'));
            errors.set('created_by', validateId(params.created_by, params.name + ' processing user ID', true));

            if(!Array.isArray(params.phones)) {
                errors.set(params.name, params.name + ' must be an array!');
            } else if(params.phones.length < 1) {
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
                    for(let i = 0; i < params.phones.length; i++) {
                        const phoneResult = await this.processPhone({
                            id_entity: params.id_entity,
                            phone: params.phones[i],
                            created_by: params.created_by,
                            order: i + 1,
                            name: params.name.concat('.' + i)
                        }, prisma);

                        if(phoneResult.errors.existsErrors()) {
                            errors.pushErrorInArray('phones', phoneResult.errors.getErrors());
                        } else if(phoneResult.data) {
                            phones.push(phoneResult.data);
                        }
                    }

                    if(errors.existsErrors()) {
                        throw errors;
                    }

                    if(entity && phones.length > 0) {
                        const updateds = await prisma.entity_phone_by_entity.updateMany({
                            data: {
                                annulled_by: user?.id,
                                annulled_at: new Date()
                            },
                            where: {
                                id_entity: entity?.id,
                                NOT: {
                                    id_entity_phone: {
                                        in: phones.map(el => el.id)
                                    }
                                }
                            }
                        });

                        const changedPhoneOrder = await this.changePhoneOrder({
                            id_entity: entity?.id,
                            id_entity_phone: phones[0].id,
                            order: 1,
                            name: params.name + '.0'
                        }, prisma);

                        if(changedPhoneOrder.errors.existsErrors()) {
                            errors.merege(changedPhoneOrder.errors);
                            throw errors;
                        }
                    }
                } else {
                    throw errors;
                }

                if(isPosibleTransaction && 'commit' in prisma) {
                    prisma.commit();
                }
            } catch(e: any) {
                if(isPosibleTransaction && 'commit' in prisma) {
                    prisma.rollback();
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
            data: errors.existsErrors() ? null : phones
        };
    }

    async changePhoneOrder(params: ChangePhoneOrderType, prisma?: Prisma.TransactionClient | PrismaClient | TransactionPrisma) {
        const errors = new HandlerErrors();

        let isPosibleTransaction = false,
            phone: entity_phone | null = null;

        if(!prisma) {
            isPosibleTransaction = true;
        }

        if(typeof params !== 'object' || Array.isArray(params)) {
            errors.set('params', 'The parameter parameter must be defined as a JSON object!');

            return {
                errors,
                data: null
            };
        } else {
            params.name ??= 'email';

            errors.set('id_entity', validateId(params.id_entity, params.name + ' entity ID', true));
            errors.set('id_entity_phone', validateId(params.id_entity_phone, params.name + ' phone ID', true));

            if(!errors.existsErrors()) {
                errors.set('order', validateCuantity({
                    num: params.order,
                    name: params.name +' order',
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
                    phone_by_entity: entity_phone_by_entity | null = !entity ? null : await prisma.entity_phone_by_entity.findFirst({ where: { id_entity: entity.id, id_entity_phone: params.id_entity_phone } });

                phone = await prisma.entity_phone.findUnique({ where: { id: params.id_entity_phone } });

                if(!phone) {
                    errors.set('id_entity_phone', params.name + ' not found!');
                }

                if(!entity) {
                    errors.set('id_entity', params.name + ' entity not found!');
                }

                if(entity && phone && !phone_by_entity) {
                    errors.set('id_entity_phone', params.name + ' does not belong to the entity!');
                }

                if(errors.existsErrors()) {
                    throw errors;
                }

                await prisma.entity_phone_by_entity.update({
                    data: {
                        order: params.order
                    },
                    where: {
                        id_entity_id_entity_phone: {
                            id_entity: entity?.id ?? 0,
                            id_entity_phone: phone?.id ?? 0
                        }
                    }
                });

                await prisma.$queryRawUnsafe(`UPDATE entity_phone_by_entity ee
                INNER JOIN (
                    SELECT
                        ee.id_entity,
                        ee.id_entity_phone,
                        ROW_NUMBER() OVER(PARTITION BY ee.id_entity ORDER BY CONVERT(CONCAT(IF(ee.id_entity = ${entity?.id} AND ee.id_entity_phone = ${phone?.id}, ${params.order}, ee.order), '.', CONCAT(IF(ee.id_entity = ${entity?.id} AND ee.id_entity_phone = ${phone?.id}, 0, 1))), DECIMAL(18, 1)) ASC) AS real_order
                    FROM entity_phone_by_entity ee
                    WHERE ee.annulled_at IS NULL
                        AND ee.id_entity = 1
                ) phone
                    ON phone.id_entity_phone = ee.id_entity_phone
                    AND phone.id_entity = ee.id_entity
                SET
                    \`order\` = phone.real_order`);

                const maxNotNullOrder = await prisma.entity_phone_by_entity.aggregate({
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

                await prisma.$queryRawUnsafe(`UPDATE entity_phone_by_entity ee
                INNER JOIN (
                    SELECT
                        ee.id_entity,
                        ee.id_entity_phone,
                        ROW_NUMBER() OVER(PARTITION BY ee.id_entity ORDER BY CONVERT(CONCAT(IF(ee.id_entity = ${entity?.id} AND ee.id_entity_phone = ${phone?.id}, ${params.order}, ee.order), '.', CONCAT(IF(ee.id_entity = ${entity?.id} AND ee.id_entity_phone = ${phone?.id}, 0, 1))), DECIMAL(18, 1)) ASC) AS real_order
                    FROM entity_phone_by_entity ee
                    WHERE ee.annulled_at IS NOT NULL
                        AND ee.id_entity = 1
                ) phone
                    ON phone.id_entity_phone = ee.id_entity_phone
                    AND phone.id_entity = ee.id_entity
                SET
                    \`order\` = (phone.real_order + ${maxNotNullOrder._max.order ?? 0})`);

                if(isPosibleTransaction && 'commit' in prisma) {
                    prisma.commit();
                }
            } catch(e: any) {
                if(isPosibleTransaction && 'commit' in prisma) {
                    prisma.rollback();
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
            data: errors.existsErrors() ? null : phone
        };
    }

    // Funcíon que obtiene el sistema
    async getBelongingSystem(params: GetBelongingSystemType, prisma: Prisma.TransactionClient | PrismaClient | TransactionPrisma = this.prisma) {
        let AND: string[] | string = [];

        if('id_entity' in params) {
            AND.push(`ent.id ${params.NotEqualEntityID === true ? '<>' : '='} ${params.id_entity}`);
        }

        if('id_entity_phone' in params) {
            AND.push(`ef.id = ${params.id_entity_phone}`);
        }

        if('id_system_subscription' in params) {
            AND.push(`ssu.id_system_subscription = ${params.id_system_subscription}`);
        }

        AND = AND.length < 1 ? '' : `AND ${AND.join("\nAND ")}`;

        const sql = `SELECT
            ef.*
        FROM entity_phone ef
        INNER JOIN entity_phone_by_entity efe
            ON efe.id_entity_phone = ef.id
        INNER JOIN entity ent
            ON ent.id = efe.id_entity
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
        WHERE COALESCE(ent.annulled_at, efe.annulled_at) IS NULL
            AND efe.order = 1
            ${AND}`;

        const result: entity_phone[] = await prisma.$queryRawUnsafe(sql) ?? [];

        return result.length < 1 ? null : result[0];
    }
}