import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BankService } from './bank.service';

@ApiTags('bank')
@Controller('bank')
export class BankController {
    constructor(private readonly bankService: BankService) { }

    @Get('balance')
    async getBalance() {
        const bank = await this.bankService.findOne();
        return { balance: bank?.balance };
    }
}