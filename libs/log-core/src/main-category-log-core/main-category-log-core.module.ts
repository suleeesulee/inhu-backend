import { Module } from '@nestjs/common';
import { MainCategoryLogCoreService } from './main-category-log-core.service';
import { MainCategoryLogCoreRepository } from './main-category-log-core.repository';

@Module({
  imports: [],
  providers: [MainCategoryLogCoreService, MainCategoryLogCoreRepository],
  exports: [MainCategoryLogCoreService],
})
export class MainCategoryLogCoreModule {}
