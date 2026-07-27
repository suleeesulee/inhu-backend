import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_MAGAZINE,
  SelectMagazine,
} from './model/prisma-type/select-magazine';
import { Prisma } from '@prisma/client';
import { CreateMagazineInput } from './inputs/create-magazine.input';
import { GetAllMagazineInput } from './inputs/get-all-magazine.input';
import {
  SELECT_MAGAZINE_OVERVIEW,
  SelectMagazineOverview,
} from './model/prisma-type/select-magazine-overview';
import { UpdateMagazineInput } from './inputs/update-magazine.input';
import {
  SELECT_LIKED_MAGAZINE_OVERVIEW,
  SelectLikedMagazineOverview,
} from './model/prisma-type/select-liked-magazine-overview';
import { GetAllLikedMagazineInput } from './inputs/get-all-liked-magazine.input';
import { PlaceType } from '../place/constants/place-type.constant';
import { MainCategory } from '../category/constants/main-category.constant';
import { MoodCategory } from '../category/constants/mood-category.constant';

@Injectable()
export class MagazineCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectMagazineByIdx(
    idx: number,
  ): Promise<SelectMagazine | null> {
    return await this.txHost.tx.magazine.findUnique({
      ...SELECT_MAGAZINE,
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public async selectMagazineAll(
    input: GetAllMagazineInput,
  ): Promise<SelectMagazineOverview[]> {
    return await this.txHost.tx.magazine.findMany({
      ...SELECT_MAGAZINE_OVERVIEW,
      where: {
        AND: [
          { deletedAt: null },
          this.getActivatedAtFilterWhereClause(input.activated),
          this.getPinnedAtFilterWhereClause(input.pinned),
          this.getTypesFilterWhereClause(input.typeList), // 타입 필터링
          this.getMainCategoryFilterWhereClause(input.mainCategoryList), // 메인 카테고리 필터링
          this.getMoodCategoryFilterWhereClause(input.moodCategoryList), // 분위기 카테고리 필터링
          this.getSearchKeywordWhereClause(input.searchKeyword), // 검색 키워드 필터링
        ],
      },
      orderBy: this.getOrderByClause(input),
      take: input.take,
      skip: input.skip,
    });
  }

  public async selectLikedMagazineAllByUserIdx(
    input: GetAllLikedMagazineInput,
  ): Promise<SelectLikedMagazineOverview[]> {
    return await this.txHost.tx.magazineLike.findMany({
      ...SELECT_LIKED_MAGAZINE_OVERVIEW,
      where: {
        userIdx: input.userIdx,
        magazine: {
          AND: [
            { deletedAt: null },
            this.getActivatedAtFilterWhereClause(input.activated),
          ],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: input.take,
      skip: input.skip,
    });
  }

  public async selectMagazineCount(
    input: GetAllMagazineInput,
  ): Promise<number> {
    return await this.txHost.tx.magazine.count({
      where: {
        AND: [
          { deletedAt: null },
          this.getActivatedAtFilterWhereClause(input.activated),
        ],
      },
    });
  }

  public async insertMagazine(
    input: CreateMagazineInput,
  ): Promise<SelectMagazine> {
    return await this.txHost.tx.magazine.create({
      ...SELECT_MAGAZINE,
      data: {
        authorIdx: input.authorIdx,
        title: input.title,
        description: input.description,
        content: input.content,
        thumbnailImagePath: input.thumbnailImagePath,
        isTitleVisible: input.isTitleVisible,
        placeList: input.placeIdxList
          ? {
              createMany: {
                data: input.placeIdxList.map((placeIdx) => ({
                  placeIdx,
                })),
              },
            }
          : undefined,
      },
    });
  }

  public async updateMagazineByIdx(
    idx: number,
    input: UpdateMagazineInput,
  ): Promise<void> {
    await this.txHost.tx.magazine.update({
      where: { idx, deletedAt: null },
      data: {
        title: input.title,
        description: input.description,
        content: input.content,
        thumbnailImagePath: input.thumbnailImagePath,
        isTitleVisible: input.isTitleVisible,
        activatedAt: input.activate ? new Date() : null,
        placeList: input.placeIdxList
          ? {
              deleteMany: {},
              createMany: {
                data: input.placeIdxList.map((placeIdx) => ({
                  placeIdx,
                })),
              },
            }
          : undefined,
        placeTypeMagazineMappingList: input.typeList
          ? {
              deleteMany: {},
              createMany: {
                data: input.typeList.map((typeIdx) => ({
                  placeTypeIdx: typeIdx,
                })),
              },
            }
          : undefined,
        magazineMainCategoryMappingList: input.mainCategoryList
          ? {
              deleteMany: {},
              createMany: {
                data: input.mainCategoryList.map((mainCategoryIdx) => ({
                  mainCategoryIdx,
                })),
              },
            }
          : undefined,
        magazineMoodCategoryMappingList: input.moodCategoryList
          ? {
              deleteMany: {},
              createMany: {
                data: input.moodCategoryList.map((moodCategoryIdx) => ({
                  moodCategoryIdx,
                })),
              },
            }
          : undefined,
      },
    });
  }

  public async softDeleteMagazineByIdx(idx: number): Promise<void> {
    await this.txHost.tx.magazine.update({
      data: { deletedAt: new Date() },
      where: { idx },
    });
  }

  public async increaseMagazineLikeCount(
    idx: number,
    count: number,
  ): Promise<void> {
    await this.txHost.tx.magazine.update({
      data: {
        likeCount: { increment: count },
      },
      where: { idx, deletedAt: null },
    });
  }

  public async decreaseMagazineLikeCount(
    idx: number,
    count: number,
  ): Promise<void> {
    await this.txHost.tx.magazine.update({
      data: {
        likeCount: { decrement: count },
      },
      where: { idx, deletedAt: null },
    });
  }

  public async increaseMagazineViewCount(
    idx: number,
    count: number,
  ): Promise<void> {
    await this.txHost.tx.magazine.update({
      data: {
        viewCount: { increment: count },
      },
      where: { idx, deletedAt: null },
    });
  }

  private getActivatedAtFilterWhereClause(
    activated?: boolean,
  ): Prisma.MagazineWhereInput {
    if (activated === undefined) {
      return {};
    }

    if (activated) {
      return { activatedAt: { not: null } };
    }

    return { activatedAt: null };
  }

  private getPinnedAtFilterWhereClause(
    pinned?: boolean,
  ): Prisma.MagazineWhereInput {
    if (pinned === undefined) {
      return {};
    }
    if (pinned) {
      return { pinnedMagazine: { isNot: null } };
    }
    return { pinnedMagazine: null };
  }

  private getOrderByClause({
    orderBy,
    pinned,
  }: Pick<GetAllMagazineInput, 'orderBy' | 'pinned'>):
    | Prisma.MagazineOrderByWithRelationInput
    | Prisma.MagazineOrderByWithRelationInput[] {
    const orderByMap: Record<string, Prisma.MagazineOrderByWithRelationInput> =
      {
        like: { likeCount: 'desc' },
        view: { viewCount: 'desc' },
        time: { createdAt: 'desc' },
      };

    const orderByClause = orderByMap[orderBy ?? 'time'];

    // if (pinned == undefined) {
    //   return [{ pinnedMagazine: { createdAt: 'desc' } }, orderByClause];
    // }
    return orderByClause;
  }

  private getTypesFilterWhereClause(
    typeList?: PlaceType[],
  ): Prisma.MagazineWhereInput {
    if (typeList === undefined || typeList.length === 0) {
      return {};
    }

    return {
      placeTypeMagazineMappingList: {
        some: { placeTypeIdx: { in: typeList } },
      },
    };
  }

  private getMainCategoryFilterWhereClause(
    mainCategoryList?: MainCategory[],
  ): Prisma.MagazineWhereInput {
    if (mainCategoryList === undefined || mainCategoryList.length === 0) {
      return {};
    }

    return {
      AND: mainCategoryList.map((category) => ({
        magazineMainCategoryMappingList: {
          some: { mainCategoryIdx: category },
        },
      })),
    };
  }

  private getMoodCategoryFilterWhereClause(
    moodCategoryList?: MoodCategory[],
  ): Prisma.MagazineWhereInput {
    if (moodCategoryList === undefined || moodCategoryList.length === 0) {
      return {};
    }

    return {
      AND: moodCategoryList.map((category) => ({
        magazineMoodCategoryMappingList: {
          some: { moodCategoryIdx: category },
        },
      })),
    };
  }

  /**
   * 검색 키워드
   */
  private getSearchKeywordWhereClause(
    searchKeyword?: string,
  ): Prisma.MagazineWhereInput {
    if (!searchKeyword) {
      return {};
    }

    const trimmedSearchKeyword = searchKeyword.trim();

    return {
      OR: [
        { title: { contains: trimmedSearchKeyword } },
        { description: { contains: trimmedSearchKeyword } },
        { content: { contains: trimmedSearchKeyword } },
      ],
    };
  }
}
