import { DailyMemoCoreModule } from '@libs/core/daily-memo/daily-memo-core.module';
import { Module } from '@nestjs/common';
import { DailyMemoController } from './daily-memo.controller';
import { DailyMemoService } from './daily-memo.service';

@Module({
  imports: [DailyMemoCoreModule],
  controllers: [DailyMemoController],
  providers: [DailyMemoService],
})
export class DailyMemoModule {}
