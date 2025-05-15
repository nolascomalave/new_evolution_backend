import { Injectable } from "@nestjs/common";
import { entity_type as entity_type, entity_type_hierarchy, entity_type_relation, system_subscription_user } from "@prisma/client";
import { PrismaService, PrismaTransactionOrService } from "src/prisma.service";
import HandlerErrors from "src/util/HandlerErrors";
import { validateBoolean, validateSimpleText, validateUniqueIdString } from "src/util/validators";

export type ViewRecursiveEntityTypeHierarchy = {
    root_id: string;
    hierarchical_route: {[key: string | number]: string};
    level: number;
    parent_id: null | string;
    id: string;
}

@Injectable()
export class EntityTypeService {
    constructor(
        private prisma: PrismaService
    ) {}

    async getEntityTypeRoot(id_entity_type: string, prisma: PrismaTransactionOrService = this.prisma): Promise<string | null> {
        return (((await prisma.$queryRaw`select distinct
            reth.root_id
        from view_recursive_entity_type_hierarchy reth
        inner join entity_type et
            on et.id = reth.root_id
            and not exists (
                select
                    id
                from entity_type_hierarchy eth
                where eth.entity_type_id = et.id
                    and annulled_at is null
            )
        where reth.parent_id is not null
            and reth.id = ${id_entity_type}` as {root_id: string}[]) ?? [])[0] ?? ({root_id: null})).root_id;
    }

    async addEntityTypeParent(params: {
        entity_type_id: string;
        entity_type_parent_id: string;
        name: string;
        error_name: string;
        system_subscription_user_id: string
    } | any, prisma?: PrismaTransactionOrService): Promise<{data: null; errors: HandlerErrors;} | {data: entity_type_hierarchy; errors: null;}> {
        const isPosibleTransaction = !prisma,
            objParams = ((typeof params === "object" && !Array.isArray(params) ? params : {}) ?? {}),
            name = objParams.name ?? "entity type",
            error_name = objParams.error_name ?? "entity_type",
            errors = new HandlerErrors,
            successCode = Date.now().toString().concat("-SUCCESS");

        if(isPosibleTransaction) {
            prisma = await this.prisma.beginTransaction();
        }

        if(typeof params !== 'object' || Array.isArray(params) || !params) {
            errors.set(`${error_name}.params`, `The ${name} parameters must be defined as a JSON object!`);

            return {
                errors,
                data: null
            };
        }

        errors.set(`${error_name}.entity_type_id`, validateUniqueIdString(params.entity_type_id, `${name} ID`, true));
        errors.set(`${error_name}.entity_type_parent_id`, validateUniqueIdString(params.entity_type_parent_id, `${name} parent ID`, true));

        if(errors.existsErrors()) {
            return {
                data: null,
                errors
            }
        }

        let entity_type_hierarchy: entity_type_hierarchy | null  = null

        try {
            entity_type_hierarchy = await prisma.entity_type_hierarchy.findFirst({
                where: {
                    entity_type_id: params.entity_type_id,
                    entity_type_parent_id: params.entity_type_parent_id
                }
            });

            if(entity_type_hierarchy) {
                throw successCode;
            }

            const entity_type_root_id: string | null = await this.getEntityTypeRoot(params.entity_type_id, prisma),
                entity_type_parent_root_id: string | null = entity_type_root_id === null ? null : await this.getEntityTypeRoot(params.entity_type_parent_id, prisma);

            if(entity_type_root_id !== null && (entity_type_parent_root_id === null || entity_type_root_id !== entity_type_parent_root_id)) {
                errors.set(`${error_name}.entity_type_parent_id`, `The ${name} parent is descended from a different hierarchy tree type than ${name}!`);

                throw errors;
            }

            entity_type_hierarchy = await prisma.entity_type_hierarchy.create({
                data: {
                    entity_type_id: params.entity_type_id,
                    entity_type_parent_id: params.entity_type_parent_id,
                    created_by: params.system_subscription_user_id,
                }
            });

            if(isPosibleTransaction) {
                await prisma.commit();
            }

            return {
                errors: null,
                data: entity_type_hierarchy
            };
        } catch(e: any) {
            if(isPosibleTransaction) {
                await prisma.rollback();
            }

            if(e === successCode) {
                return {
                    errors: null,
                    data: entity_type_hierarchy
                };
            }

            if(e instanceof HandlerErrors) {
                return {
                    errors: e,
                    data: null
                };
            }

            throw e;
        }
    }

    async createOrUpdateEntityType(params: {
        [key: string | number]: any;
        system_subscription_user_id: string;
    } | any, prisma?: PrismaTransactionOrService) {
        const isPosibleTransaction = !prisma,
            name = ((typeof params === "object" && !Array.isArray(params) ? params : {}) ?? {}).name ?? "entity type",
            error_name = ((typeof params === "object" && !Array.isArray(params) ? params : {}) ?? {}).error_name ?? "entity_type",
            errors = new HandlerErrors;

        if(isPosibleTransaction) {
            prisma = await this.prisma.beginTransaction();
        }

        if(typeof params !== 'object' || Array.isArray(params) || !params) {
            errors.set(`${error_name}.params`, `The ${name} parameters must be defined as a JSON object!`);

            return {
                errors,
                data: null
            };
        }

        errors.set(`${error_name}.entity_type_id`, validateUniqueIdString(params.entity_type_id, `${name} ID`));

        if(!Array.isArray(params.entity_type_parents_id)) {
            errors.set(`${error_name}.entity_type_parents_id`, `The ${name} parents ID parameter must be an array!`);
        }/*  else if(params.entity_type_parents_id.length === 0) {
            errors.set(`${error_name}.entity_type_parents_id`, `The id parents parameter of ${name} must contain at least one id!`);
        } */

        params.entity_type_parents_id.forEach((id: any, index) => {
            errors.set(`${error_name}.entity_type_parents_id.${index}`, validateUniqueIdString(id, `${name} parent ID No. ${index + 1}`));
        });

        const is_creating = (!errors.exists(`${error_name}.entity_type_id`) && (params.entity_type_id ?? null) == null);

        errors.set(`${error_name}.type`, validateSimpleText(params.type, `${name} type`, 5, 255, is_creating));
        errors.set(`${error_name}.code`, validateSimpleText(params.code, `${name} code`, 5, 255, is_creating));
        errors.set(`${error_name}.description`, validateSimpleText(params.description, `${name} description`, 5, 2500, is_creating));
        errors.set(`${error_name}.is_hierarchical`, validateBoolean(params.is_hierarchical, `${name} is_hierarchical`, is_creating));
        errors.set(`${error_name}.applies_to_natural`, validateBoolean(params.applies_to_natural, `${name} applies_to_natural`, is_creating));
        errors.set(`${error_name}.applies_to_legal`, validateBoolean(params.applies_to_legal, `${name} applies_to_legal`, is_creating));
        errors.set(`${error_name}.is_required_for_system`, validateBoolean(params.is_required_for_system, `${name} is_required_for_system`, is_creating));

        if(errors.existsErrors()) {
            return {
                errors,
                data: null
            };
        }

        try {
            let entity_type: entity_type | null = is_creating ? null : await prisma.entity_type.findUnique({where: {id: params.entity_type_id}});
            const entity_data = {
                type:                   params.name ?? (!entity_type ? undefined : entity_type.type),
                code:                   params.code ?? (!entity_type ? undefined : entity_type.code),
                description:            params.description ?? (!entity_type ? undefined : entity_type.description),
                is_hierarchical:        params.is_hierarchical ?? (!entity_type ? undefined : entity_type.is_hierarchical),
                applies_to_natural:     params.applies_to_natural ?? (!entity_type ? undefined : entity_type.applies_to_natural),
                applies_to_legal:       params.applies_to_legal ?? (!entity_type ? undefined : entity_type.applies_to_legal),
                is_required_for_system: params.is_required_for_system ?? (!entity_type ? undefined : entity_type.is_required_for_system)
                // [is_creating ? "created_by" : "updated_by"]: params.moderator_user_id,
            };

            if(is_creating && !entity_type) {
                errors.set(`${error_name}.entity_type_id`, `The ${name} ID does not exist!`);
            }

            entity_type: entity_type = await prisma.entity_type.upsert({
                where: {
                    id: params.entity_type_id
                },
                create: {
                    ...entity_data,
                    created_by: params.system_subscription_user_id
                },
                update: {
                    ...entity_data,
                    updated_by: params.system_subscription_user_id,
                    updated_at: new Date()
                },
                include: {
                    relation_as_hierarchy_child: { select: { entity_type_parent_id: true } },
                    relation_as_hierarchy_parent: { select: { entity_type_id: true } },
                }
            });


        } catch(e: any) {

        }
    }
}