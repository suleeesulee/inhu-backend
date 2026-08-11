import { Exception } from '@libs/common/decorator/exception.decorator';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';
import { GetLeagueSeasonByDateDto } from './dto/request/get-league-season-by-date.dto';
import { LeagueSeasonEntity } from './entity/league-season.entity';
import { LeagueSeasonService } from './league-season.service';

@Controller('league-season')
export class LeagueSeasonController {
  constructor(private readonly leagueSeasonService: LeagueSeasonService) {}

  /**
   * 날짜로 리그 시즌 조회
   */
  @Get()
  public async getLeagueSeasonByDate(
    @Query() dto: GetLeagueSeasonByDateDto,
  ): Promise<LeagueSeasonEntity> {
    return await this.leagueSeasonService.getLeagueSeasonByDate(dto);
  }
}
