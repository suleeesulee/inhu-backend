import { LeagueSeasonCoreService } from '@libs/core/league-season/league-season-core.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { LeagueSeasonEntity } from './entity/league-season.entity';
import { GetLeagueSeasonAllResponseDto } from './dto/response/get-league-season-all.dto';
import { CreateLeagueSeasonDto } from './dto/request/create-league-season.dto';
import { UpdateLeagueSeasonDto } from './dto/request/update-league-season.dto';
import { UpdateLeagueRewardOptionDto } from './dto/request/update-league-reward-option.dto';

@Injectable()
export class LeagueSeasonService {
  constructor(
    private readonly leagueSeasonCoreService: LeagueSeasonCoreService,
  ) {}

  public async getLeagueSeasonByIdx(idx: number): Promise<LeagueSeasonEntity> {
    const leagueSeason =
      await this.leagueSeasonCoreService.getLeagueSeasonByIdx(idx);
    if (!leagueSeason) {
      throw new NotFoundException(`League season with idx ${idx} not found`);
    }

    return LeagueSeasonEntity.fromModel(leagueSeason);
  }

  public async getLeagueSeasonAll(): Promise<GetLeagueSeasonAllResponseDto> {
    return {
      leagueSeasonList: (
        await this.leagueSeasonCoreService.getLeagueSeasonAll()
      ).map((leagueSeason) => LeagueSeasonEntity.fromModel(leagueSeason)),
    };
  }

  public async createLeagueSeason(
    dto: CreateLeagueSeasonDto,
  ): Promise<LeagueSeasonEntity> {
    return await this.leagueSeasonCoreService.createLeagueSeason(dto);
  }

  public async updateLeagueSeasonByIdx(
    idx: number,
    dto: UpdateLeagueSeasonDto,
  ): Promise<void> {
    const leagueSeason =
      await this.leagueSeasonCoreService.getLeagueSeasonByIdx(idx);
    if (!leagueSeason) {
      throw new NotFoundException(`League season with idx ${idx} not found`);
    }

    await this.leagueSeasonCoreService.updateLeagueSeasonByIdx(idx, dto);
  }

  public async updateLeagueSeasonRewardOptionByIdx(
    idx: number,
    dto: UpdateLeagueRewardOptionDto,
  ): Promise<void> {
    const leagueSeason =
      await this.leagueSeasonCoreService.getLeagueSeasonByIdx(idx);
    if (!leagueSeason) {
      throw new NotFoundException(`League season with idx ${idx} not found`);
    }

    await this.leagueSeasonCoreService.updateLeagueSeasonByIdx(idx, {
      rewardOptionList: [dto],
    });
  }
}
