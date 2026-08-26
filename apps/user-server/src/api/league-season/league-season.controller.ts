import { Exception } from '@libs/common/decorator/exception.decorator';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';
import { GetLeagueSeasonByIdxDto } from './dto/request/get-league-season-by-idx.dto';
import { LeagueSeasonEntity } from './entity/league-season.entity';
import { LeagueSeasonService } from './league-season.service';
import { LeagueSeasonResultEntity } from './entity/league-season-result.entity';
import { GetLeagueSeasonResultAllDto } from './dto/request/get-league-season-result-all.dto';
import { GetLeagueSeasonAllDto } from './dto/request/get-league-season-all.dto';
import { GetLeagueSeasonAllResponseDto } from './dto/response/get-league-season-all.response.dto';
import { GetLeagueSeasonResultAllResponseDto } from './dto/response/get-league-season-result-all.response.dto';

@Controller('league-season')
export class LeagueSeasonController {
  constructor(private readonly leagueSeasonService: LeagueSeasonService) {}

  /**
   * 리그 시즌 조회
   * - 랭킹 페이지 진입 시 사용
   * - idx를 입력하지 않은 경우 가장 최신 리그 조회
   */
  @Get()
  @Exception(400, 'Invalid request')
  @Exception(404, 'League season not found')
  public async getLeagueSeasonByIdx(
    @Query() dto: GetLeagueSeasonByIdxDto,
  ): Promise<LeagueSeasonEntity> {
    return await this.leagueSeasonService.getLeagueSeasonByIdx(dto);
  }

  /**
   * 리그 시즌 전체 조회
   * - 이전 시즌 보기 버튼 클릭 시 사용
   */
  @Get('/all')
  @Exception(400, 'Invalid request')
  public async getLeagueSeasonAll(
    @Query() dto: GetLeagueSeasonAllDto,
  ): Promise<GetLeagueSeasonAllResponseDto> {
    return await this.leagueSeasonService.getLeagueSeasonAll(dto);
  }

  /**
   * 특정 리그 시즌 결과 조회
   * - 리그 시즌 결과 페이지 진입 시 사용
   */
  @Get(':leagueSeasonIdx/result')
  @LoginAuth()
  @Exception(400, 'Invalid request')
  @Exception(404, 'League season not found')
  @Exception(404, 'League season result not found')
  @Exception(404, 'League season result user ranking not found')
  @Exception(404, 'Place visit statistic not found')
  public async getLeagueSeasonResultByLeagueSeasonIdx(
    @Param('leagueSeasonIdx', ParseIntPipe) leagueSeasonIdx: number,
    @User() user: LoginUser,
  ): Promise<LeagueSeasonResultEntity> {
    return await this.leagueSeasonService.getLeagueSeasonResultByLeagueSeasonIdx(
      leagueSeasonIdx,
      user.idx,
    );
  }

  /**
   * 모든 리그 시즌 결과 조회
   * - 리그 참여 내역 페이지에서 사용
   */
  @Get('result/all')
  @LoginAuth()
  @Exception(404, 'League season result user ranking not found')
  public async getLeagueSeasonResultAll(
    @User() user: LoginUser,
    @Query() dto: GetLeagueSeasonResultAllDto,
  ): Promise<GetLeagueSeasonResultAllResponseDto> {
    return await this.leagueSeasonService.getLeagueSeasonResultAll(
      user.idx,
      dto,
    );
  }
}
