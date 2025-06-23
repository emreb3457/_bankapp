import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from './entities/bank.entity';

@Injectable()
export class BankService {
    constructor(
        @InjectRepository(Bank)
        private bankRepository: Repository<Bank>,
    ) { }

    async findOne() {
        const bank = await this.bankRepository.find({});

        if (!bank?.[0]) {
            throw new HttpException("Not found", HttpStatus.NOT_FOUND);
        }
        return bank[0];
    }
}