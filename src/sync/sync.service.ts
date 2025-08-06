// Sync service for premium users
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Expense } from '../expense/expense.entity';
import { Income } from '../income/income.entity';
import { Account } from '../account/account.entity';
import { MonthlyBudget } from '../monthly-budget/monthly-budget.entity';
import { CustomCategory } from '../custom-category/custom-category.entity';
import { RecurringExpense } from '../recurring-expense/recurring-expense.entity';
import { Partnership } from '../partnership/partnership.entity';
import { SharedTransaction } from '../shared-transaction/shared-transaction.entity';

export interface SyncData {
  expenses: any[];
  incomes: any[];
  accounts: any[];
  categories: any[];
  monthlyBudgets?: any[];
  customCategories?: any[];
  recurringExpenses?: any[];
  partnerships?: any[];
  sharedTransactions?: any[];
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
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(MonthlyBudget)
    private readonly monthlyBudgetRepository: Repository<MonthlyBudget>,
    @InjectRepository(CustomCategory)
    private readonly customCategoryRepository: Repository<CustomCategory>,
    @InjectRepository(RecurringExpense)
    private readonly recurringExpenseRepository: Repository<RecurringExpense>,
    @InjectRepository(Partnership)
    private readonly partnershipRepository: Repository<Partnership>,
    @InjectRepository(SharedTransaction)
    private readonly sharedTransactionRepository: Repository<SharedTransaction>,
  ) {}

  async syncUserData(userId: string, localData: SyncData): Promise<{ success: boolean; message: string; synced_expenses?: any[]; synced_incomes?: any[]; synced_accounts?: any[]; synced_categories?: any[] }> {
    try {
      console.log('🔄 SYNC: Datos recibidos para usuario:', userId);
      console.log('🔄 SYNC: Categorías recibidas:', localData.categories?.length || 0);
      if (localData.categories && localData.categories.length > 0) {
        console.log('🔄 SYNC: Primera categoría:', localData.categories[0]);
      }
      
      // Verify user is premium
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user || !user.isPremium) {
        throw new Error('Premium subscription required');
      }

      const syncedExpenses: { local_id: any; server_id: any }[] = [];
      const syncedIncomes: { local_id: any; server_id: any }[] = [];
      const syncedAccounts: { local_id: any; server_id: string }[] = [];
      const syncedCategories: { local_id: any; server_id: string }[] = [];

      // Sync expenses
      for (const expenseData of localData.expenses) {
        // Check if expense already exists by local_id
        const existingExpense = await this.expenseRepository.findOne({
          where: { 
            local_id: expenseData.local_id,
            user: { id: userId }
          }
        });

        if (!existingExpense) {
          // Only create if it doesn't exist
          const expense = this.expenseRepository.create({
            category: expenseData.category,
            amount: expenseData.amount,
            date: new Date(expenseData.date),
            description: expenseData.description,
            account_id: expenseData.account_id,
            local_id: expenseData.local_id,
            user: { id: userId },
          });
          const savedExpense = await this.expenseRepository.save(expense);
          syncedExpenses.push({
            local_id: expenseData.local_id,
            server_id: savedExpense.id,
          });
        } else {
          // Return existing expense info
          syncedExpenses.push({
            local_id: expenseData.local_id,
            server_id: existingExpense.id,
          });
        }
      }

      // Sync incomes
      for (const incomeData of localData.incomes) {
        // Check if income already exists by local_id
        const existingIncome = await this.incomeRepository.findOne({
          where: { 
            local_id: incomeData.local_id,
            user: { id: userId }
          }
        });

        if (!existingIncome) {
          // Only create if it doesn't exist
          const income = this.incomeRepository.create({
            category: incomeData.category,
            amount: incomeData.amount,
            date: new Date(incomeData.date),
            description: incomeData.description,
            account_id: incomeData.account_id,
            local_id: incomeData.local_id,
            user: { id: userId },
          });
          const savedIncome = await this.incomeRepository.save(income);
          syncedIncomes.push({
            local_id: incomeData.local_id,
            server_id: savedIncome.id,
          });
        } else {
          // Return existing income info
          syncedIncomes.push({
            local_id: incomeData.local_id,
            server_id: existingIncome.id,
          });
        }
      }

      // Sync accounts
      for (const accountData of localData.accounts) {
        // Check if account already exists by local_id
        let existingAccount = await this.accountRepository.findOne({
          where: { 
            local_id: accountData.local_id,
            user: { id: userId }
          }
        });

        if (existingAccount) {
          // Update existing account
          existingAccount.name = accountData.name;
          existingAccount.type = accountData.type;
          existingAccount.balance = accountData.balance || 0.0;
          existingAccount.icon_code = accountData.icon_code || 57544;
          existingAccount.color = accountData.color || 4280391411;
          existingAccount.is_active = accountData.is_active !== undefined ? accountData.is_active : true;
          
          const savedAccount = await this.accountRepository.save(existingAccount);
          syncedAccounts.push({
            local_id: accountData.local_id,
            server_id: savedAccount.id,
          });
        } else {
          // Create new account
          const account = this.accountRepository.create({
            name: accountData.name,
            type: accountData.type,
            balance: accountData.balance || 0.0,
            icon_code: accountData.icon_code || 57544,
            color: accountData.color || 4280391411,
            is_active: accountData.is_active !== undefined ? accountData.is_active : true,
            created_at: accountData.created_at ? new Date(accountData.created_at) : new Date(),
            local_id: accountData.local_id,
            user: { id: userId },
          });
          const savedAccount = await this.accountRepository.save(account);
          syncedAccounts.push({
            local_id: accountData.local_id,
            server_id: savedAccount.id,
          });
        }
      }

      // Sync categories
      for (const categoryData of localData.categories || []) {
        // Check if category already exists by local_id
        let existingCategory = await this.customCategoryRepository.findOne({
          where: { 
            local_id: categoryData.local_id,
            user: { id: userId }
          }
        });

        if (existingCategory) {
          // Update existing category
          existingCategory.name = categoryData.name;
          existingCategory.type = categoryData.type;
          existingCategory.icon_code = categoryData.icon_code || 57544;
          existingCategory.color = categoryData.color || 4280391411;
          
          const savedCategory = await this.customCategoryRepository.save(existingCategory);
          syncedCategories.push({
            local_id: categoryData.local_id,
            server_id: savedCategory.id,
          });
        } else {
          // Create new category
          const category = this.customCategoryRepository.create({
            name: categoryData.name,
            type: categoryData.type,
            icon_code: categoryData.icon_code || 57544,
            color: categoryData.color || 4280391411,
            created_at: categoryData.created_at ? new Date(categoryData.created_at) : new Date(),
            local_id: categoryData.local_id,
            user: { id: userId },
          });
          const savedCategory = await this.customCategoryRepository.save(category);
          syncedCategories.push({
            local_id: categoryData.local_id,
            server_id: savedCategory.id,
          });
        }
      }

      return { 
        success: true, 
        message: 'Data synchronized successfully',
        synced_expenses: syncedExpenses,
        synced_incomes: syncedIncomes,
        synced_accounts: syncedAccounts,
        synced_categories: syncedCategories,
      };
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

    const accounts = await this.accountRepository.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });

    const categories = await this.customCategoryRepository.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });

    return {
      expenses,
      incomes,
      accounts,
      categories,
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