// Custom Category resolver
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CustomCategoryService } from './custom-category.service';
import { CustomCategory } from './custom-category.entity';
import { CreateCustomCategoryInput } from './dto/create-custom-category.input';
import { UpdateCustomCategoryInput } from './dto/update-custom-category.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => CustomCategory)
export class CustomCategoryResolver {
  constructor(private readonly customCategoryService: CustomCategoryService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [CustomCategory])
  async customCategories(@Context() ctx) {
    return this.customCategoryService.findAll(ctx.req.user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => CustomCategory, { nullable: true })
  async customCategory(@Args('id') id: string, @Context() ctx) {
    return this.customCategoryService.findOne(id, ctx.req.user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CustomCategory)
  async createCustomCategory(@Args('input') input: CreateCustomCategoryInput, @Context() ctx) {
    return this.customCategoryService.create(input, ctx.req.user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CustomCategory, { nullable: true })
  async updateCustomCategory(@Args('id') id: string, @Args('input') input: UpdateCustomCategoryInput, @Context() ctx) {
    return this.customCategoryService.update(id, input, ctx.req.user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async removeCustomCategory(@Args('id') id: string, @Context() ctx) {
    return this.customCategoryService.remove(id, ctx.req.user);
  }
}