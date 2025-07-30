// User resolver
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [User])
  async users() {
    return this.userService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async me(@Context() ctx) {
    return this.userService.findOne(ctx.req.user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async updateUser(@Args('input') input: UpdateUserInput, @Context() ctx) {
    return this.userService.update(ctx.req.user.userId, input.name);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async removeUser(@Context() ctx) {
    return this.userService.remove(ctx.req.user.userId);
  }
}
