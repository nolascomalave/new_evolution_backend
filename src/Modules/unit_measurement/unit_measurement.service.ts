import { Injectable } from "@nestjs/common";
import { unit_measurement } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { PrismaService, TransactionPrisma } from "src/prisma.service";
import HandlerErrors from "src/util/HandlerErrors";

type UnitMeasurementDef = {
    id_unit_measurement?: number;
    id_unit_measurement_type: number;
    id_unit_measurement_relative?: number;
    unit_measurement: string;
    anglo_saxon: boolean;
    name_type?: string;
    value: Decimal;
}

@Injectable()
export class UnitMeasurementService {
    constructor(
        private prisma: PrismaService
        // private resendService: ResendService
    ) {}

    async processUnitMeasurement(um: UnitMeasurementDef, prisma?: TransactionPrisma) {
        const isPosibleTransaction = !prisma,
            errors = new HandlerErrors(),
            isUpdating = 'id_unit_measurement' in um,
            name_type = um.name_type ?? "unit_measurement",
            successRollbackCode = `ok-${Date.now()}`;

        prisma ??= await this.prisma.beginTransaction();

        try {
            let unit_measurement: unit_measurement | null = 'id_unit_measurement' in um ? (await prisma.unit_measurement.findUnique({ where: { id: um.id_unit_measurement } })) : null,
                um_rel: unit_measurement | null = 'id_unit_measurement_base' in um ? (await prisma.unit_measurement.findUnique({ where: { id: um.id_unit_measurement_relative } })) : null,
                um_base: unit_measurement | null = !um_rel ? null : (um_rel.id_unit_measurement_base == null ? um_rel : (await prisma.unit_measurement.findUnique({ where: { id: um_rel.id_unit_measurement_base } })));

            if(isUpdating && !unit_measurement) {
                errors.set(name_type, "Unit measurement not found");
                throw errors;
            }

            if(
                isUpdating
                && unit_measurement.id_unit_measurement_type != um.id_unit_measurement_type
                && unit_measurement.id_unit_measurement_base != (!um_base ? null : um_base.id)
                && unit_measurement.unit_measurement.toLowerCase() != um.unit_measurement.toLowerCase()
                && unit_measurement.anglo_saxon != um.anglo_saxon
                && unit_measurement.value != um.value
            ) {
                throw successRollbackCode;
            }

            if(Number(um.value) < 1) {
                errors.set(`${name_type}.value`, "The value cannot be less than 1");
            }
        } catch(e: any) {
            if(isPosibleTransaction) {
                await prisma.rollback();
            }

            if(e !== successRollbackCode) {

            }
        }
    }
}