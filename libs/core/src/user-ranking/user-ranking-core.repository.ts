import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  SELECT_CUMULATIVE_USER_RANKING,
  SelectCumulativeUserRanking,
} from './model/prisma-type/select-cumulative-user-ranking';
import {
  SELECT_SEASON_USER_RANKING,
  SelectSeasonUserRanking,
} from './model/prisma-type/select-season-user-ranking';
import {
  SELECT_USER_RANKING_OVERVIEW,
  SelectUserRankingOverview,
} from './model/prisma-type/select-user-ranking-overview';
import {
  SELECT_USER_RANKING,
  SelectUserRanking,
} from './model/prisma-type/select-user-ranking';
import { GetCumulativeRankingAllInput } from './inputs/get-cumulative-ranking-all.input';
import { GetSeasonRankingAllInput } from './inputs/get-season-ranking-all.input';

@Injectable()
export class UserRankingCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectUserRankingAllByLeagueSeasonIdx(
    leagueSeasonIdx: number,
  ): Promise<SelectUserRanking[]> {
    return await this.txHost.tx.$queryRaw<SelectUserRanking[]>(Prisma.sql`
      ${SELECT_USER_RANKING}
      WHERE ru.league_season_idx = ${leagueSeasonIdx}
    `);
  }

  public async selectSeasonUserRankingAllByLeagueSeasonIdx(
    leagueSeasonIdx: number,
    input: GetSeasonRankingAllInput,
  ): Promise<SelectSeasonUserRanking[]> {
    return await this.txHost.tx.$queryRaw<SelectSeasonUserRanking[]>(
      Prisma.sql`
        ${SELECT_SEASON_USER_RANKING(leagueSeasonIdx)}
        ORDER BY
          ru.season_rank ASC,
          ru.user_idx ASC
        LIMIT ${input.take}
        OFFSET ${input.skip}
      `,
    );
  }

  public async selectCumulativeUserRankingAll(
    input: GetCumulativeRankingAllInput,
  ): Promise<SelectCumulativeUserRanking[]> {
    return await this.txHost.tx.$queryRaw<SelectCumulativeUserRanking[]>(
      Prisma.sql`
        ${SELECT_CUMULATIVE_USER_RANKING}
        ORDER BY
          ru.cumulative_rank ASC,
          ru.user_idx ASC
        LIMIT ${input.take}
        OFFSET ${input.skip}
      `,
    );
  }

  public async selectUserRankingOverviewByUserIdx(
    userIdx: number,
  ): Promise<SelectUserRankingOverview | null> {
    const [userRanking] = await this.txHost.tx.$queryRaw<
      SelectUserRankingOverview[]
    >(Prisma.sql`
        ${SELECT_USER_RANKING_OVERVIEW}
        WHERE ru.user_idx = ${userIdx}
      `);

    return userRanking ?? null;
  }
}
