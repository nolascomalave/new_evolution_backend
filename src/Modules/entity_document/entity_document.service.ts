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
    id_city: number | null;
    id_country: number | null;
    id_entity: number;
    id_entity_document: number;
    id_entity_document_category: number;
    id_state: number | null;
    order: number;
    symbol: string;
};

type ValidateEntityDocumentType = {
    document: string;
    id_entity: number;
    id_entity_document_category: number;
    id_entity_document?: number;
    id_country?: number;
    id_state?: number;
    id_city?: number;
    order: number;
    validatorFn?: Function;
    /* validatorConfig?: {
        fn: (document: any, ...params: any) => any | null;
        params?: any[];
    }; */
    created_by: number;
} | any;

type ProcessMultipleDocumentsType = {
    documents: string[];
    id_entity: number;
    id_entity_document_category: number;
    id_country?: number;
    id_state?: number;
    id_city?: number;
    validatorConfig?: {
        fn: (document: any, ...params: any) => any | null;
        params?: any[];
    };
    created_by: number;
} | any;

type ChangeDocumentOrderType = {
    id_entity_document: number;
    order: number;
}

type GetBelongingSystemType = {
    NotEqualDocumentID?: boolean;
    id_entity_document?: number;
    document?: string;
    id_entity?: number;
    id_entity_document_category?: number;
    id_system_subscription?: number;
}

export class EntityDocument {
    constructor(private prisma: PrismaService) {}

    async processDocument(params: ValidateEntityDocumentType, prisma?: Prisma.TransactionClient | PrismaClient | TransactionPrisma) {
        const errors = new HandlerErrors();

        let document: entity_document | null = null,
            isPosibleTransaction = false;

        if(typeof params !== 'object' || Array.isArray(params)) {
            errors.set('params', 'The parameter name must be defined as a JSON object!');

            return {
                errors,
                data: null
            };
        } else {
            if(typeof params.validatorFn === 'function') {
                errors.set('document', params.validatorFn(params.document, params.order));
            } else {
                errors.set('document', validateSimpleText(params.document, 'document', 2, 250, true));
            }

            /* if(typeof params.validatorConfig === 'function') {
                if(Array.isArray(params.validatorConfig.params)) {
                    errors.set('document', params.validatorConfig.fn(params.document, ...params.validatorConfig.params));
                } else {
                    errors.set('document', params.validatorConfig.fn(params.document));
                }
            } else {
                errors.set('document', validateSimpleText(params.document, 'document', 2, 250, true));
            } */

            const cityError = validateId(params.id_city, 'City ID'),
                stateError = validateId(params.id_state, 'State ID', !errors.exists('id_city') && (params.id_city ?? null) !== null);

            errors.set('id_entity_document', validateId(params.id_entity_document, 'Document ID'));
            errors.set('id_entity_document_category', validateId(params.id_entity_document_category, 'Document type ID', true));
            /* if(params.entity_document_category ??) {

            }
            errors.set('id_entity_document_category', validateId(params.id_entity_document_category, 'Document Type ID')); */

            errors.set('id_country', validateId(params.id_country, 'Country ID', !errors.existsSome('id_city', 'id_state') && (params.id_city ?? params.id_state ?? null) !== null));
            errors.set('id_state', stateError);
            errors.set('id_city', cityError);

            errors.set('order', validateCuantity({
                num: params.order,
                name: 'document order',
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
                const validatedEntityResult = await this.getValidatedEntity(params.id_entity, prisma),
                    entity: entity | null = validatedEntityResult.data,
                    document_category: entity_document_category | null = await prisma.entity_document_category.findFirst({ where: { id: params.id_entity_document_category } }),
                    /* country: country | null = await prisma.country.findUnique({ where: { id: params.id_country } }),
                    state: state | null = await prisma.state.findUnique({ where: { id: params.id_state } }),
                    city: city | null = await prisma.city.findUnique({ where: { id: params.id_city } }) */
                    users: User[] = await prisma.$queryRawUnsafe(`SELECT
                        *
                    FROM system_subscription_user_complete_info
                    WHERE id_system_subscription_user = ${params.created_by}`) ?? [],
                    user: User | null = users.length > 0 ? users[0] : null;

                if(!user) {
                    errors.set('moderator', 'Moderator user not found!');
                } else if((user.annulled_at ?? null) !== null) {
                    errors.set('moderator', 'The moderator user is currently disabled!');
                }

                document = !params.id_entity_document ? null : await prisma.entity_document.findFirst({ where: { id: params.id_entity_document } });

                if(!document && (params.id_entity_document ?? null) !== null) {
                    errors.set('id_entity_document', 'Document not found!');
                }

                if(!document_category) {
                    errors.set('id_entity_document_category', 'Document Type not found!');
                }

                if(!entity && (params.id_entity ?? null) !== null) {
                    errors.set('id_entity', 'Entity not found!');
                }

                if(entity && user && document_category) {
                    const existingEntityWithDocument = await this.getBelongingSystem({
                        id_entity_document: document ? document.id : undefined,
                        id_entity: document? undefined : entity.id,
                        NotEqualDocumentID: true,
                        id_system_subscription: user.id_system_subscription,
                        document: params.document.trim().toUpperCase(),
                        id_entity_document_category: document_category.id
                    });

                    if(existingEntityWithDocument) {
                        if(existingEntityWithDocument.id_entity === entity.id) {
                            errors.set('id_entity_document', 'The document already exists for this entity!');
                        } else {
                            errors.set('id_entity_document', 'The document already exists for another entity!');
                        }
                    }
                }

                /* if(!country && (params.id_country ?? null) !== null) {
                    errors.set('id_country', 'Country not found!');
                }

                if(!state && (params.id_state ?? null) !== null) {
                    errors.set('id_state', 'State not found!');
                }

                if(!city && (params.id_city ?? null) !== null) {
                    errors.set('id_city', 'City not found!');
                } */

                errors.merege(validatedEntityResult.errors);

                if(!errors.existsErrors()) {
                    if(document) {
                        document = await prisma.entity_document.update({
                            where: { id: params.id_entity_document },
                            data: {
                                document: params.document.trim().toUpperCase(),
                                id_entity_document_category: !document_category ? document.id_entity_document_category : document_category.id,
                                order: params.order ?? 0
                            }
                        });
                    } else {
                        document = await prisma.entity_document.create({
                            data: {
                                document: params.document.trim().toUpperCase(),
                                id_entity_document_category: document_category?.id,
                                id_entity: entity?.id,
                                created_by: user?.id ?? 0,
                                order: params.order
                            }
                        });
                    }

                    const changeDocumentOrderResult = await this.changeDocumentOrder({
                        id_entity_document: document.id,
                        order: params.order
                    }, prisma);

                    if(changeDocumentOrderResult.errors.existsErrors()) {
                        errors.merege(changeDocumentOrderResult.errors);
                    } else {
                        document = changeDocumentOrderResult.data ?? document;
                    }
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
            errors.set('params', 'The parameter name must be defined as a JSON object!');

            return {
                errors,
                data: null
            };
        } else {
            const cityError = validateId(params.id_city, 'City ID'),
                stateError = validateId(params.id_state, 'State ID', !errors.exists('id_city') && (params.id_city ?? null) !== null);

            if(!Array.isArray(params.documents)) {
                errors.set('documents', 'The documents must be defined as an array!');
            }

            errors.set('id_entity_document_category', validateId(params.id_entity_document_category, 'Document type ID', (params.id_entity_document ?? null) === null));

            errors.set('id_country', validateId(params.id_country, 'Country ID', !errors.existsSome('id_city', 'id_state') && (params.id_city ?? params.id_state ?? null) !== null));
            errors.set('id_state', stateError);
            errors.set('id_city', cityError);
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
                const validatedEntityResult = await this.getValidatedEntity(params.id_entity, prisma),
                    entity: entity | null = validatedEntityResult.data,
                    document_category: entity_document_category | null = !params.id_entity_document_category ? null : await prisma.entity_document_category.findFirst({ where: { id: params.id_entity_document_category } }),
                    /* country: country | null = await prisma.country.findUnique({ where: { id: params.id_country } }),
                    state: state | null = await prisma.state.findUnique({ where: { id: params.id_state } }),
                    city: city | null = await prisma.city.findUnique({ where: { id: params.id_city } }) */
                    users: User[] = await prisma.$queryRawUnsafe(`SELECT
                        *
                    FROM system_subscription_user_complete_info
                    WHERE id_system_subscription_user = ${params.created_by}`) ?? [],
                    user: User | null = users.length > 0 ? users[0] : null;

                if(users.length < 1) {
                    errors.set('moderator', 'Moderator user not found!');
                } else if((users[0].annulled_at ?? null) !== null) {
                    errors.set('moderator', 'The moderator user is currently disabled!');
                }

                if(!document_category && (params.id_entity_document_category ?? null) !== null) {
                    errors.set('id_entity_document_category', 'Document Type not found!');
                } else if((params.id_entity_document_category ?? null) === null && (params.id_entity_document ?? null) === null) {
                    errors.set('id_entity_document_category', 'Document Type ID is required!');
                }

                if(!entity && (params.id_entity ?? null) !== null) {
                    errors.set('id_entity', 'Entity not found!');
                }

                /* if(!country && (params.id_country ?? null) !== null) {
                    errors.set('id_country', 'Country not found!');
                }

                if(!state && (params.id_state ?? null) !== null) {
                    errors.set('id_state', 'State not found!');
                }

                if(!city && (params.id_city ?? null) !== null) {
                    errors.set('id_city', 'City not found!');
                } */

                errors.merege(validatedEntityResult.errors);

                if(!errors.existsErrors()) {
                    for(let i = 0; i < params.documents.length; i++) {
                        const document = await this.processDocument({
                            id_entity: entity?.id,
                            document: params.documents[i],
                            id_entity_document_category: document_category?.id,
                            /* id_country: params.id_country,
                            id_state: params.id_state,
                            id_city: params.id_city, */
                            validatorConfig: params.validatorConfig,
                            order: i + 1,
                            created_by: user?.id ?? 0
                        }, prisma);

                        if(document.errors.existsErrors()) {
                            errors.pushErrorInArray('documents', document.errors.getErrors());
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
                                id_entity: entity?.id,
                                NOT: {
                                    id: {
                                        in: documents.map(el => el.id)
                                    }
                                }
                            }
                        });

                        const changeDocumentOrderResult = await this.changeDocumentOrder({
                            id_entity_document: documents[0].id,
                            order: 1
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
        } catch(e) {
            console.log(e);
            errors.set('server', 'An error occurred while querying the database!');
        }

        return {
            errors,
            documents: errors.existsErrors() ? null : documents
        };
    }

    async getValidatedEntity(id_entity: any, prisma: Prisma.TransactionClient | PrismaClient | TransactionPrisma = this.prisma) {
        const errors = new HandlerErrors();

        let entity: entity | null = null;

        try {
            errors.set('id_entity', validateId(id_entity, 'Entity ID', true));

            if(!errors.exists('id_entity')) {
                entity = await prisma.entity.findUnique({
                    where: {
                        id: id_entity
                    }
                });

                if(!entity) {
                    errors.set('id_entity', 'Entity not found!');
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

        errors.set('order', validateCuantity({
            num: params.order,
            name: 'document order',
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
                        id: params.id_entity_document
                    }
                });

                if(!document) {
                    errors.set('id_document', 'Document not found!');
                } else {
                    await prisma.$queryRawUnsafe(`UPDATE entity_document ed
                    inner join (
                        select
                            id,
                            id_entity,
                            ROW_NUMBER() OVER(PARTITION by id_entity ORDER BY CONVERT(CONCAT(IF(id = ${document.id}, ${params.order}, ed.order), '.', CONCAT(IF(id = ${document.id}, 0, 1))), DECIMAL(18, 1)) asc, id ASC) AS real_order
                        from entity_document ed
                        where annulled_at is null
                            and id_entity = ${document.id_entity}
                    ) dor
                        on dor.id = ed.id
                    set
                        \`order\` = dor.real_order`);

                    const maxNotNullOrder = await prisma.entity_document.aggregate({
                        _max: {
                            order: true,
                        },

                        where: {
                            id_entity: document.id_entity,
                            NOT: {
                                annulled_at: null
                            }
                        }
                    });

                    await prisma.$queryRawUnsafe(`UPDATE entity_document ed
                    inner join (
                        select
                            id,
                            id_entity,
                            ROW_NUMBER() OVER(PARTITION by id_entity ORDER BY CONVERT(CONCAT(IF(id = ${document.id}, ${params.order}, ed.order), '.', CONCAT(IF(id = ${document.id}, 0, 1))), DECIMAL(18, 1)) asc, id ASC) AS real_order
                        from entity_document ed
                        where annulled_at is not null
                            and id_entity = ${document.id_entity}
                    ) dor
                        on dor.id = ed.id
                    set
                        \`order\` = (dor.real_order + ${maxNotNullOrder._max.order ?? 0})`);
                }

                if(errors.existsErrors()) {
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
            data: errors.existsErrors() ? null : document
        };
    }

    // Funcíon que obtiene el sistema
    async getBelongingSystem(params: GetBelongingSystemType, prisma: Prisma.TransactionClient | PrismaClient | TransactionPrisma = this.prisma) {
        let AND: string[] | string = [];

        if('id_entity' in params) {
            AND.push(`doc.id_entity = ${params.id_entity}`);
        }

        if('id_entity_document' in params) {
            AND.push(`doc.id ${params.NotEqualDocumentID === true ? '<>' : '='} ${params.id_entity_document}`);
        }

        if('document' in params) {
            AND.push(`UPPER(doc.document) = UPPER(${escape(params.document ?? '')})`);
        }

        if('id_entity_document_category' in params) {
            AND.push(`doc.id_entity_document_category = ${params.id_entity_document_category}`);
        }

        if('id_system_subscription' in params) {
            AND.push(`ssu.id_system_subscription = ${params.id_system_subscription}`);
        }

        AND = AND.length < 1 ? '' : `AND ${AND.join("\nAND ")}`;

        const sql = `SELECT
            doc.*
        FROM entity_document doc
        INNER JOIN entity ent
            ON ent.id = doc.id_entity
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
        WHERE COALESCE(doc.annulled_at, ent.annulled_at) IS NULL
            ${AND}`;

        const result: entity_document[] = await prisma.$queryRawUnsafe(sql) ?? [];

        return result.length < 1 ? null : result[0];
    }
}