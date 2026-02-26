import { LogPrismaService } from '@libs/common/modules/log-prisma/log-prisma.service';
import { LOG_PRISMA_KEY } from '@libs/common/modules/log-prisma/LOG_PRISMA_KEY';
import {
  InjectTransactionHost,
  TransactionHost,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { CreateInputWrapper } from '../types/input-wrapper';
import { CreateDimMenuInput } from './inputs/create-dim-menu.input';
import { CreateDimMenuReviewInput } from './inputs/create-dim-menu-review.input';

@Injectable()
export class MenuLogCoreRepository {
  constructor(
    @InjectTransactionHost(LOG_PRISMA_KEY)
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<LogPrismaService>
    >,
  ) {}

  public async insertDimMenu(input: CreateInputWrapper<CreateDimMenuInput>) {
    return await this.txHost.tx.dimMenus.upsert({
      where: {
        idx_validFrom: {
          idx: input.idx,
          validFrom: input.validFrom,
        },
      },
      create: {
        idx: input.idx,
        placeIdx: input.placeIdx,
        name: input.name,
        content: input.content,
        price: input.price,
        imagePath: input.imagePath,
        isFlexible: input.isFlexible,
        sortOrder: input.sortOrder,
        isMain: input.isMain,
        deletedAt: input.deletedAt,
        registeredAt: input.registeredAt,
        validFrom: input.validFrom,
      },
      update: {
        idx: input.idx,
        placeIdx: input.placeIdx,
        name: input.name,
        content: input.content,
        price: input.price,
        imagePath: input.imagePath,
        isFlexible: input.isFlexible,
        sortOrder: input.sortOrder,
        isMain: input.isMain,
        deletedAt: input.deletedAt,
        registeredAt: input.registeredAt,
        validFrom: input.validFrom,
      },
    });
  }

  public async insertDimMenuReview(
    input: CreateInputWrapper<CreateDimMenuReviewInput>,
  ) {
    return await this.txHost.tx.dimMenuReviews.upsert({
      where: {
        menuIdx_reviewIdx_validFrom: {
          menuIdx: input.menuIdx,
          reviewIdx: input.reviewIdx,
          validFrom: input.validFrom,
        },
      },
      create: {
        menuIdx: input.menuIdx,
        reviewIdx: input.reviewIdx,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
      update: {
        menuIdx: input.menuIdx,
        reviewIdx: input.reviewIdx,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
    });
  }
}
