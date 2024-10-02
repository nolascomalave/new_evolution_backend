import { Prisma, PrismaClient } from '@prisma/client';
import EventEmitter from 'events';

export type PrismaTransaction = Prisma.TransactionClient & {
    isTransaction: () => true;
    rollback: () => void;
    commit:  () => void;
};

export class ExtendedPrisma extends PrismaClient {
    public isTransaction() {
        return false;
    }

    // return transaction prisma instance:
    public beginTransaction(): Promise<PrismaTransaction> {
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
            let transaction: PrismaTransaction;

            try {
                await this.$transaction(async (tx) => {
                    transaction = Object.assign(tx, {
                        isTransaction: () => true,
                        rollback: () => transactionAction('rollback'),
                        commit: () => transactionAction('commit')
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
}

export type PrismaTransactionOrService = ExtendedPrisma | PrismaTransaction;