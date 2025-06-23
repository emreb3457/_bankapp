import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Bank } from '../bank/entities/bank.entity';
import { Person } from '../person/entities/person.entity';
import { DataSource } from 'typeorm';

export type TransactionResult = {
    personId: number;
    amount: number;
    status: 'success' | 'failed';
    error?: string;
};

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
        private dataSource: DataSource,
    ) { }

    findAll() {
        return this.transactionRepository.find({ relations: ['person', 'bank'] });
    }

    async processTransactions(transactions: CreateTransactionDto[]): Promise<TransactionResult[]> {
        const results: TransactionResult[] = [];
        for (const dto of transactions) {
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                const person = await queryRunner.manager.findOne(Person, { where: { id: dto.personId } });
                const bank = await queryRunner.manager.findOne(Bank, { where: { id: 1 } });
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
                results.push({ personId: dto.personId, amount: dto.amount, status: 'success' });
            } catch (error) {
                await queryRunner.rollbackTransaction();
                results.push({ personId: dto.personId, amount: dto.amount, status: 'failed', error: error.message });
            } finally {
                await queryRunner.release();
            }
        }
        return results;
    }
}