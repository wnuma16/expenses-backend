// Account service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { User } from '../user/user.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(data: Partial<Account>, user: User): Promise<Account> {
    const account = this.accountRepository.create({ ...data, user });
    return this.accountRepository.save(account);
  }

  async findAll(user: User): Promise<Account[]> {
    return this.accountRepository.find({ where: { user: { id: user.id } } });
  }

  async findOne(id: string, user: User): Promise<Account> {
    const account = await this.accountRepository.findOne({ where: { id, user: { id: user.id } } });
    if (!account) {
      throw new Error('Account not found');
    }
    return account;
  }

  async update(id: string, data: Partial<Account>, user: User): Promise<Account> {
    const account = await this.findOne(id, user);
    Object.assign(account, data);
    return this.accountRepository.save(account);
  }

  async remove(id: string, user: User): Promise<boolean> {
    await this.accountRepository.delete({ id, user: { id: user.id } });
    return true;
  }

  async createFromSync(data: any, user: User): Promise<Account> {
    const accountData = {
      name: data.name,
      type: data.type,
      balance: data.balance || 0.0,
      icon_code: data.icon_code || 57544,
      color: data.color || 4280391411,
      is_active: data.is_active !== undefined ? data.is_active : true,
      created_at: data.created_at ? new Date(data.created_at) : new Date(),
      local_id: data.local_id,
    };
    return this.create(accountData, user);
  }
}