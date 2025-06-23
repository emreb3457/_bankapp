import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PersonService } from './person.service';

@ApiTags('persons')
@Controller('persons')
export class PersonController {
    constructor(private readonly personService: PersonService) { }

    @Get()
    findAll() {
        return this.personService.findAll();
    }
}