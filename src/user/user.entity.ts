// User entity
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Expense } from '../expense/expense.entity';
import { Income } from '../income/income.entity';
import { Account } from '../account/account.entity';
import { MonthlyBudget } from '../monthly-budget/monthly-budget.entity';
import { CustomCategory } from '../custom-category/custom-category.entity';
import { RecurringExpense } from '../recurring-expense/recurring-expense.entity';
import { Partnership } from '../partnership/partnership.entity';
import { SharedTransaction } from '../shared-transaction/shared-transaction.entity';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Field({ nullable: true })
  @Column({ nullable: true })
  profile_image?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Field()
  @Column({ default: false })
  use_shared_balance: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true, default: false })
  is_synced?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  server_user_id?: string;

  @OneToMany(() => Expense, expense => expense.user)
  expenses: Expense[];

  @OneToMany(() => Income, income => income.user)
  incomes: Income[];

  @OneToMany(() => Account, account => account.user)
  accounts: Account[];

  @OneToMany(() => MonthlyBudget, monthlyBudget => monthlyBudget.user)
  monthlyBudgets: MonthlyBudget[];

  @OneToMany(() => CustomCategory, customCategory => customCategory.user)
  customCategories: CustomCategory[];

  @OneToMany(() => RecurringExpense, recurringExpense => recurringExpense.user)
  recurringExpenses: RecurringExpense[];

  @OneToMany(() => Partnership, partnership => partnership.user1)
  partnershipsAsUser1: Partnership[];

  @OneToMany(() => Partnership, partnership => partnership.user2)
  partnershipsAsUser2: Partnership[];

  @OneToMany(() => SharedTransaction, sharedTransaction => sharedTransaction.created_by_user)
  createdSharedTransactions: SharedTransaction[];
}
