import { Injectable } from '@nestjs/common';
import { UserRankingCoreRepository } from './user-ranking-core.repository';
import { GetCumulativeRankingAllInput } from './inputs/get-cumulative-ranking-all.input';
import { GetSeasonRankingAllInput } from './inputs/get-season-ranking-all.input';
import { CumulativeUserRankingModel } from './model/cumulative-user-ranking.model';
import { SeasonUserRankingModel } from './model/season-user-ranking.model';
import { UserRankingOverviewModel } from './model/user-ranking-overview.model';
import { UserRankingModel } from './model/user-ranking.model';
import { GetUserRankingAllInput } from './inputs/get-user-ranking-all.input';
import { SelectUserRankingOverviewParticipantCount } from './model/prisma-type/select-user-ranking-overview-participant-count';

@Injectable()
export class UserRankingCoreService {
  constructor(
    private readonly userRankingCoreRepository: UserRankingCoreRepository,
  ) {}

  public async getUserRankingAllByLeagueSeasonIdx(
    leagueSeasonIdx: number,
    input?: GetUserRankingAllInput,
  ): Promise<UserRankingModel[]> {
    return (
      await this.userRankingCoreRepository.selectUserRankingAllByLeagueSeasonIdx(
        leagueSeasonIdx,
        input,
      )
    ).map(UserRankingModel.fromQuery);
  }

  public async getUserRankingCountByLeagueSeasonIdx(
    leagueSeasonIdx: number,
  ): Promise<number> {
    return await this.userRankingCoreRepository.selectUserRankingCountByLeagueSeasonIdx(
      leagueSeasonIdx,
    );
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

  public async getSeasonUserRankingCountByLeagueSeasonIdx(
    leagueSeasonIdx: number,
  ): Promise<number> {
    return await this.userRankingCoreRepository.selectSeasonUserRankingCountByLeagueSeasonIdx(
      leagueSeasonIdx,
    );
  }

  public async getCumulativeUserRankingAll(
    input: GetCumulativeRankingAllInput,
  ): Promise<CumulativeUserRankingModel[]> {
    return (
      await this.userRankingCoreRepository.selectCumulativeUserRankingAll(input)
    ).map(CumulativeUserRankingModel.fromQuery);
  }

  public async getCumulativeUserRankingCount(): Promise<number> {
    return await this.userRankingCoreRepository.selectCumulativeUserRankingCount();
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

  public async getUserRankingOverviewParticipantCount(): Promise<SelectUserRankingOverviewParticipantCount> {
    return await this.userRankingCoreRepository.selectUserRankingOverviewParticipantCount();
  }
}
