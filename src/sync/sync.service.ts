// Sync service for premium users
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Expense } from '../expense/expense.entity';
import { Income } from '../income/income.entity';

export interface SyncData {
  expenses: any[];
  incomes: any[];
  accounts: any[];
  categories: any[];
}

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {}

  async syncUserData(userId: string, localData: SyncData): Promise<{ success: boolean; message: string }> {
    try {
      // Verify user is premium
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user || !user.isPremium) {
        throw new Error('Premium subscription required');
      }

      // Sync expenses
      for (const expenseData of localData.expenses) {
        const expense = this.expenseRepository.create({
          ...expenseData,
          user: { id: userId },
        });
        await this.expenseRepository.save(expense);
      }

      // Sync incomes
      for (const incomeData of localData.incomes) {
        const income = this.incomeRepository.create({
          ...incomeData,
          user: { id: userId },
        });
        await this.incomeRepository.save(income);
      }

      return { success: true, message: 'Data synchronized successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getUserSyncData(userId: string): Promise<SyncData> {
    const expenses = await this.expenseRepository.find({
      where: { user: { id: userId } },
      order: { date: 'DESC' },
    });

    const incomes = await this.incomeRepository.find({
      where: { user: { id: userId } },
      order: { date: 'DESC' },
    });

    return {
      expenses,
      incomes,
      accounts: [], // TODO: Implement accounts sync
      categories: [], // TODO: Implement categories sync
    };
  }

  async upgradeToPremium(userId: string, subscriptionType: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      // Calculate expiration date based on subscription type
      const now = new Date();
      let expiresAt: Date;

      switch (subscriptionType) {
        case 'monthly':
          expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
          break;
        case 'annual':
          expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 365 days
          break;
        case 'lifetime':
          expiresAt = new Date('2099-12-31'); // Far future date
          break;
        default:
          throw new Error('Invalid subscription type');
      }

      await this.userRepository.update(userId, {
        isPremium: true,
        premiumExpiresAt: expiresAt,
      });

      return { success: true, message: 'Successfully upgraded to premium' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}