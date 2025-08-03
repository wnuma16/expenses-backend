// Sync module for premium users
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncResolver } from './sync.resolver';
import { SyncService } from './sync.service';
import { User } from '../user/user.entity';
import { Expense } from '../expense/expense.entity';
import { Income } from '../income/income.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Expense, Income])],
  providers: [SyncResolver, SyncService],
})
export class SyncModule {}