import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

  public async selectPlaceVisitAll(
    input: GetPlaceVisitAllInput,
  ): Promise<SelectPlaceVisit[]> {
    const order = input.order ?? 'desc';

    return await this.txHost.tx.placeVisit.findMany({
      ...SELECT_PLACE_VISIT,
      where: {
        deletedAt: null,
        ...this.getPlaceIdxFilterWhereClause(input.placeIdx),
        ...this.getUserIdxFilterWhereClause(input.userIdx),
      },
      orderBy: [{ createdAt: order }, { id: order }],
      take: input.take,
      skip: input.skip,
    });
  }

  public async selectPlaceVisitCount(
    input: GetPlaceVisitAllInput,
  ): Promise<number> {
    return await this.txHost.tx.placeVisit.count({
      where: {
        deletedAt: null,
        ...this.getPlaceIdxFilterWhereClause(input.placeIdx),
        ...this.getUserIdxFilterWhereClause(input.userIdx),
      },
    });
  }

  // 방문 인증 내역용
  public async selectPlaceVisitAllByUserIdx(
    userIdx: number,
    input: GetPlaceVisitAllInput,
  ): Promise<SelectPlaceVisit[]> {
    const order = input.order ?? 'desc';

    return await this.txHost.tx.placeVisit.findMany({
      ...SELECT_PLACE_VISIT,
      where: {
        userIdx,
        deletedAt: null,
        nfc: {
          place: {
            deletedAt: null,
          },
        },
      },
      orderBy: [{ createdAt: order }, { id: order }],
      take: input.take,
      skip: input.skip,
    });
  }

  public async selectPlaceVisitById(
    id: string,
  ): Promise<SelectPlaceVisit | null> {
    return await this.txHost.tx.placeVisit.findUnique({
      ...SELECT_PLACE_VISIT,
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  public async selectPlaceVisitCountByPeriod(
    startAt: string,
    endAt: string,
  ): Promise<number> {
    return await this.txHost.tx.placeVisit.count({
      where: {
        deletedAt: null,
        createdAt: {
          gte: `${startAt}T00:00:00Z`,
          lte: `${endAt}T23:59:59Z`,
        },
      },
    });
  }

  public async selectPlaceVisitCountByDatePeriod(
    startAt: Date,
    endAt: Date,
  ): Promise<number> {
    return await this.txHost.tx.placeVisit.count({
      where: {
        deletedAt: null,
        createdAt: {
          gte: startAt,
          lte: endAt,
        },
      },
    });
  }

  public async selectPlaceVisitParticipantCountByDatePeriod(
    startAt: Date,
    endAt: Date,
  ): Promise<number> {
    const [result] = await this.txHost.tx.$queryRaw<
      { participantCount: number }[]
    >(Prisma.sql`
      SELECT COUNT(DISTINCT user_idx)::int AS "participantCount"
      FROM place_visit_tb
      WHERE created_at >= ${startAt}
        AND created_at <= ${endAt}
        AND deleted_at IS NULL
    `);

    return result.participantCount;
  }

  public async selectPlaceVisitUserScoreAllByDatePeriod(
    startAt: Date,
    endAt: Date,
  ): Promise<{ userIdx: number; score: number }[]> {
    return await this.txHost.tx.$queryRaw<{ userIdx: number; score: number }[]>(
      Prisma.sql`
        SELECT
          pv.user_idx AS "userIdx",
          COALESCE(SUM(pv.score), 0)::int AS score
        FROM place_visit_tb AS pv
        JOIN user_tb AS u ON u.idx = pv.user_idx
        WHERE pv.created_at >= ${startAt}
          AND pv.created_at <= ${endAt}
          AND pv.deleted_at IS NULL
          AND u.deleted_at IS NULL
        GROUP BY pv.user_idx
        HAVING SUM(pv.score) > 0
        ORDER BY pv.user_idx ASC
      `,
    );
  }

  public async selectPlaceVisitScoreByUserIdxAndDatePeriod(
    userIdx: number,
    startAt: Date,
    endAt: Date,
  ): Promise<number> {
    const result = await this.txHost.tx.placeVisit.aggregate({
      _sum: { score: true },
      where: {
        userIdx,
        deletedAt: null,
        createdAt: {
          gte: startAt,
          lte: endAt,
        },
      },
    });

    return result._sum.score ?? 0;
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
        latitude: input.latitude,
        longitude: input.longitude,
      },
    });
  }

  public async softDeletePlaceVisitById(id: string): Promise<void> {
    await this.txHost.tx.placeVisit.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  private getPlaceIdxFilterWhereClause(
    placeIdx?: number,
  ): Prisma.PlaceVisitWhereInput {
    if (placeIdx === undefined) {
      return {};
    }

    return { nfc: { placeIdx } };
  }

  private getUserIdxFilterWhereClause(
    userIdx?: number,
  ): Prisma.PlaceVisitWhereInput {
    if (userIdx === undefined) {
      return {};
    }

    return { userIdx };
  }
}
