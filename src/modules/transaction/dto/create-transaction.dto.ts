import { IsInt, IsPositive, Min, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
    @IsInt()
    @Min(1)
    personId: number;

    @IsInt()
    @Min(1)
    amount: number;
}

export class TransactionDto {
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateTransactionDto)
    transactions: CreateTransactionDto[];
} 