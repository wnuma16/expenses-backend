// Monthly Budget entity
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from '../user/user.entity';

@ObjectType()
@Entity()
export class MonthlyBudget {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Float)
  @Column('float')
  amount: number;

  @Field()
  @Column()
  month: string;

  @Field()
  @Column()
  created_at: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  is_synced?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  server_budget_id?: string;

  @ManyToOne(() => User, user => user.monthlyBudgets)
  user: User;
}