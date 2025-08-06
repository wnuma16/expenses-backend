// Account resolver
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './account.entity';
import { CreateAccountInput } from './dto/create-account.input';
import { UpdateAccountInput } from './dto/update-account.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => Account)
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Account])
  async accounts(@Context() ctx) {
    return this.accountService.findAll(ctx.req.user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Account)
  async account(@Args('id') id: string, @Context() ctx) {
    return this.accountService.findOne(id, ctx.req.user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Account)
  async createAccount(@Args('input') input: CreateAccountInput, @Context() ctx) {
    const accountData = {
      ...input,
      created_at: new Date(input.created_at),
    };
    return this.accountService.create(accountData, ctx.req.user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Account)
  async updateAccount(@Args('id') id: string, @Args('input') input: UpdateAccountInput, @Context() ctx) {
    return this.accountService.update(id, input, ctx.req.user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async removeAccount(@Args('id') id: string, @Context() ctx) {
    return this.accountService.remove(id, ctx.req.user);
  }
}