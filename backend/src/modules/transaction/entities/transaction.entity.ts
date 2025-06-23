import { BaseEntity } from 'src/common/entities/base.entity';
import { Bank } from 'src/modules/bank/entities/bank.entity';
import { Person } from 'src/modules/person/entities/person.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Transaction extends BaseEntity {
    @ManyToOne(() => Person)
    person: Person;

    @ManyToOne(() => Bank)
    bank: Bank;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number;

    @Column({ default: 'success', type: 'enum', enum: ['success', 'failed'] })
    status: string;
}