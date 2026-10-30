import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateLeagueSeasonInput } from './inputs/create-league-season.input';
import { UpdateLeagueSeasonInput } from './inputs/update-league-season.input';
import {
  SELECT_LEAGUE_SEASON,
  SelectLeagueSeason,
} from './model/prisma-type/select-league-season';
import {
  SELECT_LEAGUE_SEASON_RESULT,
  SelectLeagueSeasonResult,
} from './model/prisma-type/select-league-season-result';
import {
  SELECT_LEAGUE_SEASON_RESULT_USER_RANKING,
  SelectLeagueSeasonResultUserRanking,
} from './model/prisma-type/select-league-season-result-user-ranking';
import {
  SELECT_LEAGUE_REWARD_OPTION,
  SelectLeagueRewardOption,
} from './model/prisma-type/select-league-reward-option';
import { GetLeagueSeasonResultAllInput } from './inputs/get-league-season-result-all.input';
import { GetLeagueSeasonAllInput } from './inputs/get-league-season-all.input';
import {
  SELECT_LEAGUE_SEASON_OVERVIEW,
  SelectLeagueSeasonOverview,
} from './model/prisma-type/select-league-season-overview';

@Injectable()
export class LeagueSeasonCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectLeagueSeasonByIdx(
    idx?: number,
    activated?: boolean,
  ): Promise<SelectLeagueSeason | null> {
    return await this.txHost.tx.leagueSeason.findFirst({
      ...SELECT_LEAGUE_SEASON,
      where: {
        idx,
        ...this.getActivatedAtFilterWhereClause(activated),
      },
      orderBy: [{ startAt: 'desc' }, { idx: 'desc' }],
    });
  }

  public async selectLeagueSeasonByDate(
    startAt?: string,
    endAt?: string,
    activated?: boolean,
  ): Promise<SelectLeagueSeason | null> {
    return await this.txHost.tx.leagueSeason.findFirst({
      ...SELECT_LEAGUE_SEASON,
      where: {
        ...this.getDatePeriodFilterWhereClause(startAt, endAt),
        ...this.getActivatedAtFilterWhereClause(activated),
      },
      orderBy: [{ startAt: 'desc' }, { idx: 'desc' }],
    });
  }

  public async selectLeagueSeasonByDateTime(
    date: Date,
  ): Promise<SelectLeagueSeason | null> {
    return await this.txHost.tx.leagueSeason.findFirst({
      ...SELECT_LEAGUE_SEASON,
      where: {
        startAt: { lte: date },
        endAt: { gte: date },
      },
      orderBy: [{ startAt: 'desc' }, { idx: 'desc' }],
    });
  }

  public async selectLeagueSeasonAll(
    input: GetLeagueSeasonAllInput,
  ): Promise<SelectLeagueSeason[]> {
    const order = input.order ?? 'desc';

    return await this.txHost.tx.leagueSeason.findMany({
      ...SELECT_LEAGUE_SEASON,
      where: {
        ...this.getActivatedAtFilterWhereClause(input.activated),
        ...this.getEndAtFilterWhereClause(input.endAtBefore),
        ...this.getFinalizedAtFilterWhereClause(input.finalized),
      },
      orderBy: [{ startAt: order }, { idx: order }],
      take: input.take,
      skip: input.skip,
    });
  }

  public async selectLeagueSeasonOverviewAll(
    input: GetLeagueSeasonAllInput,
  ): Promise<SelectLeagueSeasonOverview[]> {
    const order = input.order ?? 'desc';

    return await this.txHost.tx.leagueSeason.findMany({
      ...SELECT_LEAGUE_SEASON_OVERVIEW,
      where: this.getActivatedAtFilterWhereClause(input.activated),
      orderBy: [{ startAt: order }, { idx: order }],
      take: input.take,
      skip: input.skip,
    });
  }

  public async selectLeagueSeasonOverviewCount(
    input: GetLeagueSeasonAllInput,
  ): Promise<number> {
    return await this.txHost.tx.leagueSeason.count({
      where: this.getActivatedAtFilterWhereClause(input.activated),
    });
  }

  public async selectLeagueSeasonResultById(
    id: string,
    activated?: boolean,
  ): Promise<SelectLeagueSeasonResult | null> {
    return await this.txHost.tx.leagueSeasonResult.findFirst({
      ...SELECT_LEAGUE_SEASON_RESULT,
      where: {
        id,
        leagueSeason: this.getActivatedAtFilterWhereClause(activated),
      },
    });
  }

  public async selectLeagueSeasonResultAllByIdList(
    idList: string[],
  ): Promise<SelectLeagueSeasonResult[]> {
    if (idList.length === 0) {
      return [];
    }

    return await this.txHost.tx.leagueSeasonResult.findMany({
      ...SELECT_LEAGUE_SEASON_RESULT,
      where: { id: { in: idList } },
    });
  }

  public async selectLeagueSeasonResultByIdAndUserIdx(
    id: string,
    userIdx: number,
    activated?: boolean,
  ): Promise<SelectLeagueSeasonResult | null> {
    return await this.txHost.tx.leagueSeasonResult.findFirst({
      ...SELECT_LEAGUE_SEASON_RESULT,
      where: {
        id,
        userIdx,
        leagueSeason: this.getActivatedAtFilterWhereClause(activated),
      },
    });
  }

  public async selectLeagueSeasonResultAllByUserIdx(
    userIdx: number,
    input: GetLeagueSeasonResultAllInput,
  ): Promise<SelectLeagueSeasonResult[]> {
    const order = input.order ?? 'desc';

    return await this.txHost.tx.leagueSeasonResult.findMany({
      ...SELECT_LEAGUE_SEASON_RESULT,
      where: {
        userIdx,
        finalScore: { gt: 0 },
        leagueSeason: this.getActivatedAtFilterWhereClause(input.activated),
      },
      orderBy: [
        { leagueSeason: { endAt: order } },
        { createdAt: order },
        { id: order },
      ],
      take: input.take,
      skip: input.skip,
    });
  }

  public async selectLeagueSeasonResultByLeagueSeasonIdxAndUserIdx(
    leagueSeasonIdx: number,
    userIdx: number,
    activated?: boolean,
  ): Promise<SelectLeagueSeasonResult | null> {
    return await this.txHost.tx.leagueSeasonResult.findFirst({
      ...SELECT_LEAGUE_SEASON_RESULT,
      where: {
        leagueSeasonIdx,
        userIdx,
        leagueSeason: this.getActivatedAtFilterWhereClause(activated),
      },
    });
  }

  public async selectLeagueSeasonResultAllByLeagueSeasonIdx(
    leagueSeasonIdx: number,
  ): Promise<SelectLeagueSeasonResult[]> {
    return await this.txHost.tx.leagueSeasonResult.findMany({
      ...SELECT_LEAGUE_SEASON_RESULT,
      where: { leagueSeasonIdx },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    });
  }

  public async selectLeagueSeasonResultUserRankingAllByLeagueSeasonIdx(
    leagueSeasonIdx: number,
  ): Promise<SelectLeagueSeasonResultUserRanking[]> {
    return await this.txHost.tx.$queryRaw<
      SelectLeagueSeasonResultUserRanking[]
    >(SELECT_LEAGUE_SEASON_RESULT_USER_RANKING([leagueSeasonIdx]));
  }

  public async selectLeagueSeasonResultUserRankingByLeagueSeasonIdxAndUserIdx(
    leagueSeasonIdx: number,
    userIdx: number,
  ): Promise<SelectLeagueSeasonResultUserRanking | null> {
    const [userRanking] = await this.txHost.tx.$queryRaw<
      SelectLeagueSeasonResultUserRanking[]
    >(SELECT_LEAGUE_SEASON_RESULT_USER_RANKING([leagueSeasonIdx], userIdx));

    return userRanking ?? null;
  }

  public async selectLeagueSeasonResultUserRankingByLeagueSeasonIdxListAndUserIdx(
    leagueSeasonIdxList: number[],
    userIdx: number,
  ): Promise<SelectLeagueSeasonResultUserRanking[]> {
    if (leagueSeasonIdxList.length === 0) {
      return [];
    }

    return await this.txHost.tx.$queryRaw<
      SelectLeagueSeasonResultUserRanking[]
    >(SELECT_LEAGUE_SEASON_RESULT_USER_RANKING(leagueSeasonIdxList, userIdx));
  }

  public async selectLeagueRewardOptionAllByLeagueSeasonIdx(
    leagueSeasonIdx: number,
  ): Promise<SelectLeagueRewardOption[]> {
    return await this.txHost.tx.leagueRewardOption.findMany({
      ...SELECT_LEAGUE_REWARD_OPTION,
      where: {
        leagueSeasonIdx,
        deletedAt: null,
      },
    });
  }

  public async selectLeagueRewardOptionAllByLeagueSeasonIdxAndTargetRank(
    leagueSeasonIdx: number,
    targetRank: number,
  ): Promise<SelectLeagueRewardOption[]> {
    return await this.txHost.tx.leagueRewardOption.findMany({
      ...SELECT_LEAGUE_REWARD_OPTION,
      where: {
        leagueSeasonIdx,
        targetRank,
        deletedAt: null,
      },
    });
  }

  public async insertLeagueSeason(
    input: CreateLeagueSeasonInput,
  ): Promise<SelectLeagueSeason> {
    return await this.txHost.tx.leagueSeason.create({
      ...SELECT_LEAGUE_SEASON,
      data: {
        name: input.name,
        startAt: this.getKoreanDateStart(input.startAt),
        endAt: this.getKoreanDateEnd(input.endAt),
        activatedAt: input.activatedAt,
        rewardOptionList: input.rewardOptionList
          ? {
              createMany: {
                data: input.rewardOptionList.map((rewardOption) => ({
                  rewardIdx: rewardOption.rewardIdx,
                  targetRank: rewardOption.targetRank,
                })),
              },
            }
          : undefined,
      },
    });
  }

  public async insertLeagueSeasonResult(input: {
    leagueSeasonIdx: number;
    userIdx: number;
    finalScore: number;
  }): Promise<SelectLeagueSeasonResult> {
    return await this.txHost.tx.leagueSeasonResult.create({
      ...SELECT_LEAGUE_SEASON_RESULT,
      data: {
        leagueSeasonIdx: input.leagueSeasonIdx,
        userIdx: input.userIdx,
        finalScore: input.finalScore,
      },
    });
  }

  public async updateLeagueSeasonByIdx(
    idx: number,
    input: UpdateLeagueSeasonInput,
  ): Promise<void> {
    await this.txHost.tx.leagueSeason.update({
      where: {
        idx,
      },
      data: {
        name: input.name,
        startAt: input.startAt
          ? this.getKoreanDateStart(input.startAt)
          : undefined,
        endAt: input.endAt ? this.getKoreanDateEnd(input.endAt) : undefined,
        activatedAt: input.activatedAt,
        finalizedAt: input.finalizedAt,
        rewardOptionList: input.rewardOptionList
          ? {
              deleteMany: {},
              createMany: {
                data: input.rewardOptionList.map((rewardOption) => ({
                  rewardIdx: rewardOption.rewardIdx,
                  targetRank: rewardOption.targetRank,
                })),
              },
            }
          : undefined,
      },
    });
  }

  public async updateLeagueSeasonResultById(
    id: string,
    input: { finalScore: number },
  ): Promise<void> {
    await this.txHost.tx.leagueSeasonResult.update({
      where: { id },
      data: { finalScore: input.finalScore },
    });
  }

  private getActivatedAtFilterWhereClause(
    activated?: boolean,
  ): Prisma.LeagueSeasonWhereInput {
    if (activated === undefined) {
      return {};
    }

    if (activated) {
      return { activatedAt: { not: null } };
    }

    return { activatedAt: null };
  }

  private getDatePeriodFilterWhereClause(
    startAt?: string,
    endAt?: string,
  ): Prisma.LeagueSeasonWhereInput {
    if (startAt === undefined || endAt === undefined) {
      return {};
    }

    return {
      startAt: this.getKoreanDateStart(startAt),
      endAt: this.getKoreanDateEnd(endAt),
    };
  }

  private getKoreanDateStart(date: string): Date {
    return new Date(`${date}T00:00:00.000+09:00`);
  }

  private getKoreanDateEnd(date: string): Date {
    return new Date(`${date}T23:59:59.999+09:00`);
  }

  private getFinalizedAtFilterWhereClause(
    finalized?: boolean,
  ): Prisma.LeagueSeasonWhereInput {
    if (finalized === undefined) {
      return {};
    }

    return finalized ? { finalizedAt: { not: null } } : { finalizedAt: null };
  }

  private getEndAtFilterWhereClause(
    endAtBefore?: Date,
  ): Prisma.LeagueSeasonWhereInput {
    if (!endAtBefore) {
      return {};
    }

    return { endAt: { lt: endAtBefore } };
  }
}
