import { LogPrismaService } from '@libs/common/modules/log-prisma/log-prisma.service';
import { LOG_PRISMA_KEY } from '@libs/common/modules/log-prisma/LOG_PRISMA_KEY';
import {
  InjectTransactionHost,
  TransactionHost,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { CreateInputWrapper } from '../types/input-wrapper';
import { CreateDimReviewInput } from './inputs/create-dim-review.input';
import { CreateDimReviewImageInput } from './inputs/create-dim-review-image.input';
import { CreateDimReviewKeywordMappingInput } from './inputs/create-dim-review-keyword-mapping.input';

@Injectable()
export class ReviewLogCoreRepository {
  constructor(
    @InjectTransactionHost(LOG_PRISMA_KEY)
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<LogPrismaService>
    >,
  ) {}

  public async insertDimReview(
    input: CreateInputWrapper<CreateDimReviewInput>,
  ) {
    return await this.txHost.tx.dimReviews.upsert({
      where: {
        idx_validFrom: {
          idx: input.idx,
          validFrom: input.validFrom,
        },
      },
      create: {
        idx: input.idx,
        userIdx: input.userIdx,
        placeIdx: input.placeIdx,
        content: input.content,
        isMenuChecked: input.isMenuChecked,
        deletedAt: input.deletedAt,
        registeredAt: input.registeredAt,
        validFrom: input.validFrom,
      },
      update: {
        idx: input.idx,
        userIdx: input.userIdx,
        placeIdx: input.placeIdx,
        content: input.content,
        isMenuChecked: input.isMenuChecked,
        deletedAt: input.deletedAt,
        registeredAt: input.registeredAt,
        validFrom: input.validFrom,
      },
    });
  }

  public async insertDimReviewKeywordMapping(
    input: CreateInputWrapper<CreateDimReviewKeywordMappingInput>,
  ) {
    return await this.txHost.tx.dimReviewKeywordMappings.upsert({
      where: {
        reviewIdx_keywordIdx_validFrom: {
          reviewIdx: input.reviewIdx,
          keywordIdx: input.keywordIdx,
          validFrom: input.validFrom,
        },
      },
      create: {
        reviewIdx: input.reviewIdx,
        keywordIdx: input.keywordIdx,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
      update: {
        reviewIdx: input.reviewIdx,
        keywordIdx: input.keywordIdx,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
    });
  }

  public async insertDimReviewImage(
    input: CreateInputWrapper<CreateDimReviewImageInput>,
  ) {
    return await this.txHost.tx.dimReviewImages.upsert({
      where: {
        idx_validFrom: {
          idx: input.idx,
          validFrom: input.validFrom,
        },
      },
      create: {
        idx: input.idx,
        reviewIdx: input.reviewIdx,
        imagePath: input.imagePath,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
      update: {
        idx: input.idx,
        reviewIdx: input.reviewIdx,
        imagePath: input.imagePath,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
    });
  }
}
