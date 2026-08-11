import { Injectable } from '@nestjs/common';
import { UserRankingCoreRepository } from './user-ranking-core.repository';
import { GetCumulativeRankingAllInput } from './inputs/get-cumulative-ranking-all.input';
import { GetSeasonRankingAllInput } from './inputs/get-season-ranking-all.input';
import { CumulativeUserRankingModel } from './model/cumulative-user-ranking.model';
import { SeasonUserRankingModel } from './model/season-user-ranking.model';
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

  public async getSeasonUserRankingAll(
    leagueSeasonIdx: number,
    input: GetSeasonRankingAllInput,
  ): Promise<SeasonUserRankingModel[]> {
    return (
      await this.userRankingCoreRepository.selectSeasonUserRankingAllByLeagueSeasonIdx(
        leagueSeasonIdx,
        input,
      )
    ).map(SeasonUserRankingModel.fromQuery);
  }

  public async getCumulativeUserRankingAll(
    input: GetCumulativeRankingAllInput,
  ): Promise<CumulativeUserRankingModel[]> {
    return (
      await this.userRankingCoreRepository.selectCumulativeUserRankingAll(input)
    ).map(CumulativeUserRankingModel.fromQuery);
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
