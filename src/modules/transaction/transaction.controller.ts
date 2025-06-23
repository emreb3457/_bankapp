import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @Get()
    findAll() {
        return this.transactionService.findAll();
    }

    @Post()
    async processTransactions(@Body() transactionDto: TransactionDto) {
        return this.transactionService.processTransactions(transactionDto.transactions);
    }
}