// Shared Transaction entity
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import { Partnership } from '../partnership/partnership.entity';

@ObjectType()
@Entity()
export class SharedTransaction {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Float)
  @Column('float')
  amount: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  category?: string;

  @Field()
  @Column({ default: 'expense' })
  type: string;

  @Field()
  @Column()
  date: Date;

  @Field()
  @Column({ default: 'equal' })
  split_type: string;

  @Field(() => Float, { nullable: true })
  @Column('float', { nullable: true })
  user1_amount?: number;

  @Field(() => Float, { nullable: true })
  @Column('float', { nullable: true })
  user2_amount?: number;

  @Field(() => Float, { nullable: true })
  @Column('float', { nullable: true })
  user1_percentage?: number;

  @Field(() => Float, { nullable: true })
  @Column('float', { nullable: true })
  user2_percentage?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  image_path?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, default: false })
  is_synced?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  server_transaction_id?: string;

  @ManyToOne(() => Partnership, partnership => partnership.sharedTransactions)
  partnership: Partnership;

  @ManyToOne(() => User, user => user.createdSharedTransactions)
  created_by_user: User;
}