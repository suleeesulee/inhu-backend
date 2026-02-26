import { Module } from '@nestjs/common';
import { ReviewCdcController } from './review-cdc.controller';
import { ReviewCdcService } from './review-cdc.service';
import { ReviewLogCoreModule } from '@libs/log-core/review-log-core/review-log-core.module';

@Module({
  imports: [ReviewLogCoreModule],
  controllers: [ReviewCdcController],
  providers: [ReviewCdcService],
})
export class ReviewCdcModule {}
