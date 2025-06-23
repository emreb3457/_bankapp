import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsInt, Min, ValidateNested } from 'class-validator';

export class CreateTransactionDto {
    @ApiProperty({
        description: 'person id',
        example: 1,
        minimum: 1
    })
    @IsInt()
    @Min(1)
    personId: number;

    @ApiProperty({
        description: 'Transaction amount',
        example: 100,
        minimum: 1
    })
    @IsInt()
    @Min(1)
    amount: number;
}

export class TransactionDto {
    @ApiProperty({
        description: 'Transaction list',
        type: [CreateTransactionDto],
        example: [
            { personId: 1, amount: 100 },
            { personId: 2, amount: 200 }
        ]
    })
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateTransactionDto)
    transactions: CreateTransactionDto[];
} 