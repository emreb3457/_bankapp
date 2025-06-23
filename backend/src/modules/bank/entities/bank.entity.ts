import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Bank extends BaseEntity {
    @Column()
    name: string;

    @Column({ type: 'decimal', scale: 2, default: 0 })
    balance: number;
}