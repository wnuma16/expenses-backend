// Account entity
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { User } from '../user/user.entity';

@ObjectType()
@Entity()
export class Account {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  type: string;

  @Field(() => Float)
  @Column('float', { default: 0.0 })
  balance: number;

  @Field(() => Int)
  @Column('int', { default: 57544 })
  icon_code: number;

  @Field(() => Float)
  @Column('float', { default: 4280391411.0 })
  color: number;

  @Field()
  @Column({ default: true })
  is_active: boolean;

  @Field()
  @Column()
  created_at: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  local_id?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, default: false })
  is_synced?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  server_account_id?: string;

  @ManyToOne(() => User, user => user.accounts)
  user: User;
}