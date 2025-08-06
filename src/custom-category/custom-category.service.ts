// Custom Category service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomCategory } from './custom-category.entity';
import { CreateCustomCategoryInput } from './dto/create-custom-category.input';
import { UpdateCustomCategoryInput } from './dto/update-custom-category.input';
import { User } from '../user/user.entity';

@Injectable()
export class CustomCategoryService {
  constructor(
    @InjectRepository(CustomCategory)
    private readonly customCategoryRepository: Repository<CustomCategory>,
  ) {}

  async findAll(user: User): Promise<CustomCategory[]> {
    return this.customCategoryRepository.find({
      where: { user: { id: user.id } },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<CustomCategory | null> {
    return this.customCategoryRepository.findOne({
      where: { id, user: { id: user.id } },
    });
  }

  async create(input: CreateCustomCategoryInput, user: User): Promise<CustomCategory> {
    const customCategory = this.customCategoryRepository.create({
      ...input,
      user,
      created_at: new Date(),
    });
    return this.customCategoryRepository.save(customCategory);
  }

  async update(id: string, updateCustomCategoryInput: UpdateCustomCategoryInput, user: User): Promise<CustomCategory | null> {
    await this.customCategoryRepository.update(
      { id, user: { id: user.id } },
      updateCustomCategoryInput,
    );
    return this.findOne(id, user);
  }

  async remove(id: string, user: User): Promise<boolean> {
    const result = await this.customCategoryRepository.delete({
      id,
      user: { id: user.id },
    });
    return result.affected ? result.affected > 0 : false;
  }
}