// Monthly Budget resolver
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MonthlyBudgetService } from './monthly-budget.service';
import { MonthlyBudget } from './monthly-budget.entity';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => MonthlyBudget)
export class MonthlyBudgetResolver {
  constructor(private readonly monthlyBudgetService: MonthlyBudgetService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [MonthlyBudget])
  async monthlyBudgets(@Context() ctx) {
    return this.monthlyBudgetService.findAll(ctx.req.user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => MonthlyBudget)
  async monthlyBudget(@Args('id') id: string, @Context() ctx) {
    return this.monthlyBudgetService.findOne(id, ctx.req.user);
  }
}