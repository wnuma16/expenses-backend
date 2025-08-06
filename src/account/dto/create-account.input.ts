// Create account input DTO
import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreateAccountInput {
  @Field()
  name: string;

  @Field()
  type: string;

  @Field(() => Float, { defaultValue: 0.0 })
  balance: number;

  @Field(() => Int, { defaultValue: 57544 })
  icon_code: number;

  @Field(() => Float, { defaultValue: 4280391411.0 })
  color: number;

  @Field({ defaultValue: true })
  is_active: boolean;

  @Field()
  created_at: string;
}