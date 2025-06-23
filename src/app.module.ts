import { config } from 'dotenv';
config();
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './modules/transaction/entities/transaction.entity';
import { Bank } from './modules/bank/entities/bank.entity';
import { Person } from './modules/person/entities/person.entity';
import { BankModule } from './modules/bank/bank.module';
import { PersonModule } from './modules/person/person.module';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USERNAME || 'bankapp',
      password: process.env.DB_PASSWORD || 'bankapppassword',
      database: process.env.DB_DATABASE || 'bankapp',
      entities: [Person, Bank, Transaction],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Person, Bank, Transaction]),
    PersonModule,
    BankModule,
    TransactionModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }