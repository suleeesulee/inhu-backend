import { Module } from '@nestjs/common';
import { MoodCategoryLogCoreService } from './mood-category-log-core.service';
import { MoodCategoryLogCoreRepository } from './mood-category-log-core.repository';

@Module({
  imports: [],
  providers: [MoodCategoryLogCoreService, MoodCategoryLogCoreRepository],
  exports: [MoodCategoryLogCoreService],
})
export class MoodCategoryLogCoreModule {}
