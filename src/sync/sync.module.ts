// Sync module for premium users
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncResolver } from './sync.resolver';
import { SyncService } from './sync.service';
import { User } from '../user/user.entity';
import { Expense } from '../expense/expense.entity';
import { Income } from '../income/income.entity';
import { Account } from '../account/account.entity';
import { MonthlyBudget } from '../monthly-budget/monthly-budget.entity';
import { CustomCategory } from '../custom-category/custom-category.entity';
import { RecurringExpense } from '../recurring-expense/recurring-expense.entity';
import { Partnership } from '../partnership/partnership.entity';
import { SharedTransaction } from '../shared-transaction/shared-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Expense, Income, Account, MonthlyBudget, CustomCategory, RecurringExpense, Partnership, SharedTransaction])],
  providers: [SyncResolver, SyncService],
})
export class SyncModule {}