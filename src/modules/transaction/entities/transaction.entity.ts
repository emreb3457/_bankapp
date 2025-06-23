import { Bank } from 'src/modules/bank/entities/bank.entity';
import { Person } from 'src/modules/person/entities/person.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Person)
    person: Person;

    @ManyToOne(() => Bank)
    bank: Bank;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: 'success', type: 'enum', enum: ['success', 'failure'] })
    status: string;
}