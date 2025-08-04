// UpgradePremiumInput DTO
import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

@InputType()
export class UpgradePremiumInput {
  @Field()
  @IsNotEmpty()
  subscriptionType: string;

  @Field()
  @IsNotEmpty()
  paymentMethod: string;

  @Field({ nullable: true })
  @IsOptional()
  paymentToken?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  amount?: number;
}