import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';

@Injectable()
export class PersonService {
    constructor(
        @InjectRepository(Person)
        private personRepository: Repository<Person>,
    ) { }

    findAll() {
        return this.personRepository.find();
    }
}