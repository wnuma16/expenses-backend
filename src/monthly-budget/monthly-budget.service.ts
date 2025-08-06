// Monthly Budget service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonthlyBudget } from './monthly-budget.entity';
import { User } from '../user/user.entity';

@Injectable()
export class MonthlyBudgetService {
  constructor(
    @InjectRepository(MonthlyBudget)
    private readonly monthlyBudgetRepository: Repository<MonthlyBudget>,
  ) {}

  async create(data: Partial<MonthlyBudget>, user: User): Promise<MonthlyBudget> {
    const monthlyBudget = this.monthlyBudgetRepository.create({ ...data, user });
    return this.monthlyBudgetRepository.save(monthlyBudget);
  }

  async findAll(user: User): Promise<MonthlyBudget[]> {
    return this.monthlyBudgetRepository.find({ where: { user: { id: user.id } } });
  }

  async findOne(id: string, user: User): Promise<MonthlyBudget> {
    const monthlyBudget = await this.monthlyBudgetRepository.findOne({ where: { id, user: { id: user.id } } });
    if (!monthlyBudget) {
      throw new Error('Monthly budget not found');
    }
    return monthlyBudget;
  }

  async update(id: string, data: Partial<MonthlyBudget>, user: User): Promise<MonthlyBudget> {
    const monthlyBudget = await this.findOne(id, user);
    Object.assign(monthlyBudget, data);
    return this.monthlyBudgetRepository.save(monthlyBudget);
  }

  async remove(id: string, user: User): Promise<boolean> {
    await this.monthlyBudgetRepository.delete({ id, user: { id: user.id } });
    return true;
  }
}