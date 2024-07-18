import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import EventEmitter from 'events';

type QueryUnsafeParams = string | {
    query: string;
    values?: any[];
}

export type TransactionPrisma  = Prisma.TransactionClient & {
    rollback: () => void;
    commit:  () => void;
    /* queryUnsafe: <type>(params: QueryUnsafeParams) => Promise<type[]>;
    findOneUnsafe: <type>(params: QueryUnsafeParams) => Promise<null | type>; */
};

export type PrismaTransactionOrService = PrismaService | TransactionPrisma;

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
                    /* const execTransactionInstanceFunction = async <Type>(fn: (...params: any) => Promise<Type>, ...params) => {
                        isPrismaError = true;
                        const returnData = await fn(...params);
                        isPrismaError = false;

                        return returnData;
                    }; */

                    isPrismaError = false;
                    transaction = Object.assign(tx, {
                        rollback: () => emmiter.emit('rollback'),
                        commit: () => emmiter.emit('commit'),
                        /* queryUnsafe: async <T>(params: QueryUnsafeParams): Promise<T[]> => await execTransactionInstanceFunction<T[]>(this.queryUnsafe, params, tx),
                        findOneUnsafe: async <T>(params: QueryUnsafeParams): Promise<T> => await execTransactionInstanceFunction<T>(this.findOneUnsafe, params, tx) */
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
                }, {
                    isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
                    maxWait: 10000, // default: 2000
                    timeout: 5000, // default: 5000
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
            query: (typeof params === 'string') ? params : params.query
        };
    }

    // recive unsafe query and return array records or empty array, but this function unlike "queryUnsafe", has an optional parameter which must be a transaction instance:
    public async queryUnsafe<T>(params: QueryUnsafeParams, instance?: PrismaTransactionOrService): Promise<T[]> {
        const { values, query } = this.getQueryUnsafeParams(params);

        const data: any[] = await (instance ?? this).$queryRawUnsafe(query, ...values) ?? [];

        return data;
    }

    // recive unsafe query and return array records or empty array, but this function unlike "queryUnsafe", has an optional parameter which must be a transaction instance:
    public async findOneUnsafe<T>(params: QueryUnsafeParams, instance?: PrismaTransactionOrService) : Promise<T | null> {
        const data = await this.queryUnsafe<T>(params, instance);

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