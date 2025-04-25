import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import EventEmitter from 'events';

type QueryUnsafeParams = string | {
    query: string;
    values?: any[];
}

export type TransactionPrisma = Prisma.TransactionClient & {
    isTransaction: () => boolean;
    rollback: () => void;
    commit:  () => void;
    /* queryUnsafe: <type>(params: QueryUnsafeParams) => Promise<type[]>;
    findOneUnsafe: <type>(params: QueryUnsafeParams) => Promise<null | type>; */
};

export type PrismaTransactionOrService = PrismaService | TransactionPrisma;


type QueryEvent = {
    timestamp: Date;
    query: string;      // La consulta SQL
    params: string;     // Los parámetros de la consulta
    duration: number;   // Duración en ms
    target: string;
  };
  
  type ErrorEvent = {
    timestamp: Date;
    message: string;    // Mensaje de error
    target: string;
    meta?: {
      code?: string;
      query?: string;
      params?: string;
      [key: string]: unknown;
    };
  };
  

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super({
          log: [
            { emit: 'event', level: 'query' },
            { emit: 'event', level: 'error' },
            { emit: 'event', level: 'warn' },
          ],
        });
      }

      async onModuleInit() {
        await this.$connect();
        // this.setupLogging();
      }

      private setupLogging() {
        // Para el evento de query
        /* (this.$on as any)('query', (e: QueryEvent) => {
          console.log('\n--- PRISMA QUERY ---');
          console.log('Query:', e.query);
          console.log('Params:', e.params);
          console.log('Duration:', e.duration, 'ms');
          console.log('-------------------\n');
        }); */

        // Para el evento de error
        (this.$on as any)('error', (e: ErrorEvent) => {
          console.error('\n--- PRISMA ERROR ---');
          console.error('Message:', e.message);
          console.error('Code:', e.meta?.code);
          console.error('Query:', e.meta?.query);
          console.error('Params:', e.meta?.params);
          console.error('-------------------\n');
        });
      }

    public isTransaction(): boolean {
        return false;
    }

    // return transaction prisma instance:
    public beginTransaction(): Promise<TransactionPrisma> {
        return new Promise(async (resolve) => {
            const emmiter: EventEmitter = new EventEmitter(),
                rollbackError = (Date.now()).toString().concat('-rollbackError'),
                transactionAction = async (event: string) => {
                    emmiter.emit(event);

                    return (new Promise(res => {
                        emmiter.on('endTransaction', () => {
                            res(true);
                        });
                    }))
                },
                endTransaction = () => {
                    emmiter.emit('endTransaction');
                    emmiter.removeAllListeners();
                };
            let transaction: TransactionPrisma;

            try {
                await this.$transaction(async (tx) => {
                    transaction = Object.assign(tx, {
                        rollback: () => transactionAction('rollback'),
                        commit: () => transactionAction('commit'),
                        isTransaction: () => true
                    });

                    resolve(transaction);

                    await (new Promise((res, rej) => {
                        emmiter.on('commit', () => res(true));

                        emmiter.on('rollback', () => rej(rollbackError));
                    }));

                    endTransaction();
                });
            } catch(e: any) {
                if(e !== rollbackError) {
                    emmiter.removeAllListeners();
                    throw e;
                }

                endTransaction();
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