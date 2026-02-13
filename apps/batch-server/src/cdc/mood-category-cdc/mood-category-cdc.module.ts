import { Module } from '@nestjs/common';
import { MoodCategoryCdcController } from './mood-category-cdc.controller';
import { MoodCategoryCdcService } from './mood-category-cdc.service';
import { MoodCategoryLogCoreModule } from '@libs/log-core/mood-category-log-core/mood-category-log-core.module';

@Module({
  imports: [MoodCategoryLogCoreModule],
  controllers: [MoodCategoryCdcController],
  providers: [MoodCategoryCdcService],
})
export class MoodCategoryCdcModule {}
