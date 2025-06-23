import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Person extends BaseEntity {
    @Column()
    name: string;

    @Column({ nullable: true })
    surname: string;
}