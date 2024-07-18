import { Injectable } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService, PrismaTransactionOrService, TransactionPrisma } from '../../prisma.service';
import { Prisma, PrismaClient, entity, entity_name, entity_name_by_entity } from '@prisma/client';
// import getBelongingSystemDto from './dto/getBelonginSystemDto.dto';
import HandlerErrors from '../../util/HandlerErrors';

// utils:
import {
    validateId,
    validateName,
    validateCuantity,
    validateSimpleText,
} from '../../util/validators';

type ProcessNameType = {
    id_entity?: number;
    id_entity_name: number;
    id_entity_name_type: number;
    name: any;
    created_by: number;
    order?: number;
    name_type?: string;
} | any;

type GetBelonginSystemType = {
    NotEqualEntityID?: boolean;
    id_entity?: number;
    id_entity_name?: number;
    id_entity_name_type?: number;
    id_system_subscription?: number;
} | any;

type ChangeNameOrderParams = {
    id_entity_name: number;
    id_entity: number;
    order: number;
    id_entity_name_type: number;
    name_type?: string;
    // type: entity_name_by_entity_type;
};

type ProcessMultipleNamesType = {
    id_entity?: number;
    names: string[];
    id_entity_name_type?: number;
    created_by: number;
    name_type?: string;
    initialIndex: number;
} | any;

@Injectable()
export class EntityNameService {
    constructor(private prisma: PrismaService) {}

    async processName(params: ProcessNameType, prisma?: PrismaTransactionOrService) {
        const errors = new HandlerErrors();

        let isPosibleTransaction = false,
            name: entity_name | null = null,
            oldName: entity_name | null = null;

        if(!prisma) {
            isPosibleTransaction = true;
        }

        if(typeof params !== 'object' || Array.isArray(params)) {
            errors.set('params', 'The name parameter must be defined as a JSON object!');

            return {
                errors,
                data: null
            };
        } else {
            params.name_type ??= 'name';

            errors.set('id_entity', validateId(params.id_entity, params.name_type + ' entity ID'));
            errors.set('created_by', validateId(params.created_by, params.name_type + ' processing user ID', true));
            errors.set('id_entity_name_type', validateId(params.id_entity_name_type, params.name_type + ' Type Name ID', true));
            errors.set('id_entity_name', validateId(params.id_entity_name, params.name_type + ' ID'));
            // errors.set('name', validateName(params.id_entity_name, true));

            if(!errors.exists('id_entity') && (params.id_entity ?? null) !== null) {
                errors.set('order', validateCuantity({
                    num: params.order,
                    name: params.name_type + ' order',
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
                    user = (params.created_by ?? null) === null ? null : await prisma.system_subscription_user.findUnique({ where: { id: params.created_by } }),
                    ent_name_type = await prisma.entity_name_type.findUnique({where: {id: params.id_entity_name_type}});
                let name_by_entity: entity_name_by_entity | null = null;

                if(!ent_name_type) {
                    errors.set('name_by_entity', params.name_type + ' type Name not found!');
                } else {
                    // errors.set(params.name_type, validateName(params.name, ent_name_type.type, true));

                    // if(!errors.exists(params.name_type)) {
                        if(params.id_entity_name) {
                            name = await prisma.entity_name.findUnique({ where: { id: params.id_entity_name } });

                            if(!name) {
                                errors.set('id_entity_name', params.name_type + ' not found!');
                            }
                        } else {
                            name = await prisma.entity_name.findUnique({ where: { name: params.name.toString().trim().toLowerCase() } });
                        }
                    // }
                }

                if(params.id_entity && !entity) {
                    errors.set('id_entity', params.name_type + ' entity not found!');
                } else if(entity && ent_name_type) {
                    errors.set(params.name_type, (entity.is_natural && (['name', 'surname']).includes(ent_name_type.type.toLowerCase())) ? validateName(params.name, params.name_type, Number(params.order) === 1) : validateSimpleText(params.name, params.name_type, 2, 250, Number(params.order) === 1))
                }

                if(!user) {
                    errors.set('created_by', params.name_type + ' processing user not found!');
                }

                // Vefifying if the name is used by another entity:
                /* if(user && ent_name_type && entity && name && (params.order ?? null) !== null && params.order == 1) {
                    const exisingNameByEntity = await this.getBelongingSystem({
                        id_entity: entity.id,
                        id_system_subscription: user.id_system_subscription,
                        id_entity_name: name.id,
                        id_entity_name_type: ent_name_type.id,
                        NotEqualEntityID: true
                    }, prisma);

                    if(exisingNameByEntity) {
                        errors.set('id_entity_email', 'Name already exists!');
                    }
                } */

                if(errors.existsErrors()) {
                    throw errors;
                }

                /* if(entity && name) {
                    name_by_entity = await prisma.entity_name_by_entity.findUnique({
                        where: {
                            id_entity_id_entity_name: {
                                id_entity: entity.id,
                                id_entity_name: name.id
                            }
                        }
                    });
                } */

                const existingName: entity_name | null = await prisma.entity_name.findFirst({
                    where: {
                        name: params.name.toString().trim().toLowerCase(),

                        ...(
                            !name ?
                                {}
                            :
                                {
                                    NOT: {
                                        id: name.id
                                    }
                                }
                        )
                    }
                });

                if(!name) {
                    name = await prisma.entity_name.create({
                        data: {
                            name: params.name,
                            created_by: user?.id ?? 0
                        }
                    });
                } else if(existingName) { // Solo pasa por aquí si name es el registro encontrado por la variable params.id_entity_name y existe un teléfono que tiene el número buscado y es diferente del teléfono a editar.
                    oldName = name;
                    name = existingName;
                } else if(params.id_entity_name) {
                    name = await prisma.entity_name.update({
                        where: {
                            id: name.id
                        },
                        data: {
                            name: params.name.trim().toLowerCase()
                        }
                    });
                }

                if(entity) {
                    name_by_entity = await prisma.entity_name_by_entity.findUnique({
                        where: {
                            id_entity_id_entity_name_id_entity_name_type: {
                                id_entity_name_type: (ent_name_type?.id ?? 0),
                                id_entity: entity.id,
                                id_entity_name: name.id
                            }
                        }
                    });

                    if(!name_by_entity) {
                        name_by_entity = await prisma.entity_name_by_entity.create({
                            data: {
                                id_entity: entity.id,
                                id_entity_name: name.id,
                                id_entity_name_type: (ent_name_type?.id ?? 0),
                                created_by: user?.id ?? 0,
                                order: params.order ?? 0
                            }
                        });
                    } else {
                        name_by_entity = await prisma.entity_name_by_entity.update({
                            where: {
                                id_entity_id_entity_name_id_entity_name_type: {
                                    id_entity_name_type: (ent_name_type?.id ?? 0),
                                    id_entity: entity.id,
                                    id_entity_name: name.id
                                }
                            },
                            data: {
                                annulled_by: null,
                                annulled_at: null,
                                order: params.order ?? 0
                            }
                        });
                    }

                    name = await prisma.entity_name.update({
                        where: {
                            id: name.id
                        },
                        data: {
                            annulled_at: null,
                            annulled_by: null
                        }
                    });

                    if(oldName) {
                        const name_by_entity2 = await prisma.entity_name_by_entity.findUnique({
                            where: {
                                id_entity_id_entity_name_id_entity_name_type: {
                                    id_entity_name_type: (ent_name_type?.id ?? 0),
                                    id_entity: entity.id,
                                    id_entity_name: oldName.id
                                }
                            }
                        });

                        if(name_by_entity2 && !name_by_entity2.annulled_at) {
                            await prisma.entity_name_by_entity.update({
                                where: {
                                    id_entity_id_entity_name_id_entity_name_type: {
                                        id_entity_name_type: (ent_name_type?.id ?? 0),
                                        id_entity: entity.id,
                                        id_entity_name: oldName.id
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

                    const changedNameOrder = await this.changeNameOrder({
                        id_entity_name_type: (ent_name_type?.id ?? 0),
                        id_entity: entity.id,
                        id_entity_name: name.id,
                        order: params.order ?? 0,
                        name_type: params.name_type
                    }, prisma);

                    if(changedNameOrder.errors.existsErrors()) {
                        errors.merege(changedNameOrder.errors);
                        throw errors;
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
            data: errors.existsErrors() ? null : name
        };
    }

    async processMultipleNames(params: ProcessMultipleNamesType, prisma?: PrismaTransactionOrService) {
        const errors = new HandlerErrors();

        let isPosibleTransaction = false,
            names: entity_name[] = [],
            initialIndex = 0;

        if(!prisma) {
            isPosibleTransaction = true;
        }

        if(typeof params !== 'object' || Array.isArray(params)) {
            errors.set('params', 'The names parameter must be defined as a JSON object!');

            return {
                errors,
                data: null
            };
        } else {
            params.name_type ??= 'names';
            initialIndex = params.initialIndex ?? initialIndex;

            errors.set('id_entity', validateId(params.id_entity, params.name_type + ' entity ID'));
            errors.set('id_entity_name_type', validateId(params.id_entity_name_type, params.name_type + ' Type Name ID', true));
            errors.set('created_by', validateId(params.created_by, params.name_type + ' processing user ID', true));

            if(!Array.isArray(params.names)) {
                errors.set(params.name_type, params.name_type + ' must be an array!');
            } else if(params.names.length < 1) {
                errors.set(params.name_type, params.name_type + ' parameter must contain at least one item!');
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
                    user = (params.created_by ?? null) === null ? null : await prisma.system_subscription_user.findUnique({ where: { id: params.created_by } }),
                    ent_name_type = await prisma.entity_name_type.findUnique({where: {id: params.id_entity_name_type}});

                if(!ent_name_type) {
                    errors.set('name_by_entity', params.name_type + ' Type Name not found!');
                }

                if(params.id_entity && !entity) {
                    errors.set('id_entity', params.name_type + ' entity not found!');
                }

                if(!user) {
                    errors.set('created_by', params.name_type + ' processing user not found!');
                }

                if(!errors.existsErrors()) {
                    for(let i = 0; i < params.names.length; i++) {
                        const nameResult = await this.processName({
                            id_entity: params.id_entity,
                            id_entity_name_type: params.id_entity_name_type,
                            name: params.names[i],
                            created_by: params.created_by,
                            order: i + 1,
                            name_type: params.name_type + '.' + (initialIndex + i)
                        }, prisma);

                        if(nameResult.errors.existsErrors()) {
                            errors.pushErrorInArray(params.name_type, nameResult.errors.getErrors());
                        } else if(nameResult.data) {
                            names.push(nameResult.data);
                        }
                    }

                    if(errors.existsErrors()) {
                        throw errors;
                    }

                    if(entity && names.length > 0) {
                        const updateds = await prisma.entity_name_by_entity.updateMany({
                            data: {
                                annulled_by: user?.id,
                                annulled_at: new Date()
                            },
                            where: {
                                id_entity: entity?.id,
                                id_entity_name_type: ent_name_type.id,
                                NOT: {
                                    id_entity_name: {
                                        in: names.map(el => el.id)
                                    }
                                }
                            }
                        });

                        const changedNameOrder = await this.changeNameOrder({
                            id_entity_name_type: (ent_name_type?.id ?? 0),
                            id_entity: (entity?.id ?? 0),
                            id_entity_name: names[0].id,
                            order: params.order ?? 0,
                            name_type: params.name_type + '.0'
                        }, prisma);

                        if(changedNameOrder.errors.existsErrors()) {
                            errors.merege(changedNameOrder.errors);
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
            data: errors.existsErrors() ? null : names
        };
    }

    async changeNameOrder(params: ChangeNameOrderParams, prisma?: Prisma.TransactionClient | PrismaClient | TransactionPrisma) {
        const errors = new HandlerErrors();

        let name: entity_name | null = null,
            ent: entity | null = null,
            name_by_ent: entity_name_by_entity | null = null;

        let isPosibleTransaction = false;

        params.name_type ??= 'name';

        if(!prisma) {
            isPosibleTransaction = true;
        }

        try {
            prisma ??= await this.prisma.beginTransaction();

            try {
                name = await prisma.entity_name.findUnique({
                    where: {
                        id: params.id_entity_name
                    }
                });

                ent = await prisma.entity.findUnique({
                    where: {
                        id: params.id_entity
                    }
                });

                name_by_ent = !(ent && name) ? null : await prisma.entity_name_by_entity.findFirst({
                    where: {
                        id_entity: ent.id,
                        id_entity_name: name.id,
                        id_entity_name_type: params.id_entity_name_type
                    }
                });

                if(!name) {
                    errors.set(params.name_type, params.name_type + ' not found!');
                }

                if(!ent) {
                    errors.set('entity', params.name_type + ' entity not found!');
                }

                if(ent && name && !name_by_ent) {
                    errors.set(params.name_type, params.name_type + ' does not belong to the entity!');
                }

                if(errors.existsErrors() || !ent || !name || !name_by_ent) {
                    throw errors;
                }

                await prisma.$queryRawUnsafe(`UPDATE entity_name_by_entity ne
                INNER JOIN entity_name_type ent
                    ON ent.id = ne.id_entity_name_type
                INNER JOIN (
                    SELECT
                        ne.id_entity,
                        ne.id_entity_name,
                        -- ent.type,
                        ne.id_entity_name_type,
                        ROW_NUMBER() OVER(PARTITION BY ne.id_entity, ent.type ORDER BY CONVERT(CONCAT(IF(ne.id_entity = ${ent.id} AND ne.id_entity_name = ${name.id}, ${params.order}, ne.order), '.', CONCAT(IF(ne.id_entity = ${ent.id} AND ne.id_entity_name = ${name.id}, 0, 1))), DECIMAL(18, 1)) ASC) AS real_order
                    FROM entity_name_by_entity ne
                    INNER JOIN entity_name_type ent
                        ON ent.id = ne.id_entity_name_type
                    WHERE COALESCE(ne.annulled_at, ent.annulled_at) IS NULL
                        AND ne.id_entity = ${ent.id}
                        AND ent.id = '${name_by_ent.id_entity_name_type}'
                ) ne_order
                    ON ne_order.id_entity = ne.id_entity
                    AND ne_order.id_entity_name = ne.id_entity_name
                    AND ne_order.id_entity_name_type = ent.type
                SET
                    \`order\` = ne_order.real_order`);

                const maxNotNullOrder = await prisma.entity_name_by_entity.aggregate({
                    _max: {
                        order: true,
                    },

                    where: {
                        id_entity: ent.id,
                        id_entity_name_type: params.id_entity_name_type,
                        NOT: {
                            annulled_at: null
                        }
                    }
                });

                await prisma.$queryRawUnsafe(`UPDATE entity_name_by_entity ne
                INNER JOIN entity_name_type ent
                    ON ent.id = ne.id_entity_name_type
                INNER JOIN (
                    SELECT
                        ne.id_entity,
                        ne.id_entity_name,
                        -- ent.type,
                        ne.id_entity_name_type,
                        ROW_NUMBER() OVER(PARTITION BY ne.id_entity, ent.type ORDER BY CONVERT(CONCAT(IF(ne.id_entity = ${ent.id} AND ne.id_entity_name = ${name.id}, ${params.order}, ne.order), '.', CONCAT(IF(ne.id_entity = ${ent.id} AND ne.id_entity_name = ${name.id}, 0, 1))), DECIMAL(18, 1)) ASC) AS real_order
                    FROM entity_name_by_entity ne
                    INNER JOIN entity_name_type ent
                        ON ent.id = ne.id_entity_name_type
                    WHERE COALESCE(ne.annulled_at, ent.annulled_at) IS NOT NULL
                        AND ne.id_entity = ${ent.id}
                        AND ent.id = '${name_by_ent.id_entity_name_type}'
                ) ne_order
                    ON ne_order.id_entity = ne.id_entity
                    AND ne_order.id_entity_name = ne.id_entity_name
                    AND ne_order.id_entity_name_type = ent.type
                SET
                    \`order\` = (ne_order.real_order + ${maxNotNullOrder._max.order ?? 0})`);

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
            errors: errors,
            data: {
                entity: ent,
                entity_name: name,
                entity_name_by_entity: name_by_ent
            }
        };
    }

    async getBelongingSystem(params: GetBelonginSystemType, prisma: Prisma.TransactionClient | PrismaClient | TransactionPrisma = this.prisma) {
        let AND: string[] | string = [];

        if('id_entity' in params) {
            AND.push(`ent.id ${params.NotEqualEntityID === true ? '<>' : '='} ${params.id_entity}`);
        }

        if('id_entity_name_type' in params) {
            AND.push(`ene.id_entity_name_type = ${params.id_entity_name_type}`);
        }

        if('id_entity_name' in params) {
            AND.push(`en.id = ${params.id_entity_name}`);
        }

        if('id_system_subscription' in params) {
            AND.push(`ssu.id_system_subscription = ${params.id_system_subscription}`);
        }

        AND = AND.length < 1 ? '' : `AND ${AND.join("\nAND ")}`;

        const sql = `SELECT
            en.*
        FROM entity_name en
        INNER JOIN entity_name_by_entity ene
            ON ene.id_entity_name = en.id
        INNER JOIN entity ent
            ON ent.id = ene.id_entity
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
        WHERE COALESCE(ent.annulled_at, ene.annulled_at) IS NULL
            AND ene.order = 1
            ${AND}`;

        const result: entity_name[] = await prisma.$queryRawUnsafe(sql) ?? [];

        return result.length < 1 ? null : result[0];
    }
}