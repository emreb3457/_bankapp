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

    async findAll() {
        const transaction = await this.transactionRepository.find({ relations: ['person', 'bank'] });

        if (!transaction?.length) {
            throw new HttpException("Not found", HttpStatus.NOT_FOUND);
        }
        return transaction;

    }

    async processTransactions(transactions: CreateTransactionDto[]): Promise<TransactionResult[]> {
        const results: TransactionResult[] = [];
        for (const dto of transactions) {
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                const person = await queryRunner.manager.findOne(Person, { where: { id: dto.personId } });
                const [bank] = await queryRunner.manager.find(Bank);
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