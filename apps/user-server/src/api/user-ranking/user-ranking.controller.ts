import { Exception } from '@libs/common/decorator/exception.decorator';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { User } from '@user/common/decorator/user.decorator';
import { LoginUser } from '@user/common/types/LoginUser';
import { GetCumulativeRankingAllDto } from './dto/request/get-ranking-all.dto';
import { GetSeasonRankingAllDto } from './dto/request/get-season-ranking-all.dto';
import { GetCumulativeRankingAllResponseDto } from './dto/response/get-cumulative-ranking-all.response.dto';
import { GetSeasonRankingAllResponseDto } from './dto/response/get-season-ranking-all.response.dto';
import { UserRankingOverviewEntity } from './entity/user-ranking-overview.entity';
import { UserRankingEntity } from './entity/user-ranking.entity';
import { UserRankingService } from './user-ranking.service';

@Controller()
@ApiTags('User Ranking')
export class UserRankingController {
  constructor(private readonly userRankingService: UserRankingService) {}

  /**
   * 특정 리그 사용자 랭킹 전체 정보 조회
   */
  @Get('/league-season/:leagueSeasonIdx/user-ranking/all')
  @Exception(404, 'League season not found')
  public async getUserRankingAllByLeagueSeasonIdx(
    @Param('leagueSeasonIdx', ParseIntPipe) leagueSeasonIdx: number,
  ): Promise<UserRankingEntity[]> {
    return await this.userRankingService.getUserRankingAllByLeagueSeasonIdx(
      leagueSeasonIdx,
    );
  }

  /**
   * 특정 리그 사용자 랭킹 조회
   */
  @Get('/league-season/:leagueSeasonIdx/season-ranking/all')
  @Exception(404, 'League season not found')
  public async getSeasonRankingAll(
    @Param('leagueSeasonIdx', ParseIntPipe) leagueSeasonIdx: number,
    @Query() dto: GetSeasonRankingAllDto,
  ): Promise<GetSeasonRankingAllResponseDto> {
    return await this.userRankingService.getSeasonRankingAll(
      leagueSeasonIdx,
      dto,
    );
  }

  /**
   * 누적 사용자 랭킹 조회
   */
  @Get('/cumulative-ranking/all')
  public async getCumulativeRankingAll(
    @Query() dto: GetCumulativeRankingAllDto,
  ): Promise<GetCumulativeRankingAllResponseDto> {
    return await this.userRankingService.getCumulativeRankingAll(dto);
  }

  /**
   * 로그인 사용자 랭킹 요약 조회
   */
  @Get('/user-ranking')
  @LoginAuth()
  @Exception(404, 'User ranking not found')
  public async getUserRankingOverview(
    @User() loginUser: LoginUser,
  ): Promise<UserRankingOverviewEntity> {
    return await this.userRankingService.getUserRankingOverview(loginUser.idx);
  }
}
