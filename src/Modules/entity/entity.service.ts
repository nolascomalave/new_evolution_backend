import { Injectable } from '@nestjs/common';
import { PrismaService, PrismaTransactionOrService } from '../../prisma.service';
import { $Enums, entity } from '@prisma/client';
import { AddOrUpdateDto } from '../system_subscription_user/dto/system_subscription_user.dto';
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

export type AddOrUpdateParams = AddOrUpdateDto & {
    id_entity?: number;
    is_natural: boolean;
    photo?: Express.Multer.File;
    id_system_subscription_user_moderator: number
};

export type CompleteEntity = {
    id: number;
    id_entity_parent: number;
    id_document: number;
    is_natural: 1 | 0;
    name: string;
    gender: null | $Enums.entity_gender;
    date_birth: null | string | Date;
    address: null | number;
    photo: null | string;
    created_at: number;
    created_by: number;
    updated_at: number;
    updated_by: number;
    annulled_at: number;
    annulled_by: number;
    complete_name: string;
    names_obj: string | {
        type: string,
        names: string[],
        id_entity_name_type: number
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
    id_system: number;
    id_system_subscription: number;
    id_system_subscription_user: number;
}

/* type NamesTypes = {
    type: string;
    id_entity_name_type: number;
    names: string[]
};

type EntityDocumentType = {
    id: number;
    id_entity: number;
    id_entity_document_category: number;
    id_entity_document: number;
    id_country: null | number;
    id_state: null | number;
    id_city: null | number;
    order: number;
    symbol: string;
    category: string;
    document: string;
}

type EntityFullInfo = {
    id: number;
    id_entity_parent: number;
    id_document: number;
    is_natural: boolean | 1 | 0;
    id_system: number;
    id_system_subscription: number;
    id_system_subscription_user: number;
    name: 'string';
    gender: null | 'Male' | 'Female';
    date_birth: null | string | Date;
    address: null | string;
    photo: null | string;
    created_at: string | Date;
    created_by: number;
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
                complete_name LIKE '%${search}%'
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
        FROM entity_complete_info eci
        WHERE id = ${id}
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
                is_natural: addData.is_natural,
                gender: addData.is_natural ? $Enums.entity_gender[addData.gender] : undefined,
                name: '',
                address: addData.address
            }

            if('id_entity' in addData) {
                entity = await prisma.entity.findUnique({
                    where: {
                        id: addData.id_entity
                    }
                });

                if(!entity) {
                    errors.set('id_entity', 404);
                    throw errors;
                }

                entity = await prisma.entity.update({
                    where: {
                        id: addData.id_entity
                    },
                    data: {
                        ...proccessingData,
                        updated_by: addData.id_system_subscription_user_moderator,
                        updated_at: new Date
                    }
                });
            } else {
                entity = await prisma.entity.create({
                    data: {
                        ...proccessingData,
                        created_by: addData.id_system_subscription_user_moderator,
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

                const type = (typeof el === 'string' ? undefined : el.id_entity_name_type) ?? (addData?.is_natural == true ? natural_entity_name_types[0] : legal_entity_name_types[0]).id;
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

            const names_types = Object.keys(names);
            let currentNameIndex = 0;

            for(let i = 0; i < names_types.length; i++) {
                const namesResult = await this.nameService.processMultipleNames({
                    names: names[names_types[i]].names,
                    id_entity: entity.id,
                    id_entity_name_type: Number(names_types[i]),
                    created_by: Number(addData.id_system_subscription_user_moderator),
                    initialIndex: currentNameIndex,
                    name_type: 'names'
                }, prisma);

                if(namesResult.errors.existsErrors()) {
                    errors.pushErrorInArray('names', namesResult.errors.getErrors());
                    // throw errors;
                }

                currentNameIndex = currentNameIndex + names[names_types[i]].names.length;
            }


            // --------------------------------------------------------------------------------------------------------------------------------------------
            // - Processing Emails: -----------------------------------------------------------------------------------------------------------------------
            // --------------------------------------------------------------------------------------------------------------------------------------------
            let emails = [];
            const emailsResult = await this.emailService.processMultipleEmails({
                emails: addData.emails,
                id_entity: entity.id,
                created_by: Number(addData.id_system_subscription_user_moderator),
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
                id_entity: entity.id,
                created_by: Number(addData.id_system_subscription_user_moderator)
            }, prisma);

            if(phonesResult.errors.existsErrors()) {
                errors.merege(phonesResult.errors);
            } else if(Array.isArray(phonesResult.data)) {
                phones = phonesResult.data;
            }


            // --------------------------------------------------------------------------------------------------------------------------------------------
            // - Processing Documents: --------------------------------------------------------------------------------------------------------------------
            // --------------------------------------------------------------------------------------------------------------------------------------------
            let documents = [];
            const documentsByType: {} | {[key: number | string]: string[] | number[]} = {};

            for(let i = 0; i < addData.documents.length; i++) {
                if(typeof addData.documents[i] !== 'object' || Array.isArray(addData.documents[i])) {
                    errors.pushErrorInArray('documents', `documents.${i} must be a JSON.`);
                    continue;
                }

                if((addData.documents[i].id_entity_document_category ?? null) === null) {
                    errors.pushErrorInArray('documents', `documents.${i} must be defined value for property "id_entity_document_category".`);
                    continue;
                }

                if((addData.documents[i].document ?? null) === null) {
                    errors.pushErrorInArray('documents', `documents.${i} must be defined value for property "document".`);
                    continue;
                }

                if(addData.documents[i].id_entity_document_category in documentsByType) {
                    documentsByType[addData.documents[i].id_entity_document_category].push(addData.documents[i].document);
                } else {
                    documentsByType[addData.documents[i].id_entity_document_category] = [addData.documents[i].document];
                }
            }

            if(!errors.exists('documents')) {
                for(let docs in documentsByType) {
                    const documentsResult = await this.documentService.processMultipleDocuments({
                        documents: documentsByType[docs],
                        id_entity_document_category: Number(docs),
                        id_entity: entity.id,
                        created_by: Number(addData.id_system_subscription_user_moderator),
                        validatorFn: (doc: string, name: string, order: number) => validateSSN(doc, name, order === 1),
                        name: 'documents'
                    }, prisma);

                    if(documentsResult.errors.existsErrors()) {
                        errors.pushErrorInArray('documents', documentsResult.errors.getErrors());
                    } else if(Array.isArray(documentsResult.documents)) {
                        documents.push(...documentsResult.documents);
                    }
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
                if(('id_entity' in addData) && fs.existsSync(photo)) {
                    fs.unlinkSync(photo);
                }
            }

            fullEntity = await this.prisma.findOneUnsafe(`SELECT
                *
            FROM entity_complete_info eci
            WHERE id = ${entity.id}`, prisma);

            if(!fullEntity) {
                errors.set('entity', 'Entity not found.');
                throw 'error';
            }

            entity = await prisma.entity.update({
                where: {
                    id: entity.id
                },
                data: {
                    id_document: documents[0].id,
                    name: (entity.is_natural ? (`${fullEntity.names} ${fullEntity.surnames}`) : (`${fullEntity.business_name} ${fullEntity.comercial_designation}`)).trim(),
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
                if('id_entity' in addData) {
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

    async getEntityEmails(id: number, prisma?: PrismaTransactionOrService) {
        return await this.prisma.queryUnsafe(`SELECT
            ee.*
        FROM entity_email_by_entity eebe
        INNER JOIN entity_email ee
            ON ee.id = eebe.id_entity_email
        INNER JOIN entity ent
            ON ent.id = eebe.id_entity
        WHERE COALESCE(eebe.annulled_at, ee.annulled_at) IS NULL
            AND ent.id = ${id}
        ORDER BY eebe.order ASC`, prisma);
    }
}