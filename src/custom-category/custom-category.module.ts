// Custom Category module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomCategory } from './custom-category.entity';
import { CustomCategoryService } from './custom-category.service';
import { CustomCategoryResolver } from './custom-category.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CustomCategory])],
  providers: [CustomCategoryService, CustomCategoryResolver],
  exports: [CustomCategoryService],
})
export class CustomCategoryModule {}