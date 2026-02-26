import { ReviewLogCoreService } from '@libs/log-core/review-log-core/review-log-core.service';
import { Injectable } from '@nestjs/common';
import { ReviewTb } from './events/review-tb.event';
import { ReviewKeywordMappingTb } from './events/review_keyword-mapping-tb.event';
import { ReviewImageTb } from './events/review-image-tb.event';

@Injectable()
export class ReviewCdcService {
  constructor(private readonly reviewLogCoreService: ReviewLogCoreService) {}

  public async createDimReview(review: ReviewTb, time: Date) {
    await this.reviewLogCoreService.createDimReview(
      {
        idx: review.idx,
        userIdx: review.user_idx,
        placeIdx: review.place_idx,
        content: review.content,
        isMenuChecked: review.is_menu_checked,
        registeredAt: new Date(review.created_at),
        deletedAt: review.deleted_at ? new Date(review.deleted_at) : null,
      },
      time,
    );
  }

  public async createDimReviewKeywordMapping(
    reviewKeywordMapping: ReviewKeywordMappingTb,
    time: Date,
    deletedAt: Date | null = null,
  ) {
    await this.reviewLogCoreService.createDimReviewKeywordMapping(
      {
        reviewIdx: reviewKeywordMapping.review_idx,
        keywordIdx: reviewKeywordMapping.keyword_idx,
        deletedAt,
      },
      time,
    );
  }

  public async createDimReviewImage(
    reviewImage: ReviewImageTb,
    time: Date,
    deletedAt: Date | null = null,
  ) {
    await this.reviewLogCoreService.createDimReviewImage(
      {
        idx: reviewImage.idx,
        reviewIdx: reviewImage.review_idx,
        imagePath: reviewImage.image_path,
        deletedAt,
      },
      time,
    );
  }
}
