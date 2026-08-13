import { Injectable } from '@nestjs/common';
import { CreateLeagueSeasonInput } from './inputs/create-league-season.input';
import { UpdateLeagueSeasonInput } from './inputs/update-league-season.input';
import { LeagueSeasonCoreRepository } from './league-season-core.repository';
import { LeagueSeasonResultModel } from './model/league-season-result.model';
import { LeagueSeasonResultUserRankingModel } from './model/league-season-result-user-ranking.model';
import { LeagueSeasonModel } from './model/league-season.model';
import { LeagueRewardOptionModel } from './model/league-reward-option.model';
import { GetLeagueSeasonResultAllInput } from './inputs/get-league-season-result-all.input';
import { GetLeagueSeasonAllInput } from './inputs/get-league-season-all.input';
import { LeagueSeasonOverviewModel } from './model/league-season-overview.model';

@Injectable()
export class LeagueSeasonCoreService {
  constructor(
    private readonly leagueSeasonCoreRepository: LeagueSeasonCoreRepository,
  ) {}

  public async getLeagueSeasonByIdx(
    idx: number,
    activated?: boolean,
  ): Promise<LeagueSeasonModel | null> {
    const leagueSeason =
      await this.leagueSeasonCoreRepository.selectLeagueSeasonByIdx(
        idx,
        activated,
      );
    return leagueSeason && LeagueSeasonModel.fromPrisma(leagueSeason);
  }

  public async getLeagueSeasonByDate(
    startAt: string,
    endAt: string,
    activated?: boolean,
  ): Promise<LeagueSeasonModel | null> {
    const leagueSeason =
      await this.leagueSeasonCoreRepository.selectLeagueSeasonByDate(
        startAt,
        endAt,
        activated,
      );
    return leagueSeason && LeagueSeasonModel.fromPrisma(leagueSeason);
  }

  public async getLeagueSeasonAll(
    activated?: boolean,
  ): Promise<LeagueSeasonModel[]> {
    return (
      await this.leagueSeasonCoreRepository.selectLeagueSeasonAll(activated)
    ).map((leagueSeason) => LeagueSeasonModel.fromPrisma(leagueSeason));
  }

  public async getLeagueSeasonOverviewAll(
    input: GetLeagueSeasonAllInput,
  ): Promise<LeagueSeasonOverviewModel[]> {
    return (
      await this.leagueSeasonCoreRepository.selectLeagueSeasonOverviewAll(input)
    ).map(LeagueSeasonOverviewModel.fromPrisma);
  }

  public async getLeagueSeasonResultById(
    id: string,
    activated?: boolean,
  ): Promise<LeagueSeasonResultModel | null> {
    const leagueSeasonResult =
      await this.leagueSeasonCoreRepository.selectLeagueSeasonResultById(
        id,
        activated,
      );
    return (
      leagueSeasonResult &&
      LeagueSeasonResultModel.fromPrisma(leagueSeasonResult)
    );
  }

  public async getLeagueSeasonResultByIdAndUserIdx(
    id: string,
    userIdx: number,
    activated?: boolean,
  ): Promise<LeagueSeasonResultModel | null> {
    const leagueSeasonResult =
      await this.leagueSeasonCoreRepository.selectLeagueSeasonResultByIdAndUserIdx(
        id,
        userIdx,
        activated,
      );
    return (
      leagueSeasonResult &&
      LeagueSeasonResultModel.fromPrisma(leagueSeasonResult)
    );
  }

  public async getLeagueSeasonResultAllByUserIdx(
    userIdx: number,
    input: GetLeagueSeasonResultAllInput,
  ): Promise<LeagueSeasonResultModel[]> {
    return (
      await this.leagueSeasonCoreRepository.selectLeagueSeasonResultAllByUserIdx(
        userIdx,
        input,
      )
    ).map(LeagueSeasonResultModel.fromPrisma);
  }

  public async getLeagueSeasonResultByLeagueSeasonIdxAndUserIdx(
    leagueSeasonIdx: number,
    userIdx: number,
    activated?: boolean,
  ): Promise<LeagueSeasonResultModel | null> {
    const leagueSeasonResult =
      await this.leagueSeasonCoreRepository.selectLeagueSeasonResultByLeagueSeasonIdxAndUserIdx(
        leagueSeasonIdx,
        userIdx,
        activated,
      );

    return (
      leagueSeasonResult &&
      LeagueSeasonResultModel.fromPrisma(leagueSeasonResult)
    );
  }

  public async getLeagueSeasonResultUserRankingAllByLeagueSeasonIdx(
    leagueSeasonIdx: number,
  ): Promise<LeagueSeasonResultUserRankingModel[]> {
    return (
      await this.leagueSeasonCoreRepository.selectLeagueSeasonResultUserRankingAllByLeagueSeasonIdx(
        leagueSeasonIdx,
      )
    ).map(LeagueSeasonResultUserRankingModel.fromQuery);
  }

  public async getLeagueSeasonResultUserRankingByLeagueSeasonIdxAndUserIdx(
    leagueSeasonIdx: number,
    userIdx: number,
  ): Promise<LeagueSeasonResultUserRankingModel | null> {
    const userRanking =
      await this.leagueSeasonCoreRepository.selectLeagueSeasonResultUserRankingByLeagueSeasonIdxAndUserIdx(
        leagueSeasonIdx,
        userIdx,
      );

    return (
      userRanking && LeagueSeasonResultUserRankingModel.fromQuery(userRanking)
    );
  }

  public async getLeagueSeasonResultUserRankingByLeagueSeasonIdxListAndUserIdx(
    leagueSeasonIdxList: number[],
    userIdx: number,
  ): Promise<LeagueSeasonResultUserRankingModel[]> {
    return (
      await this.leagueSeasonCoreRepository.selectLeagueSeasonResultUserRankingByLeagueSeasonIdxListAndUserIdx(
        leagueSeasonIdxList,
        userIdx,
      )
    ).map(LeagueSeasonResultUserRankingModel.fromQuery);
  }

  public async getLeagueRewardOptionAllByLeagueSeasonIdx(
    leagueSeasonIdx: number,
  ): Promise<LeagueRewardOptionModel[]> {
    return (
      await this.leagueSeasonCoreRepository.selectLeagueRewardOptionAllByLeagueSeasonIdx(
        leagueSeasonIdx,
      )
    ).map(LeagueRewardOptionModel.fromPrisma);
  }

  public async getLeagueRewardOptionAllByLeagueSeasonIdxAndTargetRank(
    leagueSeasonIdx: number,
    targetRank: number,
  ): Promise<LeagueRewardOptionModel[]> {
    return (
      await this.leagueSeasonCoreRepository.selectLeagueRewardOptionAllByLeagueSeasonIdxAndTargetRank(
        leagueSeasonIdx,
        targetRank,
      )
    ).map(LeagueRewardOptionModel.fromPrisma);
  }

  public async createLeagueSeason(
    input: CreateLeagueSeasonInput,
  ): Promise<LeagueSeasonModel> {
    return LeagueSeasonModel.fromPrisma(
      await this.leagueSeasonCoreRepository.insertLeagueSeason(input),
    );
  }

  public async updateLeagueSeasonByIdx(
    idx: number,
    input: UpdateLeagueSeasonInput,
  ): Promise<void> {
    await this.leagueSeasonCoreRepository.updateLeagueSeasonByIdx(idx, input);
  }
}
