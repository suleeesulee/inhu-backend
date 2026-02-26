import { Module } from '@nestjs/common';
import { ReviewLogCoreService } from './review-log-core.service';
import { ReviewLogCoreRepository } from './review-log-core.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [ReviewLogCoreService, ReviewLogCoreRepository],
  exports: [ReviewLogCoreService],
})
export class ReviewLogCoreModule {}
