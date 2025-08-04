// User service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async update(id: string, name?: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new Error('User not found');
    if (name) user.name = name;
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<boolean> {
    await this.userRepository.delete(id);
    return true;
  }
}
