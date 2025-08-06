// Partnership entity
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import { SharedTransaction } from '../shared-transaction/shared-transaction.entity';

@ObjectType()
@Entity()
export class Partnership {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ default: 'pending' })
  status: string;

  @Field()
  @Column()
  created_at: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  accepted_at?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  invite_code?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, default: false })
  is_synced?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  server_partnership_id?: string;

  @ManyToOne(() => User, user => user.partnershipsAsUser1)
  user1: User;

  @ManyToOne(() => User, user => user.partnershipsAsUser2)
  user2: User;

  @OneToMany(() => SharedTransaction, sharedTransaction => sharedTransaction.partnership)
  sharedTransactions: SharedTransaction[];
}