import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_PLACE_VISIT,
  SelectPlaceVisit,
} from './model/prisma-type/select-place-visit';
import { CreatePlaceVisitInput } from './model/inputs/create-place-visit.input';
import { GetPlaceVisitAllInput } from './model/inputs/get-place-visit-all.input';
import { GetPlaceVisitStatisticAllInput } from './model/inputs/get-place-visit-statistic-all.input';
import {
  SELECT_PLACE_VISIT_STATISTIC,
  SelectPlaceVisitStatistic,
} from './model/prisma-type/select-place-visit-statistic';

@Injectable()
export class PlaceVisitCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  // 방문 인증 내역용
  public async selectPlaceVisitAllByUserIdx(
    userIdx: number,
    dto: GetPlaceVisitAllInput,
  ): Promise<SelectPlaceVisit[]> {
    return await this.txHost.tx.placeVisit.findMany({
      ...SELECT_PLACE_VISIT,
      where: {
        userIdx,
        nfc: {
          place: {
            deletedAt: null,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: dto.take,
      skip: dto.skip,
    });
  }

  public async selectPlaceVisitById(
    id: string,
  ): Promise<SelectPlaceVisit | null> {
    return await this.txHost.tx.placeVisit.findUnique({
      ...SELECT_PLACE_VISIT,
      where: {
        id,
        nfc: {
          place: {
            deletedAt: null,
          },
        },
      },
    });
  }

  public async selectPlaceVisitStatisticAllByUserIdxAndPeriod(
    userIdx: number,
    input: GetPlaceVisitStatisticAllInput,
  ): Promise<SelectPlaceVisitStatistic[]> {
    return await this.txHost.tx.$queryRaw<SelectPlaceVisitStatistic[]>(
      SELECT_PLACE_VISIT_STATISTIC(userIdx, input.startAt, input.endAt),
    );
  }

  public async insertPlaceVisit(
    input: CreatePlaceVisitInput,
  ): Promise<SelectPlaceVisit> {
    return await this.txHost.tx.placeVisit.create({
      ...SELECT_PLACE_VISIT,
      data: {
        userIdx: input.userIdx,
        nfcIdx: input.nfcIdx,
        score: input.score,
      },
    });
  }
}
