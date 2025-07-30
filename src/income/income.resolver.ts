// Income resolver
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { IncomeService } from './income.service';
import { Income } from './income.entity';
import { CreateIncomeInput } from './dto/create-income.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UpdateIncomeInput } from './dto/update-income.input';

@Resolver(() => Income)
export class IncomeResolver {
  constructor(private readonly incomeService: IncomeService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Income])
  async incomes(@Context() ctx) {
    return this.incomeService.findAll(ctx.req.user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Income)
  async income(@Args('id') id: number, @Context() ctx) {
    return this.incomeService.findOne(id, ctx.req.user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Income)
  async createIncome(@Args('input') input: CreateIncomeInput, @Context() ctx) {
    const data = { ...input, date: new Date(input.date) };
    return this.incomeService.create(data, ctx.req.user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Income)
  async updateIncome(@Args('id') id: number, @Args('input') input: UpdateIncomeInput, @Context() ctx) {
    const data = { ...input, date: input.date ? new Date(input.date) : undefined };
    return this.incomeService.update(id, data, ctx.req.user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async removeIncome(@Args('id') id: number, @Context() ctx) {
    return this.incomeService.remove(id, ctx.req.user);
  }
}
