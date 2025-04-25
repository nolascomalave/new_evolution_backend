import { Injectable } from '@nestjs/common';
import { PrismaService, PrismaTransactionOrService } from '../../prisma.service';
import { $Enums, entity } from '@prisma/client';
import { AddOrUpdateDto } from './dto/entity.dto';
import { EntityDocumentService } from '../entity_document/entity_document.service';
import { EntityNameService } from '../entity_name/entity_name.service';
import { EntityEmailService } from '../entity_email/entity_email.service';
import { EntityPhoneService } from '../entity_phone/entity_phone.service';
import HandlerErrors from 'src/util/HandlerErrors';
import fs from 'fs';
import path from 'path';
import { validateSSN } from 'src/util/validators';
import { booleanFormat } from 'src/util/formats';
import { GetByIdDto } from './dto/entity.dto';
import { escape } from 'querystring';

export type AddOrUpdateParams = AddOrUpdateDto & {
    photo?: Express.Multer.File;
    system_subscription_user_moderator_id: string;
};

export type CompleteEntity = {
    id: number;
    entity_parent_id: string;
    document_id: string;
    is_natural: 1 | 0;
    name: string;
    gender: null | $Enums.entity_gender_enum;
    date_birth: null | string | Date;
    address: null | number;
    photo: null | string;
    created_at: number;
    created_by: string;
    updated_at: number;
    updated_by: string;
    annulled_at: number;
    annulled_by: string;
    complete_name: string;
    names_obj: string | {
        type: string,
        names: string[],
        entity_name_type_id: string
    }[];
    names: null | string;
    surnames: null | string;
    legal_name: null | string;
    business_name: null | string;
    comercial_designation: null | string;
    documents: null | {
        id: number,
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
    system_id: string;
    system_subscription_id: string;
    system_subscription_user_id: string;
}

/* type NamesTypes = {
    type: string;
    entity_name_type_id: string;
    names: string[]
};

type EntityDocumentType = {
    id: number;
    entity_id: string;
    entity_document_category_id: string;
    entity_document_id: string;
    country_id: null | number;
    state_id: null | number;
    city_id: null | number;
    order: number;
    symbol: string;
    category: string;
    document: string;
}

type EntityFullInfo = {
    id: number;
    entity_parent_id: string;
    document_id: string;
    is_natural: boolean | 1 | 0;
    system_id: string;
    system_subscription_id: string;
    system_subscription_user_id: string;
    name: 'string';
    gender: null | 'Male' | 'Female';
    date_birth: null | string | Date;
    address: null | string;
    photo: null | string;
    created_at: string | Date;
    created_by: string;
    updated_at: null | string | Date;
    updated_by: null | number;
    annulled_at: null | string | Date;
    annulled_by: null | number;
    complete_name: null | string;
    names_obj: null | string | NamesTypes[];
    names: null | string;
    surnames: null | string;
    legal_name: null | string;
    business_name: null | string;
    comercial_designation: null | string;
    documents: null | string | EntityDocumentType[];
    phones: null | string | string[];
    emails: null | string | string[];
} */

@Injectable()
export class EntityService {
    constructor(
        private prisma: PrismaService,
        private documentService: EntityDocumentService,
        private nameService: EntityNameService,
        private emailService: EntityEmailService,
        private phoneService: EntityPhoneService
    ) {}

    parseEntity(entity: CompleteEntity) {
        if(entity.documents !== null && (typeof entity.documents === 'string')) {
            entity.documents = JSON.parse(entity.documents);
        }

        if(entity.emails !== null && (typeof entity.emails === 'string')) {
            entity.emails = JSON.parse(entity.emails);
        }

        if(entity.names_obj !== null && (typeof entity.names_obj === 'string')) {
            entity.names_obj = JSON.parse(entity.names_obj);

            if(Array.isArray(entity.names_obj)) {
                entity.names_obj = entity.names_obj.map(names => {
                    names.names = Array.isArray(names.names) ? names.names : JSON.parse(names.names);
                    return names;
                });
            }
        }

        if(entity.phones !== null && (typeof entity.phones === 'string')) {
            entity.phones = JSON.parse(entity.phones);
        }

        return entity;
    }

    async getAll({ page, search, status }: { page?: number, search?: string, status?: any }) {
        let where: string[] | string = ["complete_name IS NOT NULL"];

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
                unaccent(LOWER(complete_name)) COLLATE "und-x-icu" LIKE unaccent(LOWER('%${search}%'))
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

                    where.push(`annulled_at IS NULL`);

                    /* if('Active' in status) {
                        statusCondition.push(`inactivated_at IS ${(status.Active === 'false' || status.Active === false || status.Active == 0) ? 'NOT' : ''} NULL`.replace(/ +/gi, ' '));
                    }

                    if('Inactive' in status) {
                        statusCondition.push(`inactivated_at IS ${(status.Inactive === 'false' || status.Inactive === false || status.Inactive == 0) ? '' : 'NOT'} NULL`.replace(/ +/gi, ' '));
                    } */

                    // where.push(`(${statusCondition.join("\nOR ")})`);
                }
            }
        } else {
            where.push(`COALESCE(annulled_at, annulled_at_system_subscription_user) IS NULL`);
        }

        where = where.length < 1 ? '' : ('where '.concat(where.join("\nAND ")));

        const sql = `SELECT
            *
        FROM entity_complete_info eci
        ${where}`;

        let users: CompleteEntity[] = await this.prisma.queryUnsafe(sql) ?? [];

        users = users.map(user => this.parseEntity(user));

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
        FROM entity_complete_info eci
        WHERE id = '${escape(id)}'
            ${AND}`;

        let entity: CompleteEntity | null = await this.prisma.findOneUnsafe(sql);

        if(!!entity) {
            if(entity.documents !== null && (typeof entity.documents === 'string')) {
                entity.documents = JSON.parse(entity.documents);
            }

            if(entity.emails !== null && (typeof entity.emails === 'string')) {
                entity.emails = JSON.parse(entity.emails);
            }

            if(entity.names_obj !== null && (typeof entity.names_obj === 'string')) {
                entity.names_obj = JSON.parse(entity.names_obj);

                if(Array.isArray(entity.names_obj)) {
                    entity.names_obj = entity.names_obj.map(names => {
                        names.names = Array.isArray(names.names) ? names.names : JSON.parse(names.names);
                        return names;
                    });
                }
            }

            if(entity.phones !== null && (typeof entity.phones === 'string')) {
                entity.phones = JSON.parse(entity.phones);
            }
        }

        return entity;
    }

    async addOrUpdate(addData: AddOrUpdateParams, prisma?: PrismaTransactionOrService) {
        const isPosibleTransaction = !prisma,
            errors = new HandlerErrors();

        let entity: entity,
            fullEntity: CompleteEntity | null,
            photoname: null | string = null,
            entity_folder: string,
            photopath: null | string = photoname,
            rootProjectPath: string;

        if(isPosibleTransaction) {
            prisma = await this.prisma.beginTransaction();
        }

        try {
            // --------------------------------------------------------------------------------------------------------------------------------------------
            // - Creating Entity: -------------------------------------------------------------------------------------------------------------------------
            // --------------------------------------------------------------------------------------------------------------------------------------------
            const proccessingData = {
                is_natural: addData.is_natural == true ? "1" : "0",
                gender: addData.is_natural ? $Enums.entity_gender_enum[addData.gender] : undefined,
                name: '',
                address: addData.address
            }

            if('entity_id' in addData && (addData.entity_id ?? null) !== null) {
                entity = await prisma.entity.findUnique({
                    where: {
                        id: addData.entity_id
                    }
                });

                if(!entity) {
                    errors.set('entity_id', 404);
                    throw errors;
                }

                entity = await prisma.entity.update({
                    where: {
                        id: addData.entity_id
                    },
                    data: {
                        ...proccessingData,
                        updated_by: addData.system_subscription_user_moderator_id,
                        updated_at: new Date
                    }
                });
            } else {
                entity = await prisma.entity.create({
                    data: {
                        ...proccessingData,
                        created_by: addData.system_subscription_user_moderator_id
                    }
                });
            }

            // --------------------------------------------------------------------------------------------------------------------------------------------
            // - Processing Names: ------------------------------------------------------------------------------------------------------------------------
            // --------------------------------------------------------------------------------------------------------------------------------------------
            const legal_entity_name_types = await prisma.entity_name_type.findMany({
                    where: {
                        annulled_at: null,
                        apply_to_legal: 1
                    },
                    orderBy: {
                        created_at: 'asc',
                        // id: 'asc'
                    }
                }) ?? [],
                natural_entity_name_types = await prisma.entity_name_type.findMany({
                    where: {
                        annulled_at: null,
                        apply_to_natural: 1
                    },
                    orderBy: {
                        created_at: 'asc',
                        // id: 'asc'
                    }
                }) ?? [];
            let names: any = {};

            if(legal_entity_name_types.length < 1 || natural_entity_name_types.length < 1) {
                errors.set('name_types', 'Name types not found!');
                throw errors;
            }

            addData.names.forEach((el: any) => {
                if((el ?? null) === null || typeof el !== 'string' && (typeof el !== 'object' || Array.isArray(el))) {
                    errors.set('names', 'Each name must be defined in a string or JSON format!');
                    throw errors;
                }

                const type = (typeof el === 'string' ? undefined : el.entity_name_type_id) ?? (addData?.is_natural == true ? natural_entity_name_types[0] : legal_entity_name_types[0]).id;
                const name = typeof el === 'string' ? el : el.name;

                if(!(type in names)) {
                    const name_type = [...natural_entity_name_types, ...legal_entity_name_types].find(name => name.id === type) ?? null;

                    names[type.toString()] = {
                        type: name_type === null ? null : name_type.type,
                        names: [name],
                    }
                } else {
                    names[type.toString()].names.push(name);
                }
            });

            if(Object.keys(names).length < 1) {
                errors.set('names', 'The Names parameter must contain at least one item!');
                throw errors;
            }

            const names_types = Object.keys(names),
                newNamesIDs = [];
            let currentNameIndex = 0,
                errorsInNamesProcessing = false;

            for(let i = 0; i < names_types.length; i++) {
                const namesResult = await this.nameService.processMultipleNames({
                    names: names[names_types[i]].names,
                    entity_id: entity.id,
                    entity_name_type_id: names_types[i],
                    created_by: addData.system_subscription_user_moderator_id,
                    initialIndex: currentNameIndex,
                    name_type: 'names'
                }, prisma);

                if(namesResult.errors.existsErrors()) {
                    errors.pushErrorInArray('names', namesResult.errors.getErrors());

                    if(!errorsInNamesProcessing) {
                        errorsInNamesProcessing = true;
                    }
                    // throw errors;
                } else {
                    newNamesIDs.push(...(namesResult.data.map(name => (name.id))));
                }

                currentNameIndex = currentNameIndex + names[names_types[i]].names.length;
            }

            if(!errorsInNamesProcessing) {
                /* const voidedNames = */ await prisma.entity_name_by_entity.updateMany({
                    data: {
                        annulled_by: addData.system_subscription_user_moderator_id,
                        annulled_at: new Date()
                    },
                    where: {
                        entity_id: entity.id,
                        NOT: {
                            entity_name_id: {
                                in: newNamesIDs
                            }
                        }
                    }
                });
            }


            // --------------------------------------------------------------------------------------------------------------------------------------------
            // - Processing Emails: -----------------------------------------------------------------------------------------------------------------------
            // --------------------------------------------------------------------------------------------------------------------------------------------
            let emails = [];
            const emailsResult = await this.emailService.processMultipleEmails({
                emails: addData.emails,
                entity_id: entity.id,
                created_by: addData.system_subscription_user_moderator_id,
                name: 'emails'
            }, prisma);

            if(emailsResult.errors.existsErrors()) {
                errors.merege(emailsResult.errors);
            } else if(Array.isArray(emailsResult.data)) {
                emails = emailsResult.data;
            }


            // --------------------------------------------------------------------------------------------------------------------------------------------
            // - Processing Phones: -----------------------------------------------------------------------------------------------------------------------
            // --------------------------------------------------------------------------------------------------------------------------------------------
            let phones = [];
            const phonesResult = await this.phoneService.processMultiplePhones({
                phones: addData.phones,
                entity_id: entity.id,
                created_by: addData.system_subscription_user_moderator_id
            }, prisma);

            if(phonesResult.errors.existsErrors()) {
                errors.merege(phonesResult.errors);
            } else if(Array.isArray(phonesResult.data)) {
                phones = phonesResult.data;
            }


            // --------------------------------------------------------------------------------------------------------------------------------------------
            // - Processing Documents: --------------------------------------------------------------------------------------------------------------------
            // --------------------------------------------------------------------------------------------------------------------------------------------
            let documents = [],
                errorsInDocumentsProcessing = false;
            const documentsByType: {} | {[key: number | string]: string[] | number[]} = {},
                newDocumentsIDs = [];

            for(let i = 0; i < (addData.documents ?? []).length; i++) {
                if(typeof addData.documents[i] !== 'object' || Array.isArray(addData.documents[i])) {
                    errors.pushErrorInArray('documents', `documents.${i} must be a JSON.`);
                    continue;
                }

                if((addData.documents[i].entity_document_category_id ?? null) === null) {
                    errors.pushErrorInArray('documents', `documents.${i} must be defined value for property "entity_document_category_id".`);
                    continue;
                }

                if((addData.documents[i].document ?? null) === null) {
                    errors.pushErrorInArray('documents', `documents.${i} must be defined value for property "document".`);
                    continue;
                }

                if(addData.documents[i].entity_document_category_id in documentsByType) {
                    documentsByType[addData.documents[i].entity_document_category_id].push(addData.documents[i].document);
                } else {
                    documentsByType[addData.documents[i].entity_document_category_id] = [addData.documents[i].document];
                }
            }

            if(!errors.exists('documents')) {
                for(let docs in documentsByType) {
                    const documentsResult = await this.documentService.processMultipleDocuments({
                        documents: documentsByType[docs],
                        entity_document_category_id: docs,
                        entity_id: entity.id,
                        created_by: addData.system_subscription_user_moderator_id,
                        validatorFn: (doc: string, name: string, order: number) => validateSSN(doc, name, order === 1),
                        name: 'documents'
                    }, prisma);

                    if(documentsResult.errors.existsErrors()) {
                        errors.pushErrorInArray('documents', documentsResult.errors.getErrors());

                        if(!errorsInDocumentsProcessing) {
                            errorsInDocumentsProcessing = true;
                        }
                    }  else {
                        documents.push(...documentsResult.documents);
                        newDocumentsIDs.push(...(documentsResult.documents.map(doc => (doc.id))));
                    }
                }

                if(!errorsInDocumentsProcessing) {
                    /* const voidedDocuments = */ await prisma.entity_document.updateMany({
                        data: {
                            annulled_by: addData.system_subscription_user_moderator_id,
                            annulled_at: new Date()
                        },
                        where: {
                            entity_id: entity?.id,
                            NOT: {
                                id: {
                                    in: newDocumentsIDs
                                }
                            }
                        }
                    });
                }
            }

            if(errors.existsErrors()) {
                throw 'error';
            }

            entity_folder = path.join(__dirname, `../../../public/storage/entity/entity-${entity.id}`);

            if(!!addData.photo) {
                photoname = `${addData.photo.filename}.${addData.photo.mimetype.replace(/^image\//i, '')}`;
                photopath = `${entity_folder}/${photoname}`;
                rootProjectPath = path.join(__dirname, '../../../' + addData.photo.path);

                if(!fs.existsSync(entity_folder)) {
                    fs.mkdirSync(entity_folder, { recursive: true });
                }

                fs.renameSync(rootProjectPath, photopath);
            } else if(booleanFormat(addData.removePhoto)) {
                let photo = `${entity_folder}/${entity.photo}`;
                if(('entity_id' in addData) && fs.existsSync(photo)) {
                    fs.unlinkSync(photo);
                }
            }

            fullEntity = await this.prisma.findOneUnsafe(`SELECT
                *
            FROM entity_complete_info eci
            WHERE id = '${escape(entity.id)}'`, prisma);

            if(!fullEntity) {
                errors.set('entity', 'Entity not found.');
                throw 'error';
            }

            entity = await prisma.entity.update({
                where: {
                    id: entity.id
                },
                data: {
                    document_id: (documents ?? []).length < 1 ? undefined : documents[0].id,
                    name: (entity.is_natural ? (`${fullEntity.names} ${fullEntity.surnames}`) : fullEntity.business_name).trim(),
                    photo: booleanFormat(addData.removePhoto) === true ? null : (!!addData.photo ? photoname : (('photo' in addData && addData.photo !== undefined) ? null : entity.photo))
                }
            });

            if('photo' in fullEntity) {
                fullEntity.photo = entity.photo;
            }

            if(isPosibleTransaction && ('commit' in prisma)) {
                await prisma.commit();
            }
        } catch(e: any) {
            if(isPosibleTransaction && ('rollback' in prisma)) {
                await prisma.rollback();
            }

            if(!!addData.photo && !!photopath) {
                fs.renameSync(photopath, rootProjectPath);
                if('entity_id' in addData) {
                    fs.rmdirSync(entity_folder);
                }
                // fs.mkdirSync(dirName, { recursive: true });
            }

            if(e !== 'error') {
                throw e;
            }
        }

        return {
            data: errors.existsErrors() ? null : {
                entity,
                fullEntity
            },
            errors: errors,
        };
    }

    async getEntityEmails(id: string, prisma?: PrismaTransactionOrService) {
        return await this.prisma.queryUnsafe(`SELECT
            ee.*
        FROM entity_email_by_entity eebe
        INNER JOIN entity_email ee
            ON ee.id = eebe.entity_email_id
        INNER JOIN entity ent
            ON ent.id = eebe.entity_id
        WHERE COALESCE(eebe.annulled_at, ee.annulled_at) IS NULL
            AND ent.id = '${escape(id)}'
        ORDER BY eebe.order ASC`, prisma);
    }
}