import { LogPrismaService } from '@libs/common/modules/log-prisma/log-prisma.service';
import { LOG_PRISMA_KEY } from '@libs/common/modules/log-prisma/LOG_PRISMA_KEY';
import {
  InjectTransactionHost,
  TransactionHost,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { CreateInputWrapper } from '../types/input-wrapper';
import { CreateDimMagazineInput } from './inputs/create-dim-magazine.input';
import { CreateDimMagazineLikeInput } from './inputs/create-dim-magazine-like.input';
import { CreateDimPlaceTypeMagazineMappingInput } from './inputs/create-dim-place-type-magazine-mapping.input';
import { CreateDimMainCategoryMappingInput } from './inputs/create-dim-magazine-main-category-mapping.input';
import { CreateDimMoodCategoryMappingInput } from './inputs/create-dim-magazine-mood-category-mapping.input';

@Injectable()
export class MagazineLogCoreRepository {
  constructor(
    @InjectTransactionHost(LOG_PRISMA_KEY)
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<LogPrismaService>
    >,
  ) {}

  public async insertDimMagazine(
    input: CreateInputWrapper<CreateDimMagazineInput>,
  ) {
    return await this.txHost.tx.dimMagazines.upsert({
      where: {
        idx_validFrom: {
          idx: input.idx,
          validFrom: input.validFrom,
        },
      },
      create: {
        idx: input.idx,
        authorIdx: input.authorIdx,
        title: input.title,
        description: input.description,
        content: input.content,
        thumbnailImagePath: input.thumbnailImagePath,
        isTitleVisible: input.isTitleVisible,
        likeCount: input.likeCount,
        viewCount: input.viewCount,
        registeredAt: input.registeredAt,
        activatedAt: input.activatedAt,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
      update: {
        idx: input.idx,
        authorIdx: input.authorIdx,
        title: input.title,
        description: input.description,
        content: input.content,
        thumbnailImagePath: input.thumbnailImagePath,
        isTitleVisible: input.isTitleVisible,
        likeCount: input.likeCount,
        viewCount: input.viewCount,
        registeredAt: input.registeredAt,
        activatedAt: input.activatedAt,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
    });
  }

  public async insertDimMagazineLike(
    input: CreateInputWrapper<CreateDimMagazineLikeInput>,
  ) {
    return await this.txHost.tx.dimMagazineLikes.upsert({
      where: {
        magazineIdx_userIdx_validFrom: {
          magazineIdx: input.magazineIdx,
          userIdx: input.userIdx,
          validFrom: input.validFrom,
        },
      },
      create: {
        magazineIdx: input.magazineIdx,
        userIdx: input.userIdx,
        registeredAt: input.registeredAt,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
      update: {
        magazineIdx: input.magazineIdx,
        userIdx: input.userIdx,
        registeredAt: input.registeredAt,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
    });
  }

  public async insertDimPlaceTypeMagazineMapping(
    input: CreateInputWrapper<CreateDimPlaceTypeMagazineMappingInput>,
  ) {
    return await this.txHost.tx.dimPlaceTypeMagazineMappings.upsert({
      where: {
        placeTypeIdx_magazineIdx_validFrom: {
          placeTypeIdx: input.placeTypeIdx,
          magazineIdx: input.magazineIdx,
          validFrom: input.validFrom,
        },
      },
      create: {
        placeTypeIdx: input.placeTypeIdx,
        magazineIdx: input.magazineIdx,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
      update: {
        placeTypeIdx: input.placeTypeIdx,
        magazineIdx: input.magazineIdx,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
    });
  }

  public async insertDimMagazineMainCategoryMapping(
    input: CreateInputWrapper<CreateDimMainCategoryMappingInput>,
  ) {
    return await this.txHost.tx.dimMagazineMainCategoryMappings.upsert({
      where: {
        mainCategoryIdx_magazineIdx_validFrom: {
          mainCategoryIdx: input.mainCategoryIdx,
          magazineIdx: input.magazineIdx,
          validFrom: input.validFrom,
        },
      },
      create: {
        mainCategoryIdx: input.mainCategoryIdx,
        magazineIdx: input.magazineIdx,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
      update: {
        mainCategoryIdx: input.mainCategoryIdx,
        magazineIdx: input.magazineIdx,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
    });
  }

  public async insertDimMagazineMoodCategoryMapping(
    input: CreateInputWrapper<CreateDimMoodCategoryMappingInput>,
  ) {
    return await this.txHost.tx.dimMagazineMoodCategoryMappings.upsert({
      where: {
        moodCategoryIdx_magazineIdx_validFrom: {
          moodCategoryIdx: input.moodCategoryIdx,
          magazineIdx: input.magazineIdx,
          validFrom: input.validFrom,
        },
      },
      create: {
        moodCategoryIdx: input.moodCategoryIdx,
        magazineIdx: input.magazineIdx,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
      update: {
        moodCategoryIdx: input.moodCategoryIdx,
        magazineIdx: input.magazineIdx,
        deletedAt: input.deletedAt,
        validFrom: input.validFrom,
      },
    });
  }
}
