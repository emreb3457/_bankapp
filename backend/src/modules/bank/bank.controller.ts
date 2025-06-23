import { Controller, Get } from '@nestjs/common';
import { BankService } from './bank.service';

@Controller('bank')
export class BankController {
    constructor(private readonly bankService: BankService) { }

    @Get()
    findOne() {
        return this.bankService.findOne();
    }

    @Get('balance')
    async getBalance() {
        const bank = await this.bankService.findOne();
        return { balance: bank?.balance };
    }
}