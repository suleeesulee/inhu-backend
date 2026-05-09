import { ReviewCoreService } from '@libs/core/review/review-core.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetAllReviewDto } from './dto/request/get-all-review.dto';
import { ReviewEntity } from './entity/review.entity';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewCoreService: ReviewCoreService) {}

  async deleteReviewByIdx(reviewIdx: number): Promise<void> {
    await this.reviewCoreService.deleteReviewByIdx(reviewIdx);
  }

  public async getAllReview(dto: GetAllReviewDto): Promise<{
    reviewList: ReviewEntity[];
    hasNext: boolean;
    totalCount: number;
  }> {
    const pageSize = 10;
    const take = pageSize + 1;
    const skip = (dto.page - 1) * pageSize;

    const reviewModelList = await this.reviewCoreService.getAllReview({
      take,
      skip,
      ...dto,
    });
    const totalCount = await this.reviewCoreService.getAllReviewCount({
      take,
      skip,
      ...dto,
    });

    return {
      reviewList: reviewModelList
        .slice(0, pageSize)
        .map((review) => ReviewEntity.fromModel(review)),
      totalCount,
      hasNext: reviewModelList.length > pageSize,
    };
  }

  public async getReviewByIdx(idx: number): Promise<ReviewEntity> {
    const review = await this.reviewCoreService.getReviewByIdx(idx);

    if (!review) {
      throw new NotFoundException('Cannot find review');
    }

    return ReviewEntity.fromModel(review);
  }
}
