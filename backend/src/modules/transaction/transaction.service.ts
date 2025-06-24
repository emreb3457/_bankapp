import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Bank } from '../bank/entities/bank.entity';
import { Person } from '../person/entities/person.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

export type TransactionResult = {
    personId: number;
    amount: number;
    status: string;
    error?: string;
};

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
        private dataSource: DataSource,
    ) { }

    async findAll() {
        const transaction = await this.transactionRepository.find({ relations: ['person', 'bank'] });

        if (!transaction?.length) {
            throw new HttpException("Not found", HttpStatus.NOT_FOUND);
        }
        return transaction;

    }

    async processTransactions(transactions: CreateTransactionDto[]): Promise<TransactionResult[]> {
        const results = await Promise.all(
            transactions.map(async (dto) => {
                const queryRunner = this.dataSource.createQueryRunner();
                await queryRunner.connect();
                await queryRunner.startTransaction();

                try {
                    const person = await queryRunner.manager.findOne(Person, {
                        where: { id: dto.personId }
                    });
                    // I used a lock here because there could be a race condition
                    const bank = await queryRunner.manager.findOne(Bank, {
                        where: { id: 1 },
                        lock: { mode: 'pessimistic_write' }
                    });

                    if (!person || !bank) throw new Error('Person or Bank not found');

                    bank.balance = Number(bank.balance) + Number(dto.amount);
                    await queryRunner.manager.save(bank);

                    const transaction = this.transactionRepository.create({
                        person,
                        bank,
                        amount: dto.amount,
                        status: 'success',
                    });

                    await queryRunner.manager.save(transaction);

                    await queryRunner.commitTransaction();
                    return { personId: dto.personId, amount: dto.amount, status: 'success' };
                } catch (e) {
                    await queryRunner.rollbackTransaction();
                    return { personId: dto.personId, amount: dto.amount, status: 'failed', error: e.message };
                } finally {
                    await queryRunner.release();
                }
            })
        );

        return results;
    }
}