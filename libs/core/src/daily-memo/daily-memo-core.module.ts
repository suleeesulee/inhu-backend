import { Module } from '@nestjs/common';
import { DailyMemoCoreService } from './daily-memo-core.service';
import { DailyMemoCoreRepository } from './daily-memo-core.repository';

@Module({
  providers: [DailyMemoCoreService, DailyMemoCoreRepository],
  exports: [DailyMemoCoreService],
})
export class DailyMemoCoreModule {}
