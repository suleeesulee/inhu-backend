import { Injectable } from '@nestjs/common';
import { CreateLeagueSeasonInput } from './inputs/create-league-season.input';
import { UpdateLeagueSeasonInput } from './inputs/update-league-season.input';
import { LeagueSeasonCoreRepository } from './league-season-core.repository';
import { LeagueSeasonResultModel } from './model/league-season-result.model';
import { LeagueSeasonModel } from './model/league-season.model';

@Injectable()
export class LeagueSeasonCoreService {
  constructor(
    private readonly leagueSeasonCoreRepository: LeagueSeasonCoreRepository,
  ) {}

  public async getLeagueSeasonByIdx(
    idx: number,
  ): Promise<LeagueSeasonModel | null> {
    const leagueSeason =
      await this.leagueSeasonCoreRepository.getLeagueSeasonByIdx(idx);
    return leagueSeason && LeagueSeasonModel.fromPrisma(leagueSeason);
  }

  public async getLeagueSeasonByDate(
    startAt: string,
    endAt: string,
  ): Promise<LeagueSeasonModel | null> {
    const leagueSeason =
      await this.leagueSeasonCoreRepository.getLeagueSeasonByDate(
        startAt,
        endAt,
      );
    return leagueSeason && LeagueSeasonModel.fromPrisma(leagueSeason);
  }

  public async getLeagueSeasonAll(): Promise<LeagueSeasonModel[]> {
    return (await this.leagueSeasonCoreRepository.getLeagueSeasonAll()).map(
      (leagueSeason) => LeagueSeasonModel.fromPrisma(leagueSeason),
    );
  }

  public async getLeagueSeasonResultByLeagueSeasonIdx(
    leagueSeasonIdx: number,
  ): Promise<LeagueSeasonResultModel | null> {
    const leagueSeasonResult =
      await this.leagueSeasonCoreRepository.getLeagueSeasonResultByLeagueSeasonIdx(
        leagueSeasonIdx,
      );

    return (
      leagueSeasonResult &&
      LeagueSeasonResultModel.fromPrisma(leagueSeasonResult)
    );
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
