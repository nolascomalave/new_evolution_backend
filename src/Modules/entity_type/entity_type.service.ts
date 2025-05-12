import { Injectable } from "@nestjs/common";
import { entity_type } from "@prisma/client";
import { PrismaService, PrismaTransactionOrService } from "src/prisma.service";
import HandlerErrors from "src/util/HandlerErrors";
import { validateSimpleText, validateUniqueIdString } from "src/util/validators";

@Injectable()
export class EntityTypeService {
    constructor(
        private prisma: PrismaService
    ) {}

    async createOrUpdateEntityType(params: any, prisma?: PrismaTransactionOrService) {
        const isPosibleTransaction = !prisma,
            name = ((typeof params === "object" && !Array.isArray(params) ? params : {}) ?? {}).name ?? "entity type",
            error_name = ((typeof params === "object" && !Array.isArray(params) ? params : {}) ?? {}).error_name ?? "entity_type";
        let errors = new HandlerErrors;

        if(isPosibleTransaction) {
            prisma = await this.prisma.beginTransaction();
        }

        if(typeof params !== 'object' || Array.isArray(params)) {
            errors.set(`${error_name}.params`, `The ${name} parameters must be defined as a JSON object!`);

            return {
                errors,
                data: null
            };
        }

        errors.set(`${error_name}.entity_type_id`, validateUniqueIdString(params.entity_type_id, `${name} ID`));

        if(!Array.isArray(params.entity_type_parents_id)) {
            errors.set(`${error_name}.entity_type_parents_id`, `The ${name} parents ID parameter must be an array!`);
        } else if(params.entity_type_parents_id.length === 0) {
            errors.set(`${error_name}.entity_type_parents_id`, `The id parents parameter of ${name} must contain at least one id!`);
        }

        params.entity_type_parents_id.forEach((id: any, index) => {
            errors.set(`${error_name}.entity_type_parents_id.${index}`, validateUniqueIdString(id, `${name} parent ID No. ${index + 1}`));
        });

        errors.set(`${error_name}.description`, validateSimpleText(params.description, `${name} description`, 5, 2500, true));

        if(errors.existsErrors()) {
            return {
                errors,
                data: null
            };
        }

        try {
            // const entity_type_parent: entity_type | null  = await this.prisma.entity_type.findUnique({where: {id: params.entity_type_parent_id}});

            /* if(!entity_type_parent) {

            }

            if(!entity_type_parent) {
                errors.set("entity_type_root_id", "Entity type root not found");
            } */
            // const entity_type: entity_type = await prisma.entity_type.upsert({});
        } catch(e: any) {

        }
    }
}