import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from './modules/bank/entities/bank.entity';
import { Person } from './modules/person/entities/person.entity';

@Injectable()
export class AppService implements OnModuleInit {
    constructor(
        @InjectRepository(Person)
        private personRepository: Repository<Person>,
        @InjectRepository(Bank)
        private bankRepository: Repository<Bank>,
    ) { }

    async onModuleInit() {
        this.seeder();
    }

    private async seeder() {
        const personCount = await this.personRepository.count();
        if (!personCount) {
            const persons = [
                { name: 'Emre' },
                { name: 'Laura' },
                { name: 'Karolina' },
                { name: 'Jack' },
            ];
            await this.personRepository.save(persons);
        }

        const bankCount = await this.bankRepository.count();
        if (!bankCount) {
            await this.bankRepository.save({ balance: 10000 });
        }
    }
}