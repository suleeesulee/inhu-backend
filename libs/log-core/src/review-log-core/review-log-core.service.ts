import { Injectable } from '@nestjs/common';
import { ReviewLogCoreRepository } from './review-log-core.repository';
import { CreateDimReviewInput } from './inputs/create-dim-review.input';
import { CreateDimReviewImageInput } from './inputs/create-dim-review-image.input';
import { Transactional } from '@nestjs-cls/transactional';
import { CreateDimReviewKeywordMappingInput } from './inputs/create-dim-review-keyword-mapping.input';

@Injectable()
export class ReviewLogCoreService {
  constructor(
    private readonly reviewLogCoreRepository: ReviewLogCoreRepository,
  ) {}

  @Transactional()
  public async createDimReview(input: CreateDimReviewInput, updatedAt: Date) {
    await this.reviewLogCoreRepository.insertDimReview({
      ...input,
      validFrom: updatedAt,
    });
  }

  @Transactional()
  public async createDimReviewKeywordMapping(
    input: CreateDimReviewKeywordMappingInput,
    updatedAt: Date,
  ) {
    await this.reviewLogCoreRepository.insertDimReviewKeywordMapping({
      ...input,
      validFrom: updatedAt,
    });
  }

  @Transactional()
  public async createDimReviewImage(
    input: CreateDimReviewImageInput,
    updatedAt: Date,
  ) {
    await this.reviewLogCoreRepository.insertDimReviewImage({
      ...input,
      validFrom: updatedAt,
    });
  }
}
