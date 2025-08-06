// UpdateIncomeInput DTO
import { InputType, Field, Float } from '@nestjs/graphql';
import { IsOptional, IsNumber, IsDateString } from 'class-validator';

@InputType()
export class UpdateIncomeInput {
  @Field({ nullable: true })
  @IsOptional()
  category?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  date?: string;

  @Field({ nullable: true })
  @IsOptional()
  note?: string;

  @Field({ nullable: true })
  @IsOptional()
  account_id?: string;
}
