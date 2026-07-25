import { ReviewCoreModule } from '@libs/core/review/review-core.module';
import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { UserCoreModule } from '@libs/core/user/user-core.module';
import { PlaceCoreModule } from '@libs/core/place/place-core.module';

@Module({
  imports: [ReviewCoreModule, UserCoreModule, PlaceCoreModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
