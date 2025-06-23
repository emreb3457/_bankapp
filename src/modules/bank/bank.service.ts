import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from './entities/bank.entity';

@Injectable()
export class BankService {
    constructor(
        @InjectRepository(Bank)
        private bankRepository: Repository<Bank>,
    ) { }

    findOne() {
        return this.bankRepository.findOne({ where: { id: 1 } });
    }
}