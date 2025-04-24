import { Prisma, PrismaClient, entity, entity_document, entity_document_category } from "@prisma/client";
import { PrismaService, TransactionPrisma } from '../../prisma.service';

// Queries:
import  { User } from '../../lib/sql_queries/system_subscription_user';

// utils:
import {
    validateId,
    validateSimpleText,
    validateCuantity
} from '../../util/validators';
// import { extractNumberInText, destilde } from "../util/formats";
import HandlerErrors from "../../util/HandlerErrors";
import { escape } from "querystring";

export type EntityDocumentCompleteInfo = {
    category: string;
    document: string;
    id: number;
    city_id: number | null;
    country_id: number | null;
    entity_id: number;
    entity_document_id: number;
    entity_document_category_id: number;
    state_id: number | null;
    order: number;
    symbol: string;
};

type ValidateEntityDocumentType = {
    document: string;
    entity_id: number;
    entity_document_category_id: number;
    entity_document_id?: number;
    country_id?: number;
    state_id?: number;
    city_id?: number;
    order: number;
    name?: string;
    validatorFn?: Function;
    /* validatorConfig?: {
        fn: (document: any, ...params: any) => any | null;
        params?: any[];
    }; */
    created_by: number;
} | any;

type ProcessMultipleDocumentsType = {
    documents: string[];
    entity_id: number;
    entity_document_category_id: number;
    country_id?: number;
    state_id?: number;
    city_id?: number;
    name?: string;
    validatorConfig?: {
        fn: (document: any, name: string, order: number, ...params: any) => any | null;
        params?: any[];
    };
    created_by: number;
} | any;

type ChangeDocumentOrderType = {
    entity_document_id: number;
    order: number;
    name?: string;
}

type GetBelongingSystemType = {
    NotEqualDocumentID?: boolean;
    entity_document_id?: number;
    document?: string;
    entity_id?: number;
    entity_document_category_id?: number;
    system_subscription_id?: number;
}

export class EntityDocumentService {
    constructor(private prisma: PrismaService) {}

    async processDocument(params: ValidateEntityDocumentType, prisma?: Prisma.TransactionClient | PrismaClient | TransactionPrisma) {
        const errors = new HandlerErrors();

        let document: entity_document | null = null,
            isPosibleTransaction = false;

        if(typeof params !== 'object' || Array.isArray(params)) {
            errors.set('params', 'The document parameter must be defined as a JSON object!');

            return {
                errors,
                data: null
            };
        } else {
            params.name ??= 'document';
            if(typeof params.validatorFn === 'function') {
                errors.set(params.name, params.validatorFn(params.document, params.name, (isNaN(params.order) || Math.round(Number(params.order)) < 1) ? 1 : Math.round(Number(params.order))));
            } else {
                errors.set(params.name, validateSimpleText(params.document, params.name, 2, 250, true));
            }

            /* if(typeof params.validatorConfig === 'function') {
                if(Array.isArray(params.validatorConfig.params)) {
                    errors.set(params.name, params.validatorConfig.fn(params.document, ...params.validatorConfig.params));
                } else {
                    errors.set(params.name, params.validatorConfig.fn(params.document));
                }
            } else {
                errors.set(params.name, validateSimpleText(params.document, 'document', 2, 250, true));
            } */

            const cityError = validateId(params.city_id, params.name + ' city ID'),
                stateError = validateId(params.state_id, params.name + ' state ID', !errors.exists('city_id') && (params.city_id ?? null) !== null);

            errors.set('entity_document_id', validateId(params.entity_document_id, params.name + ' ID'));
            errors.set('entity_document_category_id', validateId(params.entity_document_category_id, params.name + ' document type ID', true));
            /* if(params.entity_document_category ??) {

            }
            errors.set('entity_document_category_id', validateId(params.entity_document_category_id, 'Document Type ID')); */

            errors.set('country_id', validateId(params.country_id,  params.name + ' country ID', !errors.existsSome('city_id', 'state_id') && (params.city_id ?? params.state_id ?? null) !== null));
            errors.set('state_id', stateError);
            errors.set('city_id', cityError);

            errors.set('order', validateCuantity({
                num: params.order,
                name: params.name + ' order',
                min: 0,
                int: true,
                required: true
            }));
        }

        if(errors.existsErrors()) {
            return {
                errors,
                data: null
            };
        }

        if(!prisma) {
            isPosibleTransaction = true;
        }

        try {
            prisma ??= await this.prisma.beginTransaction();

            try {
                const validatedEntityResult = await this.getValidatedEntity(params.entity_id, prisma),
                    entity: entity | null = validatedEntityResult.data,
                    document_category: entity_document_category | null = await prisma.entity_document_category.findFirst({ where: { id: params.entity_document_category_id } }),
                    /* country: country | null = await prisma.country.findUnique({ where: { id: params.country_id } }),
                    state: state | null = await prisma.state.findUnique({ where: { id: params.state_id } }),
                    city: city | null = await prisma.city.findUnique({ where: { id: params.city_id } }) */
                    users: User[] = await prisma.$queryRawUnsafe(`SELECT
                        *
                    FROM system_subscription_user_complete_info
                    WHERE system_subscription_user_id = ${params.created_by}`) ?? [],
                    user: User | null = users.length > 0 ? users[0] : null;

                if(!user) {
                    errors.set('moderator', params.name + ' moderator user not found!');
                } else if((user.annulled_at ?? null) !== null) {
                    errors.set('moderator', params.name + ' moderator user is currently disabled!');
                }

                document = !params.entity_document_id ? null : await prisma.entity_document.findFirst({ where: { id: params.entity_document_id } });

                if(!document && (params.entity_document_id ?? null) !== null) {
                    errors.set('entity_document_id', params.name + ' not found!');
                }

                if(!document_category) {
                    errors.set('entity_document_category_id', params.name + ' document Type not found!');
                }

                if(!entity && (params.entity_id ?? null) !== null) {
                    errors.set('entity_id', params.name + ' entity not found!');
                }

                if(entity && user && document_category) {
                    const existingEntityWithDocument = await this.getBelongingSystem({
                        entity_document_id: document ? Number(document.id) : undefined,
                        entity_id: document? undefined : Number(entity.id),
                        NotEqualDocumentID: true,
                        system_subscription_id: user.system_subscription_id,
                        document: params.document.trim().toUpperCase(),
                        entity_document_category_id: Number(document_category.id)
                    }, prisma);

                    if(existingEntityWithDocument) {
                        if(existingEntityWithDocument.entity_id === entity.id) {
                            errors.set('entity_document_id', params.name + ' already exists for this entity!');
                        } else {
                            errors.set('entity_document_id', params.name + ' already exists for another entity!');
                        }
                    }
                }

                /* if(!country && (params.country_id ?? null) !== null) {
                    errors.set('country_id', 'Country not found!');
                }

                if(!state && (params.state_id ?? null) !== null) {
                    errors.set('state_id', 'State not found!');
                }

                if(!city && (params.city_id ?? null) !== null) {
                    errors.set('city_id', 'City not found!');
                } */

                errors.merege(validatedEntityResult.errors);

                if(!errors.existsErrors()) {
                    if(document) {
                        document = await prisma.entity_document.update({
                            where: { id: params.entity_document_id },
                            data: {
                                document: params.document.trim().toUpperCase(),
                                entity_document_category_id: !document_category ? document.entity_document_category_id : document_category.id,
                                order: params.order ?? 0
                            }
                        });
                    } else {
                        document = await prisma.entity_document.create({
                            data: {
                                document: params.document.trim().toUpperCase(),
                                entity_document_category_id: document_category?.id,
                                entity_id: entity?.id,
                                created_by: user?.id ?? 0,
                                order: params.order
                            }
                        });
                    }

                    const changeDocumentOrderResult = await this.changeDocumentOrder({
                        entity_document_id: Number(document.id),
                        order: params.order,
                        name: params.name
                    }, prisma);

                    if(changeDocumentOrderResult.errors.existsErrors()) {
                        errors.merege(changeDocumentOrderResult.errors);
                    } else {
                        document = changeDocumentOrderResult.data ?? document;
                    }
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
        } catch(e) {
            errors.set('server', 'An error occurred while querying the database!');
        }

        return {
            errors,
            data: errors.existsErrors() ? null : document
        };
    }

    async processMultipleDocuments(params: ProcessMultipleDocumentsType, prisma?: Prisma.TransactionClient | PrismaClient | TransactionPrisma) {
        const errors = new HandlerErrors(),
            documents: entity_document[] = [];

        let isPosibleTransaction = false;

        if(typeof params !== 'object' || Array.isArray(params)) {
            errors.set('params', 'The documents parameter must be defined as a JSON object!');

            return {
                errors,
                data: null
            };
        } else {
            params.name ??= 'documents';
            const cityError = validateId(params.city_id, params.name + ' city ID'),
                stateError = validateId(params.state_id, params.name + ' state ID', !errors.exists('city_id') && (params.city_id ?? null) !== null);

            if(!Array.isArray(params.documents)) {
                errors.set(params.name, params.name + ' must be defined as an array!');
            }

            errors.set('entity_document_category_id', validateId(params.entity_document_category_id, params.name + ' document type ID', (params.entity_document_id ?? null) === null));

            errors.set('country_id', validateId(params.country_id, params.name + ' country ID', !errors.existsSome('city_id', 'state_id') && (params.city_id ?? params.state_id ?? null) !== null));
            errors.set('state_id', stateError);
            errors.set('city_id', cityError);
        }

        if(errors.existsErrors()) {
            return {
                errors,
                data: null
            };
        } else if(params.documents.length < 1) {
            return {
                errors,
                data: []
            };
        }

        if(!prisma) {
            isPosibleTransaction = true;
        }

        try {
            prisma ??= await this.prisma.beginTransaction();

            try {
                const validatedEntityResult = await this.getValidatedEntity(params.entity_id, prisma),
                    entity: entity | null = validatedEntityResult.data,
                    document_category: entity_document_category | null = !params.entity_document_category_id ? null : await prisma.entity_document_category.findFirst({ where: { id: params.entity_document_category_id } }),
                    /* country: country | null = await prisma.country.findUnique({ where: { id: params.country_id } }),
                    state: state | null = await prisma.state.findUnique({ where: { id: params.state_id } }),
                    city: city | null = await prisma.city.findUnique({ where: { id: params.city_id } }) */
                    users: User[] = await prisma.$queryRawUnsafe(`SELECT
                        *
                    FROM system_subscription_user_complete_info
                    WHERE system_subscription_user_id = ${params.created_by}`) ?? [],
                    user: User | null = users.length > 0 ? users[0] : null;

                if(users.length < 1) {
                    errors.set('moderator', params.name + ' moderator user not found!');
                } else if((users[0].annulled_at ?? null) !== null) {
                    errors.set('moderator', params.name + ' moderator user is currently disabled!');
                }

                if(!document_category && (params.entity_document_category_id ?? null) !== null) {
                    errors.set('entity_document_category_id', params.name + ' document Type not found!');
                } else if((params.entity_document_category_id ?? null) === null && (params.entity_document_id ?? null) === null) {
                    errors.set('entity_document_category_id', params.name + ' document Type ID is required!');
                }

                if(!entity && (params.entity_id ?? null) !== null) {
                    errors.set('entity_id', params.name + ' entity not found!');
                }

                /* if(!country && (params.country_id ?? null) !== null) {
                    errors.set('country_id', 'Country not found!');
                }

                if(!state && (params.state_id ?? null) !== null) {
                    errors.set('state_id', 'State not found!');
                }

                if(!city && (params.city_id ?? null) !== null) {
                    errors.set('city_id', 'City not found!');
                } */

                errors.merege(validatedEntityResult.errors);

                if(!errors.existsErrors()) {
                    for(let i = 0; i < params.documents.length; i++) {
                        const document = await this.processDocument({
                            entity_id: entity?.id,
                            document: params.documents[i],
                            entity_document_category_id: document_category?.id,
                            /* country_id: params.country_id,
                            state_id: params.state_id,
                            city_id: params.city_id, */
                            validatorConfig: params.validatorConfig,
                            order: i + 1,
                            created_by: user?.id ?? 0,
                            name: params.name + '.' + i
                        }, prisma);

                        if(document.errors.existsErrors()) {
                            errors.pushErrorInArray(params.name, document.errors.getErrors());
                        } else if(document.data) {
                            documents.push(document.data);
                        }
                    }

                    if(errors.existsErrors()) {
                        throw errors;
                    }

                    if(documents.length > 0) {
                        const updateds = await prisma.entity_document.updateMany({
                            data: {
                                annulled_by: user?.id,
                                annulled_at: new Date()
                            },
                            where: {
                                entity_id: entity?.id,
                                NOT: {
                                    id: {
                                        in: documents.map(el => el.id)
                                    }
                                }
                            }
                        });

                        const changeDocumentOrderResult = await this.changeDocumentOrder({
                            entity_document_id: Number(documents[0].id),
                            order: 1,
                            name: params.name + '.' + 0
                        }, prisma);

                        if(changeDocumentOrderResult.errors.existsErrors()) {
                            errors.merege(changeDocumentOrderResult.errors);
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
        } catch(e) {
            console.log(e);
            errors.set('server', 'An error occurred while querying the database!');
        }

        return {
            errors,
            documents: errors.existsErrors() ? null : documents
        };
    }

    async getValidatedEntity(entity_id: any, prisma: Prisma.TransactionClient | PrismaClient | TransactionPrisma = this.prisma) {
        const errors = new HandlerErrors();

        let entity: entity | null = null;

        try {
            errors.set('entity_id', validateId(entity_id, 'Entity ID', true));

            if(!errors.exists('entity_id')) {
                entity = await prisma.entity.findUnique({
                    where: {
                        id: entity_id
                    }
                });

                if(!entity) {
                    errors.set('entity_id', 'Entity not found!');
                }
            }
        } catch(e: any) {
            errors.set('server', 'An error occurred while querying the database!');
        }

        return {
            errors,
            data: entity
        };
    }

    async changeDocumentOrder(params: ChangeDocumentOrderType, prisma?: Prisma.TransactionClient | PrismaClient | TransactionPrisma) {
        const errors = new HandlerErrors();

        let isPosibleTransaction = false,
            document: entity_document | null = null;

        params.name ??= 'document';

        errors.set('order', validateCuantity({
            num: params.order,
            name: params.name + ' order',
            min: 0,
            int: true,
            required: true
        }));

        if(errors.existsErrors()) {
            return {
                errors,
                data: null
            };
        }

        if(!prisma) {
            isPosibleTransaction = true;
        }

        try {
            prisma ??= await this.prisma.beginTransaction();

            try {
                document = await prisma.entity_document.findUnique({
                    where: {
                        id: params.entity_document_id
                    }
                });

                if(!document) {
                    errors.set('document_id', params.name + ' not found!');
                } else {
                    await prisma.$queryRawUnsafe(`UPDATE entity_document ed
                    inner join (
                        select
                            id,
                            entity_id,
                            ROW_NUMBER() OVER(PARTITION by entity_id ORDER BY CONVERT(CONCAT(IF(id = ${document.id}, ${params.order}, ed.order), '.', CONCAT(IF(id = ${document.id}, 0, 1))), DECIMAL(18, 1)) asc, id ASC) AS real_order
                        from entity_document ed
                        where annulled_at is null
                            and entity_id = ${document.entity_id}
                    ) dor
                        on dor.id = ed.id
                    set
                        "order" = dor.real_order`);

                    const maxNotNullOrder = await prisma.entity_document.aggregate({
                        _max: {
                            order: true,
                        },

                        where: {
                            entity_id: document.entity_id,
                            NOT: {
                                annulled_at: null
                            }
                        }
                    });

                    await prisma.$queryRawUnsafe(`UPDATE entity_document ed
                    inner join (
                        select
                            id,
                            entity_id,
                            ROW_NUMBER() OVER(PARTITION by entity_id ORDER BY CONVERT(CONCAT(IF(id = ${document.id}, ${params.order}, ed.order), '.', CONCAT(IF(id = ${document.id}, 0, 1))), DECIMAL(18, 1)) asc, id ASC) AS real_order
                        from entity_document ed
                        where annulled_at is not null
                            and entity_id = ${document.entity_id}
                    ) dor
                        on dor.id = ed.id
                    set
                        "order" = (dor.real_order + ${maxNotNullOrder._max.order ?? 0})`);
                }

                if(errors.existsErrors()) {
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
            data: errors.existsErrors() ? null : document
        };
    }

    // Funcíon que obtiene el sistema
    async getBelongingSystem(params: GetBelongingSystemType, prisma: Prisma.TransactionClient | PrismaClient | TransactionPrisma = this.prisma) {
        let AND: string[] | string = [];

        if(('entity_id' in params) && (params.entity_id ?? null) !== null) {
            AND.push(`doc.entity_id <> ${params.entity_id}`);
        }

        if(('entity_document_id' in params) && (params.entity_document_id ?? null) !== null) {
            AND.push(`doc.id ${params.NotEqualDocumentID === true ? '<>' : '='} ${params.entity_document_id}`);
        }

        if(('document' in params) && (params.document ?? null) !== null) {
            AND.push(`UPPER(doc.document) = UPPER(${escape(params.document ?? '')})`);
        }

        if(('entity_document_category_id' in params) && (params.entity_document_category_id ?? null) !== null) {
            AND.push(`doc.entity_document_category_id = ${params.entity_document_category_id}`);
        }

        if(('system_subscription_id' in params) && (params.system_subscription_id ?? null) !== null) {
            AND.push(`ssu.system_subscription_id = ${params.system_subscription_id}`);
        }

        AND = AND.length < 1 ? '' : `AND ${AND.join("\nAND ")}`;

        const sql = `SELECT
            doc.*
        FROM entity_document doc
        INNER JOIN entity ent
            ON ent.id = doc.entity_id
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
        WHERE COALESCE(doc.annulled_at, ent.annulled_at) IS NULL
            ${AND}`;

        const result: entity_document[] = await prisma.$queryRawUnsafe(sql) ?? [];

        return result.length < 1 ? null : result[0];
    }
}