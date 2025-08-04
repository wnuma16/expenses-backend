// Expense resolver
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { Expense } from './expense.entity';
import { CreateExpenseInput } from './dto/create-expense.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UpdateExpenseInput } from './dto/update-expense.input';

@Resolver(() => Expense)
export class ExpenseResolver {
  constructor(private readonly expenseService: ExpenseService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Expense])
  async expenses(@Context() ctx) {
    return this.expenseService.findAll(ctx.req.user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Expense)
  async expense(@Args('id') id: string, @Context() ctx) {
    return this.expenseService.findOne(id, ctx.req.user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Expense)
  async createExpense(@Args('input') input: CreateExpenseInput, @Context() ctx) {
    const expenseData = {
      ...input,
      date: new Date(input.date),
    };
    return this.expenseService.create(expenseData, ctx.req.user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Expense)
  async updateExpense(@Args('id') id: string, @Args('input') input: UpdateExpenseInput, @Context() ctx) {
    const updateData = {
      ...input,
      date: input.date ? new Date(input.date) : undefined,
    };
    return this.expenseService.update(id, updateData, ctx.req.user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async removeExpense(@Args('id') id: string, @Context() ctx) {
    return this.expenseService.remove(id, ctx.req.user);
  }
}
