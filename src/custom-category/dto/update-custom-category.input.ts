// Update Custom Category input DTO
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt } from 'class-validator';
import { CreateCustomCategoryInput } from './create-custom-category.input';

@InputType()
export class UpdateCustomCategoryInput extends PartialType(CreateCustomCategoryInput) {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  icon_code?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  color?: number;
}