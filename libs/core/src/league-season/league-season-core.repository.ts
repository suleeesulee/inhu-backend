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

@Injectable()
export class LeagueSeasonCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async getLeagueSeasonByIdx(
    idx: number,
  ): Promise<SelectLeagueSeason | null> {
    return await this.txHost.tx.leagueSeason.findUnique({
      ...SELECT_LEAGUE_SEASON,
      where: {
        idx,
      },
    });
  }

  public async getLeagueSeasonByDate(
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

  public async getLeagueSeasonAll(): Promise<SelectLeagueSeason[]> {
    return await this.txHost.tx.leagueSeason.findMany({
      ...SELECT_LEAGUE_SEASON,
    });
  }

  public async getLeagueSeasonResultByLeagueSeasonIdx(
    leagueSeasonIdx: number,
  ): Promise<SelectLeagueSeasonResult | null> {
    return await this.txHost.tx.leagueSeasonResult.findFirst({
      ...SELECT_LEAGUE_SEASON_RESULT,
      where: {
        leagueSeasonIdx,
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
