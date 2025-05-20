import { Injectable } from "@nestjs/common";
import { entity, entity_type as entity_type, entity_type_hierarchy, entity_type_relation, system_subscription_user } from "@prisma/client";
import { PrismaService, PrismaTransactionOrService } from "src/prisma.service";
import HandlerErrors from "src/util/HandlerErrors";
import { convertStringToRegExp } from "src/util/formats";
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

    async getEntityTypeRootID(id_entity_type: string, prisma: PrismaTransactionOrService = this.prisma): Promise<string | null> {
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

    /**
     * Establece la relación jerárquica entre un tipo de entidad hijo y un tipo de entidad padre.
     * Si la relación existe se retorna un objeto con la relación existente.
     * En caso de no existir la relación la crea. Sin embargo, si el tipo de entidad padre no es parte de la misma jerarquía
     * que el tipo de entidad hijo, se retorna un objeto de errores.
     * @param {{any, Object: {name: string, error_name: string, system_subscription_user_id: string}}} ancho - El ancho del rectángulo (debe ser positivo)
     * @returns {number} El área calculada
     * @throws {Error} Si los parámetros no son positivos
     * @returns {...{errors: HandlerErrors, data: null} | {errors: null, data: entity_type_hierarchy}}
    */
    async addEntityTypeParent(fnParams: {
        params: any,
        config: {
            name: string;
            error_name: string;
            system_subscription_user_id: string
        }
    }, prisma?: PrismaTransactionOrService): Promise<{data: entity_type_hierarchy | null; errors: HandlerErrors;}> {
        const isPosibleTransaction = !prisma,
            { config, params } = fnParams,
            name = config.name ?? "entity type",
            error_name = config.error_name ?? "entity_type",
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

            if(entity_type_hierarchy && entity_type_hierarchy.annulled_at === null) {
                throw successCode;
            }

            if(entity_type_hierarchy) {
                entity_type_hierarchy = await prisma.entity_type_hierarchy.update({
                    where: { id: entity_type_hierarchy.id },
                    data: {
                        updated_at: new Date,
                        updated_by: config.system_subscription_user_id,
                        annulled_at: null,
                        annulled_by: null,
                    }
                });
            } else {
                const entity_type_root_id: string | null = await this.getEntityTypeRootID(params.entity_type_id, prisma),
                    entity_type_parent_root_id: string | null = entity_type_root_id === null ? null : await this.getEntityTypeRootID(params.entity_type_parent_id, prisma);

                if(entity_type_root_id !== null && (entity_type_parent_root_id === null || entity_type_root_id !== entity_type_parent_root_id)) {
                    errors.set(`${error_name}.entity_type_parent_id`, `The ${name} parent is descended from a different hierarchy tree type than ${name}!`);

                    throw errors;
                }

                entity_type_hierarchy = await prisma.entity_type_hierarchy.create({
                    data: {
                        entity_type_id: params.entity_type_id,
                        entity_type_parent_id: params.entity_type_parent_id,
                        created_by: config.system_subscription_user_id,
                    }
                });
            }

            if(isPosibleTransaction) {
                await prisma.commit();
            }

            return {
                errors: errors,
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

    /**
     * Elimina la relación jerárquica entre un tipo de entidad hijo y un tipo de entidad padre.
     * Si la relación no existe se retorna un objeto con data null y sin errores.
     * En caso de existir la relación se anula y se retorna el objeto con la relación anulada y sin errores.
     * Los errores solo se retornan si existe un error al consultar la base de datos.
     * @param {{any, Object: {name: string, error_name: string, system_subscription_user_id: string}}} parámetros
     * @param {PrismaTransactionOrService} prisma - El objeto de transacción Prisma o el servicio Prisma.
     * @returns {...{errors: HandlerErrors, data: null} | {errors: null, data: entity_type_hierarchy}}
    */
    async removeEntityTypeParent(fnParams: {
        params: any,
        config: {
            name?: string;
            error_name?: string;
            system_subscription_user_id: string
        }
    }, prisma?: PrismaTransactionOrService): Promise<{data: null; errors: HandlerErrors;} | {data: entity_type_hierarchy; errors: null;}> {
        const isPosibleTransaction = !prisma,
            { config, params } = fnParams,
            name = config.name ?? "entity type",
            error_name = config.error_name ?? "entity_type",
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

            if(!entity_type_hierarchy || entity_type_hierarchy.annulled_at !== null) {
                throw successCode;
            }

            let entity_type: entity_type | null = null,
                entity_type_parent: entity_type | null = null;

            const existingDependentEntities: entity[] = await prisma.$queryRaw`select
                ent.*
            from entity ent
            inner join (
                select
                    ehet.entity_id /*,
                    STRING_AGG (rel.value::varchar, '.' order by rel."key"::int asc) as string_route */
                from view_recursive_entity_hierarchy_by_entity_type ehet,
                    jsonb_each_text(ehet.entity_type_hierarchical_route) as rel
                where ehet.entity_type_id = ${entity_type_hierarchy.entity_type_id}
                    and ehet.entity_type_parent_id = ${entity_type_hierarchy.entity_type_parent_id}
                group by ehet.entity_id
            ) eh
                on eh.entity_id = ent.id` ?? [];

            if(existingDependentEntities.length > 0) {
                entity_type = await prisma.entity_type.findUnique({where: {id: entity_type_hierarchy.entity_type_id}});
                entity_type_parent = await prisma.entity_type.findUnique({where: {id: entity_type_hierarchy.entity_type_parent_id}});

                if(!entity_type) {
                    errors.set(`${error_name}.entity_type_id`, `The ${name} ID does not exist!`);
                }

                if(!entity_type_parent) {
                    errors.set(`${error_name}.entity_type_parent_id`, `The ${name} parent ID does not exist!`);
                }

                if(entity_type && !entity_type_parent) {
                    errors.set(`${error_name}.dependent_entities`, `There are entities that are dependent on the entity types "${entity_type.type}" and "${entity_type_parent.type}"!`);

                    existingDependentEntities.forEach((entity: entity, index: number) => errors.set(`${error_name}.entity_type_id.dependent_entities.${index}`, entity.name));
                }

                throw errors;
            }

            const today = new Date();
            entity_type_hierarchy = await prisma.entity_type_hierarchy.update({
                where: { id: entity_type_hierarchy.id },
                data: {
                    updated_at: new Date(today),
                    updated_by: config.system_subscription_user_id,
                    annulled_at: new Date(today),
                    annulled_by: config.system_subscription_user_id,
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

    async removeAllEntityParent({
        // parent_entity,
        entity_type_array,
        entity_type,
        is_parent = false,
        process_id_key,
        name,
        error_name,
        system_subscription_user_id,
        prisma
    } : {
        entity_type_array: string[];
        entity_type: entity_type;
        is_parent: boolean;
        process_id_key: "entity_type_id" | "entity_type_parent_id";
        name: string,
        error_name: string;
        system_subscription_user_id: string;
        prisma: PrismaTransactionOrService;
    }): Promise<string[] | HandlerErrors> {
        const entity_type_to_process_key = is_parent ? "entity_type_id" : "entity_type_parent_id",
            entity_type_key = is_parent ? "entity_type_parent_id" : "entity_type_id",
            type_entity_parents = await prisma.entity_type_hierarchy.findMany({
                where: { [entity_type_key]: entity_type.id, annulled_at: null },
                select: { [entity_type_to_process_key]: true }
            }) ?? [],
            toRemoveParent: string[] = [],
            errors = new HandlerErrors;

        let counter = 0;
        for(const entity_type_to_process of type_entity_parents) {
            const existsParentInNewRelation = entity_type_array.some((id: string) => id === entity_type_to_process[process_id_key]);

            if(!existsParentInNewRelation) {
                const relationAnnulatedResult = await this.removeEntityTypeParent({
                    params: {
                        [entity_type_key]: entity_type.id,
                        [entity_type_to_process_key]: entity_type_to_process[process_id_key]
                    },
                    config: {
                        name: `${name} ${counter}`,
                        error_name: `${error_name}.${counter}`,
                        system_subscription_user_id: system_subscription_user_id
                    }
                });

                if(!relationAnnulatedResult.errors.existsErrors()) {
                    toRemoveParent.push(entity_type_to_process[process_id_key]);
                } else {
                    errors.merege(relationAnnulatedResult.errors);
                }
            }

            counter++;
        }

        if(errors.existsErrors()) {
            return errors;
        }

        return toRemoveParent;
    }

    async getExistingDependentEntities(entity_type_id: string, is_natural: boolean, prisma: PrismaTransactionOrService = this.prisma): Promise<{id: string}[]> {
        return await prisma.$queryRaw`select
            ent.id
        from entity ent
        inner join view_recursive_entity_hierarchy_by_entity_type ehet
            on ent.id = ehet.entity_id
            and exists (
                select
                    *
                from jsonb_each_text(ehet.entity_type_hierarchical_route) as et_rel
                where et_rel.value = ${entity_type_id}
            )
            and ent.is_natural = ${is_natural ? 1 : 0}
        limit 1;` ?? [];
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

        if(!Array.isArray(params.entity_type_parent_id)) {
            if((params.entity_type_parent_id ?? null) !== null) {
                errors.set(`${error_name}.entity_type_parent_id`, `The ${name} parent ID parameter must be a string array!`);
            }
            // errors.set(`${error_name}.entity_type_parent_id`, validateUniqueIdString(params.entity_type_id, `${name} parents ID`));

            /* if(!errors.exists(`${error_name}.entity_type_parent_id`) && (params.entity_type_id ?? null) !== null) {
                errors.set(`${error_name}.entity_type_parent_id`, `The ${name} parents ID parameter must be a string or a string array!`);
            } */
        } else {
            params.entity_type_parent_id.forEach((id: any, index) => {
                errors.set(`${error_name}.entity_type_parent_id.${index}`, validateUniqueIdString(id, `${name} parent ID No. ${index + 1}`));
            });
        }/*  else if(params.entity_type_parents_id.length === 0) {
            errors.set(`${error_name}.entity_type_parents_id`, `The id parents parameter of ${name} must contain at least one id!`);
        } */

        if(!Array.isArray(params.entity_type_relationships)) {
            if((params.entity_type_relationships ?? null) !== null) {
                errors.set(`${error_name}.entity_type_relationships`, `The ${name} related ID parameter must be a string array!`);
            }
        } else {
            /* params.entity_type_related_id.forEach((id: any, index) => {
                errors.set(`${error_name}.entity_type_related_id.${index}`, validateUniqueIdString(id, `${name} related ID No. ${index + 1}`));
            }); */
        }

        if(!Array.isArray(params.entity_type_child_id)) {
            if((params.entity_type_child_id ?? null) !== null) {
                errors.set(`${error_name}.entity_type_child_id`, `The ${name} child ID parameter must be a string array!`);
            }
            // errors.set(`${error_name}.entity_type_child_id`, validateUniqueIdString(params.entity_type_id, `${name} children ID`));

            /* if(!errors.exists(`${error_name}.entity_type_child_id`) && (params.entity_type_id ?? null) !== null) {
                errors.set(`${error_name}.entity_type_child_id`, `The ${name} children ID parameter must be a string or a string array!`);
            } */
        } else {
            params.entity_type_child_id.forEach((id: any, index) => {
                errors.set(`${error_name}.entity_type_child_id.${index}`, validateUniqueIdString(id, `${name} child ID No. ${index + 1}`));
            });
        }

        const is_creating = (!errors.exists(`${error_name}.entity_type_id`) && (params.entity_type_id ?? null) == null),
            existingParentErrorRegExp = new RegExp(`^${convertStringToRegExp(`${error_name}.entity_type_parent_id.`).source}`);

        errors.set(`${error_name}.type`, validateSimpleText(params.type, `${name} type`, 5, 255, is_creating));
        errors.set(`${error_name}.code`, validateSimpleText(params.code, `${name} code`, 5, 255, is_creating));
        errors.set(`${error_name}.description`, validateSimpleText(params.description, `${name} description`, 5, 2500, is_creating));

        if(!errors.exists(`${error_name}.entity_type_parent_id`, existingParentErrorRegExp) && Array.isArray(params.entity_type_parent_id)) {
            if(params.entity_type_parent_id.length < 1) {
                errors.set(`${error_name}.is_hierarchical`, validateBoolean(params.is_hierarchical, `${name} is_hierarchical`, is_creating));
                errors.set(`${error_name}.applies_to_natural`, validateBoolean(params.applies_to_natural, `${name} applies_to_natural`, is_creating));
                errors.set(`${error_name}.applies_to_legal`, validateBoolean(params.applies_to_legal, `${name} applies_to_legal`, is_creating));
                // errors.set(`${error_name}.is_required_for_system`, validateBoolean(params.is_required_for_system, `${name} is_required_for_system`, is_creating));
            } else {
                if(Array.isArray(params.entity_type_relationships)) {
                    errors.set(`${error_name}.entity_type_relationships`, "Relationships cannot be established to an entity type that is hierarchically dependent on another entity type.");
                }

                errors.set(`${error_name}.is_hierarchical`, typeof (params.is_hierarchical ?? null) === "boolean" ? "The is_hierarchical parameter only applies to root entity types." : null);
                errors.set(`${error_name}.applies_to_natural`, typeof (params.applies_to_natural ?? null) === "boolean" ? "The applies_to_natural parameter only applies to root entity types." : null);
                errors.set(`${error_name}.applies_to_legal`, typeof (params.applies_to_legal ?? null) === "boolean" ? "The applies_to_legal parameter only applies to root entity types." : null);
                // errors.set(`${error_name}.is_required_for_system`, typeof (params.is_required_for_system ?? null) === "boolean" ? "The is_required_for_system parameter only applies to root entity types." : null);
            }
        }

        if(errors.existsErrors()) {
            return {
                errors,
                data: null
            };
        }

        try {
            let entity_type: entity_type | null = is_creating ? null : await prisma.entity_type.findUnique({where: {id: params.entity_type_id}});
            const oldEntityConditions = !entity_type ? null : {
                    is_hierarchical: entity_type.is_hierarchical,
                    applies_to_natural: entity_type.applies_to_natural,
                    applies_to_legal: entity_type.applies_to_legal,
                    // is_required_for_system: entity_type.is_required_for_system
                },
                entity_data = {
                    type:                   params.name ?? (!entity_type ? undefined : entity_type.type),
                    code:                   params.code ?? (!entity_type ? undefined : entity_type.code),
                    description:            params.description ?? (!entity_type ? undefined : entity_type.description),

                    is_hierarchical:        params.is_hierarchical ?? (!entity_type ? false : entity_type.is_hierarchical),
                    applies_to_natural:     params.applies_to_natural ?? (!entity_type ? false : entity_type.applies_to_natural),
                    applies_to_legal:       params.applies_to_legal ?? (!entity_type ? false : entity_type.applies_to_legal),
                    // is_required_for_system: params.is_required_for_system ?? (!entity_type ? false : entity_type.is_required_for_system)
                    // [is_creating ? "created_by" : "updated_by"]: params.moderator_user_id,
                };

            if(!is_creating && !entity_type) {
                errors.set(`${error_name}.entity_type_id`, `The ${name} ID does not exist!`);
            }

            entity_type = await prisma.entity_type.upsert({
                where: {
                    id: !entity_type ? null : entity_type.id
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
                /* include: {
                    relation_as_hierarchy_child: { select: { entity_type_parent_id: true }, where: { annulled_at: null } },
                    relation_as_hierarchy_parent: { select: { entity_type_id: true }, where: { annulled_at: null } },
                    relation: { select: { entity_type_related_id: true }, where: { annulled_at: null } },
                } */
            });

            if(Array.isArray(params.entity_type_parent_id)) {
                const /* type_entity_parents = await prisma.entity_type_hierarchy.findMany({
                        where: { entity_type_id: entity_type.id, annulled_at: null },
                        select: { entity_type_parent_id: true }
                    }) ?? [],
                    toRemoveParent: string[] = [], */
                    removeParents = await this.removeAllEntityParent({
                        entity_type_array: params.entity_type_parent_id,
                        entity_type,
                        is_parent: false,
                        process_id_key: "entity_type_parent_id",
                        name: `${name} parent`,
                        error_name: `${error_name}.parent`,
                        system_subscription_user_id: params.system_subscription_user_id,
                        prisma
                    });

                if(removeParents instanceof HandlerErrors) {
                    errors.merege(removeParents as HandlerErrors);
                }

                for(const id of params.entity_type_parent_id) {
                    const addParentResult = await this.addEntityTypeParent({
                        params: {
                            entity_type_id: entity_type.id,
                            entity_type_parent_id: id
                        },
                        config: {
                            name: `${name} parent`,
                            error_name: `${error_name}.parent`,
                            system_subscription_user_id: params.system_subscription_user_id
                        }
                    }, prisma);

                    if(addParentResult.errors.existsErrors()) {
                        errors.merege(addParentResult.errors);
                    }
                }

                if(params.entity_type_parent_id.length > 0) {
                    const entity_type_root_id = await this.getEntityTypeRootID(entity_type.id, prisma),
                        entity_type_root = await prisma.entity_type.findUnique({ where: { id: entity_type_root_id } });

                    if(!entity_type_root) {
                        errors.set(`${error_name}.entity_type_root`, "Root entity type not found!");
                        // throw errors;
                    } else {
                        entity_type = await prisma.entity_type.update({
                            where: { id: entity_type.id },
                            data: {
                                is_hierarchical: entity_type_root.is_hierarchical,
                                applies_to_natural: entity_type_root.applies_to_natural,
                                applies_to_legal: entity_type_root.applies_to_legal,
                                is_required_for_system: entity_type_root.is_required_for_system,
                                updated_at: new Date()
                            }
                        });
                    }
                } else {
                    if(oldEntityConditions != null) {
                        const areConditionsChanged = (oldEntityConditions.is_hierarchical != entity_type.is_hierarchical || oldEntityConditions.applies_to_natural != entity_type.applies_to_natural || oldEntityConditions.applies_to_legal != entity_type.applies_to_legal);

                        if(oldEntityConditions.is_hierarchical != entity_type.is_hierarchical && oldEntityConditions.is_hierarchical == true) {
                            const existingEntityTypeChild: {entity_type_id: string}[] = await prisma.$queryRaw`select
                                eth.entity_type_id
                            from entity_type_hierarchy eth
                            where eth.entity_type_parent_id = ${entity_type.id}
                                and eth.annulled_at is null
                            limit 1` ?? [];

                            if(existingEntityTypeChild.length > 0) {
                                errors.set(`${error_name}.is_hierarchical`, `The "hierarchical" attribute cannot be set to false while there are entity types dependent on this entity type.`);
                            }
                        }

                        if(oldEntityConditions.applies_to_natural != entity_type.applies_to_natural && oldEntityConditions.applies_to_natural == true) {
                            const existingDependentEntity = await this.getExistingDependentEntities(entity_type.id, true, prisma);

                            if(existingDependentEntity.length > 0) {
                                errors.set(`${error_name}.applies_to_natural`, `The "applies to natural" attribute cannot be set to false while there are natural entities dependent on this entity type.`);
                            }
                        }

                        if(oldEntityConditions.applies_to_legal != entity_type.applies_to_legal && oldEntityConditions.applies_to_legal == true) {
                            const existingDependentEntity = await this.getExistingDependentEntities(entity_type.id, false, prisma);

                            if(existingDependentEntity.length > 0) {
                                errors.set(`${error_name}.applies_to_legal`, `The "applies to legal" attribute cannot be set to false while there are legal entities dependent on this entity type.`);
                            }
                        }

                        if(areConditionsChanged && !errors.existsErrors()) {

                        }
                    }

                    for(const relationship of params.entity_type_relationships) {

                    }
                }
            }

            if(Array.isArray(params.entity_type_child_id)) {
                const /* type_entity_parents = await prisma.entity_type_hierarchy.findMany({
                        where: { entity_type_id: entity_type.id, annulled_at: null },
                        select: { entity_type_parent_id: true }
                    }) ?? [],
                    toRemoveParent: string[] = [], */
                    removeChildren = await this.removeAllEntityParent({
                        entity_type_array: params.entity_type_child_id,
                        entity_type,
                        is_parent: true,
                        process_id_key: "entity_type_id",
                        name: `${name} child`,
                        error_name: `${error_name}.child`,
                        system_subscription_user_id: params.system_subscription_user_id,
                        prisma
                    });

                if(removeChildren instanceof HandlerErrors) {
                    errors.merege(removeChildren as HandlerErrors);
                }

                for(const id of params.entity_type_parent_id) {
                    const addParentResult = await this.addEntityTypeParent({
                        params: {
                            entity_type_id: id,
                            entity_type_parent_id: entity_type.id
                        },
                        config: {
                            name: `${name} child`,
                            error_name: `${error_name}.child`,
                            system_subscription_user_id: params.system_subscription_user_id
                        }
                    }, prisma);

                    if(addParentResult.errors.existsErrors()) {
                        errors.merege(addParentResult.errors);
                    }
                }
            }
        } catch(e: any) {
            if(isPosibleTransaction) {
                await prisma.rollback();
            }
        }
    }
}