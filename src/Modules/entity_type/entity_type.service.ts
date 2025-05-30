import { Injectable } from "@nestjs/common";
import { entity, entity_type as entity_type, entity_type_hierarchy, entity_type_relation, system_subscription_user } from "@prisma/client";
import { PrismaService, PrismaTransactionOrService } from "src/prisma.service";
import HandlerErrors from "src/util/HandlerErrors";
import { booleanFormat, convertJSONStringToJSON, convertStringToRegExp } from "src/util/formats";
import { validateBoolean, validateSimpleText, validateUniqueIdString } from "src/util/validators";

export type ViewRecursiveEntityTypeHierarchy = {
    root_id: string;
    hierarchical_route: {[key: string | number]: string};
    level: number;
    parent_id: null | string;
    id: string;
}

type EntityTypePermitedProcessConditions = {
    is_also: Boolean;
    is_also_required: Boolean;
    is_parallel: Boolean;
    is_required_parallel: Boolean;
};

export type EntityTypeRelationValidatedParams = {
    entity_type_id: string;
    entity_type_related_id: string;
    conditions: EntityTypePermitedProcessConditions;
    related_conditions: EntityTypePermitedProcessConditions;
}

export type EntityTypeWithRelation = entity_type & {
    is_root: boolean;
    parents: {id: string; entity_type_id: string; entity_type_parent_id: string}[] | string | null;
};

@Injectable()
export class EntityTypeService {
    constructor(
        private prisma: PrismaService
    ) {}

    public async getWithHierarchyRelation($params: {
        entity_type_root_code?: null | string;
    }) {
        const $where: string[] | string = [];

        if(!!$params.entity_type_root_code) {
            $where.push(`(
                (
                    etp.entity_type_id is null
                    and et.code = '${escape($params.entity_type_root_code)}'
                )
                or (
                    etp.entity_type_id is not null
                    and exists (
                        select
                            1 as Num
                        from entity_type etr
                        where id = etp.entity_type_root_id
                            and etr.code = '${escape($params.entity_type_root_code)}'
                    )
                )
            )`);
        }

        let $sql = `select
            et.*,
            iif(etp.entity_type_id is null, true, false) as is_root,
            etp.entity_type_root_id,
            etp.parents::jsonb
        from entity_type et
        left join (
            select
                etr.root_id as entity_type_root_id,
                eth.entity_type_id,
                json_agg(json_build_object(
                    'id', eth.id,
                    'entity_type_id', eth.entity_type_id,
                    'entity_type_parent_id', eth.entity_type_parent_id
                ) order by eth.id ASC) as parents
            from entity_type_hierarchy eth
            inner join (
                select distinct
                    id,
                    parent_id,
                    root_id
                from view_recursive_entity_type_hierarchy
            ) etr
                on etr.id = eth.entity_type_id
                and etr.parent_id = eth.entity_type_parent_id
            where eth.annulled_at is null
            group by etr.root_id,
                eth.entity_type_id
        ) etp
            on etp.entity_type_id = et.id
        where et.annulled_at is null
            ${$where.length > 0 ? `and ${$where.join(' and ')}` : ''}`;

        return await this.prisma.$queryRawUnsafe<EntityTypeWithRelation>($sql);
    }

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

        if(isPosibleTransaction) {
            prisma = await this.prisma.beginTransaction();
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

        if(isPosibleTransaction) {
            prisma = await this.prisma.beginTransaction();
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
        entity_type_parent_array,
        entity_type,
        is_parent = false,
        process_id_key,
        name,
        error_name,
        system_subscription_user_id,
        prisma
    } : {
        entity_type_parent_array: string[];
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
            const existsParentInNewRelation = entity_type_parent_array.some((id: string) => id === entity_type_to_process[process_id_key]);

            if(!existsParentInNewRelation) {
                const relationAnnulatedResult = await this.removeEntityTypeParent({
                    params: {
                        [entity_type_key]: entity_type.id,
                        [entity_type_to_process_key]: entity_type_to_process[process_id_key]
                    },
                    config: {
                        name: `${name} No. ${counter}`,
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

    formatConditionsToBoolean(conditions: {
        is_also: boolean | string | number;
        is_also_required: boolean | string | number;
        is_parallel: boolean | string | number;
        is_required_parallel: boolean | string | number;
    }): {
        is_also: boolean;
        is_also_required: boolean;
        is_parallel: boolean;
        is_required_parallel: boolean;
    } {
        return {
            is_also: booleanFormat(conditions.is_also),
            is_also_required: booleanFormat(conditions.is_also_required),
            is_parallel: booleanFormat(conditions.is_parallel),
            is_required_parallel: booleanFormat(conditions.is_required_parallel)
        };
    }

    validateRelationshipParams(params: any, config: {
        name?: string;
        error_name?: string;
        validateEntityTypeID?: boolean;
    }): HandlerErrors | EntityTypeRelationValidatedParams {
        const errors = new HandlerErrors,
            {
                name = config.name ?? "entity type",
                error_name = config.error_name ?? "entity_type",
                validateEntityTypeID = config.validateEntityTypeID ?? true
            } = config;

        if(typeof params !== 'object' || Array.isArray(params) || !params) {
            errors.set(`${error_name}`, `The ${name} parameters must be defined as a JSON object!`);

            return errors;
        }

        if(validateEntityTypeID) {
            errors.set(`${error_name}.entity_type_id`, validateUniqueIdString(params.entity_type_id, `${name} ID`, true));
        }

        errors.set(`${error_name}.entity_type_related_id`, validateUniqueIdString(params.entity_type_related_id, `${name} related ID`, true));

        if(typeof params.conditions !== 'object' || Array.isArray(params.conditions) || !params.conditions) {
            errors.set(`${error_name}.conditions`, `The conditions parameters must be defined as a JSON object!`);
        }

        if(typeof params.related_conditions !== 'object' || Array.isArray(params.related_conditions) || !params.related_conditions) {
            errors.set(`${error_name}.related_conditions`, `The related_conditions parameters must be defined as a JSON object!`);
        }

        if(errors.existsErrors()) {
            return errors;
        }

        errors.set(`${error_name}.conditions.is_also`, validateBoolean(params.conditions.is_also, `${name} is_also condition`, true));
        errors.set(`${error_name}.related_conditions.is_also`, validateBoolean(params.related_conditions.is_also, `${name} is_also related condition`, true));

        if(!errors.exists(`${error_name}.conditions.is_also`, `${error_name}.related_conditions.is_also`) && booleanFormat(params.conditions.is_also) !== booleanFormat(params.related_conditions.is_also)) {
            errors.set(`${error_name}.conditions.is_also`, `is_also condition must be the same as the related condition!`);
            errors.set(`${error_name}.related_conditions.is_also`, `is_also related condition must be the same as the condition!`);
        }

        errors.set(`${error_name}.conditions.is_also_required`, validateBoolean(params.conditions.is_also_required, `${name} is_also_required condition`, true));
        errors.set(`${error_name}.related_conditions.is_also_required`, validateBoolean(params.related_conditions.is_also_required, `${name} is_also_required related condition`, true));

        errors.set(`${error_name}.conditions.is_parallel`, validateBoolean(params.conditions.is_parallel, `${name} is_parallel condition`, true));
        errors.set(`${error_name}.related_conditions.is_parallel`, validateBoolean(params.related_conditions.is_parallel, `${name} is_parallel related condition`, true));

        if(!errors.exists(`${error_name}.conditions.is_parallel`, `${error_name}.related_conditions.is_parallel`) && booleanFormat(params.conditions.is_parallel) !== booleanFormat(params.related_conditions.is_parallel)) {
            errors.set(`${error_name}.conditions.is_parallel`, `is_parallel condition must be the same as the related condition!`);
            errors.set(`${error_name}.related_conditions.is_parallel`, `is_parallel related condition must be the same as the condition!`);
        }

        errors.set(`${error_name}.conditions.is_required_parallel`, validateBoolean(params.conditions.is_required_parallel, `${name} is_required_parallel condition`, true));
        errors.set(`${error_name}.related_conditions.is_required_parallel`, validateBoolean(params.related_conditions.is_required_parallel, `${name} is_required_parallel related condition`, true));

        if(errors.existsErrors()) {
            return errors;
        }

        params.conditions = this.formatConditionsToBoolean(params.conditions);
        params.related_conditions = this.formatConditionsToBoolean(params.related_conditions);

        return (params as EntityTypeRelationValidatedParams);
    }

    async confirmExistsAlsoDependents({
        entity_type_id,
        entity_type_related_id,
        exists_in_related,
        prisma
    } : {
        entity_type_id: string;
        entity_type_related_id: string;
        exists_in_related: boolean;
        prisma?: PrismaTransactionOrService;
    }) {
        const $sql = `select
            ent.id
        from entity ent
        where ent.annulled_at is null
            and exists (
                select
                    *
                from entity_type_by_entity ety
                where ety.entity_id = ent.id
                    and ety.annulled_at is null
                    and ety.entity_type_id = ${entity_type_id}
            )
            and ${exists_in_related ? "" : "NOT "}exists (
                select
                    *
                from entity_type_by_entity ety
                where ety.entity_id = ent.id
                    and ety.annulled_at is null
                    and ety.entity_type_id = ${entity_type_related_id}
            )
        limit 1`;

        return (((await (prisma ?? this.prisma).$queryRawUnsafe($sql))[0] as {id: string}) ?? {id: null}).id ?? null;
    }

    async confirmExistsParallelDependents({
        entity_type_id,
        entity_type_related_id,
        exists_in_related,
        prisma
    } : {
        entity_type_id: string;
        entity_type_related_id: string;
        exists_in_related: boolean;
        prisma?: PrismaTransactionOrService;
    }) {
        const $sql = `select
            ent.id
        from entity ent
        inner join entity_type_by_entity ete
            on ete.entity_id = ent.id
            and ete.annulled_at is null
        where ent.annulled_at is null
            and ete.entity_type_id = ${entity_type_id}
            and ${exists_in_related ? "" : "NOT "}exists (
                select
                    er.*
                from entity ent1
                inner join entity_relation er
                    on (
                        er.entity_id = ent1.id
                        or er.entity_related_id = ent1.id
                    )
                    and (
                        er.entity_id = ent.id
                        or er.entity_related_id = ent.id
                    )
                    and ent1.id <> ent.id
                    and er.is_parallel = true
                    and ent1.annulled_at is null
                inner join entity_type_by_entity ete1
                    on ete1.entity_id = ent1.id
                    and ete1.entity_type_id = ${entity_type_related_id}
                    and ete1.annulled_at is null
            )
        limit 1`;

        return (((await (prisma ?? this.prisma).$queryRawUnsafe($sql))[0] as {id: string}) ?? {id: null}).id ?? null;
    }

    async validateExistingRelationOrUpdate({
        relation,
        entity_type,
        entity_type_related,
        conditions,
        conditions_name,
        error_name,
        prisma,
        system_subscription_user_id
    }: {
        relation: entity_type_relation;
        entity_type: entity_type;
        entity_type_related: entity_type;
        conditions: EntityTypePermitedProcessConditions;
        conditions_name: string;
        error_name: string;
        prisma?: PrismaTransactionOrService;
        system_subscription_user_id: string;
    }) {
        prisma ??= this.prisma;

        const errors = new HandlerErrors;

        if(relation.is_also === true && conditions.is_also === false) {
            const existingDependentEntities: string | null = await this.confirmExistsAlsoDependents({
                entity_type_id: entity_type.id,
                entity_type_related_id: entity_type_related.id,
                prisma,
                exists_in_related: true
            });

            if(existingDependentEntities !== null) {
                errors.set(`${error_name}.${conditions_name}.is_also`, `The is_also attribute of the relationship between the ${entity_type.type} and ${entity_type_related.type} entity types cannot be changed to false while entities belonging to both types exist.`);
            }
        }

        if(/* conditions.is_also === true &&  */relation.is_also_required === false && conditions.is_also_required === true) {
            const existingDependentEntities: string | null = await this.confirmExistsAlsoDependents({
                entity_type_id: entity_type.id,
                entity_type_related_id: entity_type_related.id,
                prisma,
                exists_in_related: false
            });

            if(existingDependentEntities !== null) {
                errors.set(`${error_name}.${conditions_name}.is_also_required`, `The is_also_required attribute of the relationship between the ${entity_type.type} and ${entity_type_related.type} entity types cannot be changed to true until there are entities belonging to both types.`);
            }
        }

        if(relation.is_parallel === true && conditions.is_parallel === false) {
            const existingDependentEntities: string | null = await this.confirmExistsParallelDependents({
                entity_type_id: entity_type.id,
                entity_type_related_id: entity_type_related.id,
                prisma,
                exists_in_related: true
            });

            if(existingDependentEntities !== null) {
                errors.set(`${error_name}.${conditions_name}.is_parallel`, `The is_parallel attribute of the relationship between the ${entity_type.type} and ${entity_type_related.type} entity types cannot be set to false while entities belonging to both types exist.`);
            }
        }

        if(/* conditions.is_parallel === true &&  */relation.is_required_parallel === false && conditions.is_required_parallel === true) {
            const existingDependentEntities: string | null = await this.confirmExistsParallelDependents({
                entity_type_id: entity_type.id,
                entity_type_related_id: entity_type_related.id,
                prisma,
                exists_in_related: true
            });

            if(existingDependentEntities !== null) {
                errors.set(`${error_name}.${conditions_name}.is_required_parallel`, `The is_required_parallel attribute of the relationship between the ${entity_type.type} and ${entity_type_related.type} entity types cannot be changed to true until there are entities belonging to both types.`);
            }
        }

        if(errors.existsErrors()) {
            return errors;
        } else {
            return await prisma.entity_type_relation.update({
                where: { id: relation.id },
                data: {
                    is_also: Boolean(conditions.is_also),
                    is_also_required: Boolean(conditions.is_also_required),
                    is_parallel: Boolean(conditions.is_parallel),
                    is_required_parallel: Boolean(conditions.is_required_parallel),

                    updated_by: system_subscription_user_id,
                    updated_at: new Date,
                    annulled_at: null,
                    annulled_by: null
                }
            });
        }
    }

    async removeEntityTypeRelationship(params: {
        relation?: entity_type_relation | null;

        entity_type?: entity_type | string | null;
        entity_type_related?: entity_type | string | null;

        name?: string;
        error_name?: string;
        system_subscription_user_id: string;
        prisma?: PrismaTransactionOrService;

        removeRelated?: boolean;
    }): Promise<{data: entity_type_relation | null; errors: HandlerErrors;}> {
        let {
            prisma,
            entity_type,
            entity_type_related,
            relation
        } = params;
        const isPosibleTransaction = !prisma,
            errors = new HandlerErrors,
            {
                name = params.name ?? "entity type",
                error_name = params.error_name ?? "entity_type",
                removeRelated = params.removeRelated ?? true,
                system_subscription_user_id,
            } = params,
            successCode = Date.now().toString().concat("-SUCCESS");

        if(isPosibleTransaction) {
            prisma = await this.prisma.beginTransaction();
        }

        try {
            entity_type = typeof entity_type === "string" ? await prisma.entity_type.findUnique({where: {id: entity_type}}) : entity_type;
            entity_type_related = (typeof entity_type_related === "string" ? await prisma.entity_type.findUnique({where: {id: entity_type_related}}) : (entity_type === null ? null : entity_type_related));
            relation ??= entity_type_related === null ? null : await prisma.entity_type_relation.findFirst({
                where: {
                    entity_type_id: entity_type.id,
                    entity_type_related_id: entity_type_related.id
                }
            });

            if(!entity_type) {
                errors.set(`${error_name}.entity_type`, `The ${name} ID does not found!`);
            } else if(!entity_type_related) {
                errors.set(`${error_name}.entity_type_related`, `The ${name} related ID does not found!`);
            } /* else if(!relation) {
                errors.set(`${error_name}.relation`, `The ${name} relation does not found!`);
            } */ else if(!!relation && relation.entity_type_id != entity_type.id || relation.entity_type_related_id != entity_type_related.id) {
                errors.set(`${error_name}.relation`, `The ${name} relation does not match the provided entity types!`);
            }

            if(errors.exists()) {
                throw errors;
            }

            if(!!relation || relation.annulled_at != null) {
                throw successCode;
            }

            if(relation.is_parallel) {
                const existingParallelDependentEntities: string | null = await this.confirmExistsParallelDependents({
                    entity_type_id: entity_type.id,
                    entity_type_related_id: entity_type_related.id,
                    prisma,
                    exists_in_related: true
                });

                if(existingParallelDependentEntities !== null) {
                    errors.set(`${error_name}.relation.is_parallel`, `The relationship between entity types ${entity_type.type} and ${entity_type_related.type} cannot be deleted because the is_parallel value is set to true and there are entities of one type that are directly related to entities of the other type.`);
                }
            }

            if(relation.is_also) {
                const existingAlsoDependentEntities: string | null = await this.confirmExistsAlsoDependents({
                    entity_type_id: entity_type.id,
                    entity_type_related_id: entity_type_related.id,
                    prisma,
                    exists_in_related: true
                });

                if(existingAlsoDependentEntities !== null) {
                    errors.set(`${error_name}.relation.is_also`, `The relationship between the entity types ${entity_type.type} and ${entity_type_related.type} cannot be deleted because the value is_also is set to true and there are entities that belong to both types.`);
                }
            }

            if(errors.exists()) {
                throw errors;
            }

            if(removeRelated) {
                const removeRelatedRelationResult = await this.removeEntityTypeRelationship({
                    entity_type: entity_type_related,
                    entity_type_related: entity_type,
                    // relation: relation,
                    name: `${name} related relation`,
                    error_name: `${error_name}.related`,
                    system_subscription_user_id: system_subscription_user_id,
                    prisma: prisma,
                    removeRelated: false
                });

                if(removeRelatedRelationResult.errors.exists()) {
                    errors.merege(removeRelatedRelationResult.errors);
                    throw errors;
                } else {
                    relation = removeRelatedRelationResult.data;
                }
            }

            relation = await prisma.entity_type_relation.update({
                where: { id: relation.id },
                data: {
                    annulled_at: new Date,
                    annulled_by: system_subscription_user_id,
                    updated_at: new Date,
                    updated_by: system_subscription_user_id
                }
            });

            if(isPosibleTransaction) {
                await prisma.commit();
            }

            return {
                data: relation,
                errors: errors
            };
        } catch(e: any) {
            if(isPosibleTransaction) {
                await prisma.rollback();
            }

            if(e === successCode) {
                return {
                    errors: null,
                    data: relation
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
    };

    async addEntityTypeRelationship(params: any, config: {
        name?: string;
        error_name?: string;
        system_subscription_user_id: string;
        prisma?: PrismaTransactionOrService;
        validateInitialParams?: boolean;
        entity_type?: entity_type | null;
        entity_type_related?: entity_type | null;
    }): Promise<{data: {relation: entity_type_relation, related_relation: entity_type_relation} | null; errors: HandlerErrors;}> {
        let {
            prisma,
            entity_type,
            entity_type_related
        } = config;
        const isPosibleTransaction = !prisma,
            errors = new HandlerErrors,
            {
                name = config.name ?? "entity type",
                error_name = config.error_name ?? "entity_type",
                validateInitialParams = config.validateInitialParams ?? true,
                system_subscription_user_id,
            } = config;

        if(validateInitialParams == true) {
            const ErrorsRelation = this.validateRelationshipParams(params, {
                name: `related entity type`,
                error_name:`${error_name}.entity_type_related`
            });

            if(ErrorsRelation instanceof HandlerErrors) {
                return {
                    errors: ErrorsRelation,
                    data: null
                };
            }

            params = ErrorsRelation;
        } else {
            params.conditions = this.formatConditionsToBoolean(params.conditions);
            params.related_conditions = this.formatConditionsToBoolean(params.related_conditions);
        }

        if(isPosibleTransaction) {
            prisma = await this.prisma.beginTransaction();
        }

        try {
            entity_type ??= await prisma.entity_type.findUnique({where: {id: params.entity_type_id}});
            entity_type_related ??= !entity_type ? null : await prisma.entity_type.findUnique({where: {id: params.entity_type_related_id}});

            let relation: entity_type_relation | null = null,
                related_relation: entity_type_relation | null = null,
                entity_type_relations: entity_type_relation[] = (!entity_type || !entity_type_related) ? [] : await prisma.entity_type_relation.findMany({
                    where: {
                        OR: [
                            {
                                entity_type_id: params.entity_type_id,
                                entity_type_related_id: params.entity_type_related_id
                            },
                            {
                                entity_type_id: params.entity_type_related_id,
                                entity_type_related_id: params.entity_type_id
                            }
                        ]
                    }
                });

            if(!entity_type) {
                errors.set(`${error_name}.entity_type_id`, `The ${name} ID does not found!`);
            } else if(!entity_type_related) {
                errors.set(`${error_name}.entity_type_related_id`, `The ${name} related ID does not found!`);
            }

            if(errors.exists()) {
                throw errors;
            }

            entity_type_relations.forEach((rel: entity_type_relation) => {
                if(rel.entity_type_id === entity_type.id) {
                    relation = rel;
                    return;
                }

                related_relation = rel;
            });

            if(!relation) {
                relation = await prisma.entity_type_relation.create({
                    data: {
                        entity_type_id: entity_type.id,
                        entity_type_related_id: entity_type_related.id,
                        ...params.conditions,
                        created_by: system_subscription_user_id
                    }
                });
            } else {
                const relationValidationResult = await this.validateExistingRelationOrUpdate({
                    prisma,
                    relation,
                    entity_type,
                    entity_type_related,
                    error_name,
                    conditions: params.conditions,
                    conditions_name: "conditions",
                    system_subscription_user_id
                });

                if(relationValidationResult instanceof HandlerErrors) {
                    errors.merege(relationValidationResult);
                } else {
                    relation = relationValidationResult;
                }
            }

            if(!related_relation) {
                related_relation = await prisma.entity_type_relation.create({
                    data: {
                        entity_type_id: entity_type_related.id,
                        entity_type_related_id: entity_type.id,
                        ...params.related_conditions,
                        created_by: system_subscription_user_id
                    }
                });
            } else {
                const relationValidationResult = await this.validateExistingRelationOrUpdate({
                    prisma,
                    relation: related_relation,
                    entity_type: entity_type_related,
                    entity_type_related: entity_type,
                    error_name,
                    conditions: params.related_conditions,
                    conditions_name: "related_conditions",
                    system_subscription_user_id
                });

                if(relationValidationResult instanceof HandlerErrors) {
                    errors.merege(relationValidationResult);
                } else {
                    related_relation = relationValidationResult;
                }
            }

            if(errors.exists()) {
                throw errors;
            }

            if(isPosibleTransaction) {
                await prisma.commit();
            }

            return {
                data: {
                    relation,
                    related_relation
                },
                errors: null
            };
        } catch(e: any) {
            if(isPosibleTransaction) {
                await prisma.rollback();
            }

            if(e instanceof HandlerErrors) {
                return {
                    errors: e,
                    data: null
                };
            }

            throw e;
        }
    };


    async createOrUpdateEntityType(params: {
        [key: string | number]: any;
        system_subscription_user_id: string;
    } | any, prisma?: PrismaTransactionOrService) {
        const isPosibleTransaction = !prisma,
            name = ((typeof params === "object" && !Array.isArray(params) ? params : {}) ?? {}).name ?? "entity type",
            error_name = ((typeof params === "object" && !Array.isArray(params) ? params : {}) ?? {}).error_name ?? "entity_type",
            errors = new HandlerErrors;
        let entity_type: entity_type | null

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
            params.entity_type_relationships.forEach((relation: any, index) => {
                const ErrorsRelation = this.validateRelationshipParams(relation, {
                    name: `entity type relationship No. ${index}`,
                    error_name:`${error_name}.entity_type_relationships.${index}`,
                    validateEntityTypeID: false
                });

                if(ErrorsRelation instanceof HandlerErrors) {
                    errors.merege(ErrorsRelation);
                }
            });
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

                if(
                    !errors.exists(`${error_name}.is_hierarchical`, `${error_name}.entity_type_child_id`)
                    && (params.is_hierarchical ?? null) != null
                    && booleanFormat(params.is_hierarchical) === false
                    && Array.isArray(params.entity_type_child_id)
                ) {
                    errors.set(`${error_name}.entity_type_child_id`, `Entity types cannot be defined that are dependent on the entity type to be processed!`);
                }
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
            entity_type = is_creating ? null : await prisma.entity_type.findUnique({where: {id: params.entity_type_id}});
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

                    is_hierarchical:        booleanFormat(params.is_hierarchical) ?? (!entity_type ? false : entity_type.is_hierarchical),
                    applies_to_natural:     booleanFormat(params.applies_to_natural) ?? (!entity_type ? false : entity_type.applies_to_natural),
                    applies_to_legal:       booleanFormat(params.applies_to_legal) ?? (!entity_type ? false : entity_type.applies_to_legal),
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
                const currentEntityTypeParents = await prisma.entity_type_hierarchy.findMany({
                    where: {
                        entity_type_id: entity_type.id,
                        NOT: {
                            entity_type_parent_id: params.entity_type_parent_id
                        },
                        annulled_at: null
                    }
                });
                let parentToProcess = 0;

                for(const currentParent of currentEntityTypeParents) {
                    const relationAnnulatedResult = await this.removeEntityTypeParent({
                        params: {
                            entity_type_id: currentParent.entity_type_id,
                            entity_type_parent_id: entity_type.id
                        },
                        config: {
                            name: `${name} current_parent No. ${parentToProcess}`,
                            error_name: `${error_name}.current_parent.${parentToProcess}`,
                            system_subscription_user_id: params.system_subscription_user_id
                        }
                    });

                    if(relationAnnulatedResult.errors.existsErrors()) {
                        errors.merege(relationAnnulatedResult.errors);
                    }

                    parentToProcess++;
                }

                parentToProcess = 0;
                for(const id of params.entity_type_parent_id) {
                    const addParentResult = await this.addEntityTypeParent({
                        params: {
                            entity_type_id: entity_type.id,
                            entity_type_parent_id: id
                        },
                        config: {
                            name: `${name} parent No.${parentToProcess}`,
                            error_name: `${error_name}.parent.${parentToProcess}`,
                            system_subscription_user_id: params.system_subscription_user_id
                        }
                    }, prisma);

                    if(addParentResult.errors.existsErrors()) {
                        errors.merege(addParentResult.errors);
                    }

                    parentToProcess++;
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
                }
            }

            const isRoot = await this.getEntityTypeRootID(entity_type.id, prisma) === entity_type.id;

            if(isRoot) {
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
                        const dependentEntitiesTypesIDs: string[] = convertJSONStringToJSON((((await prisma.$queryRaw`select
                            json_agg(et.id) as ids
                        from entity_type et
                        inner join (
                            select
                                reth.id,
                                reth.root_id
                            from view_recursive_entity_type_hierarchy reth
                            group by reth.id,
                                reth.root_id
                        ) reth
                            on reth.id = et.id
                            and reth.root_id <> et.id
                        inner join entity_type etr
                            on etr.id = reth.root_id
                        where etr.id = ${entity_type.id}` as [{ids: string}] | [])[0] ?? {ids: null}).ids) ?? null);

                        if(dependentEntitiesTypesIDs !== null && (typeof dependentEntitiesTypesIDs) === "object") {
                            await prisma.entity_type.updateMany({
                                where: { id: { in: dependentEntitiesTypesIDs } },
                                data: {
                                    is_hierarchical: entity_type.is_hierarchical,
                                    applies_to_natural: entity_type.applies_to_natural,
                                    applies_to_legal: entity_type.applies_to_legal,
                                    updated_at: new Date()
                                }
                            });
                        }
                    }
                }

                if(Array.isArray(params.entity_type_relationships)) {
                    const currentRelationships = await prisma.entity_type_relation.findMany({
                        where: {
                            entity_type_id: entity_type.id,
                            NOT: {
                                entity_type_related_id: params.entity_type_relationships.filter(rel => ((rel ?? null) !== null && typeof rel === 'object' && !Array.isArray(rel) && "entity_type_related_id" in rel && typeof rel.entity_type_related_id === 'string')).map((rel: any) => rel.entity_type_related_id)
                            },
                            annulled_at: null
                        }
                    });

                    let relationToProcessCounter = 0;
                    for(const relationToDelete of currentRelationships) {
                        const removeRelationResult = await this.removeEntityTypeRelationship({
                            entity_type: entity_type,
                            entity_type_related: relationToDelete.entity_type_related_id,
                            relation: relationToDelete,

                            name: `${name} current relation No. ${relationToProcessCounter}`,
                            error_name: `${error_name}.current_relation.${relationToProcessCounter}`,

                            system_subscription_user_id: params.system_subscription_user_id,
                            prisma
                        });

                        if(removeRelationResult.errors.exists()) {
                            errors.merege(removeRelationResult.errors);
                        }

                        relationToProcessCounter++;
                    }

                    relationToProcessCounter = 0;

                    for(const relationship of params.entity_type_relationships) {
                        const entityTypeRelationResult = await this.addEntityTypeRelationship(relationship, {
                            entity_type: entity_type,
                            name: `${name} relation No. ${relationToProcessCounter}`,
                            error_name: `${error_name}.relation.${relationToProcessCounter}`,
                            validateInitialParams: true,
                            system_subscription_user_id: params.system_subscription_user_id,
                            prisma
                        });

                        if(entityTypeRelationResult.errors.exists()) {
                            errors.merege(entityTypeRelationResult.errors);
                        }

                        relationToProcessCounter++;
                    }
                }
            }

            if(Array.isArray(params.entity_type_child_id)) {
                const currentEntityTypeChildren = await prisma.entity_type_hierarchy.findMany({
                    where: {
                        entity_type_parent_id: entity_type.id,
                        NOT: {
                            entity_type_id: params.entity_type_child_id
                        },
                        annulled_at: null
                    }
                });
                let childrenToProcess = 0;

                for(const currentEntityTypeChild of currentEntityTypeChildren) {
                    const relationAnnulatedResult = await this.removeEntityTypeParent({
                        params: {
                            entity_type_id: currentEntityTypeChild.entity_type_id,
                            entity_type_parent_id: entity_type.id
                        },
                        config: {
                            name: `${name} current child No. ${childrenToProcess}`,
                            error_name: `${error_name}.current_child.${childrenToProcess}`,
                            system_subscription_user_id: params.system_subscription_user_id
                        }
                    });

                    if(relationAnnulatedResult.errors.existsErrors()) {
                        errors.merege(relationAnnulatedResult.errors);
                    }

                    childrenToProcess++;
                }

                childrenToProcess = 0;
                for(const id of params.entity_type_parent_id) {
                    const addParentResult = await this.addEntityTypeParent({
                        params: {
                            entity_type_id: id,
                            entity_type_parent_id: entity_type.id
                        },
                        config: {
                            name: `${name} child No. ${childrenToProcess}`,
                            error_name: `${error_name}.child.${childrenToProcess}`,
                            system_subscription_user_id: params.system_subscription_user_id
                        }
                    }, prisma);

                    if(addParentResult.errors.existsErrors()) {
                        errors.merege(addParentResult.errors);
                    }
                }
            }

            if(errors.exists()) {
                throw errors;
            }

            if(isPosibleTransaction) {
                await prisma.commit();
            }

            return {
                errors: errors,
                data: entity_type
            };
        } catch(e: any) {
            if(isPosibleTransaction) {
                await prisma.rollback();
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
}