// Recurring Expense entity
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from '../user/user.entity';

@ObjectType()
@Entity()
export class RecurringExpense {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => Float)
  @Column('float')
  amount: number;

  @Field()
  @Column()
  category: string;

  @Field()
  @Column()
  frequency: string;

  @Field()
  @Column()
  next_date: Date;

  @Field()
  @Column({ default: true })
  is_active: boolean;

  @Field()
  @Column()
  created_at: Date;

  @ManyToOne(() => User, user => user.recurringExpenses)
  user: User;
}