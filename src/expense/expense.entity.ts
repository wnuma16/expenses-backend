// Expense entity
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from '../user/user.entity';

@ObjectType()
@Entity()
export class Expense {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  category: string;

  @Field(() => Float)
  @Column('float')
  amount: number;

  @Field()
  @Column()
  date: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  note?: string;

  @ManyToOne(() => User, user => user.expenses)
  user: User;
}
