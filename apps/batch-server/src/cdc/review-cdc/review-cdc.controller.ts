import { Controller } from '@nestjs/common';
import { ReviewCdcService } from './review-cdc.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DebeziumEvent } from '../types/debezium';
import { ReviewTb } from './events/review-tb.event';
import { ReviewKeywordMappingTb } from './events/review_keyword-mapping-tb.event';
import { ReviewImageTb } from './events/review-image-tb.event';

@Controller()
export class ReviewCdcController {
  constructor(private readonly reviewCdcService: ReviewCdcService) {}

  @MessagePattern('inhu.public.review_tb')
  public async reviewTbEvent(@Payload() message: DebeziumEvent<ReviewTb>) {
    if (message.op === 'd' || !message.after) return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());
    await this.reviewCdcService.createDimReview(message.after, time);
  }

  @MessagePattern('inhu.public.review_keyword_mapping_tb')
  public async reviewKeywordMappingTbEvent(
    @Payload() message: DebeziumEvent<ReviewKeywordMappingTb>,
  ) {
    if (
      !message.source ||
      (message.op === 'd' && !message.before) ||
      (message.op === 'c' && !message.after)
    )
      return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());

    if (message.op === 'd') {
      await this.reviewCdcService.createDimReviewKeywordMapping(
        message.before,
        time,
        time,
      );
    } else {
      await this.reviewCdcService.createDimReviewKeywordMapping(
        message.after,
        time,
      );
    }
  }

  @MessagePattern('inhu.public.review_image_tb')
  public async reviewImageTbEvent(
    @Payload() message: DebeziumEvent<ReviewImageTb>,
  ) {
    if (
      !message.source ||
      (message.op === 'd' && !message.before) ||
      (message.op === 'c' && !message.after)
    )
      return;

    const time = new Date(message.source.ts_ms || message.ts_ms || new Date());

    if (message.op === 'd') {
      await this.reviewCdcService.createDimReviewImage(
        message.before,
        time,
        time,
      );
    } else {
      await this.reviewCdcService.createDimReviewImage(message.after, time);
    }
  }
}
