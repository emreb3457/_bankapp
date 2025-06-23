import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';
import { Bank } from './entities/bank.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Bank])],
    providers: [BankService],
    controllers: [BankController],
    exports: [BankService],
})
export class BankModule { }