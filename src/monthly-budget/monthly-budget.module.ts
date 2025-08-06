// Monthly Budget module setup
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyBudget } from './monthly-budget.entity';
import { MonthlyBudgetService } from './monthly-budget.service';
import { MonthlyBudgetResolver } from './monthly-budget.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyBudget])],
  providers: [MonthlyBudgetService, MonthlyBudgetResolver],
  exports: [MonthlyBudgetService],
})
export class MonthlyBudgetModule {}