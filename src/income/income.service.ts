// Income service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Income } from './income.entity';
import { User } from '../user/user.entity';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {}

  async create(data: Partial<Income>, user: User): Promise<Income> {
    const income = this.incomeRepository.create({ ...data, user });
    return this.incomeRepository.save(income);
  }

  async findAll(user: User): Promise<Income[]> {
    return this.incomeRepository.find({ where: { user: { id: user.id } } });
  }

  async findOne(id: number, user: User): Promise<Income | null> {
    return this.incomeRepository.findOne({ where: { id, user: { id: user.id } } });
  }

  async update(id: number, data: Partial<Income>, user: User): Promise<Income> {
    const income = await this.findOne(id, user);
    if (!income) throw new Error('Income not found');
    Object.assign(income, data);
    return this.incomeRepository.save(income);
  }

  async remove(id: number, user: User): Promise<boolean> {
    await this.incomeRepository.delete({ id, user: { id: user.id } });
    return true;
  }
}
