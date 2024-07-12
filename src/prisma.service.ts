import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import EventEmitter from 'events';

export interface TransactionPrisma extends Prisma.TransactionClient {
    rollback: () => void;
    commit:  () => void
};

type QueryUnsafeParams = string | {
    query: string;
    values?: any[];
    prismaTransactionInstance?: TransactionPrisma
}

export type PrismaTransactionOrService = PrismaClient | Prisma.TransactionClient;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }

    // return transaction prisma instance:
    public beginTransaction(): Promise<TransactionPrisma> {
        return new Promise(async (resolve) => {
            const emmiter: EventEmitter = new EventEmitter();
            let transaction: TransactionPrisma,
                isPrismaError = true;

            try {
                await this.$transaction(async (tx) => {
                    isPrismaError = false;
                    transaction = Object.assign(tx, {
                        rollback: () => emmiter.emit('rollback'),
                        commit: () => emmiter.emit('commit')
                    });

                    resolve(transaction);

                    await (new Promise((res, rej) => {
                        emmiter.on('commit', () => {
                            emmiter.removeAllListeners();
                            res(true);
                        });

                        emmiter.on('rollback', () => {
                            emmiter.removeAllListeners();
                            rej('Error');
                        });
                    }));
                });
            } catch(e: any) {
                if(isPrismaError) {
                    throw e;
                }
            }
        });
    }

    private getQueryUnsafeParams(params: QueryUnsafeParams) {
        return {
            values: (typeof params === 'string') ? [] : params.values,
            prismaTransactionInstance: (typeof params === 'string') ? undefined : params.prismaTransactionInstance,
            query: (typeof params === 'string') ? params : params.query
        };
    }

    // recive unsafe query and return array records or empty array
    public async queryUnsafe(params: QueryUnsafeParams) {
        const { values, prismaTransactionInstance, query } = this.getQueryUnsafeParams(params);

        const data: any[] = await (prismaTransactionInstance ?? this).$queryRawUnsafe(query, ...values) ?? [];

        return data;
    }

    // recive unsafe query and return one record or null:
    public async findOneUnsafe(params: QueryUnsafeParams) {
        const { values, prismaTransactionInstance, query } = this.getQueryUnsafeParams(params);

        const data: any[] = await (prismaTransactionInstance ?? this).$queryRawUnsafe(query, ...values) ?? [];

        return data.length > 0 ? data[0] : null;
    }

    // return array records or empty array
    /* public async where({
        model,
        where,
        ordering,
        prismaTransactionInstance,
        values
    } : {
        model: string,
        where?: string,
        ordering?: string,
        prismaTransactionInstance?: TransactionPrisma,
        values?: any[]
    }) {
        const query = `SELECT
            *
        FROM ${model}
        ${(where ?? '').trim().length < 1 ? '' : ("WHERE ").concat(where)}
        ${(ordering ?? '').trim().length < 1 ? '' : ("ORDER BY ").concat(ordering)}`;

        const data: any[] = await (prismaTransactionInstance ?? this).$queryRawUnsafe(query, values) ?? [];

        return data;
    } */
}