import { Injectable } from '@nestjs/common';
import { PrismaService, PrismaTransactionOrService, TransactionPrisma } from '../../prisma.service';
import { $Enums, entity } from '@prisma/client';
import { AddDto } from '../system_subscription_user/dto/system_subscription_user.dto';
import { EntityDocumentService } from '../entity_document/entity_document.service';
import { EntityNameService } from '../entity_name/entity_name.service';
import { EntityEmailService } from '../entity_email/entity_email.service';
import { EntityPhoneService } from '../entity_phone/entity_phone.service';
import HandlerErrors from 'src/util/HandlerErrors';
import fs from 'fs';
import path from 'path';
import { validateSSN } from 'src/util/validators';

export type AddParams = AddDto & {
    is_natural: boolean;
    photo?: Express.Multer.File;
    id_system_subscription_user_moderator: number
};


export type CompleteEntity = {
    id: number;
    id_entity_parent: number | null;
    id_document: number;
    is_natural: number;
    name: string;
    gender: $Enums.entity_gender;
    date_birth: Date | null;
    address: string | null;
    photo: string | null;
    created_at: Date;
    created_by: number | null;
    updated_at: number | null;
    updated_by: number | null;
    annulled_at: number | null;
    annulled_by: number | null;
    complete_name: number;
    names: string | null;
    surnames: string | null;
    legal_name: string | null;
    business_name: string | null;
    comercial_designation: string | null;
    documents: string[] | null;
    phones:  string[] | null;
    emails:  string[] | null;
    id_system: number;
    id_system_subscription: number;
    id_system_subscription_user: number;
}
@Injectable()
export class EntityService {
    constructor(
        private prisma: PrismaService,
        private documentService: EntityDocumentService,
        private nameService: EntityNameService,
        private emailService: EntityEmailService,
        private phoneService: EntityPhoneService
    ) {}

    async add(addData: AddParams, prisma?: PrismaTransactionOrService) {
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
            entity = await this.prisma.entity.create({
                data: {
                    is_natural: addData.is_natural,
                    gender: addData.is_natural ? $Enums.entity_gender[addData.gender] : undefined,
                    name: '',
                    address: addData.address,
                    created_by: addData.id_system_subscription_user_moderator,
                }
            });

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
                    const name_type = [...natural_entity_name_types, ...legal_entity_name_types].find(name => name.id === type);

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

            if(!!addData.photo) {
                photoname = `profile-photo.${addData.photo.mimetype.replace(/^image\//i, '')}`;
                entity_folder = path.join(__dirname, `../../../public/storage/entity/entity-${entity.id}`);
                photopath = `${entity_folder}/${photoname}`;
                rootProjectPath = path.join(__dirname, '../../../' + addData.photo.path);

                if(!fs.existsSync(entity_folder)) {
                    fs.mkdirSync(entity_folder, { recursive: true });
                }

                fs.renameSync(rootProjectPath, photopath);
                // fs.mkdirSync(dirName, { recursive: true });
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
                    photo: photoname
                }
            });

            if(isPosibleTransaction && ('commit' in prisma)) {
                await prisma.commit();
            }
        } catch(e: any) {
            if(isPosibleTransaction && ('rollback' in prisma)) {
                await prisma.rollback();
            }

            if(!!addData.photo && !!photopath) {
                fs.renameSync(photopath, rootProjectPath);
                fs.rmdirSync(entity_folder);
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
}