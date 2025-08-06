// Custom Category entity
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { User } from '../user/user.entity';

@ObjectType()
@Entity()
export class CustomCategory {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  type: string;

  @Field(() => Int)
  @Column('int')
  icon_code: number;

  @Field(() => Int)
  @Column('bigint')
  color: number;

  @Field()
  @Column()
  created_at: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  local_id: string;

  @ManyToOne(() => User, user => user.customCategories)
  user: User;
}