import { Exception } from '@libs/common/decorator/exception.decorator';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';
import { GetLeagueSeasonByDateDto } from './dto/request/get-league-season-by-date.dto';
import { LeagueSeasonEntity } from './entity/league-season.entity';
import { LeagueSeasonService } from './league-season.service';
import { LeagueSeasonResultEntity } from './entity/league-season-result.entity';
import { GetLeagueSeasonResultByLeagueSeasonIdxDto } from './dto/request/get-league-season-result-by-league-season-idx.dto';
import { GetLeagueSeasonResultAllDto } from './dto/request/get-league-season-result-all.dto';
import { LeagueSeasonResultOverviewEntity } from './entity/league-season-result-overview.entity';

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

  @Get(':leagueSeasonIdx/result')
  @LoginAuth()
  @Exception(400, 'Invalid request')
  @Exception(404, 'League season not found')
  @Exception(404, 'League season result not found')
  @Exception(404, 'League season result user ranking not found')
  @Exception(404, 'Place visit statistic not found')
  @Exception(404, 'User reward not found')
  public async getLeagueSeasonResultByLeagueSeasonIdx(
    @Param('leagueSeasonIdx', ParseIntPipe) leagueSeasonIdx: number,
    @User() user: LoginUser,
    @Query() dto: GetLeagueSeasonResultByLeagueSeasonIdxDto,
  ): Promise<LeagueSeasonResultEntity> {
    return await this.leagueSeasonService.getLeagueSeasonResultByLeagueSeasonIdx(
      leagueSeasonIdx,
      user.idx,
      dto,
    );
  }

  @Get('result/all')
  @LoginAuth()
  @Exception(404, 'League season result user ranking not found')
  @Exception(404, 'User reward not found')
  public async getLeagueSeasonResultAll(
    @User() user: LoginUser,
    @Query() dto: GetLeagueSeasonResultAllDto,
  ): Promise<LeagueSeasonResultOverviewEntity[]> {
    return await this.leagueSeasonService.getLeagueSeasonResultAll(
      user.idx,
      dto,
    );
  }
}
