// User entity
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Expense } from '../expense/expense.entity';
import { Income } from '../income/income.entity';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field()
  @Column({ default: false })
  isPremium: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'timestamp' })
  premiumExpiresAt?: Date;

  @OneToMany(() => Expense, expense => expense.user)
  expenses: Expense[];

  @OneToMany(() => Income, income => income.user)
  incomes: Income[];
}
