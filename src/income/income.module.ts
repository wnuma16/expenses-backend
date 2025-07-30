// Income module setup
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './income.entity';
import { IncomeService } from './income.service';
import { IncomeResolver } from './income.resolver';


@Module({
  imports: [TypeOrmModule.forFeature([Income])],
  providers: [IncomeService, IncomeResolver],
  exports: [IncomeService],
})
export class IncomeModule {}
