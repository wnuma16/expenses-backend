// Create Custom Category input DTO
import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

@InputType()
export class CreateCustomCategoryInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  type: string;

  @Field(() => Int)
  @IsInt()
  icon_code: number;

  @Field(() => Int)
  @IsInt()
  color: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  local_id?: string;
}