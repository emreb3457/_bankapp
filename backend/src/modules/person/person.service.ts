import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';

@Injectable()
export class PersonService {
    constructor(
        @InjectRepository(Person)
        private personRepository: Repository<Person>,
    ) { }

    async findAll() {
        const person = await this.personRepository.find();

        if (!person?.length) {
            throw new HttpException("Not found", HttpStatus.NOT_FOUND);
        }
        return person;
    }
}