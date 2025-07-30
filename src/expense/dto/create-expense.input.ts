// CreateExpenseInput DTO
import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsDateString, IsOptional } from 'class-validator';

@InputType()
export class CreateExpenseInput {
  @Field()
  @IsNotEmpty()
  category: string;

  @Field(() => Float)
  @IsNumber()
  amount: number;

  @Field()
  @IsDateString()
  date: string;

  @Field({ nullable: true })
  @IsOptional()
  note?: string;
}
