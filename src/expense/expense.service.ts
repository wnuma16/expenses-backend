// Expense service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async create(data: Partial<Expense>, user: User): Promise<Expense> {
    const expense = this.expenseRepository.create({ ...data, user });
    return this.expenseRepository.save(expense);
  }

  async findAll(user: User): Promise<Expense[]> {
    return this.expenseRepository.find({ where: { user: { id: user.id } } });
  }

  async findOne(id: number, user: User): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({ where: { id, user: { id: user.id } } });
    if (!expense) {
      throw new Error('Expense not found');
    }
    return expense;
  }

  async update(id: number, data: Partial<Expense>, user: User): Promise<Expense> {
    const expense = await this.findOne(id, user);
    Object.assign(expense, data);
    return this.expenseRepository.save(expense);
  }

  async remove(id: number, user: User): Promise<boolean> {
    await this.expenseRepository.delete({ id, user: { id: user.id } });
    return true;
  }
}
