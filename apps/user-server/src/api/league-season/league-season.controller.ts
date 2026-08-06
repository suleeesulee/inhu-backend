import { Controller, Get, Query } from '@nestjs/common';
import { LeagueSeasonService } from './league-season.service';
import { GetLeagueSeasonByDateDto } from './dto/request/get-league-season-by-date.dto';
import { LeagueSeasonEntity } from './entity/league-season.entity';

@Controller('league-season')
export class LeagueSeasonController {
  constructor(private readonly leagueSeasonService: LeagueSeasonService) {}

  @Get()
  public async getLeagueSeasonByDate(
    @Query() dto: GetLeagueSeasonByDateDto,
  ): Promise<LeagueSeasonEntity> {
    return await this.leagueSeasonService.getLeagueSeasonByDate(dto);
  }
}
