// Update account input DTO
import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class UpdateAccountInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  type?: string;

  @Field(() => Float, { nullable: true })
  balance?: number;

  @Field(() => Int, { nullable: true })
  icon_code?: number;

  @Field(() => Float, { nullable: true })
  color?: number;

  @Field({ nullable: true })
  is_active?: boolean;
}