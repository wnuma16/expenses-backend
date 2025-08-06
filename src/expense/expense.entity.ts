// Expense entity
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import { Account } from '../account/account.entity';

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
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  note?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  account_id?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  local_id?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  recurring_frequency?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, default: false })
  is_synced?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  server_transaction_id?: string;

  @ManyToOne(() => User, user => user.expenses)
  user: User;

  @ManyToOne(() => Account, { nullable: true })
  account?: Account;
}
