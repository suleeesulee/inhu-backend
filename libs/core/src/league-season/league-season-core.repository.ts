import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
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

@Injectable()
export class LeagueSeasonCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectLeagueSeasonByIdx(
    idx: number,
  ): Promise<SelectLeagueSeason | null> {
    return await this.txHost.tx.leagueSeason.findUnique({
      ...SELECT_LEAGUE_SEASON,
      where: {
        idx,
      },
    });
  }

  public async selectLeagueSeasonByDate(
    startAt: string,
    endAt: string,
  ): Promise<SelectLeagueSeason | null> {
    return await this.txHost.tx.leagueSeason.findFirst({
      ...SELECT_LEAGUE_SEASON,
      where: {
        startAt: `${startAt}T00:00:00Z`,
        endAt: `${endAt}T23:59:59Z`,
      },
    });
  }

  public async selectLeagueSeasonAll(): Promise<SelectLeagueSeason[]> {
    return await this.txHost.tx.leagueSeason.findMany({
      ...SELECT_LEAGUE_SEASON,
    });
  }

  public async selectLeagueSeasonResultAllByUserIdx(
    userIdx: number,
    input: GetLeagueSeasonResultAllInput,
  ): Promise<SelectLeagueSeasonResult[]> {
    const order = input.order ?? 'desc';

    return await this.txHost.tx.leagueSeasonResult.findMany({
      ...SELECT_LEAGUE_SEASON_RESULT,
      where: { userIdx },
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
  ): Promise<SelectLeagueSeasonResult | null> {
    return await this.txHost.tx.leagueSeasonResult.findFirst({
      ...SELECT_LEAGUE_SEASON_RESULT,
      where: {
        leagueSeasonIdx,
        userIdx,
      },
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
        startAt: `${input.startAt}T00:00:00Z`,
        endAt: `${input.endAt}T23:59:59Z`,
        rewardOptionList: {
          createMany: {
            data: input.rewardOptionList.map((rewardOption) => ({
              rewardIdx: rewardOption.rewardIdx,
              targetRank: rewardOption.targetRank,
            })),
          },
        },
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
        startAt: `${input.startAt}T00:00:00Z`,
        endAt: `${input.endAt}T23:59:59Z`,
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
}
