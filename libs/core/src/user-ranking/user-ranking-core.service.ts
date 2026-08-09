import { Injectable } from '@nestjs/common';
import { UserRankingCoreRepository } from './user-ranking-core.repository';
import { GetCumulativeRankingAllInput } from './inputs/get-cumulative-ranking-all.input';
import { GetSeasonRankingAllInput } from './inputs/get-season-ranking-all.input';
import { UserRankingEntryModel } from './model/user-ranking-entry.model';
import { UserRankingOverviewModel } from './model/user-ranking-overview.model';
import { UserRankingModel } from './model/user-ranking.model';

@Injectable()
export class UserRankingCoreService {
  constructor(
    private readonly userRankingCoreRepository: UserRankingCoreRepository,
  ) {}

  public async getUserRankingAllByLeagueSeasonIdx(
    leagueSeasonIdx: number,
  ): Promise<UserRankingModel[]> {
    return (
      await this.userRankingCoreRepository.selectUserRankingAllByLeagueSeasonIdx(
        leagueSeasonIdx,
      )
    ).map(UserRankingModel.fromQuery);
  }

  public async getSeasonRankingAll(
    leagueSeasonIdx: number,
    input: GetSeasonRankingAllInput,
  ): Promise<UserRankingEntryModel[]> {
    return (
      await this.userRankingCoreRepository.selectSeasonRankingAllByLeagueSeasonIdx(
        leagueSeasonIdx,
        input,
      )
    ).map(UserRankingEntryModel.fromQuery);
  }

  public async getCumulativeRankingAll(
    input: GetCumulativeRankingAllInput,
  ): Promise<UserRankingEntryModel[]> {
    return (
      await this.userRankingCoreRepository.selectCumulativeRankingAll(input)
    ).map(UserRankingEntryModel.fromQuery);
  }

  public async getUserRankingOverviewByUserIdx(
    userIdx: number,
  ): Promise<UserRankingOverviewModel | null> {
    const userRanking =
      await this.userRankingCoreRepository.selectUserRankingOverviewByUserIdx(
        userIdx,
      );

    return userRanking && UserRankingOverviewModel.fromQuery(userRanking);
  }
}
