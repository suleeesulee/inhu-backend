import { LeagueSeasonCoreService } from '@libs/core/league-season/league-season-core.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetLeagueSeasonByDateDto } from './dto/request/get-league-season-by-date.dto';
import { LeagueSeasonEntity } from './entity/league-season.entity';

@Injectable()
export class LeagueSeasonService {
  constructor(
    private readonly leagueSeasonCoreService: LeagueSeasonCoreService,
  ) {}

  public async getLeagueSeasonByDate(
    dto: GetLeagueSeasonByDateDto,
  ): Promise<LeagueSeasonEntity> {
    const leagueSeason =
      await this.leagueSeasonCoreService.getLeagueSeasonByDate(
        dto.startAt,
        dto.endAt,
      );
    if (!leagueSeason) {
      throw new NotFoundException('League season not found');
    }

    return LeagueSeasonEntity.fromModel(leagueSeason);
  }
}
